const express = require('express')
const router  = express.Router();
const passport = require('passport');
const User = require('../model/userModel');

router.get("/", (req, res) => {
    res.render('landing')
})

router.get("/register", (req, res) => {
    res.render("register")
})

router.post("/register", (req, res) => {
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

router.get("/login", (req, res) => {
    res.render("login", {message: req.flash("error")});
    
    
})

router.post("/login", passport.authenticate("local",{
    successRedirect: '/camps',
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
})

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/camps");
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please log in first") // We have to put this line before res.redirect()
    res.redirect('/login')
}

module.exports = router;