const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({

    tasks: {
        type: String,
        required: true,
    },
});

const Task = mongoose.model("task", TaskSchema);

module.exports = Task;
