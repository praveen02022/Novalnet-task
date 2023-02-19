require("dotenv").config();
const user = require("./routes/users");
const connection = require("./db");
var cors = require('cors')
const express = require("express");
const app = express();
const Department = require("./models/department");
const Task = require("./models/task");
const Projects = require("./models/project");
(async () => await connection())();

app.use(express.json());
app.use(cors())
app.use("/api/user", user);



const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
