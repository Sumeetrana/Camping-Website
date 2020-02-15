const express = require('express');

var app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render('landing')
})

app.get("/camps", (Req, res) => {
    let campgrounds =  [
        {name: "Manali"},
        {name: "Abu"},
        {name: "Hrishikesh"}
    ]

    res.render("camps", {camps: campgrounds});
})

let PORT = 3000 || process.env.PORT;
app.listen(PORT, () => {
    console.log("Camping website has started");
    
})