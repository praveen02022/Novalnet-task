const sendEmail = require("../utils/email");
const Token = require("../models/token");
const { User, validate } = require("../models/user");
const crypto = require("crypto");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const Department = require("../models/department");
const fs = require("fs");
const http = require("http");
const Activity = require("../models/activity");
const WebSocket = require("ws");
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello World!");
});
const wss = new WebSocket.Server({ server });
console.log("sss");
function sendFileContents(ws) {
  fs.readFile("activity.txt", (err, data) => {
    if (err) throw err;
    ws.send(data.toString());
  });
}

function broadcastFileContents() {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      sendFileContents(client);
    }
  });
}

fs.watch("activity.txt", (event, filename) => {
  if (event === "change") {
    broadcastFileContents();
  }
});
server.listen(4000, () => {
  console.log("Socket Server started on port 4000");
});
router.post("/signup", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return  res.status(400).json({
        success: false,
        message: "User with given email already exist!",
      });
    user = await new User({
      name: req.body.name,
      password: req.body.password,
      mobile: req.body.mobile,
      email: req.body.email,
    }).save();

    let token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const message = `${process.env.BASE_URL}/user/verify/${user.id}/${token.token}`;
    await sendEmail(user.email, "Verify Email", message);
    res.status(200).json({
      success: true,
      message: "An email has been sent to your account please verify!",
      data: {
        sucess: true,
        userId: user.id,
      },
    });

  } catch (error) {
    console.log(error);
    res.status(200).json({
      success: false,
      message: "signup failed",
      sucess: true,
    });
  }
});
router.post("/forgetpassword", async (req, res) => {
  try {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(200).json({
        success: false,
        message: "user doesn't exist",
      });
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
    await sendEmail(user.email, "Password reset", link);
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email account",
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: "An error occured",
    });
    console.log(error);
  }
});

router.post("/password-reset/:id/:token", async (req, res) => {
  try {
    const schema = Joi.object({ password: Joi.string().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.params.id);
    console.log(user);
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Invalid link or expired",
      });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token)
      return res.status(400).json({
        success: false,
        message: "Invalid link or expired",
      });

    user.password = req.body.password;
    await user.save();
    await token.delete();
    res.status(200).json({
      success: true,
      message: "password reset sucessfully.",
    });
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
});

router.post("/signin", async (req, res) => {
  try {
    let { email, password } = req.body;
    let existingUser;
    existingUser = await User.findOne({ email: email });
    if (!existingUser || existingUser.password != password) {
      const error = Error("invalid user or invalid passoword");
      throw error;
    }
    let token = crypto.randomBytes(32).toString("hex");

    res.status(200).json({
      success: true,
      message: "login sucessfully",
      data: {
        userId: existingUser.id,
        name: existingUser.name,
        token: token,
      },
    });
  } catch (err) {
    res.status(500).json({
      responsecode: 500,
      success: false,
      msg: err.message,
      message: "login failed",
    });
    console.log(err);
  }
});

router.get("/verify/:id/:token", async (req, res) => {
  console.log(req.params.id);
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send("Invalid link");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link");

    await User.updateOne({ _id: user._id, verified: true });
    await Token.findByIdAndRemove(token._id);

    res.send("email verified sucessfully");
  } catch (error) {
    console.log(error, "s");
    res.status(400).send("An error occured");
  }
});
router.post("/userdetails", async (req, res) => {
  const searchTerm = req.body.contains;
  const query = {
    $or: [
      { department: { $regex: searchTerm, $options: "i" } },
      { projectName: { $regex: searchTerm, $options: "i" } },
      { taskName: { $regex: searchTerm, $options: "i" } },
      { taskHistory: { $regex: searchTerm, $options: "i" } },
    ],
  };
  Department.find(searchTerm ? query : null)
    .then((departments) => {
      return res.status(200).json({
        success: true,
        message: "A list of all departments",
        data: departments,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error. Please try again.",
        error: err.message,
      });
    });
});


router.post("/activity", (req, res) => {
  const content = req.body.content;
  fs.appendFile("activity.txt", content + "\n", (err) => {
    if (err) throw err;
    console.log("Content saved to activity.txt");
  });
  const activity = new Activity({ content: content });
  activity
    .save()
    .then(() => {
      console.log("Content saved to database");
      res.send({ success: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ error: "Error saving content to database" });
    });
});

module.exports = router;
