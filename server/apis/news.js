const sqlMap = require('../sqlMaps/newsSqlMap');
var db = require('../db/query'); //引入db


module.exports = {
	getAllNews(req, res, next) {
    console.log('api - getAllNews');

		var sql = sqlMap.getAllNews;
		db.query(sql,(err, result) => {
			if(err)
				console.log(err);
			res.json(result);
    })
  },

	getNewsById(req, res, next) {
    console.log('api - getNewsById');
    var id = req.query.id;

		var sql = sqlMap.getNewsById;
		db.query(sql, [id],(err, result) => {
			if(err)
				console.log(err);
			res.json(result);
 
    })
  },

	deleteNewsById(req, res, next) {
    console.log('api - deleteNewsById');
    var id = req.query.id;
      var sql = sqlMap.deleteNewsById;
      db.query(sql, [id], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
    })
  },

	createNews(req, res, next) {
    console.log('api - createNews');
    var title = req.body.title, summary = req.body.summary;
		var content = req.body.content, created_at = req.body.created_at;
    var stay_top = req.body.stay_top, to_storageNm = req.body.to_storageNm;
    var sql = sqlMap.createNews;
    db.query(sql, [title,summary,content,created_at,stay_top,to_storageNm], (err, result) => {
      if(err)
        console.log(err);
      res.json(result);
    })
  },

	updateNews(req, res, next) {
    console.log('api - updateNews');
    var title = req.body.title, summary = req.body.summary;
		var content = req.body.content, update_at = req.body.update_at;
    var stay_top = req.body.stay_top, to_storageNm = req.body.to_storageNm;
		var id = req.body.blogId;
    var sql = sqlMap.updateNews;
    db.query(sql, [title,summary,content,update_at,stay_top,to_storageNm,id], (err, result) => {
      if(err)
        console.log(err);  
      res.json(result);
    })
  },
}