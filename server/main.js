const routerApi = require('./router');
const packageApi = require('./routers/packageRouter');
const itemApi = require('./routers/itemRouter');
const userApi = require('./routers/userRouter');
const invoiceApi = require('./routers/invoiceRouter');
const newsApi = require('./routers/newsRouter');
const express = require('express');
const bodyParser = require("body-parser")
const schedule = require("node-schedule");
const app = express();
const qnconfig = require('./utils/qiniuConfig')
const UserManagement = require('./scheduleJob/chargePlanFee')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all("*",(req,res,next) => {
    res.header("Access-Control-Allow-Credentials", "ture");
    res.header("Access-Control-Allow-Origin", req.header.origin);
    res.header("Access-Control-Allow-Methods", "PUT,GET,POST,DELETE,Option");
    res.header("Access-Control-Allow-Headers", "Content-Type,username");
    next();
});

// 后端api路由
app.use('/api', routerApi);
app.use('/api/package',packageApi);
app.use('/api/item',itemApi);
app.use('/api/user',userApi);
app.use('/api/invoice',invoiceApi);
app.use('/api/news',newsApi);

app.get('/api/qiniuToken', (req, res, next) => {
  console.log('generate qiniu token');
  res.status(200).send(qnconfig.generateUploadToken());
});

/* schedule.scheduleJob('0 0 0 1 * *',()=>{
  console.log('每月第一天处理用户自动续费')
	UserManagement.processUserMonthlyFee();
}); */

app.listen(3000,() => {
    console.log('app listening on port 3000.')
})




