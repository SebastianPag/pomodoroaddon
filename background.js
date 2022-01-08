var test_timer;
var timer_listener;
var test_interval;
var test_rest;
var background_f_time;
var background_r_time;
var background_f_time_split;
var background_r_time_split;
var time_left;

//set initial values for storage
function setItem(){
    console.log("Stored Initial Values");
}

function onError(){
    console.log("Failed");
}

function getItem(item) {
    test_timer = item["timer_info"];
    console.log(item);
}

var timer_info = {
    focus_time: "25:00",
    rest_time: "5:00"
}

browser.management.onInstalled.addListener((info) => {
    console.log(info.name + " was installed");
    browser.storage.local.set({timer_info}).then(setItem, onError);
});


function handleMessage(message) {
    browser.storage.local.get("timer_info").then(getItem, onError).then(background_timer); 
}

function background_timer(){
    background_f_time = test_timer.focus_time;
    background_r_time = test_timer.rest_time;
    console.log(background_f_time, background_r_time);

    background_f_time_split = background_f_time.split(":");
    time_left = parseInt(background_f_time_split[0]) * 60 + parseInt(background_f_time_split[1]);

    test_interval = setInterval(function function1() {
        time_left -= 1;
    
        var secs = parseInt(time_left%60);
        if(secs < 10){
            secs = "0" + secs.toString();
        };

        var minutes_secs = Math.floor(time_left/60).toString() + ":" + secs.toString();

        background_f_time = minutes_secs;
        console.log(background_f_time, background_r_time);

        //save values for local storage
        timer_info.focus_time = background_f_time;
        browser.storage.local.set({timer_info}).then(setItem, onError);

        //timer reaches 0
        if(time_left <= 0){

            timer_info.focus_time = "0:00";
            timer_info.rest_time = background_r_time;
            browser.storage.local.set({timer_info}).then(setItem, onError);

            clearInterval(test_interval);
            rest_timer();
            icon_blink();
        }
    }, 1000);   
};

//resetting rest timer
function rest_timer(){
    background_r_time_split = background_r_time.split(":");
    time_left = parseInt(background_r_time_split[0]) * 60 + parseInt(background_r_time_split[1]);

    test_rest = setInterval(function function1(){

        time_left -= 1;

        var secs = parseInt(time_left%60);
        if(secs < 10){
            secs = "0" + secs.toString();
        };

        var minutes_secs = Math.floor(time_left/60).toString() + ":" + secs.toString();
        background_r_time = minutes_secs;

        //save values for local storage
        timer_info.rest_time = background_r_time;
        console.log(background_f_time, background_r_time);
        browser.storage.local.set({timer_info}).then(setItem, onError);
        
        //timer reaches 0
        if(time_left <= 0){

            timer_info.focus_time = "0:00";
            timer_info.rest_time = "0:00";
            browser.storage.local.set({timer_info}).then(setItem, onError);
            clearInterval(test_rest);
            clearInterval(test_interval);
            icon_rest_over();
        }
    }, 1000);
};
  

//update icon
function icon_blink(){ 
    browser.tabs.query({currentWindow: true, active: true})
    .then((tabs) => {
        let n = 0;
        browser.browserAction.setIcon({path: "../icon/pomodoro_hot.png"});

        setTimeout(() => {  browser.browserAction.setIcon({path: "../icon/pomodoro_hot_rechts.png"}); }, 1000);
        setTimeout(() => {  browser.browserAction.setIcon({path: "../icon/pomodoro_hot_unten.png"}); }, 2000);
        setTimeout(() => {  browser.browserAction.setIcon({path: "../icon/pomodoro_hot_links.png"}); }, 3000);
        setTimeout(() => {  browser.browserAction.setIcon({path: "../icon/pomodoro_hot.png"}); }, 4000);

    });
};

function icon_rest_over(){
    browser.tabs.query({currentWindow: true, active: true})
    .then((tabs) => {
        let n = 0;
        browser.browserAction.setIcon({path: "../icon/pomodoro_gruen.png"});
        
        setTimeout(() => {  browser.browserAction.setIcon({path: "../icon/pomodoro_gruen_rechts.png"}); }, 1000);
        setTimeout(() => {  browser.browserAction.setIcon({path: "../icon/pomodoro_gruen_unten.png"}); }, 2000);
        setTimeout(() => {  browser.browserAction.setIcon({path: "../icon/pomodoro_gruen_links.png"}); }, 3000);
        setTimeout(() => {  browser.browserAction.setIcon({path: "../icon/pomodoro_gruen.png"}); }, 4000);

    });
};

browser.runtime.onMessage.addListener(handleMessage);

    

