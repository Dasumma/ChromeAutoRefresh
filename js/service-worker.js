// background-script.js
let refresh = false;
let gl_lock = 0;
startUp();

async function startUp(){
	let min = await defaultMinutes();
	let sec = await defaultSeconds();
	let ms = min * 60000 + sec * 1000;
	chrome.storage.sync.get(['defaultAutoStart']).then(result => {
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
	return await chrome.storage.sync.get(['defaultMinutes']).then(result => {
		return result.defaultMinutes;
	}).catch((error) => {
		console.log('Error getting value', error);
	});
}

async function defaultSeconds(){
	return await chrome.storage.sync.get(['defaultSeconds']).then(result => {
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

chrome.runtime.onMessage.addListener(handleMessage);


async function reloadFunction(ms){
	if(gl_lock === 1) return;
	gl_lock = 1;
	while(refresh){
		await new Promise((r,reject) => setTimeout(r, ms));
		if (!refresh) return;
		console.log("Reloaded");
		chrome.tabs.query({active: true}, function (arrayOfTabs) {
			arrayOfTabs.forEach(function (tab) {
				chrome.tabs.reload(tab.id);
			});				
		});
	}
	gl_lock = 0;
};