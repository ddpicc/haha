const sqlMap = require('../sqlMaps/userSqlMap');
var db = require('../db/query'); //引入db

module.exports = {
	getTokenFromLogin(req, res, next) {
		console.log('api - getTokenFromLogin');
		var email = req.query.username,password = req.query.password;
		db.query(sqlMap.getTokenFromLogin, [email,password], function (err, results) {
			if(err) console.log(err);
			res.json(results);
		});
	},

	getUserInfo(req, res, next) {
    console.log('api - getUserInfo');
    var token = req.query.token;
    db.query(sqlMap.getUserInfo, [token], (err, result) => {
			if(err)
				console.log(err);
			res.json(result);
    })
  },

  getUserInfoById(req, res, next) {
    console.log('api - getUserInfoById');
    var id = req.query.userId;
		var sql = sqlMap.getUserInfoById;
		db.query(sql, [id], (err, result) => {
			if(err)
				console.log(err);
			res.json(result);
    })
  },

  updateUserRole(req, res, next) {
    console.log('api - updateUserRole');
    var role = req.body.role, plan_startdate = req.body.startDate;
    var storage_number = req.body.storage_number;
		var sql = sqlMap.updateUserRole;
		db.query(sql, [role,plan_startdate,storage_number], (err, result) => {
			if(err)
				console.log(err);
			res.json(result);
    })
  },

	getAllUser(req, res, next) {
    console.log('api - getAllUser');
		var sql = sqlMap.getAllUser;
		db.query(sql, (err, result) => {
			if(err)
				console.log(err);
			res.json(result);
    })
  },








	insertRecipient(req, res, next) {
    console.log('api - insertRecipient');
    var name = req.body.recipientName,country_code = req.body.countryCode;
    var phone = req.body.recipientPhone, identity_card = req.body.recipientIdentityCard;
    var address = req.body.recipientAddress;
    var state = req.body.recipientState, city = req.body.recipientCity;
    var zip = req.body.recipientZip, user_id = req.body.userId;
		var sql = sqlMap.insertRecipient;
		db.query(sql, [user_id,name,country_code,phone,identity_card,address,city,state,zip], (err, result) => {
			if(err)
				console.log(err);
			res.json(result);
    })
  },

	existRecipient(req, res, next) {
    console.log('api - existRecipient');
    var name = req.query.name;
    var phone = req.query.phone;
    var address = req.query.address;
		var sql = sqlMap.existRecipient;
		db.query(sql, [name,phone,address], (err, result) => {
			if(err)
				console.log(err);
			res.json(result);
    })
  },
}