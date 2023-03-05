const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const departmentSchema = new Schema({

  department: {
    type: String,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  taskName: {
    type: String,
    required: true,
  },
  taskHistory: {
    type: String,
    required: true,
  },
});

const Department = mongoose.model("Usersdetails", departmentSchema);

module.exports = Department;
