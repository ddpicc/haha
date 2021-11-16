var sqlMap = {
    

    
    
  
    
    
    
    
    
    
    
   

    getPackageInfoById: 'SELECT a.*, b.storage_number, b.role,b.balance FROM littleAnt_user_package a INNER JOIN littleAnt_user b ON a.user_id = b.id WHERE a.id = ? order by id desc',
    
    
    
    updateThirdPartyPackageStatus: 'UPDATE littleAnt_third_party_package SET status = ?, package_Id = ? WHERE id=?',

    existUserPackageByLittleAntTracking: 'select id,finishprocess_time,to_country_code from littleAnt_user_package where litlleant_tracking_number = ? limit 1',
    existStorageNumber: 'select 1 from littleAnt_user where storage_number = ? limit 1',
    
    existUserEmailOrPhone: 'select 1 from littleAnt_user where email = ? or user_phone = ? limit 1',
    existUserPhone: 'select storage_number from littleAnt_user where user_phone = ? limit 1',

    getPackageById: 'SELECT * FROM littleAnt_user_package WHERE id = ?',
    getAllRecipients: 'SELECT a.*, b.storage_number FROM littleAnt_recipients a INNER JOIN littleAnt_user b ON a.user_id = b.id',
    getRecipientsByUser: 'SELECT * FROM littleAnt_recipients WHERE user_id = ?',
    updateRecipientbyId: 'UPDATE littleAnt_recipients SET name = ?,country_code = ?,phone = ?,identity_card = ?,address = ?,city = ?,state = ?,zip = ? WHERE id = ?',
    
    deleteRecipientbybyId: 'DELETE FROM littleAnt_recipients where id=?',
    getRecipientbybyId: 'SELECT * FROM littleAnt_recipients WHERE id = ?',
    getVendorTrackingByLittleAntNo: 'SELECT vendor_tracking_number,vendor FROM littleAnt_user_package WHERE litlleant_tracking_number = ?',
    
    updateUserBalance: 'UPDATE littleAnt_user SET balance = balance + ? WHERE storage_number = ?',
    insertUserInvoice: 'INSERT INTO littleAnt_user_invoice(invoice_type,total,prev_balance,user_sotrageNm,tracking_number,memo,created_at) VALUES(?,?,?,?,?,?,?)',

    setInvoicePrevBalance: 'UPDATE littleAnt_user_invoice a INNER JOIN littleAnt_user b ON a.user_sotrageNm = b.storage_number set a.prev_balance = b.balance WHERE a.id = ?',

    registerUser: 'INSERT INTO littleAnt_user(storage_number,email,password,token,role,name,user_phone) VALUES(?,?,?,?,?,?,?)',
    updatePassword: 'UPDATE littleAnt_user SET password = ? WHERE storage_number  = ?',

    
    deletePackagebybyId: 'DELETE FROM littleAnt_user_package where id=?',
    

    //修改包裹信息
    updatePackageDescription: 'UPDATE littleAnt_user_package SET package_description = ?, package_comment = ? WHERE id = ?',
    updatePackageRecipient: 'UPDATE littleAnt_user_package SET to_name = ?,to_country_code = ?,to_phone = ?,to_identity_card = ?,to_address = ?,to_city = ?,to_state = ?,to_zip = ? WHERE id = ?',
    updateUserReportItems: 'UPDATE littleAnt_user_report_items SET type = ?,item_name = ?,price = ?,unit = ?,brand = ? WHERE id = ?',
  }
  
  module.exports = sqlMap;