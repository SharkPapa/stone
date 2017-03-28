var express = require('express');
var router = express.Router();
var cookie = require('cookie');

 //数据库配置
var mongoose=require('./dbconn');
//日志模块
var log_del=require('./logdel');
var supplySchema=new mongoose.Schema({
    unitname:String,
    address:String,
    contact:String,
    tel:String,
    goodskind:String,
    username:String,
    bank:String,
    banknum:Number
});

//数据存储模型
var supply_model=mongoose.model('supply',supplySchema,'supply');
//数据查询模型
var supplyQueryModel=mongoose.model('supply');
//数据存储
router.post('/info_save',function(req,res){
    //供应商存储操作
    log_del.log_save("供应商存储操作",req);
    var suppyly_instance=new supply_model;
    suppyly_instance.unitname=req.body.unitname;
    suppyly_instance.address=req.body.address;
    suppyly_instance.contact=req.body.contact;
    suppyly_instance.tel=req.body.tel;
    suppyly_instance.goodskind=req.body.goodskind;
    suppyly_instance.username=req.body.username;
    suppyly_instance.bank=req.body.bank;
    suppyly_instance.banknum=parseInt(req.body.banknum);
    suppyly_instance.save(function(err){
        console.log("供应商数据添加成功");
        res.send("1");
    });
});
//页面刷新操作
router.get("/info_renew",function(req,res,next){

    supplyQueryModel.find(function(err,datas){
        //console.log("供应商管理刷新",datas);
        res.send(datas);
    });
});
//页面删除操作
router.get("/info_delete",function(req,res,next){
    //  当用户进行存储操作时，自动记录log信息
   log_del.log_save("供应商删除操作",req);
    //前端传回来的是一个 str需要解析
    var id=req.query.id;
    console.log("要删除数据的ID",id,typeof id);
    var delet_id=id.split(",");
    console.log("删除数据返回之后处理的数据",delet_id, typeof  delet_id);

    supplyQueryModel.find({"_id":delet_id},function(err,datas){
        for(var i=0;i<datas.length;i++){
            datas[i].remove(function(err){
                //console.log("删除成功");
            });
        }
        //console.log("单个id删除操作",datas);
        //datas.remove();
        //console.log("数据已经删除");
        res.send("1");

    });
});
router.get("/info_edit",function(req,res,next){
    var id=req.query.id;
    supplyQueryModel.find({"_id":id},function(err,datas){
        if(!err){
            //返回数据给前端
            console.log("编辑页面数据",datas[0]);
            res.send(datas);
        }
    });
});
//用户编辑
router.post('/info_edit_second',function(req,res,next){
    //供应商编辑操作
    log_del.log_save("供应商编辑操作",req);
    var id=req.body.id;
    console.log("当前编辑数据的id",id);
    var unitname=req.body.unitname;
    var address=req.body.address;
    var contact=req.body.contact;
    var tel=req.body.tel;
    var goodskind=req.body.goodskind;
    var username=req.body.username;
    var bank=req.body.bank;
    //特别注意，当请求发过来时，数据类型都被改为string类型，而且，要与前面的userSchema数据类型相同
    var banknum=parseInt(req.body.banknum);
//    查询当前编辑对象进行更改
    supplyQueryModel.findById(id,function(err,data){
        data.unitname=unitname;
        data.address=address;
        data.contact=contact;
        data.tel=tel;
        data.goodskind=goodskind;
        data.username=username;
        data.bank=bank;
        data.banknum=banknum;
        data.save();
    });
    res.send();
});
module.exports = router;