import axios from 'axios';

const token = 'd331f10372be352ac16731c387a3477c0afae036c139a5ea2fe2d55fe62adc10';
export function nihaoPay(content){
	axios.post('/payapi/transactions/securepay',content,
	{
		headers: {
			'Authorization': 'Bearer ' + token,
		}
	}).then(function (response) {
		console.log(response.data);
		return response;
	}).catch(function (error) {
		console.log(error);
		return error;
	});
}