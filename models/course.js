const mongoose = require("mongoose");

const coursesSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: 3,
    maxlength: 15,
    unique: true,
  },
  description: {
    type: String,
    minlength: 10,
    maxlength: 150,
  },
  image: {
    type: String,
    default: "https://wallpaperplay.com/walls/full/c/5/3/34778.jpg",
  },
  price: {
    required: true,
    type: Number,
    min: 1,
    max: 10000,
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0,
    max: 50,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teachers",
  },
});

module.exports = mongoose.model("courses", coursesSchema);
