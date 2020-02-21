const express = require('express')
const router  = express.Router();
const Camp = require('../model/campModel');
const Comment = require('../model/commentModel');


router.post("/camps/:id", isLoggedIn, (req ,res) => {
    var comment = new Comment();
    comment.text = req.body.comment;
    comment.author.id = req.user._id;
    comment.author.username = req.user.username;
    comment.save((err, comment) => {
        Camp.findById(req.params.id, (err, camp) => {
            camp.comments.push(comment);
            camp.save()
                .then(() => res.redirect(`/camps/${req.params.id}`))
        })
    })

})

router.get("/camps/:id/comments/:commentId/delete", checkCommentAuthorization, (req, res) => {
    Comment.findByIdAndDelete(req.params.commentId, (err, foundComment) => {
        res.redirect(`/camps/${req.params.id}`)
    })
})

function checkCommentAuthorization(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.commentId, (err, foundComment) => {
            if (err) {
                res.redirect("back")
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                   next(); 
                } else {
                    res.redirect("back");
                    console.log("You are not authorized");
                    
                }
            }
        })
    } else {
        res.redirect("back");
    }
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please log in first")
    res.redirect('/login')
}

module.exports = router;