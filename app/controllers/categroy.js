var Categroy = require("../models/categroy.js")
 
exports.new=  function(req, res) {
	/* body... */
	
	res.render('categroy_admin', {
		title: 'FMovie 后台分类录入页',
		categroy:{}
	})
}
//admin update movie  后台更新页
exports.update= function (req,res) {
	/* body... */
	var id=req.params.id
	if(id){
		Movie.findById(id,function (err,movie) {
			/* body... */
			res.render('admin',{
				title:'FMovie 后台更新页',
				movie:movie
			})
		})
	}
}
//admin post movie //电影的保存
exports.save=function (req,res) {
	/* body... */
	console.log('ddddd');
	var _categroy=req.body.categroy;
	var categroy=new Categroy(_categroy)
		//保存数据后跳转到详情页
	categroy.save(function (err,categroy) {
		/* body... */
		if (err) {
		console.log(err)
	}
	res.redirect('/admin/categroy/list');
	})
 
}

//列表页
exports.list= function(req, res) {
	 
	Categroy.fetch(function(err, catetories) {
		if (err) {
			console.log(err)
		}
		res.render('categroylist', {
			title: 'FMovie 分类列表页',
			//之前伪造的数据
			catetories: catetories
		})
	})
}


//列表页删除分类
exports.delete=function (req, res) {
    var id = req.query.id;
    if (id) {
        Categroy.remove({_id: id}, function (err, categroy) {
            if (err) {
                console.log(err);
            } else { 
                 res.json({success: 1});
            	//或res.send({success: 1});
            }
        });
    }
}

 
