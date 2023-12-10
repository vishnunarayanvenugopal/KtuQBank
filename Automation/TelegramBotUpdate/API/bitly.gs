function bitly(long_url){

var url = "https://api-ssl.bitly.com/v4/bitlinks";
var data ={"long_url": long_url};
var options = {
    'method' : 'post',
   headers: {
      'Content-Type': 'application/json',
     'Authorization' : 'xxxx',
         },
    'payload' : JSON.stringify(data),
  };
var response = JSON.parse(UrlFetchApp.fetch(url, options));
 
return(response.link);  
}
