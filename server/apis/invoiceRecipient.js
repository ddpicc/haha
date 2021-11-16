const sqlMap = require('../sqlMaps/invoiceRecipientSqlMap');
var db = require('../db/query'); //引入db

module.exports = {
	getInvoiceByUserDateRange(req, res, next) {
    console.log('api - getInvoiceByUserDateRange');
    var user_sotrageNm = req.query.user_sotrageNm;
		var startDate = req.query.startDate, endDate = req.query.endDate;
    var sql = sqlMap.getInvoiceByUserDateRange;
		db.query(sql, [user_sotrageNm,startDate,endDate], (err, result) => {
			if(err)
				console.log(err);
			res.json(result);
    })
  },
  
  getAllInvoices500Limits(req, res, next) {
    console.log('api - getAllInvoices500Limits');
		var sql = sqlMap.getAllInvoices500Limits;
		db.query(sql, (err, result) => {
		if(err)
			console.log(err);
		res.json(result);
    })
  },

	getAllInvoices(req, res, next) {
    console.log('api - getAllInvoices');
    var sql = sqlMap.getAllInvoices;
		db.query(sql,(err, result) => {
			if(err)
				console.log(err);
			res.json(result);
    })
  },
  
  getAllInvoiceByUser(req, res, next) {
    console.log('api - getAllInvoiceByUser');
		var user_sotrageNm = req.query.user_sotrageNm;
		var sql = sqlMap.getAllInvoiceByUser;
		db.query(sql, [user_sotrageNm],(err, result) => {
			if(err)
				console.log(err);
			res.json(result);
    })
  },
}