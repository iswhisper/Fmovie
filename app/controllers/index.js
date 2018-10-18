//负责与首页进行交互
var Movie = require("../models/movie.js")
var Categroy = require("../models/categroy.js")


exports.index=function(req, res) {
	/* body... */
	console.log('User session:'+req.session.user);
	Categroy
	.find({})
	.populate({path:'movies',options:{limit:5}}) //从分类的movies的数据里面去除5条数据
	.exec(function (err,catetories) {
		/* body... */
		if(err){
			console.log(err);
		}
		res.render('index', {
			title: 'FMovie 首页',
			//之前伪造的数据
			catetories:catetories
		})
	})
}
