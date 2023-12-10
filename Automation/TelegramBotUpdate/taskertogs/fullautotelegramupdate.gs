function ktuscrap() {
  const url = "https://ktu.edu.in/eu/core/announcements.htm";
  ssId="17QJlqisTGGtyRFEn562NaRShl0RcA_v8lMesLZ0tl2w";
   
  const s = UrlFetchApp.fetch(url).getContentText();
  return s.replace(/[\r\n]/g, '');
  
//getheading(s);
  //SpreadsheetApp.openById(ssId).getSheets()[0].appendRow(getheading(s));
  }


function dotask () {
  var folderid="1eswf1VK87qH2MksEOoGKqD7A4nkcC6o2";
  var i;   //forloop
  var j;    //forloop
var heading=[];
var content=[];
var linktext=[];
var links=[];
  
 var SheetData=[]; 
  var newsheet=[];
  var chat_id=[];
  var newchat_id=[];
 
  const html = ktuscrap();
  const [table] = html.match(/<div class="c-details".+?>(.+)<\/div>/);
  const rows = table.match(/<tr>(.+?)<\/tr>/g);

for(i=0;i<5;i++)
{
  
 temp=rows[i].match(/<b>(.+?)<\/b>/g);                     //heading
  var temp1 = temp[1].replace("<b>","");
  var temp1 = temp1.replace("</b>","");
heading.push(temp1);
  
  
   temp=rows[i].match(/-->(.+?)<!--/g);                        //content //changed from paragraph ending to above (Error fix blank URL)
 var temp1 = temp[0].match(/<\/b>(.+?)<!--/g);
  temp1[0]=temp1[0].replace(/<.+?>/g,""); 
  temp1[0]=temp1[0].replace("-->",""); 
  temp1[0]=temp1[0].replace("<!--",""); 
  
content.push(temp1[0]);
  
    
   temp=rows[i].match(/<!-- <\/a> -->(.+?)<\/li>/g);              //linktext (2D) array
    var temp1 = temp[0].match(/<b>(.+?)<\/a>/g);
   if (temp1!== null){                                           //run if not null only (Error fix blank URL)
  for(j=0;j<temp1.length;j++)
  {
     temp1[j]=temp1[j].replace("<b>",""); 
     temp1[j]=temp1[j].replace("</a>",""); 
  }
  linktext.push(temp1);
  }
  
   temp=rows[i].match(/<!-- <\/a> -->(.+?)<\/li>/g);               //Get links (2D) array
  var temp1 = temp[0].match(/<a href='(.+?)'  target=/g);
  if (temp1!== null){                                               //run if not null only (Error fix blank URL)
  for(j=0;j<temp1.length;j++)
  {
     temp1[j]=temp1[j].replace("<a href='",""); 
     temp1[j]=temp1[j].replace("'  target=",""); 
     if(temp1[j].startsWith("/eu/"))
     {
     temp1[j]="https://ktu.edu.in" + temp1[j];
     }
   
  }
  links.push(temp1);

  }
}

   var SheetData = SpreadsheetApp.getActiveSheet().getDataRange().getValues();  //get colum 1 and push
   for(j=0;j<SheetData.length;j++)
   {
     newsheet.push(SheetData[j][0]);
   }
  
  var chat_id=SpreadsheetApp.openById("16SUqeYftPtoLgGPk9ZoTfKF-rBHR1SmO7iRg-N6ii4w").getSheets()[0].getRange("I1:I").getValues(); //GET Telegram Chatids
 
  for(j=0;j<chat_id.filter(String).length;j++)
  {
    newchat_id.push(chat_id[j][0]);
    
  }
  
 
  for(j=0;j<5;j++)
    
  {
    var a = newsheet.indexOf(heading[j]);         //check if new top 5 heading already in content ?
 //  console.log("Checking started");
    if(a==-1)
   { var contentbitlylink="";
    var individual_links=[];
    var pdflinks=[];
    var previewlink=[];
    var weburllinks=[];
    var pdflinkforocrarray=[];
     for(i=0;i<links[j].length;i++)
     {
        if(links[j][i].startsWith("https://ktu.edu.in/eu/att"))
        {
          
          pdflinkforocrarray.push(links[j][i]);
          
       var glink=uploadToDrive(links[j][i], folderid, linktext[j][i]);
             individual_links.push({"text":linktext[j][i],"url":glink});
        var contentbitlylink = contentbitlylink.concat("\uD83D\uDCE5  "+bitly(glink)+"\r\n\r\n");
        
        var temp=glink.match(/id=(.*)/g);  
        
   var temp1=temp[0].replace("id=",""); 
 var temp2=temp1.replace("&export=download",""); 
         
          
          var newpreview="https://drive.google.com/file/d/"+temp2+"/preview";
    pdflinks.push(glink);
          previewlink.push(newpreview);
        }
       else
       {
           var contentbitlylink = contentbitlylink.concat("\uD83D\uDCE5  "+bitly(links[j][i])+"\r\n\r\n");
         weburllinks.push(links[j][i]);
       }
       
     }
     
     
     SpreadsheetApp.getActiveSheet().insertRowBefore(1).getRange(1, 1, 1, 1).setValues([[heading[j]]]);  //add row if not present


   
     var blogurl=RUNTHIS(heading[j],content[j],pdflinks,weburllinks,pdflinkforocrarray,linktext[j],previewlink);
     
      for(i=0;i<newchat_id.length;i++)
  
      {   
       try {
       console.log(i);
        var d = new Date();
        var month=d.getMonth() + 1;
        var day=d.getDate();
        var date=day+"/" + month +"/"+d.getFullYear();
        var hours = d.getHours();
  var minutes = d.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var time = hours + ':' + minutes + ' ' + ampm;
         
          console.log(newchat_id[i]);
         
  var watext=encodeURI("https://api.whatsapp.com/send?&text="+"\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\r\n\r\n      \uD83D\uDCD1\uD83D\uDCDB NEW UPDATE \uD83D\uDCDB\uD83D\uDCD1\r\n\r\n\uD83D\uDCCC " + heading[j] +" \r\n\r\n\u2763" + content[j] +"\r\n"+ contentbitlylink +"\uD83E\uDD16 add me to your telegram groups to get live updates @ktuupdatesbot\r\n\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\r\n\uD83D\uDDD3 "+ date +" @ "+ time +"\r\n\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796");
         
  var whatsappupdategen="\uD83D\uDCE2 *KTU Live Updates And Help* \uD83D\uDCE2\r\n\r\n        \uD83D\uDD0C\uD83D\uDCA1 By *Ktuqbank.com*  \r\n\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\r\n\r\n        \uD83D\uDCD1\uD83D\uDCDB *NEW UPDATE* \uD83D\uDCDB\uD83D\uDCD1  \r\n\r\n\uD83D\uDCCC *" + heading[j] +"*\r\n\r\n\u2763   ```" + content[j] +"```\r\n\r\n\uD83D\uDCE5  "+blogurl+"\r\n\r\n\uD83D\uDCE5 \r\n\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\r\n\uD83D\uDDD3  "+date+" @ "+time+"\r\n\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\r\n\r\n\uD83D\uDCE9.   To Join, click & Send \uD83D\uDC47\uD83D\uDC47\r\n\r\n           link.ktuqbank.com\/join\r\n\u3030\u3030\u3030\u3030\u3030\u3030\u3030\u3030\u3030\u3030\u3030\r\n*Autogenerated";    
  var sheet = SpreadsheetApp.openById("1bFoKVnpJiWJRZ0kOOSuYBZ2Fy2HA1arvV8dSr8T7Jkw").getRange('A1').setValue(heading[j]+"~"+content[j]+"~"+blogurl+"~"+date+"~"+time+"~");
        
         
  var url = "https://api.telegram.org/xxxx/sendMessage";
  var raw = JSON.stringify({"inline_keyboard":[individual_links,[{"text":"Subcribe channel","url":"https://t.me/ktuliveupdates"},{"text":"Send to Whatsapp","url":watext}],[{"text":"Get Whatsapp Updates","url":"http://link.ktuqbank.com/join"}]]});
  var data ={
    'chat_id': newchat_id[i],
    'text': "\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\r\n\r\n      \uD83D\uDCD1\uD83D\uDCDB NEW UPDATE \uD83D\uDCDB\uD83D\uDCD1\r\n\r\n\uD83D\uDCCC " + heading[j] +" \r\n\r\n\u2763" + content[j] +"\r\n\r\n\uD83D\uDCE5 "+blogurl +"\r\n\r\n\uD83E\uDD16 add me to your telegram groups to get live updates @ktuupdatesbot\r\n\r\n\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\r\n\uD83D\uDDD3 "+ date +" @ "+ time +"\r\n\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796",
    'reply_markup': raw
  };
    
var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(data)
  };
  
  
var response = UrlFetchApp.fetch(url, options);
 console.log(response);
        
        

          Utilities.sleep(40);
   } catch(e) {
   console.log(e);
 console.log(newchat_id[i]);
         kickhandler(e,newchat_id[i]);
  continue;//If error continue looping
}
      }
     
     
   }
 }

 

};


