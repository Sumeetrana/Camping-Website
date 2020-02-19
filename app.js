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

app.post("/camps/:id", (req ,res) => {
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

let PORT = 3000 || process.env.PORT;
app.listen(PORT, () => {
    console.log("Camping website has started");
    
})