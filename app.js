//require的都是需要在命令台使用npm安装的，如  npm install express --save
var express = require('express')
var app = express()
var path = require('path')
var cookieParser = require('cookie-parser')
var multipart = require('connect-multiparty');
var session = require('express-session')
var mongoose = require('mongoose')
var mongoStore=require('connect-mongo')(session)
var logger = require('morgan'); 
var port = process.env.PORT || 3000
var dbUrl='mongodb://localhost/imooc'
var fs=require('fs')
mongoose.connect(dbUrl)
var modles_path=__dirname+"/app/models"
var walk = function(path) {
  fs
    .readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file
      var stat = fs.statSync(newPath)

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath)
        }
      }
      else if (stat.isDirectory()) {
        walk(newPath)
      }
    })
}
walk(modles_path) //测试用例

app.use(multipart())//处理表单传输文件等的插件
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
	extended: true
})); // for parsing application/x-www-form-urlencoded
//http://www.expressjs.com.cn/guide/using-template-engines.html
//在 Express 中使用模板引擎
// 需要在应用中进行如下设置才能让 Express 渲染模板文件：
// views, 放模板文件的目录，比如： app.set('views', './views')
// view engine, 模板引擎，比如： app.set('view engine', 'jade')
app.set('views', './app/views/pages') //视图的路径，即后面index,admin,list,detail的文件位置
app.set('view engine', 'jade') //模板引擎
app.use(cookieParser());
app.use(session({
	secret:'imooc',
	store:new mongoStore({
		url:dbUrl,
		collection:'session'
	}),
	resave: false,  
	saveUninitialized: true 
}))

if('development'==app.get('env')){
	app.set('showStackError',true)
	app.use(logger(':method :url :status'))
	app.locals.pretty=true
	mongoose.set('debug',true);
}

app.use(express.static(path.join(__dirname, 'app/views/public'))) //静态文件的路径
app.locals.moment = require('moment')
require('./config/routes')(app)
app.listen(port)