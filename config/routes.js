var Index= require("../app/controllers/index.js")
var User = require("../app/controllers/user.js")
var Movie = require("../app/controllers/movie.js")
var Comment = require("../app/controllers/comment.js")
var Categroy = require("../app/controllers/categroy.js")

module.exports=function (app) {
app.use(function (req,res,next) {
	/* body... */
	var _user=req.session.user;
	app.locals.user=_user;
	return next();
})
//首页
app.get('/', Index.index)

app.get('/signup',User.showSignup)
//登录逻辑
app.get('/signin',User.showSignin)
//user post 用户注册
app.post('/user/signup',User.signup)
//登录逻辑
app.post('/user/signin',User.signin)
//user post 用户注册

//退出登录
app.get('/logout',User.logout)
//用户列表页 先调用signinRequired通过了再调用adminRequried通过了再行list
app.get('/admin/user/list',User.signinRequired,User.adminRequired,User.list)

//列表页删除用户
app.delete('admin/user/list',User.delete);
// 电影详情页
app.get('/movie/:id', Movie.detail)

app.get('/admin/movie',User.signinRequired,User.adminRequired,Movie.new)
//admin update movie
app.get('/admin/movie/update/:id',User.signinRequired,User.adminRequired,Movie.update)
//admin post movie
app.post('/admin/movie/new',User.signinRequired,User.adminRequired,Movie.save)
//列表页
app.get('/admin/movie/list',User.signinRequired,User.adminRequired, Movie.list)

//列表页删除电影
app.delete('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.delete)

//用户评论
app.post('/user/comment',User.signinRequired,Comment.save);

//电影分类
app.get('/admin/categroy/new',User.signinRequired,User.adminRequired,Categroy.new)
 
app.post('/admin/categroy',User.signinRequired,User.adminRequired, Categroy.save)
 
app.get('/admin/categroy/list',User.signinRequired,User.adminRequired,Categroy.list)

app.delete('/admin/categroy/list',User.signinRequired,User.adminRequired,Categroy.delete)

}
