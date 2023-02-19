const sendEmail = require("../utils/email");
const Token = require("../models/token");
const { User, validate } = require("../models/user");
const crypto = require("crypto");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const Department = require("../models/department");
const Project = require("../models/project");
const TaskHistroy = require("../models/taskHistroy");
const Task = require("../models/task")


router.post("/signup", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(400).send("User with given email already exist!");

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
    res
      .status(200)
      .json({
        success: true,
        message: "An Email sent to your account please verify",
        data: {
          sucess: true,
          userId: user.id,
        },
      });
    // res.send("An Email sent to your account please verify");
  } catch (error) {
    console.log(error);
    res
      .status(200)
      .json({
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
      return res.status(400).send("user with given email doesn't exist");

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
    await sendEmail(user.email, "Password reset", link);

    res.send("password reset link sent to your email account");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
});

router.post("/password-reset/:userId/:token", async (req, res) => {
  try {
    const schema = Joi.object({ password: Joi.string().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send("invalid link or expired");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link or expired");

    user.password = req.body.password;
    await user.save();
    await token.delete();

    res.send("password reset sucessfully.");
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
    let token = crypto.randomBytes(32).toString("hex")

    res
      .status(200)
      .json({
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
    })
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
    console.log(error, 's');
    res.status(400).send("An error occured");
  }
});
router.get('/selectdepartments', async (req, res) => {
  Department.find()
    .then((departments) => {
      return res.status(200).json({
        success: true,
        message: 'A list of all departments',
        data: departments,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
        error: err.message,
      });
    });
});

router.get('/selectproject', async (req, res) => {
  Project.find()
    .then((projects) => {
      return res.status(200).json({
        success: true,
        message: 'A list of all projects',
        data: projects,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
        error: err.message,
      });
    });
});

router.get('/selecttask', async (req, res) => {
  Task.find()
    .then((tasks) => {
      return res.status(200).json({
        success: true,
        message: 'A list of all tasks',
        data: tasks,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
        error: err.message,
      });
    });
});

router.get('/selecthistory', async (req, res) => {
  TaskHistroy.find()
    .then((taskHistroys) => {
      return res.status(200).json({
        success: true,
        message: 'A list of all taskHistroys',
        data: taskHistroys,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
        error: err.message,
      });
    });
});


module.exports = router;
