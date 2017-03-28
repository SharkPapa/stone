var express = require('express');
var router = express.Router();
var cookie = require('cookie');

// 数据库配置
var mongoose=require('./dbconn');
var userSchema=new mongoose.Schema({
  username:String,
  truename:String,
  role:String,
  department:String,
  apply:Number
});
//数据存储模型
var user_model=mongoose.model('user',userSchema,'user');
//数据查询模型
var userQueryModel=mongoose.model('user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get("/newshow",function(req,res,next){
  userQueryModel.find(function(err,data){
    //console.log("数据库中的数据",data);
    res.send(data);
  });
});
//处理页面的请求，用于存储数据
router.post('/user_save',function(req,res,next){
//  获取页面中传来的数据
  var username=req.body.username;
  var truename=req.body.truename;
  var role=req.body.role;
  var department=req.body.department;
  //特别注意，当请求发过来时，数据类型都被改为string类型，而且，要与前面的userSchema数据类型相同
  var apply=parseInt(req.body.apply);
  console.log("数据接收成功",username,truename,role,department,apply);
//  new 一个模板对象，用于存储数据到数据库
  var instance = new user_model();
  instance.username=username;
  instance.truename=truename;
  instance.role=role;
  instance.department=department;
  instance.apply=apply;
  //调用save方法进行数据的保存
  instance.save(function(err){
    console.log(err);
    if(!err){
      //返回数据"1"表示成功存储
      res.send("1")
    }else {
      //返回数据"0"表示存储失败
      res.send("0");
    }
  });
});
module.exports = router;
