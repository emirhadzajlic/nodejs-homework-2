const Course = require("../models/course");

function addCourse(course) {
  return new Promise((resolve, reject) => {
    try {
      resolve(Course.create(course));
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

function deleteCourseByName(nameToFind) {
  return new Promise((resolve, reject) => {
    try {
      resolve(Course.findOneAndDelete({ name: nameToFind }));
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

function selectCourseByName(nameToFind) {
  return new Promise((resolve, reject) => {
    try {
      resolve(Course.find({ name: nameToFind }));
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

function upadateCourseByName(nameToFind, newData) {
  return new Promise((resolve, reject) => {
    try {
      resolve(Course.findOneAndUpdate({ name: nameToFind }, { newData }));
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

function listAllCourses() {
  return new Promise((resolve, reject) => {
    try {
      resolve(Course.find({}).lean().exec());
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

function findCourseById(id) {
  return new Promise((resolve, reject) => {
    try {
      resolve(Course.findById(id).exec());
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

function deleteCourseById(id) {
  return new Promise((resolve, reject) => {
    try {
      resolve(Course.findByIdAndDelete(id));

      // Course.fin
      // reslove(Course.deleteOne(id))
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

function upadateCourseById(id, newData) {
  return new Promise((resolve, reject) => {
    try {
      resolve(Course.findByIdAndUpdate(id, newData));
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

function decreaseQuantity(id) {
  return new Promise((reslove, reject) => {
    try {
      reslove(Course.findOneAndUpdate(id, { $inc: { quantity: -1 } }));
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

function increaseQuantity(id) {
  return new Promise((reslove, reject) => {
    try {
      reslove(Course.findOneAndUpdate(id, { $inc: { quantity: 1 } }));
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

module.exports = {
  addCourse,
  deleteCourseByName,
  selectCourseByName,
  upadateCourseByName,
  listAllCourses,
  findCourseById,
  deleteCourseById,
  upadateCourseById,
  decreaseQuantity,
  increaseQuantity,
};
