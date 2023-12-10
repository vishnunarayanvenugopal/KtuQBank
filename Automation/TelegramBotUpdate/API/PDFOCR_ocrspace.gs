function pdfocr(url) {  


    var api = "https://api.ocr.space/parse/imageurl?apikey=xxxx&url="+url+"";

    
    var options = {
    
      method : 'GET',
      muteHttpExceptions: true
    };
    
    var response = UrlFetchApp.fetch(api, options);
    
    var json = JSON.parse(response.getContentText());
// console.log(json);
  var parsedresults=json.ParsedResults;
  
  var parsedtext=parsedresults[0].ParsedText;
  var parsedtextnew=parsedtext.replace(/\r\n/g,"</br>");
    return parsedtextnew;
  
}
