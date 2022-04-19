var express = require('express');
var router = express.Router();
var User = require('../model/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({},(err,users)=>{
    if(err) return next(err)
    res.render('usersList',{users: users})
  })
});


router.get('/register',(req,res,next)=>{
   res.render("registrationForm")
})

router.post('/register',(req,res,next)=>{
   User.create(req.body,(err,addedUser)=>{
     console.log(err,addedUser);
     if(err) return next(err)
     res.redirect('/users')
   })
})
module.exports = router;
