const express = require('express')
const router  = express.Router();
const Camp = require('../model/campModel');
const Comment = require('../model/commentModel');


router.post("/camps/:id", isLoggedIn, (req ,res) => {
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

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login')
}

module.exports = router;