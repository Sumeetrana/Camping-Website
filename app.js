const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport')
const LocalStrategy = require('passport-local');

const Camp = require('./model/campModel');
const Comment = require('./model/commentModel')
const User = require('./model/userModel');

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

app.get("/", (req, res) => {
    res.render('landing')
})

app.get("/camps", (req, res) => {
    // res.render("camps", {camps: campgrounds});
    Camp.find({})
        .then((camp) => {
            res.render("camps", {camps: camp});
        })
        
})

app.post("/camps", (req, res) => {
    // var name = req.body.name;
    // var image = req.body.image;
    // var desc = req.body.description;

    // var newCamp = {name: name, image: image, desc: desc}

    // campgrounds.push(newCamp);
    // res.redirect('/camps')

    var name = req.body.name;
    var image = req.body.image;
    var state = req.body.state;
    var desc = req.body.description;

    var site = new Camp();
    site.name = name;
    site.imageUrl = image;
    site.state = state;
    site.description = desc;

    site.save()
        .then(() => res.redirect('/camps'))

})

app.get("/camps/new", (req, res) => {
    res.render("new");
})

app.get("/camps/:id", (req ,res) => {
    Camp.findById(req.params.id).populate("comments").exec((err, foundCamp) => {
        if(err) console.log(err);
        else {
            res.render("show", {camp: foundCamp})
        }        
    })
})

app.post("/camps/:id", isLoggedIn, (req ,res) => {
    var comment = new Comment();
    comment.text = req.body.comment;

    comment.save((err, comment) => {
        Camp.findById(req.params.id, (err, camp) => {
            camp.comments.push(comment);
            camp.save()
                .then(() => res.redirect(`/camps/${req.params.id}`))
        })
    })
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/register", (req, res) => {
    var newUser = new User({username: req.body.username});
    
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.render("register")
        } 
        passport.authenticate("local")(req, res, () => {
            res.redirect("/camps")
        })
    })
}) 

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", passport.authenticate("local",{
    successRedirect: '/camps',
    failureRedirect: '/login'
}), (req, res) => {
})

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/camps")
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login')
}

let PORT = 3000 || process.env.PORT;
app.listen(PORT, () => {
    console.log("Camping website has started");
    
})