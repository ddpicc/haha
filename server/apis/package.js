const sqlMap = require('../sqlMaps/packageSqlMap');
var db = require('../db/query'); //引入db


module.exports = {
  createForcastInfo(req, res, next) {
    console.log('api - createForcastInfo');
    var forcast_tracking = req.body.forcast_tracking, comment = req.body.comment;
    var arrive_at = req.body.arrive_at, storage_number = req.body.storage_number;
    var service_type = req.body.service_type;
		var sql = sqlMap.createForcastInfo;
		db.query(sql, [forcast_tracking,comment,storage_number,service_type,arrive_at], (err, result) => {
			if(err)
				console.log(err);  
			res.json(result);
    })
  },

  updateForcastInfo(req, res, next) {
    console.log('api - updateForcastInfo');
    var display = req.body.display,id = req.body.id;

		var sql = sqlMap.updateForcastInfo;
		db.query(sql, [display,id], (err, result) => {
			if(err)
				console.log(err);
			res.json(result);
    })
  },

  getForcastInfo(req, res, next) {
    console.log('api - getForcastInfo');

		var sql = sqlMap.getForcastInfo;
		db.query(sql,(err, result) => {
			if(err)
				console.log(err);
			res.json(result);

    })
  },

  getForcastInfoByStorageNm(req, res, next) {
    console.log('api - getForcastInfoByStorageNm');
    var storage_number = req.query.storage_number;

		var sql = sqlMap.getForcastInfoByStorageNm;
		db.query(sql, [storage_number],(err, result) => {
			if(err)
				console.log(err);
			res.json(result);
 
    })
  },

  existForcastPackage(req, res, next) {
    console.log('api - existForcastPackage');
    var forcast_tracking = req.query.forcast_tracking;

		var sql = sqlMap.existForcastPackage;
		db.query(sql, [forcast_tracking],(err, result) => {
			if(err)
				console.log(err);
			res.json(result);

    })
  },

	deleteForcastInfo(req, res, next) {
    console.log('api - deleteForcastInfo');
    var id = req.query.id;
      var sql = sqlMap.deleteForcastInfo;
      db.query(sql, [id], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
    })
  },
	
  insertThirdPartyPackage(req, res, next) {
    console.log('api - insertThirdPartyPackage');
    var storage_number = req.body.storage_number, tracking = req.body.tracking;
    var comment = req.body.comment, status = req.body.status;
    var in_store_date = req.body.instore_date, service_type = req.body.service_type;
		var sql = sqlMap.insertThirdPartyPackage;
		db.query(sql, [storage_number,tracking,comment,in_store_date,status,service_type], (err, result) => {
			if(err)
				console.log(err);  
			res.json(result);
    })
  },

  updateThirdPartyPackage(req, res, next) {
    console.log('api - updateThirdPartyPackage');
    var status = req.body.status;
    var id = req.body.package_Id;
    var sql = sqlMap.updateThirdPartyPackage;
    db.query(sql, [status,id], (err, result) => {
      if(err)
        console.log(err);  
      res.json(result);
    })
  },

  getTodayandUncheckedThirdPartyPackage(req, res, next) {
    console.log('api - getTodayandUncheckedThirdPartyPackage');
    var startDate = req.query.startDate, endDate = req.query.endDate;
		var sql = sqlMap.getTodayandUncheckedThirdPartyPackage;
		db.query(sql, [startDate,endDate], (err, result) => {
			if(err)
				console.log(err);
			res.json(result);
    })
  },

  getAllThirdPartyPackage(req, res, next) {
    console.log('api - getAllThirdPartyPackage');
    var sql = sqlMap.getAllThirdPartyPackage;
    db.query(sql, (err, result) => {
      if(err)
        console.log(err);
      res.json(result);
    })
  },

  getThirdPartyPackageByUser(req, res, next) {
    console.log('api - getThirdPartyPackageByUser');
    console.log(req.headers['authorization']);
    var storage_number = req.query.storage_number;
    var sql = sqlMap.getThirdPartyPackageByUser;
    db.query(sql, [storage_number], (err, result) => {
      if(err)
        console.log(err);
      res.json(result);
    })
  },

  getTrackingByThirdPartyPackageId(req, res, next) {
    console.log('api - getTrackingByThirdPartyPackageId');
    var id = req.query.packageId;
      var sql = sqlMap.getTrackingByThirdPartyPackageId;
      db.query(sql,  [id], (err, result) => {
        if(err)
          console.log(err);
        res.json(result);
    })
  },

  deleteThirdPartyPackagebyId(req, res, next) {
    console.log('api - deleteThirdPartyPackagebyId');
    var id = req.query.packageId;
    var sql = sqlMap.deleteThirdPartyPackagebyId;
    db.query(sql, [id], (err, result) => {
      if(err)
        console.log(err);
      res.json(result);
    })
  },

  getUserPackageByUser(req, res, next) {
    console.log('api - getUserPackageByUser');
    var user_id = req.query.userId;
    var sql = sqlMap.getUserPackageByUser;
    db.query(sql, [user_id], (err, result) => {
      if(err)
        console.log(err);
      res.json(result);
    })
  },

  setPackageWeightandStatus(req, res, next) {
    console.log('api - setPackageWeightandStatus');
    var status = req.body.status, id = req.body.packageId;
    var total_weight = req.body.total_weight,finishprocess_time = req.body.finishprocess_time;
    var total_price = req.body.total_price;
    var sql = sqlMap.setPackageWeightandStatus;
    db.query(sql, [status,total_weight,total_price,finishprocess_time,id], (err, result) => {
      if(err)
        console.log(err);
      res.json(result);
    })
  },

  insertUserPackage(req, res, next) {
    console.log('api - insertUserPackage');
    var user_id = req.body.user_id, litlleant_tracking_number = req.body.litlleant_tracking_number;
    var created_at = req.body.created_at,package_description = req.body.package_description;
    var package_comment = req.body.package_comment,total = req.body.total;
    var name = req.body.recipientName,country_code = req.body.countryCode;
    var phone = req.body.recipientPhone, identity_card = req.body.recipientIdentityCard;
    var address = req.body.recipientAddress, package_type = req.body.package_type;
    var city = req.body.recipientCity, state = req.body.recipientState;
    var zip = req.body.recipientZip, status = req.body.packageStatus;
    var sql = sqlMap.insertUserPackage;
    db.query(sql, [user_id,litlleant_tracking_number,created_at,package_description,package_comment,total,name,country_code,phone,identity_card,address,city,state,zip,status,package_type], (err, result) => {
      if(err)
        console.log(err);  
      res.json(result);
    })
  },

    //生成境内转运单号
    insertUSChildOrder(req, res, next) {
      console.log('api - insertUSChildOrder');
      var litlleant_package_id = req.body.litlleant_package_id, vendor = req.body.vendor;
      var weight = req.body.weight;
      var litlleant_package_number = req.body.litlleant_package_number,  vendor_tracking_number = req.body.vendor_tracking_number;
      var sql = userSqlMap.insertUSChildOrder;
      db.query(sql, [litlleant_package_id,litlleant_package_number,vendor,weight,vendor_tracking_number], (err, result) => {
        if(err)
          console.log(err);  
        res.json(result);
      })
    },

  getAllWaitPackage(req, res, next) {
    console.log('api - getAllWaitPackage');
    var sql = sqlMap.getAllWaitPackage;
    db.query(sql, (err, result) => {
      if(err)
        console.log(err);
      res.json(result);
    })
  },

  getAllFinishPackage(req, res, next) {
    console.log('api - getAllFinishPackage');

    var sql = sqlMap.getAllFinishPackage;
    db.query(sql, (err, result) => {
      if(err)
        console.log(err);
      res.json(result);

    })
  },  


  //生成child order
  insertChildOrder(req, res, next) {
    console.log('api - insertChildOrder');
    var litlleant_package_id = req.body.litlleant_package_id, vendor = req.body.vendor;
    var weight = req.body.weight;
    var litlleant_package_number = req.body.litlleant_package_number, report_item_description = req.body.report_item_description;
    var sql = sqlMap.insertChildOrder;
    db.query(sql, [litlleant_package_id,litlleant_package_number,vendor,weight,report_item_description], (err, result) => {
      if(err)
        console.log(err);
      res.json(result);
    })
  },

  searchInfoByPackageId(req, res, next) {
    console.log('api - searchInfoByPackageId');
    var package_Id = req.query.package_Id;
    var sql = sqlMap.searchInfoByPackageId;
    db.query(sql, [package_Id],(err, result) => {
      if(err)
        console.log(err);
      res.json(result);
    })
  },

  getChildOrderByPackageId(req, res, next) {
    console.log('api - getChildOrderByPackageId');
    var package_Id = req.query.package_Id;
    var sql = sqlMap.getChildOrderByPackageId;
    db.query(sql, [package_Id],(err, result) => {
      if(err)
        console.log(err);
      res.json(result);
    })
  },

  getItemsByChildId(req, res, next) {
    console.log('api - getItemsByChildId');
    var childPackage_Id= req.query.childPackage_Id;
    var sql = sqlMap.getItemsByChildId;
    db.query(sql, [childPackage_Id], (err, result) => {
      if(err)
        console.log(err);
      res.json(result);
    })
  },
}