function uploadToDrive(url, folderid, filename) {
  var msg = '';
  var response;
var drivefileurl;
  try {
    response = UrlFetchApp.fetch(url, {
      // muteHttpExceptions: true,
      // validateHttpsCertificates: false,
      followRedirects: true  // Default is true anyway.
    });
  } catch(e) {
    return e.toString();
  }

  if (response.getResponseCode() === 200) {
    if (!filename) {
      // TODO: try content-disposition.
      filename = getFilenameFromURL(url);
    }

    if (!filename) {
      msg += 'Aborting: Filename not detected. Please supply a filename.\n'
    } else {
      var folder = DriveApp.getRootFolder();
      if (folderid) {
        folder = DriveApp.getFolderById(folderid);
      }
      var blob = response.getBlob();
      var file = folder.createFile(blob);
       file.setName(filename);
      file.setDescription("Downloaded from " + url);
      var drivefileurl=file.getDownloadUrl();
     
      
      
      var headers = response.getHeaders();
      var content_length = NaN;
      for (var key in headers) {
        if (key.toLowerCase() == 'Content-Length'.toLowerCase()) {
          content_length = parseInt(headers[key], 10);
          break;
        }
      }

      var blob_length = blob.getBytes().length;
      msg += 'Saved "' + filename + '" (' + blob_length + ' bytes)';
      if (!isNaN(content_length)) {
        if (blob_length < content_length) {
          msg += ' WARNING: truncated from ' + content_length + ' bytes.';
        } else if (blob_length > content_length) {
          msg += ' WARNING: size is greater than expected ' + content_length + ' bytes from Content-Length header.';
        }
      }
      msg += '\nto folder "' + folder.getName() + '".\n';
    }
  } else {
    msg += 'Response code: ' + response.getResponseCode() + '\n';
  }

  // Debug: printing response headers.
  // msg += JSON.stringify(response.getHeaders(), undefined, 2) + '\n';
//console.log(drivefileurl);
  return drivefileurl;
}


