// API endpoint variables
	let endpoint_getscenes = "/api_getscenes";
	let endpoint_getimages = "/api_getimages";
	let endpoint_sendimages = "/api_uploadimg";
	let endpoint_sendstyles = "/api_stylesmanager";

// runtime data
	let default_font = 6.7;
	let curscale = 1.0;
	let curstyles_viewer = {};

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener('message', (event) => {
	if (window.location.pathname.endsWith('receiver.html')) {
		// in case you are in the receiver page
		let cmd = event.data;

		if(cmd.includes(":") && !(cmd.includes("{"))){
			document.getElementById('output').textContent = event.data;
			test_getverse(cmd);
		} else {
			let payld = cmd.split("->");
			if(payld[0] == "action"){
				let b = sceneops[payld[1]];

				if(b != undefined && typeof b == 'function'){
					b();
				}
			} else if(payld[0] == "data"){
				let datagram = payld[1].split('|||');
				let b = dataops[datagram[0]]

				if(b != undefined && typeof b == 'function'){
					b(datagram[1]);
				} else {
					alert_danger("unknown data request");
				}
			}
		}
	}
});

function sendMessage(msg) {
	socket.send(msg);
}

function getBibleVerses(reference,version) {
	if(version == undefined){
		version = 'kjv';
	}

	const url = `https://bible-api.com/${encodeURIComponent(reference)}?translation=${encodeURIComponent(version)}`;

	return fetch(url)
		.then(response => {
			if (!response.ok) {
				throw new Error(`API error: ${response.status}`);
			}
			return response.json();
		})
		.then(data => {
			if (!data.verses || !Array.isArray(data.verses)) {
				throw new Error("Unexpected API response format");
			}

			// Extract verse texts into an array
			const verses = data.verses.map(v => v.text.trim());
			return verses;
		})
		.catch(error => {
			console.error("Error fetching verses:", error);
			return ["no connection"];
		});
}

// Example Usage:
function test_getverse(theverse) {
	hideverseguy();

	setTimeout( () => {
		getBibleVerses(theverse)
		.then(verses => {
			console.log("Fetched Verses:", verses);
			gottenverse.innerHTML = verses[0];

			showverseguy();
			// You can now use the `verses` array in your app
		});
	},timing.duration);
}

// operations
let sceneops = {};
sceneops['appear'] = () => {
	bring_forth();
}

sceneops['hide'] = () => {
	hide_panel();
}
sceneops['sizeup'] = () => {
	curscale += 0.1;
	gottenverse.style.fontSize = `${default_font * curscale}rem`;
	console.log("upscale")
}
sceneops['sizedown'] = () => {
	curscale -= 0.1;
	gottenverse.style.fontSize = `${default_font * curscale}rem`;
	console.log("downscale")
}
sceneops['regetstyles'] = async (s) => {
	s = s == undefined ? false : s;

	if(!s){
		alert_warning('reloading styles');
	}

	try{
		let req = await fetch(endpoint_getscenes);
		let theres = await req.json();

		// console.log(theres);

		if(!theres.success){
			throw new Error(theres.echo);
		}

		curstyles_viewer = theres.echo;
		reset_styles(s);
	} catch (e){
		alert_danger(`error: ${e}`);
	}
}
sceneops['showthird'] = () => {
	showhostinfo();
}
sceneops['hidethird'] = () => {
	hidehostinfo();
}

let dataops = {};
dataops['set_speaker'] = (d) => {
	let dta = JSON.parse(d);

	thetopic.innerHTML = `${dta.s_topic}`;
	thespeaker.innerHTML = `by ${dta.s_title} ${dta.s_name}`;
}


function bring_forth() {
	mainpanel.animate(entrance,timing);
}
function hide_panel() {
	mainpanel.animate([...entrance].reverse(),timing);
}

// setTimeout(() => {test_getverse("John 3:16-17")},1000);

// unvetted

/* Usage:

<div id="textContainer" style="width: 300px; height: 100px; border: 1px solid #000; overflow: hidden;">
	<span id="resizableText" style="display: inline-block;">This is some text that might be too long to fit in the container!</span>
</div>

autoResizeText({
	textElement: document.getElementById('resizableText'),
	containerElement: document.getElementById('textContainer'),
	minFontSize: 10,
	segmentCharLength: 30,
	onResizeLimitReached: () => {
		console.warn("Font can't shrink anymore, trimming text and segmenting.");
	}
});

console.log("Segments in 'words':", words);
*/