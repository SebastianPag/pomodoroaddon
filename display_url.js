let currentTab = null;
let currTab = null;

//add eventlistener, in this case event is a tab is loaded
browser.tabs.onActivated.addListener((event) => log_url(event));

function log_url(event){

   
    browser.tabs.query({currentWindow: true, active: true})
    .then((tabs) => {
      currTab = tabs[0].url 
      console.log(currTab);
    });

    document.getElementsByClassName("title").innerHTML = "TEST";
};
