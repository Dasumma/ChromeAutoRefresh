// background-script.js
let refresh = false;
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
	while(refresh){
		await new Promise(r => setTimeout(r, ms));
		console.log("Test");
		chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
		chrome.tabs.reload(arrayOfTabs[0].id);
		});
	}
};