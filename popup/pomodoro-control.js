//focus time controllers
document.getElementById("increase-focus").addEventListener("click", function(){
    var text = document.getElementById("focus-time").innerHTML;
    var minutes = parseInt(text.split(":")[0]);
    
    if(minutes < 99){
        minutes++;
    };
    document.getElementById("focus-time").innerHTML = minutes.toString() + ":00";

});

document.getElementById("decrease-focus").addEventListener("click", function(){
    var text = document.getElementById("focus-time").innerHTML;
    var minutes = parseInt(text.split(":")[0]);
    
    if(minutes > 0){
        minutes--;
    };
    document.getElementById("focus-time").innerHTML = minutes.toString() + ":00";

});

//rest time controllers
document.getElementById("increase-rest").addEventListener("click", function(){
    var text = document.getElementById("rest-time").innerHTML;
    var minutes = parseInt(text.split(":")[0]);
    
    if(minutes < 99){
        minutes++;
    };
    document.getElementById("rest-time").innerHTML = minutes.toString() + ":00";

});

document.getElementById("decrease-rest").addEventListener("click", function(){
    var text = document.getElementById("rest-time").innerHTML;
    var minutes = parseInt(text.split(":")[0]);
    
    if(minutes > 1){
        minutes--;
    };

    document.getElementById("rest-time").innerHTML = minutes.toString() + ":00";

});


//start stop reset controllers
var downloadTimer;
var pauseTimer;

//reset
document.getElementById("reset").addEventListener("click", function(){
    var rest_time = "5:00";
    var focus_time = "25:00";

    document.getElementById("rest-time").innerHTML = rest_time;
    document.getElementById("focus-time").innerHTML = focus_time;
    clearInterval(downloadTimer);
    clearInterval(pauseTimer);

    icon_reset();
});


//start
document.getElementById("start").addEventListener("click", function(){
    var timeleft = document.getElementById("focus-time").innerHTML.split(":");
    var time_in_sec = parseInt(timeleft[0]) * 60 + parseInt(timeleft[1]);
    clearInterval(downloadTimer);
    clearInterval(pauseTimer);

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

        //timer reaches 0
        if(time_in_sec <= 0){
            clearInterval(downloadTimer);
            icon_blink();
            pause_timer();
        }
    }, 1000);
  });


  function pause_timer(){
    var timeleft = document.getElementById("rest-time").innerHTML.split(":");
    var time_in_sec = parseInt(timeleft[0]) * 60 + parseInt(timeleft[1]);

    pauseTimer = setInterval(function function1(){

        time_in_sec -= 1;

        var secs = parseInt(time_in_sec%60);
        if(secs < 10){
            secs = "0" + secs.toString();
        };

        var minutes_secs = Math.floor(time_in_sec/60).toString() + ":" + secs.toString();
        document.getElementById("rest-time").innerHTML = minutes_secs;
        
        //timer reaches 0
        if(timeleft <= 0){
            clearInterval(downloadTimer);
        }
    }, 1000);
};


  //halt
  document.getElementById("stop").addEventListener("click", function(){
    clearInterval(downloadTimer);
    clearInterval(pauseTimer);
  });


//update icon
function icon_blink(){ 
    browser.tabs.query({currentWindow: true, active: true})
    .then((tabs) => {
        let n = 0;
        browser.browserAction.setIcon({path: "../icon/pomodoro_hot.png"});

        while(n<3){
            n++;

            setTimeout(() => {  browser.browserAction.setIcon({path: "../icon/pomodoro_hot_rechts.png"}); }, 1000);
            setTimeout(() => {  browser.browserAction.setIcon({path: "../icon/pomodoro_hot_unten.png"}); }, 2000);
            setTimeout(() => {  browser.browserAction.setIcon({path: "../icon/pomodoro_hot_links.png"}); }, 3000);
            setTimeout(() => {  browser.browserAction.setIcon({path: "../icon/pomodoro_hot.png"}); }, 4000);
        };
    });
};

function icon_reset(){ 
    browser.tabs.query({currentWindow: true, active: true})
    .then((tabs) => {
      
      browser.browserAction.setIcon({path: "../icon/pomodoro.png"});

    });
};