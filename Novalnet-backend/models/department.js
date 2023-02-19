const mongoose = require("mongoose");
const TaskHistroy = require("./taskHistroy");
const Schema = mongoose.Schema;

const departmentSchema = new Schema({

  departmentName: {
    type: String,
    required: true,
  },
});

const Department = mongoose.model("department", departmentSchema);

module.exports = Department;
