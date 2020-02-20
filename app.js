const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport')
const LocalStrategy = require('passport-local');

const Camp = require('./model/campModel');
const Comment = require('./model/commentModel')
const User = require('./model/userModel');

const commentRoutes = require('./routes/comments')
const campRoutes = require('./routes/campgrounds')
const indexRoutes = require('./routes/auth');

mongoose.connect("mongodb://localhost/camp")

var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static("public"));

app.use(require("express-session")({
    secret: "Harry potter is the best",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Below middleware will run in every api and pass variable of name
// "currentUser" to every template. So we can use "currentUser" in 
// our template.
app.use((req ,res, next) => {
    res.locals.currentUser = req.user;
    next();
})

app.use('/', indexRoutes);
app.use('/camps',campRoutes);
app.use(commentRoutes);

let PORT = 3000 || process.env.PORT;
app.listen(PORT, () => {
    console.log("Camping website has started");
    
})