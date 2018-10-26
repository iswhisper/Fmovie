var Movie = require("../models/movie.js")
var Comment = require("../models/comment.js")
var Categroy = require("../models/categroy.js")
var _ = require("underscore") //里面的extend()方法可将新数据里面的字段替换掉老数据里面的字段
var fs=require('fs')
var path=require('path')

exports.detail = function(req, res) {
	/* body... */
	var id = req.params.id; //获取路径的:id
	Movie.update({_id:id},{$inc:{pv:1}}, function(err) {
		if(err){
			console.log(err)
		}
	})
	Movie.findById(id, function(err, movie) {
		/* body... */
		Comment
			.find({
				movie: id
			})
			.populate('from', 'name') //from是comment的字段名，表示通过from的ObjectId找到对应User的name,添加到from上
			.populate('reply.from reply.to', 'name')
			.exec(function(err, comments) {
				res.render('movie', {
					title: 'FMovie 详情页',
					movie: movie,
					comments: comments
				})
			})

	})
}

exports.new = function(req, res) {
	Categroy.find({}, function(err, categroies) {
		res.render('admin', {
			title: 'FMovie 后台录入页',
			categroies: categroies,
			movie: {}
		})
	})
}
//admin update movie  后台更新页
exports.update = function(req, res) {
	/* body... */
	var id = req.params.id
	if (id) {
		Movie.findById(id, function(err, movie) {
			/* body... */
			Categroy.find({}, function(err, categroies) {
				res.render('admin', {
					title: 'FMovie 后台更新页',
					movie: movie,
					categroies: categroies
				})
			})
		})
	}
}
exports.savePoster=function (req,res,next) {
	/* body... */
	var posterData=req.files.uploadposter //接收数据
	var filePath=posterData.path//拿到原始路径
	var originalFilename=posterData.originalFilename //拿到原始文件名
	 console.log(originalFilename+"=---======================")
	if(originalFilename){
		//如果有则读取数据
		fs.readFile(filePath,function (err,data) {
			/* body... */
			var timestamp=Date.now();//拿到时间戳
			var type=posterData.type.split('/')[1] //拿到图片类型
      		var poster = timestamp + '.' + type
			var newPath=path.join(__dirname,'../','/views/public/upload/'+poster)  //生成一个储存图片的服务器的地址
			console.log(newPath)
 			fs.writeFile(newPath,data,function (err) {
 				/* body... */
 				req.poster=poster; //将写入的数据挂在req上面
 				next();
 			})
		})
	}else {
		next();
	}
}
//admin post movie //电影的保存
exports.save = function(req, res) {
	/* body... */
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;
//是否有上传的海报图片有则保存无则保存海报地址
	if(req.poster){
		movieObj.poster=req.poster
	}
	if (id) {
		//已处在该id的数据
		Movie.findById(id, function(err, movie) {
			if (err) {
				console.log(err)
			}
			_movie = _.extend(movie, movieObj)
			var categroyId = _movie.categroy
			_movie.save(function(err, movie) {
				if (err) {
					console.log(err)
				}
			})
			//先找出比对所有分类的的id，相同的删除，保证一个电影只能所以一个分类
			Categroy.find({}, function(err, categroies) {
				/* body... */
				categroies.forEach(function(element, categoryindex) {
					// statements
					categroies[categoryindex].movies.forEach(function(element, index) {
						if (_.isEqual(element, movie._id)) {
							categroies[categoryindex].movies.splice(index);
						}
					})
					//一定要执行save否则数据库的数据不会更新
					categroies[categoryindex].save(function(err, categroy) {})
				});
			})
			//重新保存电影ID到categroy.movies
			Categroy.findById(categroyId, function(err, categroy) {
				/* body... */
				categroy.movies.push(movie._id);
				categroy.save(function(err, categroy) {
					/* body... */
					res.redirect('/movie/' + movie._id);
				})
			})
		})
	} else {
 	_movie = new Movie(movieObj)

    var categroyId = movieObj.categroy
    var categroyName = movieObj.categroyName

    _movie.save(function(err, movie) {
      if (err) {
        console.log(err)
      }
      if (categroyId) {
        Categroy.findById(categroyId, function(err, categroy) {
          categroy.movies.push(movie._id)

          categroy.save(function(err, categroy) {
            res.redirect('/movie/' + movie._id)
          })
        })
      }
      else if (categroyName) {
        var categroy = new Categroy({
          name: categroyName,
          movies: [movie._id]
        })

        categroy.save(function(err, categroy) {
          movie.categroy = categroy._id
          movie.save(function(err, movie) {
            res.redirect('/movie/' + movie._id)
          })
        })
      }
    })
	}
}

	

//列表页
exports.list = function(req, res) {
	/* body... */
	// res.render('list', {
	// 	title: 'FMovie 列表页',
	// 	movies: [{
	// 		title: "机械战警",
	// 		_id: 1,
	// 		doctor: '何塞.帕迪利亚',
	// 		country: "美国",
	// 		year: 2014,
	// 		poster: "http://r3.ykimg.com/05160000530EEB63675839160D0B79D5",
	// 		language: "英语",
	// 		flash: "http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf",
	// 		summary: "《机械战警》是由何塞·帕迪里亚执导，乔尔·金纳曼、塞缪尔·杰克逊、加里·奥德曼等主演的一部科幻电影，改编自1987年保罗·范霍文执导的同名电影。影片于2014年2月12日在美国上映，2014年2月28日在中国大陆上映。影片的故事背景与原版基本相同，故事设定在2028年的底特律，男主角亚历克斯·墨菲是一名正直的警察，被坏人安装在车上的炸弹炸成重伤，为了救他，OmniCorp公司将他改造成了生化机器人“机器战警”，代表着美国司法的未来。"
	// 	}]
	// })

	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err)
		}
		res.render('list', {
			title: 'FMovie 列表页',
			//之前伪造的数据
			movies: movies
		})
	})
}

//列表页删除电影
exports.delete = function(req, res) {
	var id = req.query.id;
	if (id) {
		Movie.remove({
			_id: id
		}, function(err, movie) {
			if (err) {
				console.log(err);
			} else {
				res.json({
					success: 1
				});
				//或res.send({success: 1});
			}
		});
	}
}