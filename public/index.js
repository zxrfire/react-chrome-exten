console.log("popup js running...");


const drawBox = document.getElementById("capture");
let storageNotEmpty = false;

drawBox.onclick = function(e) {
    e.preventDefault();
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id,
            {greeting: "TAKE_ACTION", storageNotEmpty: storageNotEmpty},
            function(response) {
                console.log(response.farewell);
                storageNotEmpty = response.storage;
            });
    });
    // window.close();
};
