//Created on startup

window.onload = setDefaults;

document.getElementById("MainButton").addEventListener("click", function (e) {
	notifyBackgroundPage();
});
document.getElementById("SaveButton").addEventListener("click", function (e) {
	saveFormData();
});
document.addEventListener("click", function (e) {
	saveFormData();
	getRefreshStatus();
});
//Notifys service-worker to toggle refreshing.
function notifyBackgroundPage(e) {
	const sending = chrome.runtime.sendMessage({
		greeting: "Toggling Refresh State",
		refreshMS: getSeconds(), 
		toggleRefresh: true
	});
	sending.then(setButtonText, handleError);
}

//Gets refresh status from the service-worker.
function getRefreshStatus(e) {
	const sending = chrome.runtime.sendMessage({
		getStatus: true
	});
	sending.then(setButtonText, handleError);
}

//Gets number of seconds from the form.
function getSeconds() {
	return ((document.getElementById("FormMinutes").value * 60000) + (document.getElementById("FormSeconds").value * 1000)); 
}

//Changes button text depending on whether the refresh is running or not.
function setButtonText(message) {
	console.log(message);
	if(message.running){
		document.getElementById("MainButton").innerHTML = "Stop Refreshing";
	}else{
		document.getElementById("MainButton").innerHTML = "Start Refreshing";
	}
}

//Saves Form Data to Extension Defaults
function saveFormData() {
	chrome.storage.sync.set({ defaultMinutes: document.getElementById("FormMinutes").value }).then(() => {
		console.log('Minutes value is set');
	}).catch((error) => {
		console.error('Error setting value: ', error);
	});
	chrome.storage.sync.set({ defaultSeconds: document.getElementById("FormSeconds").value }).then(() => {
		console.log('Seconds value is set');
	}).catch((error) => {
		console.error('Error setting value: ', error);
	});
	chrome.storage.sync.set({ defaultAutoStart: document.getElementById("AutoStart").checked }).then(() => {
		console.log('Autostart value is set');
	}).catch((error) => {
		console.error('Error setting value: ', error);
	});
}

//Sets Extension Defaults
function setDefaults(e) {
	chrome.storage.sync.get(['defaultMinutes']).then(result => {
		document.getElementById("FormMinutes").value = result.defaultMinutes;
	}).catch((error) => {
		console.log('Error getting value', error);
	});
	chrome.storage.sync.get(['defaultSeconds']).then(result => {
		document.getElementById("FormSeconds").value = result.defaultSeconds;
	}).catch((error) => {
		console.log('Error getting value', error);
	});
	chrome.storage.sync.get(['defaultAutoStart']).then(result => {
		document.getElementById("AutoStart").checked = result.defaultAutoStart;
	}).catch((error) => {
		console.log('Error getting value', error);
	});
	getRefreshStatus();
}

//Handles Errors.
function handleError(error) {
  console.log(`Error: ${error}`);
}