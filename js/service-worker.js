// background-script.js
let refresh = false;
let gl_lock = 0;
startUp();

chrome.runtime.onStartup.addListener( () => {
    console.log(`onStartup()`);
});

async function startUp(){
	let min = await defaultMinutes();
	let sec = await defaultSeconds();
	let ms = min * 60000 + sec * 1000;
	chrome.storage.sync.get(['defaultAutoStart']).then(result => {
		if(result.defaultAutoStart){
			log(ms);
			refresh = true;
			reloadFunction(ms);
		}
	}).catch((error) => {
		log('Error getting value', error);
	});
}

async function defaultMinutes(){
	return await chrome.storage.sync.get(['defaultMinutes']).then(result => {
		if(result.defaultMinutes == null) chrome.storage.sync.set({'defaultMinutes': 15});
		return result.defaultMinutes;
	}).catch((error) => {
		log('Error getting value', error);
	});
}

async function defaultSeconds(){
	return await chrome.storage.sync.get(['defaultSeconds']).then(result => {
		if(result.defaultSeconds == null) chrome.storage.sync.set({'defaultSeconds': 0});
		return result.defaultSeconds;
	}).catch((error) => {
		log('Error getting value', error);
	});
}

function handleMessage(request, sender, sendResponse) {
	if(request.toggleRefresh){
		if(!refresh){
			refresh = true;
			reloadFunction(request.refreshMS);
			sendResponse({ running: true });
		} else {
			refresh = false;
			sendResponse({ running: false });
		}	
	} else if(request.getStatus){
		if(refresh){
			sendResponse({ running: true});
		} else {
			sendResponse({ running: false});
		}
	}
  log(`A content script sent a message: ${request.greeting}`);
}

chrome.runtime.onMessage.addListener(handleMessage);


async function reloadFunction(ms){
	if(ms < 15000) ms = 15000;
	if(gl_lock === 1) return;
	gl_lock = 1;
	while(refresh){
		await new Promise((r,reject) => setTimeout(r, ms));
		if (!refresh) return;
		log("Reloaded");
		chrome.tabs.query({active: true}, function (arrayOfTabs) {
			arrayOfTabs.forEach(function (tab) {
				chrome.tabs.reload(tab.id);
			});				
		});
	}
	gl_lock = 0;
};

function log(msg){
	let date = new Date();
	date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0,19).replace("T", " ");
	console.log(date + " : " + msg);
}