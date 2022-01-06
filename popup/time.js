//date info
var dt = new Date();
var month = dt.getMonth();
var year = dt.getFullYear();

//gradient colors
var gradient_colors = ["#BDE724", "#83AF00", "#4A7B00", "#054900", "#001D00", "#000000"].reverse();

daysInMonth = new Date(year, month, 0).getDate();

var entries = "";
var pomodoro_count = {
    "0-2022": Array.from({length: 31}, () => Math.floor(Math.random() * 40))
};

//get pomodoro counts for month
var query_string = month.toString() + "-" + year.toString(); //format of keys in JSON is m-yyyy; m is 0 indexed;
var num_entries = pomodoro_count[query_string].length;
var monthly_count = pomodoro_count[query_string].concat(Array(daysInMonth-num_entries).fill(0));


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
            console.log("default");
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

    console.log(val, bins);
}

var bins = binValues(monthly_count);

console.log(monthly_count);
console.log(bins);

for (let i = 0; i < daysInMonth; i++){
    color_index = find_bin(monthly_count[i], bins);
    color = gradient_colors[color_index]

    //entries += "<div>"+ color +"</div>";
    entries += "<div class='color"+color_index+"'></div>";
    
};

document.getElementById("grid-container").innerHTML = entries;
