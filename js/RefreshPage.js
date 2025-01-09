$(document).ready(function() {
    $("#MainButton").click(function(){
		event.preventDefault();
		notifyBackgroundPage();
    }); 
	$(window).click(function(){
		event.preventDefault();
		getRefreshStatus();
	});
});

window.onload = getRefreshStatus;

function handleError(error) {
  console.log(`Error: ${error}`);
}

function getSeconds() {
	return (($("#FormMinutes").val() * 60000) + ($("#FormSeconds").val() * 1000)); 
}

function setButtonText(message) {
	console.log(message);
	if(message.running){
		$("#MainButton").html("Stop Refreshing");
	}else{
		$("#MainButton").html("Start Refreshing");
	}
}

function notifyBackgroundPage(e) {
	const sending = chrome.runtime.sendMessage({
		greeting: "Toggling Refresh State",
		refreshMS: getSeconds(), 
		toggleRefresh: true
	});
	sending.then(setButtonText, handleError);
}

function getRefreshStatus(e) {
	const sending = chrome.runtime.sendMessage({
		getStatus: true
	});
	sending.then(setButtonText, handleError);
}