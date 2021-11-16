const express = require('express');
const router = express.Router();
const api = require('../apis/invoiceRecipient')

router.get('/getInvoiceByUserDateRange', (req, res, next) => {
  api.getInvoiceByUserDateRange(req, res, next);
});

router.get('/getAllInvoices500Limits', (req, res, next) => {
  api.getAllInvoices500Limits(req, res, next);
});

router.get('/getAllInvoices', (req, res, next) => {
  api.getAllInvoices(req, res, next);
});

router.get('/getAllInvoiceByUser', (req, res, next) => {
  api.getAllInvoiceByUser(req, res, next);
});
module.exports = router;