/*
七牛云配置
*/

const qiniu = require('qiniu')
const accessKey = 'Q5q46fhpMgQZX7Yx_aqeVUMzIHZJ8Qwy-AlmflZh';
const secretKey = 'thN4-G6wiqVG4EQevA0IYmCc3c_v8C7T-AbJAHqT';
const mac = new qiniu.auth.digest.Mac(accessKey,secretKey);
const options = {
    scope: 'thelittleant',
    expires: 7200
}
const putPolicy = new qiniu.rs.PutPolicy(options);
module.exports = {
    generateUploadToken () {
        return putPolicy.uploadToken(mac);
    }
}