function bitly(long_url){

var url = "https://api-ssl.bitly.com/v4/bitlinks";
var data ={"long_url": long_url};
var options = {
    'method' : 'post',
   headers: {
      'Content-Type': 'application/json',
     'Authorization' : 'xxxxx',
         },
    'payload' : JSON.stringify(data),
  };
var response = JSON.parse(UrlFetchApp.fetch(url, options));
 
return(response.link);  
}

function kickhandler(e,tempx)
{ console.log(e);
 console.log(tempx);
  var errormes=  JSON.parse(e.message.match(/{(.+?)}/g));
     if(errormes.error_code=="403")
     {
       var error_chat_id=SpreadsheetApp.openById("16SUqeYftPtoLgGPk9ZoTfKF-rBHR1SmO7iRg-N6ii4w").getSheets()[0].getDataRange().getValues();
        for(var i = error_chat_id.length-1; i >= 0; i--){
    if(error_chat_id[i][1] ==tempx ){ //newchat_id[i]
      
      SpreadsheetApp.openById("16SUqeYftPtoLgGPk9ZoTfKF-rBHR1SmO7iRg-N6ii4w").deleteRow(i+1); 
    };
  };
       
      
     }
  else
  {
    console.log(errormes.error_code);
  }
    
}

//////////////////////////////////////////////////////////////////////////////
var CLIENT_ID = 'xxxxx';
var CLIENT_SECRET = 'xxxxx';



function getService() {
 
  return OAuth2.createService('blogger')

      .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
      .setTokenUrl('https://accounts.google.com/o/oauth2/token')
      
      .setClientId(CLIENT_ID)
      .setClientSecret(CLIENT_SECRET)

      .setCallbackFunction('authCallback')

        .setPropertyStore(PropertiesService.getUserProperties())

          .setScope('https://www.googleapis.com/auth/blogger')

     
      .setParam('login_hint', Session.getActiveUser().getEmail())
      
         .setParam('access_type', 'offline')

      .setParam('approval_prompt', 'force');
}

function authCallback(request) {
  var bloggerService = getService();
  var isAuthorized = bloggerService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}

// Modified from http://ctrlq.org/code/20068-blogger-api-with-google-apps-script
function bloggerAPI(payload) {                       //Adding Post
 console.log("starting bloggerAPI");
  
  var service = getService();
  if (service.hasAccess()) {
  
    var api = "https://www.googleapis.com/blogger/v3/blogs/2916909995879942251/posts/";
    
    var headers = {
      "Authorization": "Bearer " + getService().getAccessToken(),
      "Content-Type": "application/json"
    };
    

    
    var options = {
      "headers": headers,
      "method" : "POST",
      "payload" : JSON.stringify(payload),
      "muteHttpExceptions": true
    };
    
    var response = UrlFetchApp.fetch(api, options);
    
    var json = JSON.parse(response.getContentText());
    return json.url;

   
  } else {
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log('Open the following URL and re-run the script: %s',
        authorizationUrl);
  }
  
}



