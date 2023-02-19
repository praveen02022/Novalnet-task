const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({

    ProjectName: {
        type: String,
        required: true,
    },  
});

const Project = mongoose.model("project", projectSchema);

module.exports = Project;
