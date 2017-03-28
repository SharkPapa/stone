var express = require('express');
var router = express.Router();
var cookie = require('cookie');

// 数据库配置
var mongoose = require('./dbconn');
//引入日志处理模块，里边有两个方法，分别用于日志的存储和查询
var log_del = require('./logdel');
//user表操作对象
var userSchema = new mongoose.Schema({
    username: String,
    truename: String,
    role: String,
    department: String,
    apply: Number
});
//数据存储模型
var user_model = mongoose.model('user', userSchema, 'user');
//数据查询模型
var userQueryModel = mongoose.model('user');

router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
router.get("/newshow", function (req, res, next) {
    userQueryModel.find(function (err, data) {
        //console.log("数据库中的数据",data);
        res.send(data);
    });
});
//处理页面的请求，用于存储数据
router.post('/user_save', function (req, res, next) {
    //日志文件操作
    log_del.log_save("用户存储操作", req);
//  获取页面中传来的数据
    var username = req.body.username;
    var truename = req.body.truename;
    var role = req.body.role;
    var department = req.body.department;
    //特别注意，当请求发过来时，数据类型都被改为string类型，而且，要与前面的userSchema数据类型相同
    var apply = parseInt(req.body.apply);
    console.log("数据接收成功", username, truename, role, department, apply);
//  new 一个模板对象，用于存储数据到数据库
    var instance = new user_model();
    instance.username = username;
    instance.truename = truename;
    instance.role = role;
    instance.department = department;
    instance.apply = apply;
    //调用save方法进行数据的保存
    instance.save(function (err) {
        console.log(err);
        if (!err) {
            //返回数据"1"表示成功存储
            res.send("1");
        } else {
            //返回数据"0"表示存储失败
            res.send("0");
        }
    });
});
//编辑用户操作
router.post('/user_edit_second', function (req, res, next) {
//  日志操作自动存储
    log_del.log_save("用户编辑操作", req);
//  获取页面中传来的数据
    var id = req.body.id;
    console.log("当前编辑数据的id", id);
    var username = req.body.username;
    var truename = req.body.truename;
    var role = req.body.role;
    var department = req.body.department;
    //特别注意，当请求发过来时，数据类型都被改为string类型，而且，要与前面的userSchema数据类型相同
    var apply = parseInt(req.body.apply);
    console.log("数据接收成功", username, truename, role, department, apply);
//  new 一个模板对象，用于存储数据到数据库
    var instance = new user_model();
    instance.username = username;
    instance.truename = truename;
    instance.role = role;
    instance.department = department;
    instance.apply = apply;
    //调用save方法进行数据的保存
    instance.save(function (err) {
        console.log(err);
        if (!err) {
            //返回数据"1"表示成功存储
            res.send("1");
        } else {
            //返回数据"0"表示存储失败
            res.send("0");
        }
    });
//  保存成功之后删除原来的那条数据，根据id查询
    userQueryModel.find({"_id": id}, function (err, datas) {
        for (var i in datas) {
            datas[i].remove();
            console.log("编辑页面原始数据已经删除");
        }
    });
});
//删除请求处理
router.get("/user_delete", function (req, res, next) {
    //页面删除操作日志记录

    log_del.log_save("用户删除操作", req);
    //前端传回来的是一个 str需要解析
    var id = req.query.id;
    console.log("要删除数据的ID", id, typeof id);
    var delet_id = id.split(",");
    console.log("删除数据返回之后处理的数据", delet_id, typeof  delet_id);

    userQueryModel.find({"_id": delet_id}, function (err, datas) {
        for (var i = 0; i < datas.length; i++) {
            datas[i].remove(function (err) {
                //console.log("删除成功");
            });
        }
        //console.log("单个id删除操作",datas);
        //datas.remove();
        //console.log("数据已经删除");
        res.send("1");

    });


});
//修改请求处理
router.get("/user_edit", function (req, res, next) {
    //日志操作记录
    var log_instance = new log_model();
    log_instance.name = req.cookies.username;
    var data = new Date();
    log_instance.time = data.toLocaleString();
    log_instance.ip = req.ip;
    log_instance.option = "用户编辑操作";
    log_instance.save(function (err) {
        console.log("日志文件记录-usersave-ok");
    });
    var id = req.query.id;
    userQueryModel.find({"_id": id}, function (err, datas) {
        if (!err) {
            //返回数据给前端
            console.log("编辑页面数据", datas[0]);
            res.send(datas);
        }
    });
});
//处理log页面的数据请求
router.get("/log_getdata", function (req, res, next) {
    //设置单个页面的条数
    var pagesingel=3;
    var currentPage = req.query.currentpage? parseInt(req.query.currentpage) : 1;
    log_del.logQueryModel.find(function(err,datas){
        //获取数据长度
        var log_data_length=datas.length;
        //总共的页面数，并将其向上取整
        var pages=Math.ceil(log_data_length/pagesingel);
        var start = (currentPage-1) * pagesingel;
        //封装数据返回页面
        log_del.logQueryModel.find(function(err,data){
            var page_data={
                    start:start+1,
                    log_data_length:log_data_length,
                     'end' : Math.min(start + pagesingel,log_data_length),
                    pages:pages,
                    datas:data,
                    currentPage:currentPage
            }
            res.send(page_data);
        }).limit(pagesingel).skip(start);
    });

});
//处理查询操作请求
router.post("/search_user", function (req, res) {
//  取出传递的数据
    var department = req.body.department;
    var username = req.body.username;
    var role = req.body.role;
    //console.log(department,username,role);
//  编写查询对象
    var search = {};
//  判断操作
    if (department != "" && department != "全部") {
        search.department = department;
    }
    if (role != "" && role != "全部") {
        search.role = role;
    }
    if (username != "") {
        search.username = new RegExp(username);
    }

//  查询操作开始
    userQueryModel.find(search, function (err, datas) {
        if (!err) {
            //console.log("高级查询对象",datas);
            res.send(datas);
        }
    });
});
module.exports = router;
