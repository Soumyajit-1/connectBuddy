const express = require("express");
const cookieParser = require("cookie-parser");
require('dotenv').config();
const app = express();
const port = process.env.PORT;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
//Used for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require("./config/passport-jwt-strategy");
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require("connect-mongo")(session);
const sassMiddleware= require('node-sass-middleware');
const helmet=require('helmet');
const morgan = require('morgan');
const flash = require('connect-flash');
const customMware = require('./config/middleware');


// app.use(sassMiddleware({
//   src:'./assets/scss',
//   dest: './assets/css',
//   debug: true,
//   outputStyle: 'extended',
//   prefix: './css' 
// }))
app.use(helmet());
app.use(express.urlencoded());
app.use(cookieParser());
//app.use(morgan())

app.use(express.static("./assets"));
app.use('/uploads',express.static(__dirname + '/uploads'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.set("view engine", "ejs");
app.set("views", "./views");

//mongo store is used to sore the session
app.use(
  session({
    name: "connectbuddy",
    //change the secret before deployment and before production mode
    secret: "myproperty",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect-monodb setup ok");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);

//use express router
app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) console.log(`Error:${err}`);
  console.log(`server is running on port:${port}`);
  //console.log();
});
