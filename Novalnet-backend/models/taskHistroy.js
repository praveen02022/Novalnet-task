const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskHistorySchema = new Schema({

    task_historys: {
        type: String,
        required: true,
    },
});

const TaskHistroy = mongoose.model("historys", TaskHistorySchema);

module.exports = TaskHistroy;
