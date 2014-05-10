console.log('iWindsurf ads with simply.js and kimonolabs');

//Pebble app configuration
simply.fullscreen(false); 
simply.scrollable(true);//for the menu screen set to false
simply.style('small'); //use smallest text
var apptitle = "iWindsurf Add";
var api_key = "e0410419639a90c0e2ac742009fffaf6";//kimono
var api_route = "83cb43fe";
var islocation =  /(CA\n|SF\n|Bay Area|California)/i;
 
var notrequesting = true;
var feedtimer,status = null;//timers for both status while requesting the feed and for updating the feed
var ipending = 0; //nbr of period
var currentstatus = "";
var bmenu =true; //state

simply.on('singleClick', function(e) {
  console.log('Pressed ' + e.button + '!');
  if (e.button === 'back') {
    clearInterval(feedtimer);
    console.log('Timer OFF');
  } 

});

startapp(1*60); //in sec

function setstatus(st) {
  simply.title(apptitle + st);
  console.log('status:'+ st);
  if(status)
  {
    clearInterval(status);
    console.log("clear status");
  }
  if(st)
  {
    currentstatus = apptitle + st; //stored the current status
    status = setInterval(function()
      {
        ipending++;
        if(ipending > 4)
          currentstatus = currentstatus.substr(0, currentstatus.length - 4);
        else
        {
          currentstatus = currentstatus + ".";
        }
        console.log('status interval:' + ipending + '-'+ currentstatus);
        simply.title(currentstatus);
      }, 500);
  }
  else
    simply.title(apptitle);
}

function startapp(isec) {
  console.log('Feed ON');
  requestfeed(); 
  if(feedtimer)
     clearInterval(feedtimer);
   feedtimer = setInterval(function(){
      console.log('Requesting Feed Again');
      requestfeed();
    }, isec * 1000); //Currently Kimono provide update every 15 min
  
}
function requestfeed() {
  setstatus("   ");
  notrequesting = false;
  var api_url = 'http://www.kimonolabs.com/api/'+ api_route+ '?apikey='+ api_key;
  ajax({ url: api_url  }, function(data){
    var news = JSON.parse(data);
    var arr = news.results.iwindsurf;
    var ad ='';
    console.log("arr.length:" + arr.length);
    for(var i=1;i<15 && i<arr.length;i++){
      if(islocation.test(arr[i]["ads"]["text"])){
        console.log("ad:"+ arr[i]["ads"]["text"].replace(/\n/g, " "));
        ad += arr[i]["ads"]["text"].replace(/^(\d\n)/,"$1-").replace(/\n/g, " ") + '\n';
      }
    }
    setstatus("");
    notrequesting = true;
    simply.body(ad);
  });
}
