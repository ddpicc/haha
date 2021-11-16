const mysql = require('mysql');
const dbConfig = require('../db/db');

const pool = mysql.createPool({
	host: dbConfig.mysql.host,
	user: dbConfig.mysql.user,
	password: dbConfig.mysql.password,
	database: dbConfig.mysql.database,
	port: dbConfig.mysql.port,
	dateStrings: true,   //强制日期类型(TIMESTAMP, DATETIME, DATE)以字符串返回，而不是一javascript Date对象返回
	multipleStatements: true    // 多语句查询
});

function query(sql, values, callback) {
	pool.getConnection(function (err, connection) {
		if(err) throw err;
		//Use the connection
		connection.query(sql, values,function (err, results) {
			//每次查询都会 回调
			callback(err, results);
			if(err) throw err;
		});
		//只是释放链接，在缓冲池了，没有被销毁
		connection.release();
	});
};

module.exports = {pool, query};

