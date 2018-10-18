var mongoose = require('mongoose')
var Schema=mongoose.Schema
var ObjectId=Schema.Types.ObjectId

var CategroySchema =new Schema({
	name: String,
	movies:[{type:ObjectId,ref:'Movie'}],
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
CategroySchema.pre('save', function(next) {
	/* body... */
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next();
});


CategroySchema.statics = {
	fetch: function(cb) { //查找所有数据
		/* body... */
		return this.find({}).sort('meta.updateAt').exec(cb)
	},
	findById: function(id,cb) { //查找所有数据
		/* body... */
		return this.findOne({_id:id}).exec(cb)
	}
};

module.exports=CategroySchema;