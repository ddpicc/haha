const express = require('express');
const router = express.Router();
const api = require('../apis/package')

router.post('/createForcastInfo', (req, res, next) => {
	api.createForcastInfo(req, res, next);
});

router.post('/updateForcastInfo', (req, res, next) => {
	api.updateForcastInfo(req, res, next);
});

router.get('/getForcastInfo', (req, res, next) => {
	api.getForcastInfo(req, res, next);  
});

router.get('/getForcastInfoByStorageNm', (req, res, next) => {
	api.getForcastInfoByStorageNm(req, res, next);  
});

router.get('/existForcastPackage', (req, res, next) => {
	api.existForcastPackage(req, res, next);  
});

router.delete('/deleteForcastInfo', (req, res, next) => {
  api.deleteForcastInfo(req, res, next);
});

router.post('/insertThirdPartyPackage', (req, res, next) => {
  api.insertThirdPartyPackage(req, res, next);
});

router.post('/updateThirdPartyPackage', (req, res, next) => {
  api.updateThirdPartyPackage(req, res, next);
});

router.get('/getTodayandUncheckedThirdPartyPackage', (req, res, next) => {
  api.getTodayandUncheckedThirdPartyPackage(req, res, next);
});

router.get('/getAllThirdPartyPackage', (req, res, next) => {
  api.getAllThirdPartyPackage(req, res, next);
});

router.get('/getThirdPartyPackageByUser', (req, res, next) => {
  api.getThirdPartyPackageByUser(req, res, next);
});

router.get('/getTrackingByThirdPartyPackageId', (req, res, next) => {
  api.getTrackingByThirdPartyPackageId(req, res, next);
});

router.delete('/deleteThirdPartyPackagebyId', (req, res, next) => {
  api.deleteThirdPartyPackagebyId(req, res, next);
});

router.get('/getUserPackageByUser', (req, res, next) => {
  api.getUserPackageByUser(req, res, next);
});

router.post('/setPackageWeightandStatus', (req, res, next) => {
  api.setPackageWeightandStatus(req, res, next);
});

router.post('/insertUserPackage', (req, res, next) => {
  api.insertUserPackage(req, res, next);
});


router.get('/getAllWaitPackage', (req, res, next) => {
  api.getAllWaitPackage(req, res, next);
});

router.get('/getAllFinishPackage', (req, res, next) => {
  api.getAllFinishPackage(req, res, next);
});


//生成child order
router.post('/insertChildOrder', (req, res, next) => {
  api.insertChildOrder(req, res, next);
});

router.post('/insertUSChildOrder', (req, res, next) => {
  api.insertUSChildOrder(req, res, next);
});

router.get('/searchInfoByPackageId', (req, res, next) => {
  api.searchInfoByPackageId(req, res, next);  
});

router.get('/getChildOrderByPackageId', (req, res, next) => {
  api.getChildOrderByPackageId(req, res, next);  
});

router.get('/getItemsByChildId', (req, res, next) => {
  api.getItemsByChildId(req, res, next);  
});
module.exports = router;