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