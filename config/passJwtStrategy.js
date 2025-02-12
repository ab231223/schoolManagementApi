const Admin = require("../models/adminModel");
const passport = require("passport");
const jwtStrategy = require("passport-jwt").Strategy;
const extractJwt = require("passport-jwt").ExtractJwt;
let opts = {
  jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "alpesh",
};
passport.use(
  new jwtStrategy(opts, async function (payload, done) {
    let checkUser = await Admin.findOne({ email: payload.adminData.email });
    if (checkUser) {
      return done(null, checkUser);
    } else {
      return done(null, false);
    }
  })
);
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(async function (id, done) {
  let userdata = await Admin.findById(id);
  if (userdata) {
    return done(null, userdata);
  } else {
    return done(null, false);
  }
});

module.exports = passport;
