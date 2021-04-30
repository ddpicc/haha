export default {
	SET_TOKEN: (state, token) => {
		state.token = token;
	},
	SET_NAME: (state, name) => {
		state.name = name;
	},
	SET_STORAGEnM: (state, storage_number) => {
		state.storage_number = storage_number;
	},
	SET_ROLES: (state, roles) => {
		state.roles = roles;
	},
	SET_USERID: (state, user_id) => {
		state.user_id = user_id;
	},
	SET_BALANCE: (state, balance) => {
		state.balance = balance;
	},
	UPDATE_BALANCE: (state, changeAmt) => {
		state.balance = state.balance + changeAmt;
	},

	LOGIN_SUCCESS: () => {
		console.log('login success')
	}
}