var mongoose=require('mongoose');
var MovieSchema=require('../schemas/movie');
//生成模型
var Movie=mongoose.model('Movie',MovieSchema);
//导出构造函数

module.exports=Movie