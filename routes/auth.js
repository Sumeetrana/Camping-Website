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
    res.render("login")
})

router.post("/login", passport.authenticate("local",{
    successRedirect: '/camps',
    failureRedirect: '/login'
}), (req, res) => {
})

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/camps")
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login')
}

module.exports = router;