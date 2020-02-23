const express = require('express')
const router  = express.Router();
const Camp = require('../model/campModel')


router.get("/", (req, res) => {
    // console.log(req.user);
    let noMatch = null;
    if (req.query.search) {
        const regex = new RegExp(escapeRegExp(req.query.search), 'gi');
        
        Camp.find({name: regex})
            .then((camp) => {
                if (camp.length < 1) {
                    noMatch = "Your search query doesn't exist, please try again later"            
                }
                res.render("camps", {camps: camp, noMatch: noMatch});
            })
    } else {
        Camp.find({})
            .then((camp) => {
                res.render("camps", {camps: camp, noMatch: noMatch});
            })
        }
})

router.post("/", isLoggedIn, (req, res) => {

    var name = req.body.name;
    var image = req.body.image;
    var state = req.body.state;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }

    var site = new Camp();
    site.name = name;
    site.imageUrl = image;
    site.state = state;
    site.description = desc;
    site.author = author;

    site.save()
        .then(() => res.redirect('/camps'))

})

router.get("/new", isLoggedIn, (req, res) => {
    res.render("new");
})

router.get("/:id",  (req ,res) => {
    Camp.findById(req.params.id).populate("comments").exec((err, foundCamp) => {
        if(err) console.log(err);
        else {
            res.render("show", {camp: foundCamp})
        }        
    })
})  

router.get("/:id/edit", checkCampOwnership, (req, res) => {
    Camp.findById(req.params.id, (err, camp) => {
        res.render("edit", {camp: camp})
    })
})

router.post("/:id/edit", checkCampOwnership, (req, res) => {
    Camp.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, camp) => {
        if (!err) {
            res.redirect(`/camps/${req.params.id}`)
        }
    })
})

router.get("/:id/delete", checkCampOwnership, (req, res) => {
    Camp.findByIdAndDelete(req.params.id, (err, camp) => {
        if (!err) {
            res.redirect("/camps");
        }
    })
})

function checkCampOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Camp.findById(req.params.id, (err, foundCamp) => {
            if (err) {
                res.redirect("back")
            } else {
                if (foundCamp.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                    
                }
            }
        })
    } else {
        res.redirect("back")
    }
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please log in first")
    res.redirect('/login')
}

module.exports = router