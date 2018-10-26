var mongoose = require('mongoose')
var Schema= mongoose.Schema;
var ObjectId=Schema.Types.ObjectId
var MovieSchema = new Schema({
	doctor: String,
	title: String,
	language: String,
	country: String,
	summary: String,
	flash: String,
	poster: String,
	year: Number,
	pv:{ //双向绑定
		type:Number, 
		default:0
	},
	categroy:{ //双向绑定
		type:ObjectId, 
		ref:'Categroy'
	},
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
MovieSchema.pre('save', function(next) {
	/* body... */
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next();
});


MovieSchema.statics = {
	fetch: function(cb) { //查找所有数据
		/* body... */
		return this.find({}).sort('meta.updateAt').exec(cb)
	},
	findById: function(id,cb) { //查找所有数据
		/* body... */
		return this.findOne({_id:id}).exec(cb)
	}
};

module.exports=MovieSchema;