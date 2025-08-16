const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener('message', (event) => {
	if (window.location.pathname.endsWith('receiver.html')) {
		let cmd = event.data;

		if(cmd.includes(":")){
			document.getElementById('output').textContent = event.data;
			test_getverse(cmd);
		} else {
			let payld = cmd.split("->");
			if(payld[0] == "action"){
				let b = sceneops[payld[1]];

				if(b != undefined){
					b();
				}
			}
			// alert_danger("unknown request");
		}
	}
});

function sendMessage(msg) {
	socket.send(msg);
}

function getBibleVerses(reference,version) {
	if(version == undefined)
		version = 'kjv';
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

// ✅ Example Usage:
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