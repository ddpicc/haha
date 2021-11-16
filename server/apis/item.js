const sqlMap = require('../sqlMaps/itemSqlMap');
var db = require('../db/query'); //引入db
var async = require("async");

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
  db.pool.getConnection(function (err, connection) {
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
  insertItemTemplate(req, res, next) {
    console.log('api - insertItemTemplate');
    var barcode = req.body.barcode,type = req.body.itemType;
    var item_name = req.body.itemName,price = req.body.itemPrice;
    var brand = req.body.itemBrand;

		var sql = sqlMap.insertItemTemplate;
		db.query(sql, [barcode,type,item_name,price,brand], (err, result) => {
			if(err)
				console.log(err);
			res.json(result);
    })
  },

	insertPackageItem(req, res, next) {
    console.log('api - insertPackageItem');
    var third_party_packageId = req.body.packageId;
    var item_count = req.body.itemCount;
		var itemTemplate_Id = req.body.itemTemplate_Id;
		var sql = sqlMap.insertPackageItem;
		db.query(sql, [third_party_packageId,itemTemplate_Id,item_count], (err, result) => {
			if(err)
				console.log(err);  
			res.json(result);
    })
  },

  deletePackageItem(req, res, next) {
    console.log('api - deletePackageItem');
    var id = req.query.itemId;
    var sql = sqlMap.deletePackageItem;
    db.query(sql, [id], (err, result) => {
      if(err)
				console.log(err);  
			res.json(result);
    })
  },

	getItemsByThirdPartyPackageId(req, res, next) {
    console.log('api - getItemsByThirdPartyPackageId');
    var packageId = req.query.packageId;
    var sql = sqlMap.getItemsByThirdPartyPackageId;
    db.query(sql, [packageId], (err, result) => {
      if(err)
        console.log(err);
      res.json(result);
    })
  },

  existItemByUPC(req, res, next) {
    console.log('api - existItemByUPC');
    var upcBarcode = req.query.upcBarcode;

		var sql = sqlMap.existItemByUPC;
		db.query(sql, [upcBarcode],(err, result) => {
			if(err)
				console.log(err);
			res.json(result);
    })
  },

  updateItemSetPackageId(req, res, next) {
    console.log('api - updateItemSetPackageId');
    var package_Id = req.body.packageId;
    var id = req.body.id;
    var sql = sqlMap.updateItemSetPackageId;
    db.query(sql, [package_Id,id], (err, result) => {
      if(err)
        console.log(err);
      res.json(result);
    })
  },

  createNewItemUpdateOldItem(req, res, next){
    console.log('api - create new Item and update old item for package that need split');
    var update_count = req.body.update_count, item_id = req.body.item_id;
    var third_party_packageId = req.body.third_party_packageId, package_Id = req.body.package_Id;
    var itemTemplate_Id = req.body.itemTemplate_Id, item_count = req.body.item_count;
    var pic1_url = req.body.pic1_url, pic1_name = req.body.pic1_name;
    var pic2_url = req.body.pic2_url, pic2_name = req.body.pic3_name;
    var pic3_url = req.body.pic3_url, pic3_name = req.body.pic3_name;
    var sqlParamsEntity = [];
    var sql1 = sqlMap.updateItemCount;
    console.log('change count' + item_count + '- ' + item_id);
    sqlParamsEntity.push(_getNewSqlParamEntity(sql1, [update_count,item_id]));

    var sql2 = sqlMap.copyOneItem;
    sqlParamsEntity.push(_getNewSqlParamEntity(sql2, [third_party_packageId,package_Id,itemTemplate_Id,item_count,pic1_url,pic1_name,pic2_url,pic2_name,pic3_url,pic3_name,item_id]));

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

  getItemsByPackageId(req, res, next) {
    console.log('api - getItemsByPackageId');
    var packageId = req.query.packageId;
    var sql = sqlMap.getItemsByPackageId;
    db.query(sql, [packageId], (err, result) => {
      if(err)
        console.log(err);
      res.json(result);
    })
  },

  //Set child order id到用户申报的物品
  updateReportItemWithChildOrder(req, res, next) {
    console.log('api - updateReportItemWithChildOrder');
    var childPackage_Id = req.body.childPackage_Id, id = req.body.id;
    var item_count = req.body.item_count;
    var sql = sqlMap.updateReportItemWithChildOrder;
    db.query(sql, [childPackage_Id,item_count,id], (err, result) => {
      if(err)
        console.log(err);  
      res.json(result);
    })
  },

  copyItemInsertChildPackageId(req, res, next) {
    console.log('api - copyItemInsertChildPackageId');
    var package_id = req.body.packageId,itemTemplate_Id = req.body.itemTemplate_Id;
    var item_count = req.body.item_count;
    var childPackage_id = req.body.childPackageId;
    var sql = sqlMap.copyItemInsertChildPackageId;
    db.query(sql, [package_id,childPackage_id,itemTemplate_Id,item_count], (err, result) => {
      if(err)
        console.log(err);  
      res.json(result);
    })
  },

  getAllItemTemplate(req, res, next) {
    console.log('api - getAllItemTemplate');
    var sql = sqlMap.getAllItemTemplate;
    db.query(sql, (err, result) => {
      if(err)
        console.log(err);
      res.json(result);
    })
  },

  deleteItemTemplate(req, res, next) {
    console.log('api - deleteItemTemplate');
    var id = req.query.itemId;
    var sql = sqlMap.deleteItemTemplate;
    db.query(sql, [id], (err, result) => {
      if(err)
				console.log(err);  
			res.json(result);
    })
  },

  updateItemTemplate(req, res, next) {
    console.log('api - updateItemTemplate');
    var type = req.body.itemType, item_name = req.body.itemName;
    var price = req.body.itemPrice, brand = req.body.itemBrand;
    var id = req.body.id;
    var sql = sqlMap.updateItemTemplate;
    db.query(sql, [type,item_name,price,brand,id], (err, result) => {
      if(err)
        console.log(err);  
      res.json(result);
    })
  },
}