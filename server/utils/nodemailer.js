module.exports = {
    mail
}

/**
* 发送邮件
* @param {string} to 收件方邮箱
* @param {string} title 内容标题
* @param {string} content 邮件内容
* @param {Function} callback 回调函数（内置参数）
* 
*/
function mail(to,title,content,callback) {
  const nodemailer = require('nodemailer'); //引入依赖
  /**
   * 详细配置文件地址： node_modules/lib/well-known/services
   */
  let transporter = nodemailer.createTransport({
      host: 'smtp.163.com',
      port: 465,
      secure: true,
      auth: {
          user: 'thelittleant@163.com', //发送方邮箱
          pass: 'UDMXNWVHSGHLGDLG' //发送方邮箱的授权码,一般去邮箱设置里面找，应该可以找到
      }
  });

  let info = {
      from: 'thelittleant@163.com',//发送方邮箱
      to: to, 
      subject: title,
      text: content
       //html: '<h1>这里内容</h1>'，text和html任选其一即可
  }
    //发送邮件
  transporter.sendMail(info,(err,data) => {
      callback &&  callback(err,data)
  })
}