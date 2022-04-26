var express = require('express');
var router = express.Router();
var User = require('../model/user')
// var flash = require('connect-flash')

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({},(err,users)=>{
    if(err) return next(err)
    res.render('users',{users: users})
  })
});


router.get('/register',function(req,res,next){
  var error = req.flash('error')[0];
   res.render("registrationForm",{ error });
})

router.post('/register',function(req,res,next){
   User.create(req.body,(err,addedUser)=>{
    if(err) {
      if(err.name === 'MongoError') {
        req.flash('error', 'This email is already in use');
        return res.redirect('/users/register');
      }
      if(err.name === 'ValidationError') {
        req.flash('error', err.message);
        return res.redirect('/users/register');
      }
    }
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

//  login

router.get('/login',(req,res,next)=>{
  var error = req.flash('error')[0];
  res.render('login',{ error })
})

router.post('/login',(req,res,next)=>{
  var {email,password} = req.body;
  if(!email || !password){
    req.flash('error', 'Email/Password required!');
    return res.redirect('/users/login')
  }

  User.findOne({email},(err,user)=>{
    if(err) return next(err);

    // no user

    if(!user){
      req.flash('error', 'This email is not registered');
      return res.redirect('/users/login')
    }


  user.verifyPassword(password,(err,result)=>{
    if(err) return next(err);
    if(!result){
      req.flash('error', 'Incorrect password! Try Again!');
      return res.redirect('/users/login');

    }
    req.session.userId = user.id;
    res.redirect('/users/dashboard');
  })
})
})


// delete and update user

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

// logout
router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');  
}); 


module.exports = router;