// background-script.js
let refresh = false;
let gl_lock = 0;
startUp();

async function startUp(){
	let min = await defaultMinutes();
	let sec = await defaultSeconds();
	let ms = min * 60000 + sec * 1000;
	browser.storage.sync.get(['defaultAutoStart']).then(result => {
		if(result.defaultAutoStart){
			console.log(ms);
			refresh = true;
			reloadFunction(ms);
		}
	}).catch((error) => {
		console.log('Error getting value', error);
	});
}

async function defaultMinutes(){
	return await browser.storage.sync.get(['defaultMinutes']).then(result => {
		if(result.defaultMinutes == null) browser.storage.sync.set({'defaultMinutes': 15});
		return result.defaultMinutes;
	}).catch((error) => {
		console.log('Error getting value', error);
	});
}

async function defaultSeconds(){
	return await browser.storage.sync.get(['defaultSeconds']).then(result => {
		if(result.defaultSeconds == null) browser.storage.sync.set({'defaultMinutes': 0});
		return result.defaultSeconds;
	}).catch((error) => {
		console.log('Error getting value', error);
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
  console.log(`A content script sent a message: ${request.greeting}`);
}

browser.runtime.onMessage.addListener(handleMessage);


async function reloadFunction(ms){
	if(ms < 15000) ms = 15000;
	if(gl_lock === 1) return;
	gl_lock = 1;
	while(refresh){
		await new Promise((r,reject) => setTimeout(r, ms));
		if (!refresh) return;
		console.log("Reloaded");
		browser.tabs.query({active: true}, function (arrayOfTabs) {
			arrayOfTabs.forEach(function (tab) {
				browser.tabs.reload(tab.id);
			});				
		});
	}
	gl_lock = 0;
};