var mongoose = require('mongoose')
var Schema=mongoose.Schema
var ObjectId=Schema.Types.ObjectId

var CommentSchema = new mongoose.Schema({
 	movie:{type:ObjectId,ref:'Movie'},
 	from:{type:ObjectId,ref:'User'},   //ref---表示此ObjectId为User的唯一外键
 	reply:[{ //针对评论的回复
 		from:{type:ObjectId,ref:'User'},
 		to:{type:ObjectId,ref:'User'},
 		content:String
 	}],
 	to:{type:ObjectId,ref:'User'},
 	content:String,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});
//在执行保存的时候先执行这个函数
CommentSchema.pre('save', function(next) {
	/* body... */
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next();
});


CommentSchema.statics = {
	fetch: function(cb) { //查找所有数据
		/* body... */
		return this.find({}).sort('meta.updateAt').exec(cb)
	},
	findById: function(id,cb) { //查找所有数据
		/* body... */
		return this.findOne({_id:id}).exec(cb)
	}
};

module.exports=CommentSchema;