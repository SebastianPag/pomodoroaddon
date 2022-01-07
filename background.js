//set initial values for storage
function setItem(){
    console.log("Stored Initial Values");
}

function onError(){
    console.log("Failed");
}

function getItem(item) {
    console.log(item)
}

let timer_info = {
    focus_time: "25:00",
    rest_time: "5:00"
}

browser.management.onInstalled.addListener((info) => {
    console.log(info.name + " was installed");
    browser.storage.local.set({timer_info}).then(setItem, onError);
  });



