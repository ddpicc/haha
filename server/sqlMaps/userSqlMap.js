var batchUserSqlMap = {
  //User
    //
  getTokenFromLogin: 'SELECT token FROM littleAnt_user WHERE email = ? and password = ?',
  getUserInfo: 'SELECT * FROM littleAnt_user WHERE token = ?',
  getUserInfoById: 'SELECT * FROM littleAnt_user WHERE id = ?',
  updateUserRole: 'UPDATE littleAnt_user SET role = ?, plan_startdate = ? WHERE storage_number = ?',
  getAllUser: 'SELECT a.*, b.alias FROM littleAnt_user a INNER JOIN littleAnt_rate_table b ON a.rateTable_id = b.id',

  getBatchUser: 'SELECT * FROM littleAnt_user WHERE role = "batch & default" or role = "batch & premium"',
  getDefinedTrackingByTlaPackageId: 'SELECT user_defined_tracking FROM littleAnt_third_party_package WHERE package_Id = ?',

  //rate table
  getAllRateTalbes: 'SELECT * FROM littleAnt_rate_table',
  deleteRateTablebyId: 'DELETE FROM littleAnt_rate_table where id=?',
  updateUserRateTable: 'UPDATE littleAnt_user SET rateTable_id = ? WHERE storage_number = ?',
  getUserRateByStorageNm: 'SELECT a.balance,a.rateTable_id, b.* from littleAnt_user a INNER JOIN littleAnt_rate_table b ON a.rateTable_id = b.id where a.storage_number = ?',
  insertRateTable: 'INSERT INTO littleAnt_rate_table(alias,classA_rate,classB_rate,classC_rate,classD_rate,inbound_rate) VALUES(?,?,?,?,?,?)',
  editRateTable: 'UPDATE littleAnt_rate_table SET alias = ?,classA_rate = ?,classB_rate = ?,classC_rate = ?,classD_rate = ?,inbound_rate = ? WHERE id = ?',

  //change password
  




  //收件人
  insertRecipient: 'INSERT INTO littleAnt_recipients (user_id,name,country_code,phone,identity_card,address,city,state,zip) VALUES(?,?,?,?,?,?,?,?,?)',
  existRecipient: 'select 1 from littleAnt_recipients where name = ? and phone = ? and address = ? limit 1',



  //package processing
  createMailBag: 'INSERT INTO littleAnt_mailbag(name,status,vendor,created_at) VALUES(?,?,?,?)',
  getAllMailBag: 'SELECT * FROM littleAnt_mailbag order by id desc',
  
  setPackageToMailBag: 'UPDATE littleAnt_child_package set bag_id = ? WHERE ?? = ?',
  //把新生成的child order（也就是没有vendor tracking）的放到mail bag里
  setNoTrackingChildPackageToMailBag: 'UPDATE littleAnt_child_package set bag_id = ? WHERE bag_id is NULL',
  //获取小蚂蚁包裹，已经有child order，但是没有mail bag的列表
  getTlaPackageWithChildNoMailbag: 'SELECT a.*,b.litlleant_tracking_number,b.package_description,b.to_name,b.to_address FROM littleAnt_child_package a INNER JOIN littleAnt_user_package b ON a.litlleant_package_id = b.id WHERE a.bag_id is null order by id desc',
  //set vendor tracking to child order
  setVendorTrackingToChildPackage: 'UPDATE littleAnt_child_package SET vendor_tracking_number = ? where id = ?',
  
  getChildPackagesInMailBag: 'SELECT a.*,b.litlleant_tracking_number,b.package_description,b.to_name,b.to_phone,b.to_identity_card,b.to_address,b.to_city,b.to_state FROM littleAnt_child_package a INNER JOIN littleAnt_user_package b ON a.litlleant_package_id = b.id WHERE a.bag_id = ? order by id desc',
  

  setAdminComment: 'UPDATE littleAnt_user_package SET admin_comment = ? WHERE id = ?',

  getMailBagStatusByLtaTracking: 'SELECT a.vendor,a.vendor_tracking_number,b.finishprocess_time,b.admin_comment,c.created_at,c.sendOut_at,c.flyToChina_at,c.beginCustomerClear_at,c.customerFinish_at FROM littleAnt_child_package a INNER JOIN littleAnt_user_package b ON a.litlleant_package_id = b.id INNER JOIN littleAnt_mailbag c ON a.bag_id = c.id WHERE b.litlleant_tracking_number = ?', // 
  updateMailBagStatus: 'UPDATE littleAnt_mailbag SET status= ?, ?? = ? WHERE id = ?',

 



  //child package, user package, report item三个表做内连接，获得所有child order，但是还没加入mail bag的
  searchAllChildOrderWithNoMailBag: 'SELECT a.child_tracking_number,b.to_name,b.to_address,c.* FROM littleAnt_child_package a INNER JOIN littleAnt_user_package b ON a.litlleant_package_id = b.id INNER JOIN littleAnt_user_report_items c ON a.id = c.childPackage_Id WHERE a.bag_id is null order by b.finishprocess_time desc',
  //获得发货单excel数据
  getAllExcelInfo: 'SELECT a.child_tracking_number,a.vendor,a.vendor_tracking_number,a.weight,b.litlleant_tracking_number,b.to_name,b.to_phone,b.to_identity_card,b.to_address,b.to_city,b.to_state,c.type,c.item_name,c.price,c.unit,c.brand FROM littleAnt_child_package a INNER JOIN littleAnt_user_package b ON a.litlleant_package_id = b.id INNER JOIN littleAnt_user_report_items c ON a.id = c.childPackage_Id WHERE a.id in (SELECT id FROM littleAnt_child_package WHERE bag_id = ?)',

  //邮袋里有多少包裹
  countChildPackageNmInBag: 'SELECT count(1)  FROM littleAnt_child_package WHERE bag_id = ?',
  //获取邮袋名字
  getMailBagName: 'SELECT * FROM littleAnt_mailbag WHERE id = ?',


  //添加第三方大货包裹
  insertThirdPartyBatchPackage: 'INSERT INTO littleAnt_third_party_package(user_id,user_defined_tracking,status,in_store_date,package_type) VALUES(?,?,?,?,?)',

  //是否存在该child order
  existChildPackageByChildTrackingNumber: 'select id,litlleant_package_id from littleAnt_child_package where child_tracking_number = ? limit 1',
  //删除分单号的mail bag，把mailbag id为当前id的分单号的mailbagid置为null
  setMailbagIdToNull: 'UPDATE littleAnt_child_package SET bag_id = null WHERE bag_id = ?',
  //删除mailbag
  deleteMailBag: 'DELETE FROM littleAnt_mailbag where id=?',
  //获取美国境内转运子单号的vendor tracking
  getVendorTracking: 'SELECT * FROM littleAnt_child_package WHERE litlleant_package_id = ?',

  

  
}
  
module.exports = batchUserSqlMap;