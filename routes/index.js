var express = require('express');
var router = express.Router();
var cookie = require('cookie');

// 数据库配置
var mongoose=require('./dbconn');
var adminSchema=new mongoose.Schema({
  _id:String,
  username:String,
  nickname:String,
  password:String
});
var admin_model=mongoose.model('admin',adminSchema,'admin');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/doLogin', function(req, res, next) {
  // 1、接收前端输入的参数
  var username = req.body.username;
  var password = req.body.password;
  //console.log('');
  //console.log('username:',username, typeof username);
  //console.log('password:',password, typeof password);
  //console.log('');
  // 2、处理
  admin_model.find({'username':username,'password':password},function(err, datas){
    // 验证登录用户的唯一性，datas.length用于处理数据的唯一性，在后台系统中，账号数据都是唯一的
    if(datas && datas.length==1){
      // cookie(key，value)，设置cookie 的值，在会话时有效，除非消除会话
      res.cookie("username",username);
      //res.cookie("age",18);
      res.send('1'); //  登录成功
    }else{
      res.send('0'); // 登录失败
    }
  });
});
router.get("/check",function(req,res,next){
  var name=req.cookies.username;
  console.log("请求已经接收到了",name,typeof name);
  if(name){
    console.log("用户已登录");
    res.send();
  }else{
    console.log("用户未登录");
     res.send("alert('未登录，请登录');location.href='/pages/login.html'");
    console.log("执行跳转");
    
  }
});
//清除cookie并且返回登录页面
//router.get("/clearcookie",function(req,res,next){
//  //清除cookie
//  res.clearCookie("username");
////  想页面返回js代码用于跳转
//  res.send("alert('已经注销');location.href='/pages/login.html'");
//});
router.get("/clearcookie",function(req,res,next){
  //清除cookie
  res.clearCookie("username");
//  想页面返回js代码用于跳转
  res.send("<script>alert('已经注销');location.href='/pages/login.html'</script>");
});
module.exports = router;
