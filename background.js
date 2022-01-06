function look_up_url(url){
  return url.split("/")[2];  
};

let currentTab = null;
let currTab = null;

//add eventlistener, in this case event is a tab is loaded
//browser.tabs.onActivated.addListener((event) => log_url(event));
browser.tabs.onUpdated.addListener((event) => log_url(event));

function log_url(event){ 
    browser.tabs.query({currentWindow: true, active: true})
    .then((tabs) => {
      
      currTab = look_up_url(tabs[0].url);
      console.log(currTab);

      //Adjust favicon, when link is recognized
      if(currTab.startsWith("www.amazon.de")){
        browser.browserAction.setIcon({path: "./icon/matunus_bright.png"});
      }
      else{
        browser.browserAction.setIcon({path: "./icon/matunus_bw.png"});
      };
    });
};
