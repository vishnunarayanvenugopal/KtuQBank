var CLIENT_ID = 'xxxx';
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
