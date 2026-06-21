const mongoose = require("mongoose");

const categoryschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    }
});

const category = mongoose.model("category", categoryschema);

module.exports = { category };