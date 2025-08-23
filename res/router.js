const { readMyData, savepayload } = require('./reader');

async function handlereq(path,body, callback){
	let res = {success: false,echo: 'Invalid endpoint'}

	if(path === '/api_test'){
		res = {success: true,echo: body};
	} else if(path === '/api_stylesmanager') {
		// sets the styles to be used by the showpage
		await savepayload(JSON.stringify(body,null,4),'./databank/stylesdata.json');
		res = {success: true,echo: "data saved successgully"};
	} else if(path === '/api_getscenes') {
		console.log("body",JSON.stringify(body));
		let dta = await readMyData('./databank/stylesdata.json');
		res = {success:true,echo: dta}
	}

	callback(res)
	return res;
}

module.exports = {handlereq}