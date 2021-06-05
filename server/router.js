const express = require('express');
const router = express.Router();
const api = require('./apis/defaultApi');

router.get('/getTokenFromLogin', (req, res, next) => {
  api.getTokenFromLogin(req, res, next);
});

router.get('/getUserInfo', (req, res, next) => {
  api.getUserInfo(req, res, next);
});

router.get('/getUserInfoById', (req, res, next) => {
  api.getUserInfoById(req, res, next);
});

router.post('/updateUserRole', (req, res, next) => {
  api.updateUserRole(req, res, next);
});

router.get('/getBatchUser', (req, res, next) => {
  api.getBatchUser(req, res, next);
});

router.get('/getAllUser', (req, res, next) => {
  api.getAllUser(req, res, next);
});

router.post('/insertPackageItems', (req, res, next) => {
  api.insertPackageItems(req, res, next);
});

router.post('/insertUserPackage', (req, res, next) => {
  api.insertUserPackage(req, res, next);
});

router.post('/insertThirdPartyPackage', (req, res, next) => {
  api.insertThirdPartyPackage(req, res, next);
});

router.post('/insertAdminReportItems', (req, res, next) => {
  api.insertAdminReportItems(req, res, next);
});

router.post('/updateThirdPartyPackage', (req, res, next) => {
  api.updateThirdPartyPackage(req, res, next);
});

router.post('/updateReportItems', (req, res, next) => {
  api.updateReportItems(req, res, next);
});

router.delete('/deleteThirdPartyPackagebyId', (req, res, next) => {
  api.deleteThirdPartyPackagebyId(req, res, next);
});

router.get('/getAllWaitPackage', (req, res, next) => {
  api.getAllWaitPackage(req, res, next);
});

router.get('/getAllFinishPackage', (req, res, next) => {
  api.getAllFinishPackage(req, res, next);
});

router.get('/getPackageInfoById', (req, res, next) => {
  api.getPackageInfoById(req, res, next);
});

router.get('/getAllThirdPartyPackage', (req, res, next) => {
  api.getAllThirdPartyPackage(req, res, next);
});

router.get('/getThirdPartyPackageByUser', (req, res, next) => {
  api.getThirdPartyPackageByUser(req, res, next);
});

router.post('/updateAdminReportItems', (req, res, next) => {
  api.updateAdminReportItems(req, res, next);
});

router.post('/updateThirdPartyPackageStatus', (req, res, next) => {
  api.updateThirdPartyPackageStatus(req, res, next);
});

router.get('/getUserPackageByUser', (req, res, next) => {
  api.getUserPackageByUser(req, res, next);
});

router.get('/existUserPackageByLittleAntTracking', (req, res, next) => {
  api.existUserPackageByLittleAntTracking(req, res, next);
});

router.get('/existStorageNumber', (req, res, next) => {
  api.existStorageNumber(req, res, next);
});

router.get('/existRecipient', (req, res, next) => {
  api.existRecipient(req, res, next);
});

router.get('/existUserEmailOrPhone', (req, res, next) => {
  api.existUserEmailOrPhone(req, res, next);
});

router.get('/existUserPhone', (req, res, next) => {
  api.existUserPhone(req, res, next);
});

router.get('/getItemsByPackageId', (req, res, next) => {
  api.getItemsByPackageId(req, res, next);
});

router.get('/getUserReportItemsByPackageId', (req, res, next) => {
  api.getUserReportItemsByPackageId(req, res, next);
});

router.get('/getItemsInPackage', (req, res, next) => {
  api.getItemsInPackage(req, res, next);
});

router.get('/getPackageById', (req, res, next) => {
  api.getPackageById(req, res, next);
});

router.get('/getAllRecipients', (req, res, next) => {
  api.getAllRecipients(req, res, next);
});

router.get('/getRecipientsByUser', (req, res, next) => {
  api.getRecipientsByUser(req, res, next);
});

router.post('/updateRecipientbyId', (req, res, next) => {
  api.updateRecipientbyId(req, res, next);
});

router.post('/insertRecipient', (req, res, next) => {
  api.insertRecipient(req, res, next);
});

router.delete('/deleteRecipientbybyId', (req, res, next) => {
  api.deleteRecipientbybyId(req, res, next);
});

router.get('/getRecipientbybyId', (req, res, next) => {
  api.getRecipientbybyId(req, res, next);
});

router.get('/getVendorTrackingByLittleAntNo', (req, res, next) => {
  api.getVendorTrackingByLittleAntNo(req, res, next);
});

router.post('/setPackageWeightandStatus', (req, res, next) => {
  api.setPackageWeightandStatus(req, res, next);
});

//nihaopay notify 不知道是不是这样调用
router.post('/nihaopay_notify', (req, res, next) => {
	console.log('nihaopay notify');
	console.log(req.data.status);
});

router.post('/manualCharge', (req, res, next) => {
  api.manualCharge(req, res, next);
});

router.post('/userDeposit', (req, res, next) => {
  api.userDeposit(req, res, next);
});


//twilio 发送短信验证码
router.get('/sendPhoneCode', (req, res, next) => {
  api.sendPhoneCode(req, res, next);
});

