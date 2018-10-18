//负责用户交互
var User = require("../models/user.js")

// signup
exports.showSignup = function(req, res) {
  res.render('signup', {
    title: '注册页面'
  })
}

exports.showSignin = function(req, res) {
  res.render('signin', {
    title: '登录页面'
  })
}

//user post 用户注册
exports.signup=function (req,res) {
	/* body... */
	console.log("1111")
	var _user=req.body.user;
	User.findOne({name:_user.name},function (err,user) {
		/* body... */
		if(err){
			console.log(err)
		}
		if(user){
			return res.redirect("/signin");
		}else{
			var user=new User(_user);
			user.save(function (err,user) {
			/* body... */
				if(err){
					console.log(err);
				}
				console.log(user)
				res.redirect('/');
			})
		}
	})
	
}

//登录逻辑
exports.signin=function (req,res) {
	/* body... */
	var _user=req.body.user
	var name=_user.name
	var password=_user.password
	User.findOne({name:name},function(err,user){
		if(err){
			console.log(err)
		}
		if(!user){
			return res.redirect('/signup')
		}
		user.comparePassword(password,function(err,isMatch){
			if(err){
				console.log(err)
			}
			if(isMatch){
				console.log('Password is match');
				req.session.user=user;
				return res.redirect('/')
			}else{
					return res.redirect('/signin')
				console.log('Password is not match')
			}
		})
	})
}
//用户列表页
exports.list=function(req, res) {
	/* body... */
	User.fetch(function(err, users) {
		if (err) {
			console.log(err)
		}
		res.render('userlist', {
			title: 'FMovie 用户列表页',
			//之前伪造的数据
			users: users
		})
	})
}


//退出登录
exports.logout=function (req,res) {
	/* body... */
	delete req.session.user
	//delete app.locals.user  //app只能在app.js和routes.js之间访问到
	res.redirect('/')
}

//列表页删除用户
exports.delete=function (req, res) {
    var id = req.query.id;
    console.log(id)
    if (id) {
        User.remove({_id: id}, function (err, user) {
            if (err) {
                console.log(err);
            } else { 
                 res.json({success: 1});
            	//或res.send({success: 1});
            }
        });
    }
}


//判断登录状态
exports.signinRequired=function (req,res,next) {
	/* body... */
	var user=req.session.user
	if(!user){
		return res.redirect('/')
	}
	next()
}

exports.adminRequired=function (req,res,next) {
	/* body... */
	var user=req.session.user
	if(user.role<=10){  //判断角色是否为管理员、
		return res.redirect('/signin')
	}
	next()
}

