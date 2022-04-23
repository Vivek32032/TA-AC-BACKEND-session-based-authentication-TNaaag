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

router.get('/dashboard', (req, res, next) => {
  console.log(req.session);
  User.findOne({_id: req.session.userId }, (err, user) => {
    if(err) return next(err);
    console.log(user)
    res.render('dashboard', { user });
  });
})

router.get('/login',(req,res,next)=>{
  res.render('loginPage')
})

router.post('/login',(req,res,next)=>{
  var {email,password} = req.body;
  if(!email || !password){
    res.redirect('/users/')
  }

  User.findOne({email},(err,user)=>{
    if(err) return next(err);

    // no user

    if(!user){
      res.redirect('/users/login')
    }


  user.verifyPassword(password,(err,result)=>{
    if(err) return next(err);
    if(!result){
      res.redirect('/users/login');

    }
    req.session.userId = user.id;
    res.redirect('/users/dashboard');
  })
})
})

router.get('/:id/delete',(req,res,next)=>{
  var id = req.params.id;
  User.findByIdAndDelete(id,(err,deletedUser)=>{
    if(err) return next(err);
    res.redirect('/users');
  })
})
router.get('/:id/edit',(req,res,next)=>{
    var id = req.params.id;
    User.findById(id,(err,user)=>{
      if(err) return next(err)
      res.render("updateForm",{user: user})
    })
  })


  router.post('/:id',(req,res,next)=>{
  var id = req.params.id;
  User.findByIdAndUpdate(id,req.body,(err,updatedUser)=>{
    if(err) return next(err);
    res.redirect('/users');
  })
})


module.exports = router;