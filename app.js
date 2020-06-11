const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const cryptojs = require("crypto-js");
const nodemailer = require("nodemailer");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
require("dotenv").config();
//const { json } = require('body-parser')

const Teacher = require("./models/teacher");
const teacher = require("./controllers/teacher.js");
const course = require("./controllers/course.js");
const auth = require("./auth");

const port = process.env.PORT || 3000;

const app = express();

const csvWriter = createCsvWriter({
  path: "kurs.csv",
  header: [
    { id: "name", title: "Name" },
    { id: "description", title: "Description" },
    { id: "image", title: "Image" },
    { id: "price", title: "Price" },
    { id: "quantity", title: "Quantity" },
    { id: "teacher", title: "Teacher" },
  ],
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mailcourses495@gmail.com",
    pass: process.env.PASS,
  },
});

function mailOptions(email) {
  return {
    from: "mailcourses495@gmail.com",
    to: `${email}`,
    subject: "Course",
    text: "New course added",
    attachments: {
      path: "./kurs.csv",
    },
  };
}

app.delete("/teacher/:username", auth.verifyToken, (req, res) => {
  var username = req.params.username;
  teacher.deleteTeacherByUsername(username).then((e) => {
    console.log(e);
    res.send(e);
  });
});

app.post("/teacher", auth.verifyToken, (req, res) => {
  req.query.password = cryptojs.AES.encrypt(
    "My message!",
    req.query.password
  ).toString();
  teacher.addTeacher(req.query).then((e) => {
    res.send(e);
  });
});

app.put("/teacher/:username", auth.verifyToken, (req, res) => {
  var username = req.params.username;
  teacher.upadateTeacherByUsername(username, req.query).then((e) => {
    res.send(e);
  });
});

app.get("/teacher/:username", auth.verifyToken, (req, res) => {
  var username = req.params.username;
  teacher
    .selectTeacherByUsername(username)
    .then((e) => {
      res.send(e);
      console.log(e);
    })
    .catch((e) => {
      console.log(e);
    });
});

app.get("/teachers", auth.verifyToken, (req, res) => {
  teacher.listAllTeacher().then((e) => {
    res.send(e);
  });
});

app.delete("/course/name/:name", auth.verifyToken, (req, res) => {
  var name = req.params.username;
  course.deleteCourseByName(name).then((e) => {
    console.log(e);
    res.send(e);
  });
});

app.post("/course", auth.verifyToken, (req, res) => {
  course.addCourse(req.query).then((e) => {
    csvWriter
      .writeRecords([e])
      .then(() => {
        teacher.listAllTeacher().then((teachers) => {
          const admins = teachers.filter((elem) => elem.role == 1);
          admins.forEach((admin, i) => {
            transporter.sendMail(mailOptions(admin.email), (error, info) => {
              if (error) console.log(error);
              else {
                console.log("mail sent" + info.response);
                if (i == admins.length - 1) {
                  fs.unlink("./kurs.csv", (err) => {
                    if (err) console.log(err);
                  });
                }
              }
            });
          });
        });
      })
      .catch((csvErr) => console.log(csvErr));
    res.send(e);
  });
});

app.put("/course/name/:name", auth.verifyToken, (req, res) => {
  var name = req.params.name;
  course.upadateCourseByName(name, req.query).then((e) => {
    res.send(e);
  });
});

app.get("/course/:name", auth.verifyToken, (req, res) => {
  var name = req.params.name;
  course
    .selectCourseByName(name)
    .then((e) => {
      res.send(e);
      console.log(e);
    })
    .catch((e) => {
      console.log(e);
    });
});

app.get("/products", auth.verifyToken, (req, res) => {
  course.listAllCourses().then((e) => {
    res.send(e);
  });
});

app.delete("/course_id/:id", auth.verifyToken, (req, res) => {
  var id = req.params.id;
  course.deleteCourseById(id).then((e) => {
    console.log(e);
    res.send(e);
  });
});

app.put("/course_id/:id", auth.verifyToken, (req, res) => {
  var id = req.params.id;
  course.upadateCourseById(id, req.query).then((e) => {
    res.send(e);
    console.log(e);
  });
});

app.get("/course_id/:id", auth.verifyToken, (req, res) => {
  var id = req.params.id;
  course
    .selectCourseByName(id)
    .then((e) => {
      res.send(e);
      console.log(e);
    })
    .catch((e) => {
      console.log(e);
    });
});

app.put("/subs_dec/:id", auth.verifyToken, (req, res) => {
  var id = req.params.id;
  course.decreaseQuantity(id).then((e) => {
    res.send(e);
  });
});

app.put("/subs_inc/:id", auth.verifyToken, (req, res) => {
  var id = req.params.id;
  course.increaseQuantity(id).then((e) => {
    res.send(e);
  });
});

app.get("/subs_num/:id", auth.verifyToken, (req, res) => {
  var id = req.params.id;
  course.findCourseById(id).then((e) => {
    console.log(e);
    res.status(200).json(e.quantity);
    //res.send({quantity:e.quantity})
  });
});

app.post("/teacher/:username", auth.verifyToken, (req, res) => {
  var username = req.params.username;
  teacher.selectTeacherByUsername(username).then((e) => {
    var courses = e[0].course;
    courses.push(mongoose.Types.ObjectId(`${req.query.id}`));
    teacher
      .upadateTeacherByUsername(username, { course: courses })
      .then((e) => {
        res.send(e);
      });
  });
});

app.get("/teacherscourses/:username", auth.verifyToken, (req, res) => {
  var username = req.params.username;
  teacher.selectTeacherByUsername(username).then((e) => {
    res.send(e[0].course);
  });
});

app.delete("/teacher/deletecourse/:username", auth.verifyToken, (req, res) => {
  var username = req.params.username;
  teacher.selectTeacherByUsername(username).then((e) => {
    var courses = e[0].course;
    courses.splice(
      courses.findIndex((elem) => elem == req.query.id),
      1
    );
    teacher
      .upadateTeacherByUsername(username, { course: courses })
      .then((e) => {
        res.send(e);
        console.log(e);
      });
  });
});

app.put("/teacher/updatecourse/:username", auth.verifyToken, (req, res) => {
  var username = req.params.username;
  teacher.selectTeacherByUsername(username).then((e) => {
    var courses = e[0].course;
    courses.splice(
      courses.findIndex((elem) => elem == req.query.oldid),
      1
    );
    courses.push(mongoose.Types.ObjectId(`${req.query.newid}`));
    teacher
      .upadateTeacherByUsername(username, { course: courses })
      .then((e) => {
        res.send(e);
        console.log(e);
      });
  });
});

app.get("/login", auth.createToken);

app.get("/profit", auth.verifyToken, async (req, res) => {
  let arr = [];

  let results = await Teacher.aggregate([
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "outputArr",
      },
    },
  ]);

  for (let i = 0; i < results.length; i++) {
    let teacherProfit = {};
    let profit = 0;

    for (let j = 0; j < results[i].course.length; j++) {
      profit += results[i].course[j].price;
    }

    teacherProfit.teacher = results[i].username;
    teacherProfit.profit = profit;

    arr.push(teacherProfit);
  }
  res.status(200).json(arr);
});

app.listen(port, () => {
  console.log("listen on port " + port);
  mongoose.connect("mongodb://127.0.0.1:27017/app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
});
