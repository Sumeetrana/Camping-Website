const express = require('express');

var app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Camp = require('./model/campModel');

mongoose.connect("mongodb://localhost/camp")

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static("public"));

// var campgrounds =  [
//     {name: "Manali", image: "https://cdn.pixabay.com/photo/2020/02/04/10/42/camping-4817872__340.jpg", description: "Exploring the jaw-dropping US east coast by foot and by boat"},
//     {name: "Abu", image: "https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__340.jpg", description: "Breathtaking hike through the Canadian Banff National ParkExploring the jaw-dropping US east coast by foot and by boat"},
//     {name: "Hrishikesh", image: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402__340.jpg", description: "Breathing in Nature in America's most spectacular National Parks"},
//     {name: "Manali", image: "https://cdn.pixabay.com/photo/2020/02/04/10/42/camping-4817872__340.jpg", description: "Exploring the jaw-dropping US east coast by foot and by boat"},
//     {name: "Abu", image: "https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__340.jpg", description: "Breathtaking hike through the Canadian Banff National ParkExploring the jaw-dropping US east coast by foot and by boat"},
//     {name: "Hrishikesh", image: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402__340.jpg", description: "Breathing in Nature in America's most spectacular National Parks"},
//     {name: "Manali", image: "https://cdn.pixabay.com/photo/2020/02/04/10/42/camping-4817872__340.jpg", description: "Exploring the jaw-dropping US east coast by foot and by boat"},
//     {name: "Abu", image: "https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__340.jpg", description: "Breathtaking hike through the Canadian Banff National ParkExploring the jaw-dropping US east coast by foot and by boat"},
//     {name: "Hrishikesh", image: "https://cdn.pixabay.com/photo/2016/01/19/16/48/teepee-1149402__340.jpg", description: "Breathing in Nature in America's most spectacular National Parks"}
// ]

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
    var desc = req.body.description;

    var site = new Camp();
    site.name = name;
    site.imageUrl = image;
    site.description = desc;

    site.save()
        .then(() => res.redirect('/camps'))

})

app.get("/camps/new", (req, res) => {
    res.render("new");
})

app.get("/camps/:id", (req ,res) => {
    res.send("This will be the show page one day")
})

let PORT = 3000 || process.env.PORT;
app.listen(PORT, () => {
    console.log("Camping website has started");
    
})