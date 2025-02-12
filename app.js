const express = require("express");

const passport = require('passport')
const jwtStrategy = require("./config/passJwtStrategy")
const session = require('express-session')

const port = 5193;

const app = express();

const db = require('./config/db')

app.use(express.urlencoded())

app.use(
  session({
    name: "Alpesh",
    secret: "Key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());


app.use("/api",require('./routes/api/v1/adminRoute/index'))

app.listen(port, (err) => {
    if (err) {
      console.log("Something is Wrong", err);
      return false;
    }
    console.log("Server Connected Successfully", port);
  });
  