//注册验证短信验证码
router.post('/verifyPhoneCode', (req, res, next) => {
  api.verifyPhoneCode(req, res, next);
});

//注册新用户
router.post('/registerUser', (req, res, next) => {
  api.registerUser(req, res, next);
});

//忘记密码处更新密码
router.post('/updatePassword', (req, res, next) => {
  api.updatePassword(req, res, next);
});

router.get('/getInvoiceByUser', (req, res, next) => {
  api.getInvoiceByUser(req, res, next);
});

router.get('/getAllInvoices', (req, res, next) => {
  api.getAllInvoices(req, res, next);
});

router.get('/getDefinedTrackingById', (req, res, next) => {
  api.getDefinedTrackingById(req, res, next);
});

router.delete('/deletePackagebybyId', (req, res, next) => {
  api.deletePackagebybyId(req, res, next);
});

router.post('/updateAdminItemCount', (req, res, next) => {
  api.updateAdminItemCount(req, res, next);
});

router.delete('/deleteUserReportItem', (req, res, next) => {
  api.deleteUserReportItem(req, res, next);
});

router.post('/deleteAdminItemAndChangeCount', (req, res, next) => {
  api.deleteAdminItemAndChangeCount(req, res, next);
});

router.get('/getDefinedTrackingByTlaPackageId', (req, res, next) => {
  api.getDefinedTrackingByTlaPackageId(req, res, next);
});

//rate table
router.get('/getAllRateTalbes', (req, res, next) => {
  api.getAllRateTalbes(req, res, next);
});

router.delete('/deleteRateTablebyId', (req, res, next) => {
  api.deleteRateTablebyId(req, res, next);
});

router.post('/updateUserRateTable', (req, res, next) => {
  api.updateUserRateTable(req, res, next);
});

router.get('/getUserRateByStorageNm', (req, res, next) => {
  api.getUserRateByStorageNm(req, res, next);
});

router.post('/insertRateTable', (req, res, next) => {
  api.insertRateTable(req, res, next);
});

router.post('/editRateTable', (req, res, next) => {
  api.editRateTable(req, res, next);
});

router.post('/updatePackageDescription', (req, res, next) => {
  api.updatePackageDescription(req, res, next);
});

router.post('/updatePackageRecipient', (req, res, next) => {
  api.updatePackageRecipient(req, res, next);
});

router.post('/updateUserReportItems', (req, res, next) => {
  api.updateUserReportItems(req, res, next);
});

router.post('/depositNotify', (req, res, next) => {
  api.handleNihaoPayNotify(req, res, next);  
});

  //processing batch management
router.post('/createMailBag', (req, res, next) => {
  api.createMailBag(req, res, next);  
});  

router.get('/getAllMailBag', (req, res, next) => {
  api.getAllMailBag(req, res, next);
});

router.get('/getChildPackagesInMailBag', (req, res, next) => {
  api.getChildPackagesInMailBag(req, res, next);
});

router.get('/getUserReportItemsByChildId', (req, res, next) => {
  api.getUserReportItemsByChildId(req, res, next);
});

router.post('/setAdminComment', (req, res, next) => {
  api.setAdminComment(req, res, next);  
});

router.post('/setVendorTrackingToChildPackage', (req, res, next) => {
  api.setVendorTrackingToChildPackage(req, res, next);  
});

router.get('/getPackageNotInBatch', (req, res, next) => {
  api.getPackageNotInBatch(req, res, next);
});

router.post('/setPackageToMailBag', (req, res, next) => {
  api.setPackageToMailBag(req, res, next);  
}); 

router.post('/setNoTrackingChildPackageToMailBag', (req, res, next) => {
  api.setNoTrackingChildPackageToMailBag(req, res, next);  
}); 

router.get('/getTlaPackageWithChildNoMailbag', (req, res, next) => {
  api.getTlaPackageWithChildNoMailbag(req, res, next);
});

router.get('/getMailBagStatusByLtaTracking', (req, res, next) => {
  api.getMailBagStatusByLtaTracking(req, res, next);
});

router.post('/updateMailBagStatus', (req, res, next) => {
  api.updateMailBagStatus(req, res, next);  
}); 

router.get('/getAllExcelInfo', (req, res, next) => {
  api.getAllExcelInfo(req, res, next);  
});


//生成child order
router.post('/insertChildOrder', (req, res, next) => {
  api.insertChildOrder(req, res, next);
});

//Set child order id到用户申报的物品
router.post('/updateReportItemChildOrder', (req, res, next) => {
  api.updateReportItemChildOrder(req, res, next);
});

router.get('/searchInfoByChildPackageId', (req, res, next) => {
  api.searchInfoByChildPackageId(req, res, next);  
});

router.get('/searchInfoByPackageId', (req, res, next) => {
  api.searchInfoByPackageId(req, res, next);  
});

router.get('/searchAllChildOrderWithNoMailBag', (req, res, next) => {
  api.searchAllChildOrderWithNoMailBag(req, res, next);  
});

router.get('/searchInfo', (req, res, next) => {
  api.searchInfo(req, res, next);  
});

router.get('/countChildPackageNmInBag', (req, res, next) => {
  api.countChildPackageNmInBag(req, res, next);  
});


module.exports = router;