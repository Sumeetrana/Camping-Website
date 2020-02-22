const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport')
const LocalStrategy = require('passport-local');
const flash = require('connect-flash')

const Camp = require('./model/campModel');
const Comment = require('./model/commentModel')
const User = require('./model/userModel');

const commentRoutes = require('./routes/comments')
const campRoutes = require('./routes/campgrounds')
const indexRoutes = require('./routes/auth');

mongoose.connect("mongodb+srv://sumeet123:sumeet123@camp-3tyhx.mongodb.net/test?retryWrites=true&w=majority")

var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static("public"));
app.use(flash());

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
// Basically res.locals variables are available to all templates.
app.use((req ,res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use('/', indexRoutes);
app.use('/camps',campRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT || 5000, () => {
    console.log("Camping website has started");
})