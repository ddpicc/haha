const mysql = require('mysql');
var async = require("async");
const dbConfig = require('../db/db');
const sqlMap = require('../sqlMaps/defaultSqlMap');
const userSqlMap = require('../sqlMaps/userSqlMap');
const twilio_util = require('../utils/twilioConfig');
const mail_util = require('../utils/nodemailer')
var crypto = require('crypto');
var md5 = crypto.createHash('md5');

const users = {};

const pool = mysql.createPool({
  host: dbConfig.mysql.host,
  user: dbConfig.mysql.user,
  password: dbConfig.mysql.password,
  database: dbConfig.mysql.database,
  port: dbConfig.mysql.port,
  dateStrings: true,   //强制日期类型(TIMESTAMP, DATETIME, DATE)以字符串返回，而不是一javascript Date对象返回
  multipleStatements: true    // 多语句查询
});

function _getNewSqlParamEntity(sql, params, callback) {
	if (callback) {
		return callback(null, {
				sql: sql,
				params: params
		});
	}
	return {
		sql: sql,
		params: params
	};
};

function execTrans(sqlparamsEntities, callback) {
  pool.getConnection(function (err, connection) {
    if (err) {
      return callback(err, null);
    }
    connection.beginTransaction(function (err) {
      if (err) {
        return callback(err, null);
      }
      console.log("开始执行transaction，共执行" + sqlparamsEntities.length + "条数据");
      var funcAry = [];
      sqlparamsEntities.forEach(function (sql_param) {
        var temp = function (cb) {
          var sql = sql_param.sql;
          var param = sql_param.params;
          connection.query(sql, param, function (tErr, rows, fields) {
              if (tErr) {
                connection.rollback(function () {
                  console.log("事务失败，" + sql_param + "，ERROR：" + tErr);
                  throw tErr;
                });
              } else {
                return cb(null, 'ok');
              }
          })
        };
        funcAry.push(temp);
      });

      async.series(funcAry, function (err, result) {
        console.log("transaction error: " + err);
        if (err) {
          connection.rollback(function (err) {
            console.log("transaction error: " + err);
            connection.release();
            return callback(err, null);
          });
        } else {
          connection.commit(function (err, info) {
            console.log("transaction info: " + JSON.stringify(info));
            if (err) {
              console.log("执行事务失败，" + err);
              connection.rollback(function (err) {
                console.log("transaction error: " + err);
                connection.release();
                return callback(err, null);
              });
            } else {
              connection.release();
              return callback(null, info);
            }
          })
        }
      })
    });
  });
};

