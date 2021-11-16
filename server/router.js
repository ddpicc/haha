const express = require('express');
const router = express.Router();
const api = require('./apis/defaultApi');
const userapi = require('./apis/user');


router.get('/getTokenFromLogin', (req, res, next) => {
  userapi.getTokenFromLogin(req, res, next);
});

router.get('/getUserInfo', (req, res, next) => {
  userapi.getUserInfo(req, res, next);
});

router.get('/getUserInfoById', (req, res, next) => {
  userapi.getUserInfoById(req, res, next);
});

router.post('/updateUserRole', (req, res, next) => {
  userapi.updateUserRole(req, res, next);
});

router.get('/getBatchUser', (req, res, next) => {
  api.getBatchUser(req, res, next);
});

router.get('/getAllUser', (req, res, next) => {
  userapi.getAllUser(req, res, next);
});














router.get('/getPackageInfoById', (req, res, next) => {
  api.getPackageInfoById(req, res, next);
});







router.post('/updateThirdPartyPackageStatus', (req, res, next) => {
  api.updateThirdPartyPackageStatus(req, res, next);
});



router.get('/existUserPackageByLittleAntTracking', (req, res, next) => {
  api.existUserPackageByLittleAntTracking(req, res, next);
});

router.get('/existStorageNumber', (req, res, next) => {
  api.existStorageNumber(req, res, next);
});



router.get('/existUserEmailOrPhone', (req, res, next) => {
  api.existUserEmailOrPhone(req, res, next);
});

router.get('/existUserPhone', (req, res, next) => {
  api.existUserPhone(req, res, next);
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



router.delete('/deleteRecipientbybyId', (req, res, next) => {
  api.deleteRecipientbybyId(req, res, next);
});

router.get('/getRecipientbybyId', (req, res, next) => {
  api.getRecipientbybyId(req, res, next);
});

router.get('/getVendorTrackingByLittleAntNo', (req, res, next) => {
  api.getVendorTrackingByLittleAntNo(req, res, next);
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

//发送邮箱验证码
router.get('/sendMailCode', (req, res, next) => {
  api.sendMailCode(req, res, next);
});

//注册新用户
router.post('/registerUser', (req, res, next) => {
  api.registerUser(req, res, next);
});

//忘记密码处更新密码
router.post('/updatePassword', (req, res, next) => {
  api.updatePassword(req, res, next);
});





router.delete('/deletePackagebybyId', (req, res, next) => {
  api.deletePackagebybyId(req, res, next);
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






//Set child order id到用户申报的物品



router.get('/searchAllChildOrderWithNoMailBag', (req, res, next) => {
  api.searchAllChildOrderWithNoMailBag(req, res, next);  
});


router.get('/countChildPackageNmInBag', (req, res, next) => {
  api.countChildPackageNmInBag(req, res, next);  
});

router.get('/getMailBagName', (req, res, next) => {
  api.getMailBagName(req, res, next);  
});



router.post('/insertThirdPartyBatchPackage', (req, res, next) => {
  api.insertThirdPartyBatchPackage(req, res, next);
});

router.get('/existChildPackageByChildTrackingNumber', (req, res, next) => {
  api.existChildPackageByChildTrackingNumber(req, res, next);  
});

router.post('/setMailbagIdToNull', (req, res, next) => {
  api.setMailbagIdToNull(req, res, next);
});

router.delete('/deleteMailBag', (req, res, next) => {
  api.deleteMailBag(req, res, next);
});

router.get('/getVendorTracking', (req, res, next) => {
  api.getVendorTracking(req, res, next);  
});


module.exports = router;