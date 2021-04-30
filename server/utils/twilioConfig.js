let dotenv = require('dotenv');
dotenv.config({path: '../.env'});
const accountSid = process.env.VUE_APP_TWILIO_SID;
const authToken = process.env.VUE_APP_TWILIO_TOKEN;
const client = require('twilio')(accountSid, authToken);

module.exports = {
	randomCode (length) {
		var chars = ['0','1','2','3','4','5','6','7','8','9'];
		var result = ""; 
		for(var i = 0; i < length ; i ++) {
				var index = Math.ceil(Math.random()*9);
				result += chars[index];
		}
		return result;
	},

	sendCode (phone, code){
		msg = '【TheLittleAnt】验证码： ' + code;
		return new Promise (( resolve, reject) => {
      client.messages.create({body: msg, from: '+12056512430', to: phone})
			.then(function (response) {
        console.log(response);
        resolve('success');
      }).catch(function (error) {
        console.log(error);
        reject(error);
      });
    })
		
	}
}