async function handlereq(path,body, callback){
	let res = {success: false,echo: 'Invalid endpoint'}

	if(path === '/api_test'){
		res = {success: true,echo: body};
	}

	callback(res)
	return res;
}

module.exports = {handlereq}