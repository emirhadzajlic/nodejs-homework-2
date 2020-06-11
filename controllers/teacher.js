const Teacher = require("../models/teacher");
const mongoose = require("mongoose");
const cryptojs = require("crypto-js");

function addTeacher(teacher) {
  return new Promise((resolve, reject) => {
    try {
      // e.password=cryptojs.AES.encrypt('My message!',e.password).toString();
      resolve(Teacher.create(teacher));
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

function deleteTeacherByUsername(usernameToDelete) {
  return new Promise((resolve, reject) => {
    try {
      resolve(Teacher.findOneAndDelete({ username: usernameToDelete }));
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

function selectTeacherByUsername(usernameToFind) {
  return new Promise((resolve, reject) => {
    try {
      resolve(Teacher.find({ username: usernameToFind }));
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

function upadateTeacherByUsername(usernameToFind, somethingNew) {
  return new Promise((resolve, reject) => {
    try {
      resolve(
        Teacher.findOneAndUpdate({ username: usernameToFind }, somethingNew, {
          new: true,
        })
      );
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

function listAllTeacher() {
  return new Promise((resolve, reject) => {
    try {
      resolve(Teacher.find({}).lean().exec());
    } catch (e) {
      console.log(e);
      reject(false);
    }
  });
}

module.exports = {
  addTeacher,
  deleteTeacherByUsername,
  selectTeacherByUsername,
  upadateTeacherByUsername,
  listAllTeacher,
};
