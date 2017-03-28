var mongoose=require('./dbconn');
    var logSchema=new mongoose.Schema({
        name:String,
        time:String,
        ip:String,
        option:String
    });
//创建log的存储、查询对象
    var log_model=mongoose.model("log",logSchema,"log");
    var logQueryModel=mongoose.model("log");
    function log_save(str,req){
        var log_instance=new log_model();
        log_instance.name=req.cookies.username;
        var data=new Date();
        log_instance.time=data.toLocaleString();
        log_instance.ip=req.ip;
        log_instance.option=str;
        log_instance.save(function(err){
        });
    }
    module.exports.log_save= log_save;
    module.exports.logQueryModel = logQueryModel;
