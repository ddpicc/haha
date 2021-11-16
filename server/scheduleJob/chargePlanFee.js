const mysql = require('mysql');
const dbConfig = require('../db/db');
var async = require("async");

const pool = mysql.createPool({
	host: dbConfig.mysql.host,
	user: dbConfig.mysql.user,
	password: dbConfig.mysql.password,
	database: dbConfig.mysql.database,
	port: dbConfig.mysql.port,
	dateStrings: true,   //强制日期类型(TIMESTAMP, DATETIME, DATE)以字符串返回，而不是一javascript Date对象返回
	multipleStatements: true    // 多语句查询
});

	function getNowFormatDate() {
		var date = new Date();
		let sep = "-";
		var year = date.getFullYear();  //年
		var month = date.getMonth()+1;   //月
		var strDate = date.getDate();   //日
		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		var currentdate = year + sep + month + sep + strDate;
		return currentdate;
	}
  
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
	processUserMonthlyFee(){
		pool.getConnection((err, connection) => {
      if(err)
        console.log(err);
      var sql = "SELECT storage_number FROM littleAnt_user WHERE role = 'premium'";
			var updateUserBalance = 'UPDATE littleAnt_user SET balance = balance + ? WHERE storage_number = ?';
			var insertUserInvoice = 'INSERT INTO littleAnt_user_invoice(invoice_type,total,user_sotrageNm,tracking_number,memo,created_at) VALUES(?,?,?,?,?,?)';
      connection.query(sql, [], (err, result) => {
        if(err)
          console.log(err);
        var dataString = JSON.stringify(result);
				var data = JSON.parse(dataString);
				//console.log(data);
				//声明要用到的变量
				var total = -8;
				var invoice_type = '自动续费', tracking_nm = '';
				var memo = '每个月第一天', created_at = getNowFormatDate();
				for(let eachUser of data){
					//console.log(eachUser.storage_number);
					var sqlParamsEntity = [];
					console.log('process user storage number ' + eachUser.storage_number);
					console.log('charge monthly fee $8 and generate invoice');
					sqlParamsEntity.push(_getNewSqlParamEntity(updateUserBalance, [total,eachUser.storage_number]));

					sqlParamsEntity.push(_getNewSqlParamEntity(insertUserInvoice, [invoice_type,total,eachUser.storage_number,tracking_nm,memo,created_at]));

					execTrans(sqlParamsEntity, function(err, info){
						if(err){
							console.error("事务执行失败");
						}else{
							console.log("done.");
						}
					})
				}
        connection.release();
      })
    })
	}
}