var sqlMap = {
	getAllNews: 'SELECT * FROM littleant_newslist order by id desc',
	getNewsById: 'SELECT * FROM littleant_newslist WHERE id = ?',
	deleteNewsById: 'DELETE FROM littleant_newslist where id = ?',

	createNews: 'INSERT INTO littleAnt_newsList(title,summary,content,created_at,stay_top,to_storageNm) VALUES(?,?,?,?,?,?)',
	updateNews: 'UPDATE littleAnt_newsList SET title = ?, summary = ?, content = ?,update_at = ?,stay_top = ?,to_storageNm = ? WHERE id = ?',
}
module.exports = sqlMap;