////////////////////////////////////////////////////////////////Overall function payload//////////////////////////////////////////////////////////////

// publish post return payload
 var labels=   [
    "ktu updates",
    "announcement",
    "notification"
  ];

function RUNTHIS(title,content,pdflinks,weburllinks,pdflinkforocrarray,linktext,previewlink) {
  console.log("Started runthis");
  function generateinitial(title,content)
  {
    var initial="<a href=\"https:\/\/1.bp.blogspot.com\/-HrWsTFFA6Wk\/XpMb5AV2HhI\/AAAAAAAAx_Y\/MBHL20m5BIwtyLSDWvuSwReAmotY9rYCQCPcBGAYYCw\/s1600\/1-c3cQvYJrVezv_Az0CoDcbA.jpeg\" imageanchor=\"1\" ><img border=\"0\" src=\"https:\/\/1.bp.blogspot.com\/-HrWsTFFA6Wk\/XpMb5AV2HhI\/AAAAAAAAx_Y\/MBHL20m5BIwtyLSDWvuSwReAmotY9rYCQCPcBGAYYCw\/s1600\/1-c3cQvYJrVezv_Az0CoDcbA.jpeg\" data-original-width=\"560\" data-original-height=\"397\"  style=\"display:none;\" alt=\""+title+"\"><\/a> <meta property=\"fb:pages\" content=\"1156506657810335\" \/><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><meta name=\"description\" content=\""+content+"\"\/><meta property=\"og:locale\" content=\"en_US\" \/><meta property=\"og:type\" content=\"article\" \/><meta property=\"og:title\" content=\""+content+"\" \/><meta property=\"og:site_name\" content=\"KtuQBank\" \/><meta property=\"article:publisher\" content=\"https:\/\/www.facebook.com\/ktuqbank\/\" \/><meta property=\"article:tag\" content=\"Announcements\" \/><meta property=\"article:tag\" content=\"announcement\" \/><meta property=\"article:tag\" content=\"notification\" \/><meta property=\"article:tag\" content=\""+title+"\" \/><meta property=\"article:tag\" content=\"ktu updates\" \/><meta property=\"article:tag\" content=\"ktu live updates\" \/><meta property=\"article:tag\" content=\"ktu website notification\" \/><meta property=\"article:tag\" content=\"ktu notification\" \/><meta property=\"article:section\" content=\"Announcement\" \/><meta property=\"og:image\" content=\"https:\/\/1.bp.blogspot.com\/-HrWsTFFA6Wk\/XpMb5AV2HhI\/AAAAAAAAx_Y\/MBHL20m5BIwtyLSDWvuSwReAmotY9rYCQCPcBGAYYCw\/s1600\/1-c3cQvYJrVezv_Az0CoDcbA.jpeg\" \/><meta name=\"twitter:card\" content=\"summary\" \/><meta name=\"twitter:description\" content=\""+content+"\" \/><meta name=\"twitter:title\" content=\""+title+"\" \/><meta name=\"twitter:site\" content=\"@ktuqbank\" \/><meta name=\"twitter:image\" content=\"https:\/\/1.bp.blogspot.com\/-HrWsTFFA6Wk\/XpMb5AV2HhI\/AAAAAAAAx_Y\/MBHL20m5BIwtyLSDWvuSwReAmotY9rYCQCPcBGAYYCw\/s1600\/1-c3cQvYJrVezv_Az0CoDcbA.jpeg\" \/> \r\n "+content+" \r\n\r\n<p><\/p>\r\n";
    return initial;
  }
  

    
      var iframe=iframegen(previewlink);
 
    var pdfbeta=ocrpdftext(pdflinkforocrarray);
   
    var linkbutton=linkbuttongen(pdflinks,weburllinks,linktext);
 
   
 
    
    function ocrpdftext(pdflinkforocrarray)
    {
     
  
 
      var ocrtext="";
      for(var i=0;i<pdflinkforocrarray.length;i++)
      {
        
       ocrtext=ocrtext+pdfocr(bitly(pdflinkforocrarray[i]));
        
        
      }
      var ocrpdf="<button class=\"accordion\">PDF (Beta)<\/button>\r\n<div class=\"panel\">\r\n  <p>"+ocrtext+"<\/p>\r\n<\/div>\r\n\r\n";
    
      return ocrpdf;
    }
   
    function iframegen(previewlink)
    {
  
      
      var iframe="";
      for(var i=0;i<previewlink.length;i++)
      {
        iframe=iframe+"</br><iframe src=\""+previewlink[i]+"\" width=\"640\" height=\"480\"><\/iframe></br>";
      }
     
     return iframe;
    }
    function linkbuttongen(pdflinks,weburllinks,linktext)
    {
      var linkbutton="<center><h2>Links<\/h2><\/center>\r\n \r\n  <center> <div style=\"font-size:1.5em\">\r\n\u2003";
      var newlinkarr = pdflinks.concat(weburllinks);
      for(var i=0;i<newlinkarr.length;i++)
      {
        linkbutton=linkbutton+"<a href=\""+newlinkarr[i]+"\" class=\"button5\"   style=\"background-color:#42cc8c;\"  target=\"_blank\" >"+linktext[i]+"<\/a>\r\n\u2003";
      }
      linkbutton=linkbutton+"<\/div><\/center>\r\n\r\n";
     
     return linkbutton;
    }
    
  
  
  var initial=generateinitial(title,content);
  
  var stylelast="<style>a.button5{\r\n\u2003display:inline-block;\r\n\u2003padding:0.46em 1.6em;\r\n\u2003border:0.1em solid #000000;\r\n\u2003margin:0 0.2em 0.2em 0;\r\n\u2003border-radius:0.12em;\r\n\u2003box-sizing: border-box;\r\n\u2003text-decoration:none;\r\n\u2003font-family:'Roboto',sans-serif;\r\n\u2003font-weight:300;\r\n\u2003color:#000000;\r\n\u2003text-shadow: 0 0.04em 0.04em rgba(0,0,0,0.35);\r\n\u2003background-color:#FFFFFF;\r\n\u2003text-align:center;\r\n\u2003transition: all 0.15s;\r\n}\r\na.button5:hover{\r\n\u2003text-shadow: 0 0 2em rgba(255,255,255,1);\r\n\u2003color:#FFFFFF;\r\n\u2003border-color:#FFFFFF;\r\n}\r\n@media all and (max-width:30em){\r\n\u2003a.button5{\r\n\u2003\u2003display:block;\r\n\u2003\u2003margin:0.4em auto;\r\n\u2003}\r\n}<\/style>";
 var stylemiddle="\r\n<style>\r\n.accordion {\r\n  background-color: #dcdcdc;\r\n  color: #444;\r\n  cursor: pointer;\r\n  padding: 18px;\r\n  width: 100%;\r\n  border: none;\r\n  text-align: left;\r\n  outline: none;\r\n  font-size: 15px;\r\n  transition: 0.4s;\r\n}\r\n\r\n.accordion.active, .accordion:hover {\r\n  background-color: #dcdcdc;\r\n}\r\n\r\n.accordion:after {\r\n  content: '\\002B';\r\n  color: #777;\r\n  font-weight: bold;\r\n  float: right;\r\n  margin-left: 5px;\r\n}\r\n\r\n.accordion.active:after {\r\n  content: \"\\2212\";\r\n}\r\n\r\n.panel {\r\n  padding: 0 18px;\r\n  background-color: white;\r\n  max-height: 0;\r\n  overflow: hidden;\r\n  transition: max-height 0.2s ease-out;\r\n}\r\n<\/style>\r\n\r\n\r\n\r\n\r\n";
  var scriptlast="<script>\r\nvar acc = document.getElementsByClassName(\"accordion\");\r\nvar i;\r\n\r\nfor (i = 0; i < acc.length; i++) {\r\n  acc[i].addEventListener(\"click\", function() {\r\n    this.classList.toggle(\"active\");\r\n    var panel = this.nextElementSibling;\r\n    if (panel.style.maxHeight) {\r\n      panel.style.maxHeight = null;\r\n    } else {\r\n      panel.style.maxHeight = panel.scrollHeight + \"px\";\r\n    } \r\n  });\r\n}\r\n<\/script>\r\n\r\n\r\n\r\n";
  var payload={
  "kind": "blogger#post",
  "blog": {
    "id": "2916909995879942251"
  },
  "title": title,
  "content": initial+iframe+stylemiddle+pdfbeta+scriptlast+linkbutton+stylelast,
   "labels":  labels
}; 

   
  url=bloggerAPI(payload);
  console.log(url);
  return bitly(url);
   
}
/////////////////////////////////////////////////////OCR PDF HERE///////////////////////////////////////////////////////////////////////////////////////////////
function pdfocr(url) {  


    var api = "https://api.ocr.space/parse/imageurl?apikey=xxxxx&url="+url+"";

    
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
