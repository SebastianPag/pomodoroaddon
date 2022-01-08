var downloadTimer;
var pauseTimer;
var focus_time;
var rest_time;
var time_left;
var time_in_sec;
var tester = "tackle Mackle";

var windows = browser.extension.getViews({type: "popup"});


browser.storage.local.get("timer_info").then(getItem, onError).then(timer_logic);


//if popup is open:
function timer_logic(){
if(windows.length == 1){
    focus_time = timer_info["focus_time"];
    rest_time = timer_info["rest_time"];

    document.getElementById("focus-time").innerHTML = focus_time;
    document.getElementById("rest-time").innerHTML = rest_time;

    //focus time controllers
    document.getElementById("increase-focus").addEventListener("click", function(){
        
        var text = document.getElementById("focus-time").innerHTML;
        var minutes = parseInt(text.split(":")[0]);
        
        if(minutes < 99){
            minutes++;
        };

        focus_time = minutes.toString() + ":00"; 
        document.getElementById("focus-time").innerHTML = focus_time;

        timer_info["focus_time"] = focus_time;
        timer_info["rest_time"] = rest_time;

        browser.storage.local.set({timer_info}).then(setItem, onError);

    });

    document.getElementById("decrease-focus").addEventListener("click", function(){
        var text = document.getElementById("focus-time").innerHTML;
        var minutes = parseInt(text.split(":")[0]);
        
        if(minutes > 1){
            minutes--;
        };
        focus_time = minutes.toString() + ":00"; 
        document.getElementById("focus-time").innerHTML = focus_time;

        timer_info["focus_time"] = focus_time;
        timer_info["rest_time"] = rest_time;

        browser.storage.local.set({timer_info}).then(setItem, onError);

    });

    //rest time controllers
    document.getElementById("increase-rest").addEventListener("click", function(){
        var text = document.getElementById("rest-time").innerHTML;
        var minutes = parseInt(text.split(":")[0]);
        
        if(minutes < 99){
            minutes++;
        };
        rest_time = minutes.toString() + ":00";
        document.getElementById("rest-time").innerHTML = rest_time;

        timer_info["focus_time"] = focus_time;
        timer_info["rest_time"] = rest_time;

        browser.storage.local.set({timer_info}).then(setItem, onError);

    });

    document.getElementById("decrease-rest").addEventListener("click", function(){
        var text = document.getElementById("rest-time").innerHTML;
        var minutes = parseInt(text.split(":")[0]);
        
        if(minutes > 1){
            minutes--;
        };
        rest_time = minutes.toString() + ":00";
        document.getElementById("rest-time").innerHTML = rest_time;

        timer_info["focus_time"] = focus_time;
        timer_info["rest_time"] = rest_time;

        browser.storage.local.set({timer_info}).then(setItem, onError);

    });


    //reset
    document.getElementById("reset").addEventListener("click", function(){

        document.getElementById("rest-time").innerHTML = "5:00";
        document.getElementById("focus-time").innerHTML = "25:00";

        timer_info["focus_time"] = "25:00";
        timer_info["rest_time"] = "5:00";

        browser.storage.local.set({timer_info}).then(setItem, onError);
        
        notifyBackgroundPage("reset");
        icon_reset();
    });


    //start
    document.getElementById("start").addEventListener("click", function(){
        timeleft = document.getElementById("focus-time").innerHTML.split(":");
        time_in_sec = parseInt(timeleft[0]) * 60 + parseInt(timeleft[1]);
        //init timer in background.js
        notifyBackgroundPage("start");
    });


    //halt
    document.getElementById("stop").addEventListener("click", function(){
        notifyBackgroundPage("stop");
    });
}
}

//resetting rest timer
function rest_timer(){
    timeleft = document.getElementById("rest-time").innerHTML.split(":");
    time_in_sec = parseInt(timeleft[0]) * 60 + parseInt(timeleft[1]);

    notifyBackgroundPage("rest");
};

function setItem(item){
    return;
}

function onError(){
    console.log("Failed");
}

function getItem(item) {
    timer_info = item["timer_info"];
}

//reset icon when reset button is pressed
function icon_reset(){ 
    browser.tabs.query({currentWindow: true, active: true})
    .then((tabs) => {
      
      browser.browserAction.setIcon({path: "../icon/pomodoro.png"});

    });
};

//message passing fucntions  
function notifyBackgroundPage(source) {
    if(source == "reset"){
        browser.runtime.sendMessage({mode: "reset"});
    }
    else if(source == "stop"){
        browser.runtime.sendMessage({mode: "stop"});
    } 
    else{
        browser.runtime.sendMessage({f_time: focus_time, r_time: rest_time, mode: "no"});
    }

  }

function handleTime(message){
    update_focus_timer(message);
}

function update_focus_timer(message) {
    if(message.mode == "0"){
        document.getElementById("focus-time").innerHTML = message.f_time;
        document.getElementById("rest-time").innerHTML = message.r_time;
    }    
}

browser.runtime.onMessage.addListener(handleTime);