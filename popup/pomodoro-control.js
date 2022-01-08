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
        
        if(minutes > 0){
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
        clearInterval(downloadTimer);
        clearInterval(pauseTimer);

        timer_info["focus_time"] = focus_time;
        timer_info["rest_time"] = rest_time;

        browser.storage.local.set({timer_info}).then(setItem, onError);

        icon_reset();
    });


    //start
    document.getElementById("start").addEventListener("click", function(){
        timeleft = document.getElementById("focus-time").innerHTML.split(":");
        time_in_sec = parseInt(timeleft[0]) * 60 + parseInt(timeleft[1]);
        clearInterval(downloadTimer);
        clearInterval(pauseTimer);

        //init timer in background.js
        notifyBackgroundPage();

        downloadTimer = setInterval(function function1(){
            time_in_sec -= 1;
    
            var secs = parseInt(time_in_sec%60);
            if(secs < 10){
                secs = "0" + secs.toString();
            };

            var minutes_secs = Math.floor(time_in_sec/60).toString() + ":" + secs.toString();
            if(time_in_sec >= 0){
                document.getElementById("focus-time").innerHTML = minutes_secs;
            };

            focus_time = minutes_secs;
            timer_info["focus_time"] = focus_time;
            timer_info["rest_time"] = rest_time;

            browser.storage.local.set({timer_info}).then(setItem, onError);

            //timer reaches 0
            if(time_in_sec <= 0){

                timer_info["focus_time"] = "0:00";
                clearInterval(downloadTimer);
            }
        }, 1000);
    });


    //halt
    document.getElementById("stop").addEventListener("click", function(){
        clearInterval(downloadTimer);
        clearInterval(pauseTimer);
    });
}
}

//resetting rest timer
function rest_timer(){
    timeleft = document.getElementById("rest-time").innerHTML.split(":");
    time_in_sec = parseInt(timeleft[0]) * 60 + parseInt(timeleft[1]);

    pauseTimer = setInterval(function function1(){

        time_in_sec -= 1;

        var secs = parseInt(time_in_sec%60);
        if(secs < 10){
            secs = "0" + secs.toString();
        };

        var minutes_secs = Math.floor(time_in_sec/60).toString() + ":" + secs.toString();
        if(time_in_sec >= 0){
            document.getElementById("rest-time").innerHTML = minutes_secs;
        };

        rest_time = minutes_secs;
        timer_info["rest_time"] = rest_time;

        browser.storage.local.set({timer_info}).then(setItem, onError);
        
        //timer reaches 0
        if(time_in_sec <= 0){
            clearInterval(downloadTimer);
            clearInterval(pauseTimer);
        
            document.getElementById("rest-time").innerHTML = rest_time;
        }
    }, 1000);
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
function notifyBackgroundPage() {
    var sending = browser.runtime.sendMessage({f_time: focus_time, r_time: rest_time});
  }