module.exports = {
  
  
  getBatchUser(req, res, next) {
    console.log('api - getBatchUser');
    var role = req.query.role;
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = userSqlMap.getBatchUser;
      connection.query(sql, [role], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  

  
  


  
  

  

  


  
  getPackageInfoById(req, res, next) {
    console.log('api - getPackageInfoById');
    var id = req.query.packageId;
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = sqlMap.getPackageInfoById;
      connection.query(sql, [id], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },
  
  

  

  
  
  updateThirdPartyPackageStatus(req, res, next) {
    console.log('api - updateThirdPartyPackageStatus');
    var status = req.body.status,third_party_packageId = req.body.third_party_packageId;
    var user_packageId = req.body.user_packageId;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.updateThirdPartyPackageStatus;
      connection.query(sql, [status,user_packageId,third_party_packageId], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },


  
  existUserPackageByLittleAntTracking(req, res, next) {
    console.log('api - existUserPackageByLittleAntTracking');
    var littleant_tracking = req.query.littleant_tracking;
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = sqlMap.existUserPackageByLittleAntTracking;
      connection.query(sql, [littleant_tracking], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },
  
  existStorageNumber(req, res, next) {
    console.log('api - existStorageNumber');
    var storage_number = req.query.storage_number;
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = sqlMap.existStorageNumber;
      connection.query(sql, [storage_number], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  

  existUserEmailOrPhone(req, res, next) {
    console.log('api - existUserEmailOrPhone');
    var email = req.query.email;
    var phone = req.query.phone;
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = sqlMap.existUserEmailOrPhone;
      connection.query(sql, [email,phone], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  existUserPhone(req, res, next) {
    console.log('api - existUserPhone');
    var phone = req.query.phone;
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = sqlMap.existUserPhone;
      connection.query(sql, [phone], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  
  

  getPackageById(req, res, next) {
    console.log('api - getPackageById');
    var id = req.query.packageId;
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = sqlMap.getPackageById;
      connection.query(sql, [id], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },
  
  getAllRecipients(req, res, next) {
    console.log('api - getAllRecipients');
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = sqlMap.getAllRecipients;
      connection.query(sql, (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  getRecipientsByUser(req, res, next) {
    console.log('api - getRecipientsByUser');
    var user_id = req.query.userId;
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = sqlMap.getRecipientsByUser;
      connection.query(sql, [user_id], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  updateRecipientbyId(req, res, next) {
    console.log('api - updateRecipientbyId');
    var name = req.body.recipientName,country_code = req.body.countryCode;
    var phone = req.body.recipientPhone, identity_card = req.body.recipientIdentityCard;
    var address = req.body.recipientAddress;
    var state = req.body.recipientState, city = req.body.recipientCity;
    var zip = req.body.recipientZip, id = req.body.id;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.updateRecipientbyId;
      connection.query(sql, [name,country_code,phone,identity_card,address,city,state,zip,id], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
          connection.release();
      })
    })
  },

  

  deleteRecipientbybyId(req, res, next) {
    console.log('api - deleteRecipientbybyId');
    var id = req.query.id;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.deleteRecipientbybyId;
      connection.query(sql, [id], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  getRecipientbybyId(req, res, next) {
    console.log('api - getRecipientbybyId');
    var id = req.query.id;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.getRecipientbybyId;
      connection.query(sql, [id], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },
  
  getVendorTrackingByLittleAntNo(req, res, next) {
    console.log('api - getVendorTrackingByLittleAntNo');
    var littleant_tracking = req.query.littleant_tracking;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.getVendorTrackingByLittleAntNo;
      connection.query(sql, [littleant_tracking], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },
  
  
  updateUserBalance(req, res, next) {
    console.log('api - updateUserBalance');
    var changeAmt = req.body.changeAmt;
    var storage_number = req.body.storage_number;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.updateUserBalance;
      connection.query(sql, [changeAmt,storage_number], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  manualCharge(req, res, next){
    console.log('api - manual charge');
    var tracking_nm = req.body.trackingNm, total = req.body.chargeAmount;
    var memo = req.body.comment, storage_number = req.body.storage_number;
    var invoice_type = req.body.type, created_at = req.body.created_at;
    var prev_balance = req.body.prev_balance;
    var sqlParamsEntity = [];
    var sql1 = sqlMap.updateUserBalance;
    console.log(total + '- ' + storage_number);
    sqlParamsEntity.push(_getNewSqlParamEntity(sql1, [total,storage_number]));

    var sql2 = sqlMap.insertUserInvoice;
    sqlParamsEntity.push(_getNewSqlParamEntity(sql2, [invoice_type,total,prev_balance,storage_number,tracking_nm,memo,created_at]));

    execTrans(sqlParamsEntity, function(err, info){
      if(err){
        console.error("事务执行失败");
        res.send('error');
      }else{
        console.log("done.");
        res.send('done');
      }
    })
  },

  userDeposit(req, res, next){
    console.log('api - user deposit');
    var tracking_nm = req.body.trackingNm, total = req.body.chargeAmount;
    var memo = req.body.comment, storage_number = req.body.storage_number;
    var invoice_type = req.body.type, created_at = req.body.created_at;
    var prev_balance = req.body.prev_balance;
    var sqlParamsEntity = [];
    console.log('storage number' + storage_number);
    var sql1 = sqlMap.updateUserBalance;
    console.log(total + '- ' + storage_number);
    sqlParamsEntity.push(_getNewSqlParamEntity(sql1, [total,storage_number]));

    var sql2 = sqlMap.insertUserInvoice;
    sqlParamsEntity.push(_getNewSqlParamEntity(sql2, [invoice_type,total,prev_balance,storage_number,tracking_nm,memo,created_at]));

    execTrans(sqlParamsEntity, function(err, info){
      if(err){
        console.error("事务执行失败");
        res.send('error');
      }else{
        console.log("done.");
        res.send('done');
      }
    })
  },
  

  async sendPhoneCode(req, res, next){
    var phone = req.query.phoneNm;
    var code  = twilio_util.randomCode(4);
    console.log('api - send verification code '+ code + ' to ' + phone);
    status = await twilio_util.sendCode(phone, code);
    if(status == 'success'){
      users[phone] = code;
      res.send({code: 1, msg: '验证码发送成功'});
    }else{
      res.send({code: 0, msg: '验证码发送失败，请重试或联系管理员'});
    }    
  },

  verifyPhoneCode(req, res, next){
    console.log('api - verifyPhoneCode');
    var phone = req.body.phoneNm;
    var code = req.body.code;
    if (users[phone] != code) {
      console.log('手机号或验证码不正确');
      res.send({code: 0, msg: '手机号或验证码不正确'});
      return;
    }
    console.log('验证码正确');
    res.send({code: 1, msg: '验证码正确'});
    //删除保存的code
    delete users[phone];
  },

  sendMailCode(req, res, next){
    var email = req.query.email;
    var phone = req.query.phoneNm;
    var code  = twilio_util.randomCode(4);
    console.log('api - send verification code '+ code + ' to ' + email);
    mail_util.mail(email,'验证码',code + '',function (err,data) {
      if (err) {
        res.send({code: 0, msg: '验证码发送失败，请重试或联系管理员'});
      } else {
        users[phone] = code;
        res.send({code: 1, msg: '验证码发送成功'});
      }
    });
  },

  registerUser(req, res, next) {
    console.log('api - registerUser');
    var storage_number = req.body.storage_number;
    var email = req.body.email,password = req.body.password;
    var token = req.body.token, role = req.body.role;
    var name = req.body.name, user_phone = req.body.phoneNm;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.registerUser;
      connection.query(sql, [storage_number,email,password,token,role,name,user_phone], (err, result) => {
        res.json(result);
          connection.release();
      })
    })
  },

  updatePassword(req, res, next) {
    console.log('api - updatePassword');
    var storage_number = req.body.storage_number;
    var password = req.body.password;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.updatePassword;
      connection.query(sql, [password,storage_number], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
          connection.release();
      })
    })
  },
  

  

  
  deletePackagebybyId(req, res, next) {
    console.log('api - deletePackagebybyId');
    var id = req.query.packageId;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.deletePackagebybyId;
      connection.query(sql, [id], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },
  
  
  
  

  deleteAdminItemAndChangeCount(req, res, next){
    console.log('api - when delete package, if the item have more than one');
    var update_count = req.body.update_count, original_item_id = req.body.original_item_id;
    var current_item_id = req.body.current_item_id;
    var sqlParamsEntity = [];
    var sql1 = 'UPDATE littleAnt_admin_report_items SET item_count = item_count + ? WHERE id = ?';
    console.log('change count' + update_count + '- ' + original_item_id);
    sqlParamsEntity.push(_getNewSqlParamEntity(sql1, [update_count,original_item_id]));

    var sql2 = 'DELETE FROM littleAnt_admin_report_items WHERE id = ?';
    console.log('delete admin report item ' + current_item_id );
    sqlParamsEntity.push(_getNewSqlParamEntity(sql2, [current_item_id]));

    execTrans(sqlParamsEntity, function(err, info){
      if(err){
        console.error("事务执行失败");
        res.send('error');
      }else{
        console.log("done.");
        res.send('done');
      }
    })
  },

  getDefinedTrackingByTlaPackageId(req, res, next) {
    console.log('api - getDefinedTrackingByTlaPackageId');
    var tlaPackage_Id = req.query.tlaPackage_Id;
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = userSqlMap.getDefinedTrackingByTlaPackageId;
      connection.query(sql,  [tlaPackage_Id], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },
  
  getAllRateTalbes(req, res, next) {
    console.log('api - getAllRateTalbes');
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = userSqlMap.getAllRateTalbes;
      connection.query(sql, (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },
  
  deleteRateTablebyId(req, res, next) {
    console.log('api - deleteRateTablebyId');
    var id = req.query.tableId;
    pool.getConnection((err, connection) => {
      var sql = userSqlMap.deleteRateTablebyId;
      connection.query(sql, [id], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  updateUserRateTable(req, res, next) {
    console.log('api - updateUserRateTable');
    var rate = req.body.rateId;
    var storage_number = req.body.storage_number;
    pool.getConnection((err, connection) => {
      var sql = userSqlMap.updateUserRateTable;
      connection.query(sql, [rate,storage_number], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  getUserRateByStorageNm(req, res, next) {
    console.log('api - getUserRateByStorageNm');
    var storage_number= req.query.storage_number;
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = userSqlMap.getUserRateByStorageNm;
      connection.query(sql, [storage_number], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  insertRateTable(req, res, next) {
    console.log('api - insertRateTable');
    var alias = req.body.alias, classA_rate = req.body.classA_rate;
    var classB_rate = req.body.classB_rate, classC_rate = req.body.classC_rate;
    var classD_rate = req.body.classD_rate;
    var inbound_rate = req.body.inbound_rate;
    pool.getConnection((err, connection) => {
      var sql = userSqlMap.insertRateTable;
      connection.query(sql, [alias,classA_rate,classB_rate,classC_rate,classD_rate,inbound_rate], (err, result) => {
        if(err)
          console.log(err);  
        res.json(result);
          connection.release();
      })
    })
  },

  editRateTable(req, res, next) {
    console.log('api - editRateTable');
    var alias = req.body.alias, classA_rate = req.body.classA_rate;
    var classB_rate = req.body.classB_rate, classC_rate = req.body.classC_rate;
    var classD_rate = req.body.classD_rate, id = req.body.rateId;
    var inbound_rate = req.body.inbound_rate;
    pool.getConnection((err, connection) => {
      var sql = userSqlMap.editRateTable;
      connection.query(sql, [alias,classA_rate,classB_rate,classC_rate,classD_rate,inbound_rate,id], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },
  
  updatePackageDescription(req, res, next) {
    console.log('api - updatePackageDescription');
    var package_description = req.body.package_description;
    var package_comment = req.body.package_comment;
    var id = req.body.id;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.updatePackageDescription;
      connection.query(sql, [package_description,package_comment,id], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },
  
  updatePackageRecipient(req, res, next) {
    console.log('api - updatePackageRecipient');
    var name = req.body.recipientName,country_code = req.body.countryCode;
    var phone = req.body.recipientPhone, identity_card = req.body.recipientIdentityCard;
    var address = req.body.recipientAddress;
    var state = req.body.recipientState, city = req.body.recipientCity;
    var zip = req.body.recipientZip;
    var id = req.body.id;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.updatePackageRecipient;
      connection.query(sql, [name,country_code,phone,identity_card,address,city,state,zip,id], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  updateUserReportItems(req, res, next) {
    console.log('api - updateUserReportItems');
    var id = req.body.id,type = req.body.itemType;
    var item_name = req.body.itemName,price = req.body.itemPrice;
    var unit = req.body.itemCount, brand = req.body.itemBrand;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.updateUserReportItems;
      connection.query(sql, [type,item_name,price,unit,brand,id], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  handleNihaoPayNotify(req, res, next){
    console.log('get nihaopay notify');
    var id = req.body.id,amount = req.body.amount;
    //console.log(JSON.stringify(req.body));
    var currency = req.body.currency,rmb_amount = req.body.rmb_amount;
    var reference = req.body.reference,sys_reserve = req.body.sys_reserve;
    var depositStatus = req.body.status,time = req.body.time;
    var storage_number = req.body.note;
    var verifySign = req.body.verify_sign;
    let inDBdate = new Date(time);
    if(depositStatus == 'success'){
      console.log('storage number' + storage_number + ' deposit ' + amount);
      var sqlParamsEntity = [];      
      var sql1 = sqlMap.updateUserBalance;
      sqlParamsEntity.push(_getNewSqlParamEntity(sql1, [amount/100,storage_number]));

      var sql2 = sqlMap.insertUserInvoice;
      sqlParamsEntity.push(_getNewSqlParamEntity(sql2, ['充值',amount/100,storage_number,'','通过nihaopay充值',inDBdate]));


      execTrans(sqlParamsEntity, function(err, info){
        if(err){
          console.error("事务执行失败");
        }else{
          console.log("done.");
        }
      })
      //var result = md5.update('a').digest('hex');
      res.send('ok');
    }    
  },


  //processing batch management
  createMailBag(req, res, next) {
    console.log('api - createMailBag');
    var name = req.body.name, status = req.body.status;
    var created_at = req.body.created_at,vendor = req.body.vendor;
    pool.getConnection((err, connection) => {
      var sql = userSqlMap.createMailBag;
      connection.query(sql, [name,status,vendor,created_at], (err, result) => {
        if(err)
          console.log(err);  
        res.json(result);
          connection.release();
      })
    })
  },

  getAllMailBag(req, res, next) {
    console.log('api - getAllMailBag');
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = userSqlMap.getAllMailBag;
      connection.query(sql, (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  getChildPackagesInMailBag(req, res, next) {
    console.log('api - getChildPackagesInMailBag');
    var mailBag_id= req.query.mailBag_id;
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = userSqlMap.getChildPackagesInMailBag;
      connection.query(sql, [mailBag_id], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },



  setAdminComment(req, res, next) {
    console.log('api - setAdminComment');
    var admin_comment = req.body.admin_comment;
    var packageId = req.body.packageId;
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = userSqlMap.setAdminComment;
      connection.query(sql, [admin_comment,packageId], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  setVendorTrackingToChildPackage(req, res, next) {
    console.log('api - setVendorTrackingToChildPackage');
    var vendor_tracking_number = req.body.vendor_tracking_number;
    var id = req.body.packageId;
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = userSqlMap.setVendorTrackingToChildPackage;
      connection.query(sql, [vendor_tracking_number,id], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },
  
  setPackageToMailBag(req, res, next) {
    console.log('api - setPackageToMailBag');
    var col = req.body.col;
    var colValue = req.body.colValue,bag_id = req.body.bag_id;
    pool.getConnection((err, connection) => {
      var sql = userSqlMap.setPackageToMailBag;
      connection.query(sql, [bag_id,col,colValue], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },
  
  setNoTrackingChildPackageToMailBag(req, res, next) {
    console.log('api - setNoTrackingChildPackageToMailBag');
    var bag_id = req.body.bag_id;
    pool.getConnection((err, connection) => {
      var sql = userSqlMap.setNoTrackingChildPackageToMailBag;
      connection.query(sql, [bag_id], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  getTlaPackageWithChildNoMailbag(req, res, next) {
    console.log('api - getTlaPackageWithChildNoMailbag');
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = userSqlMap.getTlaPackageWithChildNoMailbag;
      connection.query(sql,(err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  getMailBagStatusByLtaTracking(req, res, next) {
    console.log('api - getMailBagStatusByLtaTracking');
    var ltaTracking = req.query.lta_tracking;
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = userSqlMap.getMailBagStatusByLtaTracking;
      connection.query(sql, [ltaTracking],(err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },
  
  updateMailBagStatus(req, res, next) {
    console.log('api - updateMailBagStatus');
    var stautsCol = req.body.stautsCol,changeTime = req.body.changeTime;
    var mailBag_id = req.body.mailBag_id,status = req.body.status;
    pool.getConnection((err, connection) => {
      var sql = userSqlMap.updateMailBagStatus;
      connection.query(sql, [status,stautsCol,changeTime,mailBag_id], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  getAllExcelInfo(req, res, next) {
    console.log('api - getAllExcelInfo');
    var bag_id = req.query.bag_id;
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = userSqlMap.getAllExcelInfo;
      connection.query(sql, [bag_id],(err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },


  
  
  searchAllChildOrderWithNoMailBag(req, res, next) {
    console.log('api - searchAllChildOrderWithNoMailBag');
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = userSqlMap.searchAllChildOrderWithNoMailBag;
      connection.query(sql,(err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },


  countChildPackageNmInBag(req, res, next) {
    console.log('api - countChildPackageNmInBag');
    var bag_id = req.query.bag_id;
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = userSqlMap.countChildPackageNmInBag;
      connection.query(sql, [bag_id],(err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  getMailBagName(req, res, next) {
    console.log('api - getMailBagName');
    var bag_id = req.query.bag_id;
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = userSqlMap.getMailBagName;
      connection.query(sql, [bag_id],(err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  
  

  insertThirdPartyBatchPackage(req, res, next) {
    console.log('api - insertThirdPartyBatchPackage');
    var user_id = req.body.user_id, user_defined_tracking = req.body.user_defined_tracking;
    var package_type = req.body.package_type, status = req.body.status;
    var in_store_date = req.body.instore_date;
    pool.getConnection((err, connection) => {
      var sql = userSqlMap.insertThirdPartyBatchPackage;
      connection.query(sql, [user_id,user_defined_tracking,status,in_store_date,package_type], (err, result) => {
        if(err)
          console.log(err);  
        res.json(result);
          connection.release();
      })
    })
  },

  existChildPackageByChildTrackingNumber(req, res, next) {
    console.log('api - existChildPackageByChildTrackingNumber');
    var child_tracking_number = req.query.child_tracking_number;
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = userSqlMap.existChildPackageByChildTrackingNumber;
      connection.query(sql, [child_tracking_number],(err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  setMailbagIdToNull(req, res, next) {
    console.log('api - setMailbagIdToNull');
    var bag_id = req.body.bag_id;
    pool.getConnection((err, connection) => {
      var sql = userSqlMap.setMailbagIdToNull;
      connection.query(sql, [bag_id], (err, result) => {
        if(err)
          console.log(err);  
        res.json(result);
          connection.release();
      })
    })
  },

  deleteMailBag(req, res, next) {
    console.log('api - deleteMailBag');
    var id = req.query.bag_id;
    pool.getConnection((err, connection) => {
      var sql = userSqlMap.deleteMailBag;
      connection.query(sql, [id], (err, result) => {
          res.json(result);
          connection.release();
      })
    })
  },

  getVendorTracking(req, res, next) {
    console.log('api - getVendorTracking');
    var package_id = req.query.package_id;
    pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = userSqlMap.getVendorTracking;
      connection.query(sql, [package_id],(err, result) => {
        if(err)
          console.log(err);
        res.json(result);
        connection.release();
      })
    })
  },

  
}
