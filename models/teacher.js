const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  username: {
    required: true,
    type: String,
    minlength: 3,
    maxlength: 20,
    unique: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 44,
    // match: /[A-Z]&[0-9]/
  },
  email: {
    required: true,
    type: String,
    minlength: 5,
    maxlength: 35,
    unique: true,
  },
  role: {
    type: Number,
    min: 0,
    max: 1,
    required: true,
  },
  course: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
    },
  ],
});

module.exports = mongoose.model("teachers", teacherSchema);
