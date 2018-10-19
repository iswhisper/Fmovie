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
//分类查询
exports.search=function(req, res) {
	/* body... */
	var count=2
	var catId=req.query.cat;
	var q=req.query.q;
	var page=parseInt(req.query.p,10)||0;
	var index=parseInt(page*count,10);
	if(catId){  //如果有catId则表明是来自分类搜索的ID
		Categroy
			.find({_id:catId}) //查询这个id的数据
			.populate({
				path: 'movies',
				select: 'title poster',
				// options: { //分页筛选
				// 	limit: 2,
				// 	skip:index
				// } //一次显示两条数据，跳到为index位置查询
			}) 
			.exec(function (err,catetories) {
			/* body... */
			if(err){
				console.log(err);
			}
			var categroy=catetories[0]||[] //有则赋值无则空数组
			var movies=categroy.movies||{}
			var results=movies.slice(index,index+count);//截取从index到index+2的数据
			res.render('result', {
				title: 'FMovie 分类结果列表',
				//之前伪造的数据
				keyword:categroy.name,
				currentPage:(page+1),
				query:'cat='+catId,
				totalPage:Math.ceil(movies.length/count), //向上舍入
				movies:results
			})
		})
	}else { //否则是来则搜索框的搜索
		Movie
			.find({title:new RegExp(q+'.*','i')}) //通过正则表达式实现模糊搜索
			.exec(function (err,movies) {
			/* body... */
			if(err){
				console.log(err);
			}
			var results=movies.slice(index,index+count);//截取从index到index+2的数据
			res.render('result', {
				title: 'FMovie 分类结果列表',
				//之前伪造的数据
				keyword:q,
				currentPage:(page+1),
				query:'q='+q,
				totalPage:Math.ceil(movies.length/count), //向上舍入
				movies:results
			})
		})
	}
	 
}
