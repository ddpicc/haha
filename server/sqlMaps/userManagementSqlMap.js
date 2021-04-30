var batchUserSqlMap = {
  getBatchUser: 'SELECT * FROM littleAnt_user WHERE role = ?',
  getDefinedTrackingByTlaPackageId: 'SELECT user_defined_tracking FROM littleant_third_party_package WHERE package_Id = ?',

  //rate table
  getAllRateTalbes: 'SELECT * FROM littleAnt_rate_table',
  deleteRateTablebyId: 'DELETE FROM littleAnt_rate_table where id=?',
  updateUserRateTable: 'UPDATE littleAnt_user SET rateTable_id = ? WHERE storage_number = ?',
  getUserRateByStorageNm: 'SELECT a.rateTable_id, b.* from littleAnt_user a INNER JOIN littleAnt_rate_table b ON a.rateTable_id = b.id where a.storage_number = ?',
  insertRateTable: 'INSERT INTO littleAnt_rate_table(alias,classA_rate,classB_rate,classC_rate,classD_rate) VALUES(?,?,?,?,?)',
  editRateTable: 'UPDATE littleAnt_rate_table SET alias = ?,classA_rate = ?,classB_rate = ?,classC_rate = ?,classD_rate = ? WHERE id = ?',

  //change password
  

  //package processing
  createMailBag: 'INSERT INTO littleAnt_mailbag(name,status,vendor,created_at) VALUES(?,?,?,?)',
  getAllMailBag: 'SELECT * FROM littleAnt_mailbag order by id desc',
  setPackageToMailBag: 'UPDATE littleAnt_child_package set bag_id = ? WHERE ?? = ?',
  //把新生成的child order（也就是没有vendor tracking）的放到mail bag里
  setNoTrackingChildPackageToMailBag: 'UPDATE littleAnt_child_package set bag_id = ? WHERE vendor_tracking_number is NULL',
  //获取小蚂蚁包裹，已经有child order，但是没有mail bag的列表
  getTlaPackageWithChildNoMailbag: 'SELECT a.*,b.litlleant_tracking_number,b.package_description,b.to_name,b.to_address FROM littleAnt_child_package a INNER JOIN littleAnt_user_package b ON a.litlleant_package_id = b.id WHERE a.bag_id is null order by id desc',
  //set vendor tracking to child order
  setVendorTrackingToChildPackage: 'UPDATE littleAnt_child_package SET vendor_tracking_number = ? where id = ?',
  
  getChildPackagesInMailBag: 'SELECT a.*,b.litlleant_tracking_number,b.package_description,b.to_name,b.to_phone,b.to_identity_card,b.to_address,b.to_city,b.to_state FROM littleAnt_child_package a INNER JOIN littleAnt_user_package b ON a.litlleant_package_id = b.id WHERE a.bag_id = ? order by id desc',
  getUserReportItemsByChildId: 'SELECT * FROM littleAnt_user_report_items WHERE childPackage_Id = ?',

  setAdminComment: 'UPDATE littleAnt_user_package SET admin_comment = ? WHERE id = ?',

  getMailBagStatusByLtaTracking: 'SELECT a.vendor,a.vendor_tracking_number,b.finishprocess_time,b.admin_comment,c.created_at,c.sendOut_at,c.flyToChina_at,c.beginCustomerClear_at,c.customerFinish_at FROM littleAnt_child_package a INNER JOIN littleant_user_package b ON a.litlleant_package_id = b.id INNER JOIN littleAnt_mailbag c ON a.bag_id = c.id WHERE b.litlleant_tracking_number = ?', // 
  updateMailBagStatus: 'UPDATE littleAnt_mailbag SET status= ?, ?? = ? WHERE id = ?',

  //生成child order
  insertChildOrder: 'INSERT INTO littleAnt_child_package(litlleant_package_id,vendor,weight) VALUES(?,?,?)',
  updateReportItemChildOrder: 'UPDATE littleAnt_user_report_items SET childPackage_Id = ? WHERE id = ?',

  //child package, user package, report item三个表做内连接,通过child package id查询
  searchInfoByChildPackageId: 'SELECT a.id,a.litlleant_package_id,a.vendor,a.vendor_tracking_number,a.weight,b.litlleant_tracking_number,b.to_name,b.to_phone,b.to_identity_card,b.to_address,b.to_city,b.to_state,c.item_name,c.price,c.unit,c.brand FROM littleAnt_child_package a INNER JOIN littleant_user_package b ON a.litlleant_package_id = b.id INNER JOIN littleAnt_user_report_items c ON a.id = c.childPackage_Id WHERE a.id = ?',

  //child package, user package, report item三个表做内连接,通过package id查询
  searchInfoByPackageId: 'SELECT a.id,a.litlleant_package_id,a.vendor,a.vendor_tracking_number,a.weight,b.litlleant_tracking_number,b.to_name,b.to_phone,b.to_identity_card,b.to_address,b.to_city,b.to_state,c.item_name,c.price,c.unit,c.brand FROM littleAnt_child_package a INNER JOIN littleant_user_package b ON a.litlleant_package_id = b.id INNER JOIN littleAnt_user_report_items c ON a.id = c.childPackage_Id WHERE b.id = ?',
  //给以前没有child package的包裹暂用，查询信息
  searchInfo: 'SELECT a.*, b.item_name,b.price,b.unit,b.brand FROM littleant_user_package a INNER JOIN littleAnt_user_report_items b ON a.id = b.package_Id WHERE a.id = ?',
  //获得发货单excel数据
  getAllExcelInfo: 'SELECT a.vendor,a.vendor_tracking_number,a.weight,b.litlleant_tracking_number,b.to_name,b.to_phone,b.to_identity_card,b.to_address,b.to_city,b.to_state,c.type,c.item_name,c.price,c.unit,c.brand FROM littleAnt_child_package a INNER JOIN littleant_user_package b ON a.litlleant_package_id = b.id INNER JOIN littleAnt_user_report_items c ON a.id = c.childPackage_Id WHERE a.id in (SELECT id FROM littleAnt_child_package WHERE bag_id = ?)',
}
  
module.exports = batchUserSqlMap;