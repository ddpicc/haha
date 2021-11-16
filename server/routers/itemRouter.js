const express = require('express');
const router = express.Router();
const api = require('../apis/item')

router.post('/insertItemTemplate', (req, res, next) => {
  api.insertItemTemplate(req, res, next);
});
  
router.post('/insertPackageItem', (req, res, next) => {
  api.insertPackageItem(req, res, next);
});

router.delete('/deletePackageItem', (req, res, next) => {
  api.deletePackageItem(req, res, next);
});

router.get('/getItemsByThirdPartyPackageId', (req, res, next) => {
  api.getItemsByThirdPartyPackageId(req, res, next);
});

router.get('/existItemByUPC', (req, res, next) => {
	api.existItemByUPC(req, res, next);  
});

router.post('/updateItemSetPackageId', (req, res, next) => {
  api.updateItemSetPackageId(req, res, next);
});

router.post('/createNewItemUpdateOldItem', (req, res, next) => {
  api.createNewItemUpdateOldItem(req, res, next);
});

router.get('/getItemsByPackageId', (req, res, next) => {
  api.getItemsByPackageId(req, res, next);
});

router.post('/updateReportItemWithChildOrder', (req, res, next) => {
  api.updateReportItemWithChildOrder(req, res, next);
});

router.post('/copyItemInsertChildPackageId', (req, res, next) => {
  api.copyItemInsertChildPackageId(req, res, next);
});

router.get('/getAllItemTemplate', (req, res, next) => {
  api.getAllItemTemplate(req, res, next);
});

router.delete('/deleteItemTemplate', (req, res, next) => {
  api.deleteItemTemplate(req, res, next);
});

router.post('/updateItemTemplate', (req, res, next) => {
  api.updateItemTemplate(req, res, next);
});
module.exports = router;