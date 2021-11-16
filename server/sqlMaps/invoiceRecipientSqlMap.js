var sqlMap = {
	//获取用户最近七天的账单
	getInvoiceByUserDateRange: 'SELECT a.*,b.balance FROM littleAnt_user_invoice a INNER JOIN littleant_user b ON a.user_sotrageNm = b.storage_number WHERE user_sotrageNm = ? AND (created_at BETWEEN ? AND ?) order by id desc',
	getAllInvoices500Limits: 'SELECT a.*,b.balance FROM littleAnt_user_invoice a INNER JOIN littleant_user b ON a.user_sotrageNm = b.storage_number order by id desc LIMIT 500',
	getAllInvoices: 'SELECT a.*,b.balance FROM littleAnt_user_invoice a INNER JOIN littleant_user b ON a.user_sotrageNm = b.storage_number order by id desc',
	getAllInvoiceByUser: 'SELECT a.*,b.balance FROM littleAnt_user_invoice a INNER JOIN littleant_user b ON a.user_sotrageNm = b.storage_number WHERE user_sotrageNm = ? order by id desc',
}
module.exports = sqlMap;