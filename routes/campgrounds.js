const express = require('express')
const router  = express.Router();
const Camp = require('../model/campModel')


router.get("/", (req, res) => {
    // console.log(req.user);
    
    Camp.find({})
        .then((camp) => {
            res.render("camps", {camps: camp});
        })
      
})

router.post("/", isLoggedIn, (req, res) => {

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

router.get("/new", isLoggedIn , (req, res) => {
    res.render("new");
})

router.get("/:id", (req ,res) => {
    Camp.findById(req.params.id).populate("comments").exec((err, foundCamp) => {
        if(err) console.log(err);
        else {
            res.render("show", {camp: foundCamp})
        }        
    })
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login')
}

module.exports = router