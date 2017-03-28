/*mongo数据库连接公共模块*/
var mongoose = require("mongoose");
//方法一
//mongoose.Promise = global.Promise;//配置mongoose的Promise。
//// 连接字符串格式为mongodb://主机/数据库名
//mongoose.connect('mongodb://localhost/test101');
//mongoose.Promise = global.Promise;
// 方法二 连接本地mongodb ，本机的ip 127.0.0.1，端口：27017 数据库：student，可以不用填写端口号
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://127.0.0.1:27017/pss",function(err){
    if(!err){//如果连接成功，则打印出connected to Mongodb
        console.log("连接成功");
    }else{
        console.log("连接失败");
    }
});
module.exports = mongoose;


