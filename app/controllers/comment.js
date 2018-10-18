var Comment = require("../models/comment.js")

//admin post movie //电影的保存
exports.save=function (req,res) {
	/* body... */
	var _comment=req.body.comment;
	var movieId=_comment.movie;
	var comment=new Comment(_comment)

	//判断是否存在cid,存在即是在回复评论
	if(_comment.cid){
		//找到主评论
		Comment.findById(_comment.cid,function (err,comment) {
			/* body... */
			var reply={
				from:_comment.from, //谁回复的
				to:_comment.tid, //回复给谁
				content:_comment.content //内容
			}
			comment.reply.push(reply)
			//保存数据后跳转到详情页
			comment.save(function (err,comments) {
				/* body... */
				if (err) {
				console.log(err)
			}
			res.redirect('/movie/'+movieId);
		 })
		})

	}else {//简单的评论
		
	//保存数据后跳转到详情页
	comment.save(function (err,comments) {
		/* body... */
		if (err) {
		console.log(err)
	}
	res.redirect('/movie/'+movieId);
	})
	}
}

