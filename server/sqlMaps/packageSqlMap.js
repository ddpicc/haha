var sqlMap = {
	//生成预报信息
	createForcastInfo: 'INSERT INTO littleAnt_forcastList(forcast_tracking,comment,storage_number,service_type,arrive_at) VALUES(?,?,?,?,?)',
	//更新预报信息
	updateForcastInfo: 'UPDATE littleAnt_forcastList SET display = ? WHERE id = ?',
	//获取所有包裹预报信息
	getForcastInfo: 'SELECT a.*,b.rateTable_id FROM littleAnt_forcastList a INNER JOIN littleAnt_user b ON a.storage_number = b.storage_number',
	//根据仓位号获取包裹预报信息
	getForcastInfoByStorageNm: 'SELECT * FROM littleAnt_forcastList WHERE storage_number = ?',
	//是否已经预报该包裹
	existForcastPackage: 'SELECT a.*,b.rateTable_id from littleAnt_forcastList a INNER JOIN littleAnt_user b ON a.storage_number = b.storage_number where forcast_tracking = ? limit 1',
	//删除一条预报信息 todo
	deleteForcastInfo: 'DELETE FROM littleAnt_forcastList where id = ?',


	insertThirdPartyPackage: 'INSERT INTO littleAnt_third_party_package(storage_number,tracking,comment,in_store_date,status,service_type) VALUES(?,?,?,?,?,?)',
	//更新第三方包裹状态，在内件清点完后更新状态未已清点
	updateThirdPartyPackage: "UPDATE littleAnt_third_party_package SET status = ? WHERE id = ?",
  //获取当天的第三方包裹和系统内未清点内件的第三方包裹
  getTodayandUncheckedThirdPartyPackage: "SELECT * FROM littleAnt_third_party_package WHERE (in_store_date between ? and ? AND status = '已清点') OR status = '未清点' order by id desc",
	//获取所有第三方包裹
	getAllThirdPartyPackage: "SELECT a.*,b.name FROM littleAnt_third_party_package a INNER JOIN littleAnt_user b ON a.storage_number = b.storage_number WHERE a.status != '已全部打包' order by id desc",
	//根据用户获取第三方包裹,还在仓库中的，也就是状态为已清点或者部分发货
	getThirdPartyPackageByUser: "SELECT * FROM littleAnt_third_party_package WHERE storage_number = ? AND (status = '已清点' or status = '部分打包') order by id desc",
	//根据第三方包裹ID获取tracking
	getTrackingByThirdPartyPackageId: 'SELECT tracking FROM littleAnt_third_party_package WHERE id = ?',
	//根据ID删除一个第三方包裹
	deleteThirdPartyPackagebyId: 'DELETE FROM littleAnt_third_party_package where id=?',

	//获取用户的包裹
	getUserPackageByUser: 'SELECT * FROM littleAnt_user_package WHERE user_id = ? order by id desc',
	//管理员打包后更新包裹状态
	setPackageWeightandStatus: 'UPDATE littleAnt_user_package SET status = ?, total_weight = ?, total_price = ?, finishprocess_time = ? WHERE id = ?',
	//创建用户包裹
	insertUserPackage: 'INSERT littleAnt_user_package(user_id,litlleant_tracking_number,created_at,package_description,package_comment,total,to_name,to_country_code,to_phone,to_identity_card,to_address,to_city,to_state,to_zip,status,package_type) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
	//获取所有未处理包裹
	getAllWaitPackage: "SELECT a.*, b.storage_number, b.role, b.rateTable_id FROM littleAnt_user_package a INNER JOIN littleAnt_user b ON a.user_id = b.id WHERE a.status != '已处理' order by id desc",
	//获取所有已处理的包裹
	getAllFinishPackage: "SELECT a.*, b.storage_number, b.role FROM littleAnt_user_package a INNER JOIN littleAnt_user b ON a.user_id = b.id WHERE a.status = '已处理' order by a.finishprocess_time desc",

	//生成child order, description表明这个子单号是把一个小蚂蚁包裹分拆了还是整个
	insertChildOrder: 'INSERT INTO littleAnt_child_package(litlleant_package_id,child_tracking_number,vendor,weight,report_item_description) VALUES(?,?,?,?,?)',
	//生成美国境内转运子单号，比普通子单号多了一个vendor tracking
	insertUSChildOrder: 'INSERT INTO littleAnt_child_package(litlleant_package_id,child_tracking_number,vendor,weight,vendor_tracking_number) VALUES(?,?,?,?,?)',


	//包裹信息相关查询
	//child package, user package, item, item template四个表做内连接,通过package id查询
	//need to change
	searchInfoByPackageId: 'SELECT a.vendor,a.child_tracking_number,a.bag_id,a.vendor_tracking_number,a.weight,b.*,c.third_party_packageId,c.item_count,d.item_name,d.price,d.type,d.brand FROM littleAnt_child_package a INNER JOIN littleAnt_user_package b ON a.litlleant_package_id = b.id INNER JOIN littleAnt_minimalGroupItems_in_package c ON a.id = c.childPackage_Id INNER JOIN littleAnt_item_template d ON c.itemTemplate_Id = d.id WHERE b.id = ?',
	getChildOrderByPackageId: 'SELECT a.id,a.vendor,a.child_tracking_number,a.bag_id,a.vendor_tracking_number,a.weight,b.user_id,b.litlleant_tracking_number,b.created_at,b.package_description,b.package_comment,b.total,b.to_name,b.to_country_code,b.to_phone,b.to_identity_card,b.to_address,b.to_city,b.to_state,b.to_zip,b.status,b.finishprocess_time FROM littleAnt_child_package a INNER JOIN littleAnt_user_package b ON a.litlleant_package_id = b.id WHERE b.id = ?',
	//获取child package里的item, package已经被管理员打包处理过了
	getItemsByChildId: 'SELECT a.*,b.* FROM littleAnt_minimalGroupItems_in_package a INNER JOIN littleAnt_item_template b on a.itemTemplate_Id = b.id WHERE a.childPackage_Id = ?',
}
module.exports = sqlMap;