var pomodoro_count;
var monthly_count;
var bins;
var dt = new Date();
var month = dt.getMonth()+1;
var year = dt.getFullYear();
var key;

//functions
function binValues(counts){
    let num_bins = 5;
    var bins = [];

    var min = Math.min(...counts);
    var max = Math.max(...counts);
    var bin_width = (max-min)/5;

    switch(max-min){
        case 0:
            return bins.push(0);
        case 1:
            return bins.concat([0,max]);
        case 2:
            return bins.concat([0,min+1, max]);
        case 3:
            return bins.concat([0,min+1, min+2, max]);
        case 4:
            return bins.concat([0,min+1, min+2, min+3, max]);
        default:
            return bins.concat([0,Math.ceil(min+bin_width), Math.ceil(min+2*bin_width),Math.ceil(min+3*bin_width), Math.ceil(min+4*bin_width), max]);
    };

    return bins;
}


function find_bin(val, bins){
    //matches values with corresponding bins
    if(val == 0){
        return 0;
    }

    for (let i = 0; i < bins.length; i++){
        if (val <= bins[i]){
            return i;
        }
    };

}


function get_prev_month_year(){
    if(month == 1){
        month = 12;
        year --;
    }
    else{
        month --;
    }
    return [month, year];
};

function get_next_month_year(){
    if(month == 12){
        month = 1;
        year ++;
    }
    else{
        month ++;
    }
    return [month, year];
};

function display_calendar(){
    for (let i = 0; i < daysInMonth; i++){
        color_index = find_bin(monthly_count[i], bins);
        color = gradient_colors[color_index]
        
        //entries += "<div>"+ color +"</div>";
        var day = parseInt(i)+1;
        entries += "<div class='color"+color_index+"'><span class='tooltip-text'>"+ day + ". " + num_month[month] + "</br>"+ monthly_count[i] + " Pomodoros" +"</span></div>";
    };

    document.getElementById("display-date").innerHTML = num_month[month] + " " + year;
};

function getItemPomodoro(item){
    pomodoro_count = item["pomodoro_count"];
    console.log(pomodoro_count);
}

function onError(e) {
    console.log(e);
}

//universal
var num_month = {"1": "January", "2": "Feburary", "3": "March", "4": "April", "5": "May", "6": "June", "7": "July", "8": "August", "9": "September", "10": "October", "11": "November", "12": "December"};

//gradient colors
var gradient_colors = ["#BDE724", "#83AF00", "#4A7B00", "#054900", "#001D00", "#5A636A"].reverse();
var entries = "";


//get pomodoro counts for month
browser.storage.local.get("pomodoro_count").then(getItemPomodoro, onError).then(init_calendar).then(calendar_logic);

function init_calendar() {
    key = month + "-" + year;
    monthly_count = pomodoro_count[key];
    daysInMonth = monthly_count.length;
    bins = binValues(monthly_count);
}



//check if popup is opened
windows = browser.extension.getViews({type: "popup"});
//if popup is open:
function calendar_logic(){
    if(windows.length == 1){
        display_calendar();
        document.getElementById("grid-container").innerHTML = entries;

        //update calendar left button
        document.getElementById("left-arrow").addEventListener("click", function(){
            //contains divs for calendar
            entries = "";
        
            var previous_month = get_prev_month_year();
            browser.storage.local.get("pomodoro_count").then(getItemPomodoro, onError).then(update_calendar(previous_month));
        });

        //update calendar right button
        document.getElementById("right-arrow").addEventListener("click", function(){
            //contains divs for calendar
            entries = "";
        
            var previous_month = get_next_month_year();
            browser.storage.local.get("pomodoro_count").then(getItemPomodoro, onError).then(update_calendar(previous_month));
        });
    }
}


function update_calendar(display_month) {
    daysInMonth = new Date(display_month[1], display_month[0], 0).getDate();
    key = display_month[0] + "-" + display_month[1];

    if(!(key in pomodoro_count)){
        monthly_count = Array.from({length: daysInMonth}, () => 0);
    }
    else{
        monthly_count = pomodoro_count[key];
    }
    bins = binValues(monthly_count);

    display_calendar();
    document.getElementById("grid-container").innerHTML = entries;
}