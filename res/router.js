function handlereq(path,body, callback){
	if(path === '/api_test'){
		callback({success: true,echo: body})
	} else {
		callback({success: false,echo: 'Invalid endpoint'})
	}
}

module.exports = {handlereq}