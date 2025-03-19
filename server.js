// import express from "express"
const express = require("express");
const db = require("better-sqlite3")("ourApp.db");
db.pragma("journal_mode = WAL");

// database setup here
const createsTables = db.transaction(() => {
  db.prepare(
    `
  CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username STRING NOT NULL UNIQUE,
  password STRING NOT NULL

  )
  `
  ).run();
});

createsTables();
// database setup ends here

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

// use the simpleCSS.css file from the public folder
app.use(express.static("public"));

// middleware
app.use(function (req, res, next) {
  res.locals.errors = [];
  next();
});

app.get("/", (req, res) => {
  res.render("homepage");
});

// login page
app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/register", (req, res) => {
  const errors = [];

  //   username validation
  if (typeof req.body.username !== "string") req.body.username = "";
  if (typeof req.body.password !== "string") req.body.password = "";

  req.body.username = req.body.username.trim();

  if (!req.body.username) errors.push("You must provide a username!");

  if (req.body.username && req.body.username.length < 3)
    errors.push("Username must be at least 3 characters long!");

  if (req.body.username && req.body.username.length > 10)
    errors.push("Username cannot exceed 10 characters ");

  if (req.body.username && !req.body.username.match(/^[a-zA-Z0-9]+$/))
    errors.push("Username can only contain letters and numbers");

  //   password validation
  if (!req.body.password) errors.push("You must provide a password!");

  if (req.body.password && req.body.password.length < 8)
    errors.push("Password must be at least 8 characters long!");

  if (req.body.password && req.body.password.length > 20)
    errors.push("Password cannot exceed 20 characters ");

  if (errors.length) {
    return res.render("homepage", { errors });
  }

  //   save the new user into the database if there's no errors

  // log the user in by giving them a cookie
});

app.listen(3002);
