var CLIENT_ID = 'xxxxxx';
var CLIENT_SECRET = 'xxxxx';
var action="publish"; // publish / update
ssId="1UmLOX5Sm8H0IDQaeH8SERULxsT4FuDIQqzcZ_TNA_Y4";


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
function bloggerAPI(payload,row) {                       //Adding Post
 
  
  var service = getService();
  if (service.hasAccess()) {
  
    var api = "https://www.googleapis.com/blogger/v3/blogs/2916909995879942251/posts/";
    
    var headers = {
      "Authorization": "Bearer " + getService().getAccessToken(),
      "Content-Type": "application/json"
    };
    
 //  var payload=RUNTHIS()[0];    //return payload to blogger API
   // var row=RUNTHIS()[1]+2;
    
    var options = {
      "headers": headers,
      "method" : "POST",
      "payload" : JSON.stringify(payload),
      "muteHttpExceptions": true
    };
    
    var response = UrlFetchApp.fetch(api, options);
    
    var json = JSON.parse(response.getContentText());
    console.log(json.url);
    console.log(json.id);
   row=row+2;
    SpreadsheetApp.getActiveSheet().getRange('P'+row).setValue(json.id);
    SpreadsheetApp.getActiveSheet().getRange('Q'+row).setValue(json.url);
    SpreadsheetApp.getActiveSheet().getRange('R'+row).setValue(json.selfLink);
     SpreadsheetApp.getActiveSheet().getRange('N'+row).setValue("Updated");
  } else {
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log('Open the following URL and re-run the script: %s',
        authorizationUrl);
  }
  
}

// Modified from http://ctrlq.org/code/20068-blogger-api-with-google-apps-script
function bloggerupdateAPI(payload,row,postid) {                       //Updating existing Post
 
  
  var service = getService();
  if (service.hasAccess()) {
  
    var api = "https://www.googleapis.com/blogger/v3/blogs/2916909995879942251/posts/"+postid;
    console.log(api);
    var headers = {
      "Authorization": "Bearer " + getService().getAccessToken(),
      "Content-Type": "application/json"
    };
    
 //  var payload=RUNTHIS()[0];    //return payload to blogger API
   // var row=RUNTHIS()[1]+2;
    
    var options = {
      "headers": headers,
      "method" : "PUT",
      "payload" : JSON.stringify(payload),
      "muteHttpExceptions": true
    };
    
    var response = UrlFetchApp.fetch(api, options);
    
    var json = JSON.parse(response.getContentText());
    console.log(json);
    console.log(json.url);
    console.log(json.id);
   row=row+2;
  
     SpreadsheetApp.openById(ssId).getSheets()[0].getRange('I'+row).setValue("Updated");
  } else {
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log('Open the following URL and re-run the script: %s',
        authorizationUrl);
  }
  
}

////////////////////////////////////////////////////////////////Overall function payload//////////////////////////////////////////////////////////////

// publish post return payload

function RUNTHIS() {

  var status=SpreadsheetApp.openById(ssId).getSheets()[0].getRange("I2:I").getValues(); //Get status if new or processed

  for(var i=0;i<status.filter(String).length;i++)
  {
    
     if(status[i]=="New") //check every row status if new
     {
         var subjectcode=SpreadsheetApp.openById(ssId).getSheets()[0].getRange("E2:E").getValues();
         var unique=SpreadsheetApp.openById(ssId).getSheets()[0].getRange("J2:J").getValues();
         var publishid=SpreadsheetApp.openById(ssId).getSheets()[0].getRange("K2:K").getValues();
         var url=SpreadsheetApp.openById(ssId).getSheets()[0].getRange("L2:L").getValues();
       var selfLink=SpreadsheetApp.openById(ssId).getSheets()[0].getRange("M2:M").getValues();
       
       
    
            for(var j=0;j<unique.filter(String).length;j++)  
                {
                    
                   if(unique[j][0]==subjectcode[i][0]) //get subject codes coresponding unique
                   {
                     if(publishid[j].filter(String).length==1) //get published id corresponding to unique subject code //if id present already published
                     {
                       console.log("Published post");   //update the post
                       var payload=publishpost(i,j,publishid[j][0],url[j][0],selfLink[j][0]);      //return payload
                     
                       console.log(payload);
                       if(payload==1)
                       { row=i+2;
                          SpreadsheetApp.openById(ssId).getSheets()[0].getRange('I'+row).setValue("Updated");
                       }
                       
                    bloggerupdateAPI(payload,i,publishid[j]);
                     }
                     else if(publishid[j].filter(String).length==0) //if id not present not published
                     {
                       console.log("not Published post");
                     //  var payload=publishpost(i,j);              //publish the post
                       //return [payload,j];            //return payload
                     //  bloggerAPI(payload,j);
                     }
                    
                  }
               }
      //var payload=publishpost(i);
       
     }
  
  }
}
//////////////////////////////////////////////////////////publish post code///////////////////////////////////////////////////////////////////////////
 function publishpost(i,j,publishid,url,selfLink) {
    var rows = SpreadsheetApp.openById(ssId).getDataRange().getValues();
    
  var today = new Date();
    var year = rows[i+1][2];
    var semester = rows[i+1][3]; 
    var branch = rows[i+1][1];
    var subjectname = rows[i+1][5];
    var subjectcode = rows[i+1][4]; 
    var date= rows[i+1][6]; 
    
    var rowyearwise=[];
    var uniquesubjectcode=[];
    
    var common2=[ 'HS200', 'MA201', 'MA202', 'HS210', 'HS300' ];
          if((common2.indexOf(subjectcode)!==-1))
          {
            return 1;
          }
  
            for(var z=1;z<=4;z++)
           {
            var temprow=[];
           
             for(var k=0;k<rows.length;k++)       //get all rows for all years
               {
                 if(rows[k][2]==z)
                     {
                         temprow.push(rows[k]);    //push array year wise into array (2D)
                     }
                     
                                   
               }
                var sortedtempyear = temprow.slice().sort((a, b) => b[6] - a[6]); //sort by date (Full sorting Date wise)
               rowyearwise.push(sortedtempyear);
     
          }
          
          
        
        
        if(year==1)
        {
          for(var y=0;y<rowyearwise[0].length;y++) 
          {
           uniquesubjectcode.push(rowyearwise[0][y][4]);  // push subject code year 1
          }
          
          uniquesubjectcode=[ ...new Set(uniquesubjectcode)]   //get unique of subject codes of all rows of year 1
          
         
          
          var accordion=" <div class=\"su-note\" style=\"border-color:#c7e5c7;border-radius:3px;-moz-border-radius:3px;-webkit-border-radius:3px;\">\r\n   <div class=\"su-note-inner su-clearfix\" style=\"background-color:#ddffdd;border-color:#f8fff8;color:#000000;border-radius:3px;-moz-border-radius:3px;-webkit-border-radius:3px;\">\r\n      <div class=\"su-accordion\">";
            
          for(var x=0;x<uniquesubjectcode.length;x++)
          {
            //for each subject code generate spoiler
            accordion=accordion+spoilergen(rowyearwise,rows,year,uniquesubjectcode[x],x);
          }
          
          accordion=accordion+"  <\/div>\r\n   <\/div>\r\n<\/div><a class=\"item\">\r\n        <div class=\"ui red horizontal label\">Updated On : <\/div>"+ today.getDate()+"/"+(today.getMonth()+1)+"/"+ today.getFullYear()+"\r\n      <\/a>";
          
          var title="First Year KTU Solved Question Papers";
          
          var subjectcodetemp="S1";
          var subjectnametemp="S2";
          
          var labels=   [ "2015 batch","First Year Solved Question Papers","BE100","CY100","BE110","BE101-05","CS100","CE100","EC100","BE103","MA101","MA102","ME100"];
          
         
      var payload={
 "kind": "blogger#post",
 "id": publishid,
 "blog": {
  "id": "2916909995879942251"
 },
 "url": url,
 "selfLink": selfLink,
 "title": title,
        
 "content": returnstatic(2)+returnstatic(1)+accordion,
 "labels":  labels
};
       return payload;
    
         
        }
        else 
        { 
          
          var sems=[];
         
           for(var y=0;y<rowyearwise[year-1].length;y++) 
          {
            sems.push(rowyearwise[year-1][y][3]);
          }
          
           sems=[ ...new Set(sems)]   //get unique of semester
           
           var semsarray=[];
           var uniquesem=[];
           for(var x=0;x<sems.length;x++)
           
           { 
             var tempsems=[];
             var uniquecodetemp=[];
              for(var z=0;z<rowyearwise[year-1].length;z++)
                 { 
                  
                  
                   if(rowyearwise[year-1][z][3]==sems[x] && (branch==rowyearwise[year-1][z][1] || rowyearwise[year-1][z][1]=="Common" ))
                   {
                    
                    tempsems.push(z);
                    uniquecodetemp.push(rowyearwise[year-1][z][4]);
                   }
            
                 }
             uniquecodetemp=[ ...new Set(uniquecodetemp)]     
            semsarray.push(tempsems);
            uniquesem.push(uniquecodetemp);
           }
          
          return othergeneration(semsarray,rowyearwise,sems,uniquesem,year,rows,branch,publishid,url,selfLink);
     
        }
         
}    
//////////////////////////////////////////////////////////////////////////Return Preset/////////////////////////////////////////////////////////////////////////
function returnstatic(no)
{
  if(no==1)
  {
   return static="<style>\r\n#header.sticky .blog-title {\r\n    height: 100%;\r\n\r\n}\r\n   .authorboxwrap {\r\n   display: none;\r\n   }\r\n   .pager {\r\n   display: none;\r\n   }\r\n   .post-body ul li:before {\r\n   display: none;\r\n   }\r\n   .post-info {\r\n   display: none;\r\n   }\r\n   .breadcrumbs {\r\n   display: none !important;\r\n   }\r\n   body {\r\n   font: normal normal 14px Montserrat, arial, sans-serif !important;\r\n   }\r\n   .post-title entry-title {\r\n   display: none !important;\r\n   }\r\n \r\n  \r\n   \/*! CSS Used from: https:\/\/secureservercdn.net\/45.40.150.81\/60j.c7c.myftpupload.com\/wp-content\/plugins\/tabby-responsive-tabs\/css\/tabby.css?ver=1.2.3&time=1584979063 ; media=all *\/\r\n   @media all{\r\n   .responsive-tabs .responsive-tabs__heading{display:none;}\r\n   .responsive-tabs .responsive-tabs__list__item{display:inline;cursor:pointer;}\r\n   .responsive-tabs .responsive-tabs__heading:focus,.responsive-tabs .responsive-tabs__list__item:focus{outline:1px solid transparent;}\r\n   .responsive-tabs .responsive-tabs__heading--active:focus,.responsive-tabs .responsive-tabs__list__item--active:focus{outline:none;}\r\n   .responsive-tabs ul.responsive-tabs__list{font-size:18px;line-height:18px;margin:20px 0 0 12px;padding:0;}\r\n   .responsive-tabs .responsive-tabs__list__item{background:transparent;border:1px solid transparent;border-bottom:none;-webkit-border-top-left-radius:3px;-webkit-border-top-right-radius:3px;-moz-border-radius-topleft:3px;-moz-border-radius-topright:3px;border-top-left-radius:3px;border-top-right-radius:3px;color:#999;font-size:18px;line-height:19px;text-transform:inherit;margin:1px 12px 0 0;padding:10px 12px 10px;white-space:nowrap;float:left;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}\r\n   .responsive-tabs .responsive-tabs__list__item:hover{color:#333;background:transparent;}\r\n   .responsive-tabs .responsive-tabs__list__item--active,.responsive-tabs .responsive-tabs__list__item--active:hover{background:#fff;border-color:#ddd;color:#666;padding-bottom:11px;margin-top:0;position:relative;top:1px;}\r\n   .responsive-tabs .responsive-tabs__panel{background:#fff;border:1px solid #ddd;border-top:1px solid #ddd;-webkit-border-radius:0px;-moz-border-radius:0px;border-radius:0px;-webkit-border-top-left-radius:0px;-moz-border-radius-topleft:0px;border-top-left-radius:0px;clear:left;margin-bottom:0;padding:20px 20px 0;word-wrap:break-word;}\r\n   .responsive-tabs .responsive-tabs__panel:after{content:\"\";display:block;height:0;clear:both;}\r\n   @media (max-width: 767px){\r\n   .responsive-tabs .responsive-tabs__list{display:none;}\r\n   .responsive-tabs .responsive-tabs__heading{display:block;cursor:pointer;}\r\n   .responsive-tabs .responsive-tabs__heading{background:#fff;border:1px solid #ccc;border-top:none;color:#777;font-size:18px;font-weight:normal;text-transform:inherit;margin:0;padding:10px 0;padding-left:20px;position:relative;}\r\n   .responsive-tabs .responsive-tabs__heading:after{border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid #777;content:\"\";display:block;position:absolute;right:20px;top:20px;height:0;width:0;}\r\n   .responsive-tabs .responsive-tabs__heading:hover{background:#eee;color:#777;}\r\n   .responsive-tabs .responsive-tabs__heading:hover:after{border-top:6px solid #777;}\r\n   .responsive-tabs .responsive-tabs__heading--active,.responsive-tabs .responsive-tabs__heading--active:hover{background:#ccc;color:#fff;}\r\n   .responsive-tabs .responsive-tabs__heading--active:after,.responsive-tabs .responsive-tabs__heading--active:hover:after{border-bottom:6px solid #fff;border-top:0;top:18px;}\r\n   .responsive-tabs .responsive-tabs__panel{background:#fff;border:1px solid #ccc;-webkit-border-radius:0;-moz-border-radius:0;border-radius:0;border-top:none;margin:0;padding:0 20px;padding-top:20px;}\r\n   }\r\n   }\r\n   \/*! CSS Used from: https:\/\/secureservercdn.net\/45.40.150.81\/60j.c7c.myftpupload.com\/wp-content\/plugins\/tabby-responsive-tabs\/css\/tabby-print.css?ver=1.2.3&time=1584979063 ; media=all *\/\r\n   @media all{\r\n   @media print{\r\n   .responsive-tabs .responsive-tabs__list{display:none;}\r\n   .responsive-tabs h2.tabtitle{display:block!important;}\r\n   .responsive-tabs .responsive-tabs__heading{background:none;border:none;display:block;font-size:22px;font-weight:bold;text-transform:inherit;margin:0!important;padding:10px 0 0;}\r\n   .responsive-tabs .responsive-tabs__panel{display:block!important;background:none;border:none;padding:0;}\r\n   }\r\n   }\r\n   \/*! CSS Used from: https:\/\/secureservercdn.net\/45.40.150.81\/60j.c7c.myftpupload.com\/wp-content\/plugins\/shortcodes-ultimate\/includes\/css\/shortcodes.css?ver=5.3.0&time=1584979063 ; media=all *\/\r\n   @media all{\r\n   .su-clearfix:before,.su-clearfix:after{display:table;content:\" \";}\r\n   .su-clearfix:after{clear:both;}\r\n   .su-tabs{margin:0 0 1.5em 0;padding:3px;border-radius:3px;background:#eee;}\r\n   .su-tabs-nav span{display:inline-block;margin-right:3px;padding:10px 15px;font-size:13px;min-height:40px;line-height:20px;border-top-left-radius:3px;border-top-right-radius:3px;color:#333;cursor:pointer;transition:all .2s;}\r\n   .su-tabs-nav span:hover{background:#f5f5f5;}\r\n   .su-tabs-nav span.su-tabs-current{background:#fff;cursor:default;}\r\n   .su-tabs-nav span:focus{outline:currentColor thin dotted;}\r\n   .su-tabs-pane{padding:15px;font-size:13px;border-bottom-right-radius:3px;border-bottom-left-radius:3px;background:#fff;color:#333;}\r\n   .su-tabs-pane:not(.su-tabs-pane-open){height:0!important;overflow:hidden!important;padding:0!important;min-height:0!important;border:none!important;}\r\n   .su-tabs-vertical:before,.su-tabs-vertical:after{content:\" \";display:table;}\r\n   .su-tabs-vertical:after{clear:both;}\r\n   .su-tabs-vertical .su-tabs-nav{float:left;width:30%;}\r\n   .su-tabs-vertical .su-tabs-nav span{display:block;margin-right:0;border-radius:0;border-top-left-radius:3px;border-bottom-left-radius:3px;}\r\n   .su-tabs-vertical .su-tabs-panes{float:left;width:70%;}\r\n   .su-tabs-vertical .su-tabs-pane{border-radius:0;-webkit-border-top-right-radius:3px;-webkit-border-bottom-right-radius:3px;-moz-border-radius-topright:3px;-moz-border-radius-bottomright:3px;border-top-right-radius:3px;border-bottom-right-radius:3px;}\r\n   .su-tabs-nav,.su-tabs-nav span,.su-tabs-panes,.su-tabs-pane{box-sizing:border-box!important;}\r\n   @media only screen and (max-width: 768px){\r\n   .su-tabs-nav span{display:block;}\r\n   .su-tabs-vertical .su-tabs-nav{float:none;width:auto;}\r\n   .su-tabs-vertical .su-tabs-panes{float:none;width:auto;}\r\n   }\r\n   .su-spoiler{margin-bottom:1.5em;}\r\n   .su-accordion{margin-bottom:1.5em;}\r\n   .su-accordion .su-spoiler{margin-bottom:0.5em;}\r\n   .su-spoiler-title{position:relative;cursor:pointer;min-height:20px;line-height:20px;padding:7px 7px 7px 34px;font-weight:bold;font-size:13px;}\r\n   .su-spoiler-title:focus{outline:currentColor thin dotted;}\r\n   .su-spoiler-icon{position:absolute;left:7px;top:7px;display:block;width:20px;height:20px;line-height:21px;text-align:center;font-size:14px;font-family:ShortcodesUltimateIcons;font-weight:normal;font-style:normal;-webkit-font-smoothing:antialiased;*margin-right:.3em;}\r\n   .su-spoiler-content{padding:14px;transition:padding-top .2s;-ie-transition:padding-top .2s;}\r\n   .su-spoiler.su-spoiler-closed > .su-spoiler-content{height:0;margin:0;padding:0;overflow:hidden;border:none;opacity:0;}\r\n   .su-spoiler-icon-plus .su-spoiler-icon:before{content:\"\\f068\";}\r\n   .su-spoiler-icon-plus.su-spoiler-closed .su-spoiler-icon:before{content:\"\\f067\";}\r\n   .su-spoiler-style-fancy{border:1px solid #ccc;border-radius:10px;background:#fff;color:#333;}\r\n   .su-spoiler-style-fancy > .su-spoiler-title{border-bottom:1px solid #ccc;border-radius:10px;background:#f0f0f0;font-size:0.9em;}\r\n   .su-spoiler-style-fancy.su-spoiler-closed > .su-spoiler-title{border:none;}\r\n   .su-spoiler-style-fancy > .su-spoiler-content{border-radius:10px;}\r\n   .su-row{clear:both;zoom:1;margin-bottom:1.5em;}\r\n   .su-row:before,.su-row:after{display:table;content:\"\";}\r\n   .su-row:after{clear:both;}\r\n   .su-column{display:block;margin:0 4% 0 0;float:left;box-sizing:border-box;}\r\n   .su-row .su-column{margin:0 0 0 4%;}\r\n   .su-row .su-column:first-child{margin-left:0;}\r\n   @media only screen{\r\n   [class*=\"su-column\"] + [class*=\"su-column\"]:last-child{float:right;}\r\n   }\r\n   .su-column-size-1-2{width:48%;}\r\n   @media only screen and (max-width: 768px){\r\n   .su-column{width:100%!important;margin:0 0 1.5em 0!important;float:none!important;}\r\n   .su-row .su-column:last-child{margin-bottom:0!important;}\r\n   }\r\n   .su-box{margin:0 0 1.5em 0;border-width:2px;border-style:solid;}\r\n   .su-box-title{display:block;padding:0.5em 1em;font-weight:bold;font-size:1.1em;}\r\n   .su-box-content{background-color:#fff;color:#444;padding:1em;}\r\n   .su-column-inner > *:first-child,.su-accordion > *:first-child,.su-spoiler-content > *:first-child,.su-box-content > *:first-child{margin-top:0;}\r\n   .su-column-inner > *:last-child,.su-tabs-pane > *:last-child,.su-accordion > *:last-child,.su-spoiler-content > *:last-child,.su-box-content > *:last-child{margin-bottom:0;}\r\n   }\r\n   \/*! CSS Used fontfaces *\/\r\n   @font-face{font-family:\"ShortcodesUltimateIcons\";src:url(\"https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/fork-awesome\/1.1.7\/fonts\/forkawesome-webfont.eot\"); src:url(\"https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/fork-awesome\/1.1.7\/fonts\/forkawesome-webfont.eot\") format(\"embedded-opentype\"),url(\"https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/fork-awesome\/1.1.7\/fonts\/forkawesome-webfont.woff\") }\r\n   \/*! CSS Used from: https:\/\/secureservercdn.net\/45.40.150.81\/60j.c7c.myftpupload.com\/wp-content\/plugins\/shortcodes-ultimate\/includes\/css\/shortcodes.css?ver=5.3.0&time=1584979063 ; media=all *\/\r\n   @media all{\r\n   .su-clearfix:before,.su-clearfix:after{display:table;content:\" \";}\r\n   .su-clearfix:after{clear:both;}\r\n   .su-note{margin:0 0 1.5em 0;border-width:1px;border-style:solid;}\r\n   .su-note-inner{padding:1em;border-width:1px;border-style:solid;}\r\n   .su-note-inner > *:first-child{margin-top:0;}\r\n   .su-note-inner > *:last-child{margin-bottom:0;}\r\n   }\r\n \/*! CSS Used from: https:\/\/semantic-ui.com\/dist\/semantic.min.css *\/\r\n*,:after,:before{-webkit-box-sizing:inherit;box-sizing:inherit;}\r\na{background-color:transparent;-webkit-text-decoration-skip:objects;}\r\na{color:#4183c4;text-decoration:none;}\r\na:hover{color:#1e70bf;text-decoration:none;}\r\n::-webkit-selection{background-color:#cce2ff;color:rgba(0,0,0,.87);}\r\n::-moz-selection{background-color:#cce2ff;color:rgba(0,0,0,.87);}\r\n::selection{background-color:#cce2ff;color:rgba(0,0,0,.87);}\r\nbody ::-webkit-scrollbar{-webkit-appearance:none;width:10px;height:10px;}\r\nbody ::-webkit-scrollbar-track{background:rgba(0,0,0,.1);border-radius:0;}\r\nbody ::-webkit-scrollbar-thumb{cursor:pointer;border-radius:5px;background:rgba(0,0,0,.25);-webkit-transition:color .2s ease;transition:color .2s ease;}\r\nbody ::-webkit-scrollbar-thumb:hover{background:rgba(128,135,139,.8);}\r\n.ui.label{display:inline-block;line-height:1;vertical-align:baseline;margin:0 .14285714em;background-color:#e8e8e8;background-image:none;padding:.5833em .833em;color:rgba(0,0,0,.6);text-transform:none;font-weight:700;border:0 solid transparent;border-radius:.28571429rem;-webkit-transition:background .1s ease;transition:background .1s ease;}\r\n.ui.label:first-child{margin-left:0;}\r\n.ui.label:last-child{margin-right:0;}\r\n.ui.red.label{background-color:#db2828!important;border-color:#db2828!important;color:#fff!important;}\r\n.ui.horizontal.label{margin:0 .5em 0 0;padding:.4em .833em;min-width:3em;text-align:center;}\r\n.ui.label{font-size:.85714286rem;}\r\n.ui.list>.item{display:list-item;table-layout:fixed;list-style-type:none;list-style-position:outside;padding:.21428571em 0;line-height:1.14285714em;}\r\n.ui.list>.item:after{content:\'\';display:block;height:0;clear:both;visibility:hidden;}\r\n.ui.list>.item:first-child{padding-top:0;}\r\n.ui.list>a.item{cursor:pointer;color:#4183c4;}\r\n.ui.list>a.item:hover{color:#1e70bf;}\r\n.ui.selection.list>.item{cursor:pointer;background:0 0;padding:.5em .5em;margin:0;color:rgba(0,0,0,.4);border-radius:.5em;-webkit-transition:.1s color ease,.1s padding-left ease,.1s background-color ease;transition:.1s color ease,.1s padding-left ease,.1s background-color ease;}\r\n.ui.selection.list.list>.item:hover,.ui.selection.list>.item:hover{background:rgba(0,0,0,.03);color:rgba(0,0,0,.8);}\r\n.ui.selection.list>.item:active{background:rgba(0,0,0,.05);color:rgba(0,0,0,.9);}\r\n.ui.divided.selection.list>.item{border-radius:0;}\r\n.ui.divided.list>.item{border-top:1px solid rgba(34,36,38,.15);}\r\n.ui.divided.list>.item:first-child{border-top:none;}\r\n.ui.divided.selection.list>.item{margin:0;border-radius:0;} <\/style>\r\n<script>\r\n   \/* ----------------\r\n   Tabby.js 1.2.0\r\n   \r\n   based on ResponsiveTabs.js 1.10\r\n   by Pete Love\r\n   ------------------- *\/\r\n   \r\n   var RESPONSIVEUI = {};\r\n   \r\n   (function($) {\r\n        \r\n    RESPONSIVEUI.responsiveTabs = function () {\r\n     var $tabSets = $(\'.responsive-tabs\');\r\n   \r\n     if (!$tabSets.hasClass(\'responsive-tabs--enabled\')) { \/\/ if we haven\'t already called this function and enabled tabs\r\n      $tabSets.addClass(\'responsive-tabs--enabled\'); \r\n   \r\n      \/\/loop through all sets of tabs on the page\r\n      var tablistcount = 1;\r\n   \r\n      $tabSets.each(function() {\r\n   \r\n       var $tabs = $(this);\r\n   \r\n       \/\/ add tab heading and tab panel classes\r\n       $tabs.children(\':header\').addClass(\'responsive-tabs__heading\');\r\n       $tabs.children(\'div\').addClass(\'responsive-tabs__panel\');\r\n   \r\n       \/\/ determine if markup already identifies the active tab panel for this set of tabs\r\n       \/\/ if not then set first heading and tab to be the active one\r\n       var $activePanel = $tabs.find(\'.responsive-tabs__panel--active\');\r\n       if(!$activePanel.length) {\r\n        $activePanel = $tabs.find(\'.responsive-tabs__panel\').first().addClass(\'responsive-tabs__panel--active\');\r\n       }\r\n   \r\n       \/* Add active class to the active header of the panel (FOR MOBILE) *\/                \r\n       $activeHeader = $activePanel.prev();\r\n       if($activeHeader !== null) {\r\n        $activeHeader.addClass(\"responsive-tabs__heading--active\");\r\n       }\r\n   \r\n       $tabs.find(\'.responsive-tabs__panel\').not(\'.responsive-tabs__panel--active\').hide().attr(\'aria-hidden\',\'true\'); \/\/hide all except active panel\r\n       $activePanel.attr(\'aria-hidden\', \'false\');\r\n       \/* make active tab panel hidden for mobile *\r\n       $activePanel.addClass(\'responsive-tabs__panel--closed-accordion-only\');*\/\r\n   \r\n       \/\/ wrap tabs in container - to be dynamically resized to help prevent page jump\r\n       var $tabsWrapper = $(\'<div\/>\', {\'class\': \'responsive-tabs-wrapper\' });\r\n       $tabs.wrap($tabsWrapper);\r\n   \r\n       var highestHeight = 0;\r\n   \r\n       \/\/ determine height of tallest tab panel. Used later to prevent page jump when tabs are clicked\r\n       $tabs.find(\'.responsive-tabs__panel\').each(function() {\r\n        var tabHeight = $(this).height();\r\n        if (tabHeight > highestHeight) {\r\n         highestHeight = tabHeight;\r\n        }\r\n       });\r\n   \r\n       \/\/create the tab list\r\n       var $tabList = $(\'<ul\/>\', { \'class\': \'responsive-tabs__list\', \'role\': \'tablist\' });\r\n   \r\n       \/\/loop through each heading in set\r\n       var tabcount = 1;\r\n       $tabs.find(\'.responsive-tabs__heading\').each(function() {\r\n   \r\n        var $tabHeading = $(this);\r\n        var $tabPanel = $(this).next();\r\n   \r\n        $tabHeading.attr(\'tabindex\', 0);\r\n   \r\n        \/\/ CREATE TAB ITEMS (VISIBLE ON DESKTOP)\r\n        \/\/create tab list item from heading\r\n        \/\/associate tab list item with tab panel\r\n        var $tabListItem = $(\'<li\/>\', { \r\n         \'class\': \'responsive-tabs__list__item\',\r\n         html: $tabHeading.html(),\r\n         id: \'tablist\' + tablistcount + \'-tab\' + tabcount,\r\n         \'aria-controls\': \'tablist\' + tablistcount +\'-panel\' + tabcount,\r\n         \'role\': \'tab\',\r\n         tabindex: 0,\r\n         keydown: function (objEvent) {\r\n          if (objEvent.keyCode === 13) { \/\/ if user presses \'enter\'\r\n           $tabListItem.click();\r\n          }\r\n         },\r\n         click: function() {\r\n   \r\n          \/\/Show associated panel\r\n   \r\n          \/\/set height of tab container to highest panel height to avoid page jump\r\n          $tabsWrapper.css(\'height\', highestHeight);\r\n   \r\n          \/\/ remove hidden mobile class from any other panel as we\'ll want that panel to be open at mobile size\r\n          $tabs.find(\'.responsive-tabs__panel--closed-accordion-only\').removeClass(\'responsive-tabs__panel--closed-accordion-only\');\r\n          \r\n          \/\/ close current panel and remove active state from its (hidden on desktop) heading\r\n          $tabs.find(\'.responsive-tabs__panel--active\').toggle().removeClass(\'responsive-tabs__panel--active\').attr(\'aria-hidden\',\'true\').prev().removeClass(\'responsive-tabs__heading--active\');\r\n          \r\n          \/\/make this tab panel active\r\n          $tabPanel.toggle().addClass(\'responsive-tabs__panel--active\').attr(\'aria-hidden\',\'false\');\r\n   \r\n          \/\/make the hidden heading active\r\n          $tabHeading.addClass(\'responsive-tabs__heading--active\');\r\n   \r\n          \/\/remove active state from currently active tab list item\r\n          $tabList.find(\'.responsive-tabs__list__item--active\').removeClass(\'responsive-tabs__list__item--active\');\r\n   \r\n          \/\/make this tab active\r\n          $tabListItem.addClass(\'responsive-tabs__list__item--active\');\r\n   \r\n          \/\/reset height of tab panels to auto\r\n          $tabsWrapper.css(\'height\', \'auto\');\r\n        \r\n         }\r\n        });\r\n        \r\n        \/\/associate tab panel with tab list item\r\n        $tabPanel.attr({\r\n         \'role\': \'tabpanel\',\r\n         \'aria-labelledby\': $tabListItem.attr(\'id\'),\r\n         id: \'tablist\' + tablistcount + \'-panel\' + tabcount\r\n        });\r\n   \r\n        \/\/ if this is the active panel then make it the active tab item\r\n        if($tabPanel.hasClass(\'responsive-tabs__panel--active\')) {\r\n         $tabListItem.addClass(\'responsive-tabs__list__item--active\');\r\n        }\r\n   \r\n        \/\/ add tab item\r\n        $tabList.append($tabListItem);\r\n   \r\n        \r\n        \/\/ TAB HEADINGS (VISIBLE ON MOBILE)\r\n        \/\/ if user presses \'enter\' on tab heading trigger the click event\r\n        $tabHeading.keydown(function(objEvent) {\r\n         if (objEvent.keyCode === 13) {\r\n          $tabHeading.click();\r\n         }\r\n        });\r\n   \r\n        \/\/toggle tab panel if click heading (on mobile)\r\n        $tabHeading.click(function() {\r\n          \r\n         \/\/ remove any hidden mobile class\r\n         $tabs.find(\'.responsive-tabs__panel--closed-accordion-only\').removeClass(\'responsive-tabs__panel--closed-accordion-only\');\r\n   \r\n         \/\/ if this isn\'t currently active\r\n         if (!$tabHeading.hasClass(\'responsive-tabs__heading--active\')){\r\n   \r\n          var oldActivePos,\r\n           $activeHeading = $tabs.find(\'.responsive-tabs__heading--active\');\r\n           \r\n          \/\/ if there is an active heading, get its position\r\n          if($activeHeading.length) {\r\n           oldActivePos = $activeHeading.offset().top;\r\n          }\r\n          \r\n          \/\/ close currently active panel and remove active state from any hidden heading\r\n          $tabs.find(\'.responsive-tabs__panel--active\').slideToggle().removeClass(\'responsive-tabs__panel--active\').prev().removeClass(\'responsive-tabs__heading--active\');\r\n          \r\n          \/\/close all tabs\r\n          $tabs.find(\'.responsive-tabs__panel\').hide().attr(\'aria-hidden\',\'true\');\r\n   \r\n          \/\/open this panel\r\n          $tabPanel.slideToggle().addClass(\'responsive-tabs__panel--active\').attr(\'aria-hidden\',\'false\');\r\n   \r\n          \/\/ make this heading active\r\n          $tabHeading.addClass(\'responsive-tabs__heading--active\');\r\n   \r\n          var $currentActive = $tabs.find(\'.responsive-tabs__list__item--active\');\r\n   \r\n          \/\/set the active tab list item (for desktop)\r\n          $currentActive.removeClass(\'responsive-tabs__list__item--active\');\r\n          var panelId = $tabPanel.attr(\'id\');\r\n          var tabId = panelId.replace(\'panel\',\'tab\');\r\n          $(\'#\' + tabId).addClass(\'responsive-tabs__list__item--active\');\r\n   \r\n          \/\/scroll to active heading only if it is below previous one\r\n          var tabsPos = $tabs.offset().top;\r\n          var newActivePos = ($tabHeading.offset().top) - 15;\r\n          if(oldActivePos < newActivePos) {\r\n           $(\'html, body\').animate({ scrollTop: tabsPos }, 0).animate({ scrollTop: newActivePos }, 550);\r\n          }\r\n   \r\n         }\r\n   \r\n         \/\/ if this tab panel is already active\r\n         else {\r\n   \r\n          \/\/ hide panel but give it special responsive-tabs__panel--closed-accordion-only class so that it can be visible at desktop size\r\n          $tabPanel.removeClass(\'responsive-tabs__panel--active\').slideToggle(function () { $(this).addClass(\'responsive-tabs__panel--closed-accordion-only\'); });\r\n   \r\n          \/\/remove active heading class\r\n          $tabHeading.removeClass(\'responsive-tabs__heading--active\');\r\n   \r\n          \/\/don\'t alter classes on tabs as we want it active if put back to desktop size\r\n         }\r\n         \r\n        });\r\n   \r\n        tabcount ++;\r\n       });\r\n   \r\n       \/\/ add finished tab list to its container\r\n       $tabs.prepend($tabList);\r\n       \r\n   \r\n       \/\/ next set of tabs on page\r\n       tablistcount ++;\r\n      });\r\n     }\r\n    };\r\n    \r\n   })(jQuery);\r\n   \r\n<\/script>\r\n<script>\r\n   jQuery(document).ready(function($) {\r\n   \r\n    \/\/ Spoiler\r\n    $(\'body:not(.su-other-shortcodes-loaded)\').on(\'click keypress\', \'.su-spoiler-title\', function(e) {\r\n     var $title = $(this),\r\n      $spoiler = $title.parent(),\r\n      bar = ($(\'#wpadminbar\').length > 0) ? 28 : 0;\r\n     \/\/ Open\/close spoiler\r\n     $spoiler.toggleClass(\'su-spoiler-closed\');\r\n     \/\/ Close other spoilers in accordion\r\n     $spoiler.parent(\'.su-accordion\').children(\'.su-spoiler\').not($spoiler).addClass(\'su-spoiler-closed\');\r\n     \/\/ Scroll in spoiler in accordion\r\n     if ($(window).scrollTop() > $title.offset().top) $(window).scrollTop($title.offset().top - $title.height() - bar);\r\n     e.preventDefault();\r\n    });\r\n    \/\/ Tabs\r\n    $(\'body:not(.su-other-shortcodes-loaded)\').on(\'click keypress\', \'.su-tabs-nav span\', function(e) {\r\n     var $tab = $(this),\r\n      data = $tab.data(),\r\n      index = $tab.index(),\r\n      is_disabled = $tab.hasClass(\'su-tabs-disabled\'),\r\n      $tabs = $tab.parent(\'.su-tabs-nav\').children(\'span\'),\r\n      $panes = $tab.parents(\'.su-tabs\').find(\'.su-tabs-pane\'),\r\n      $gmaps = $panes.eq(index).find(\'.su-gmap:not(.su-gmap-reloaded)\');\r\n     \/\/ Check tab is not disabled\r\n     if (is_disabled) return false;\r\n     \/\/ Hide all panes, show selected pane\r\n     $panes.removeClass(\'su-tabs-pane-open\').eq(index).addClass(\'su-tabs-pane-open\');\r\n     \/\/ Disable all tabs, enable selected tab\r\n     $tabs.removeClass(\'su-tabs-current\').eq(index).addClass(\'su-tabs-current\');\r\n     \/\/ Reload gmaps\r\n     if ($gmaps.length > 0) $gmaps.each(function() {\r\n      var $iframe = $(this).find(\'iframe:first\');\r\n      $(this).addClass(\'su-gmap-reloaded\');\r\n      $iframe.attr(\'src\', $iframe.attr(\'src\'));\r\n     });\r\n     \/\/ Set height for vertical tabs\r\n     tabs_height();\r\n     \/\/ Open specified url\r\n     if (data.url !== \'\') {\r\n      if (data.target === \'self\') window.location = data.url;\r\n      else if (data.target === \'blank\') window.open(data.url);\r\n     }\r\n     e.preventDefault();\r\n    });\r\n   \r\n    \/\/ Activate tabs\r\n    $(\'.su-tabs\').each(function() {\r\n     var active = parseInt($(this).data(\'active\')) - 1;\r\n     $(this).children(\'.su-tabs-nav\').children(\'span\').eq(active).trigger(\'click\');\r\n     tabs_height();\r\n    });\r\n   \r\n    \/\/ Activate anchor nav for tabs and spoilers\r\n    anchor_nav();\r\n   \r\n    \/\/ Lightbox\r\n    $(document).on(\'click\', \'.su-lightbox\', function(e) {\r\n     e.preventDefault();\r\n     e.stopPropagation();\r\n     if ($(this).parent().attr(\'id\') === \'su-generator-preview\') $(this).html(su_other_shortcodes.no_preview);\r\n     else {\r\n      var type = $(this).data(\'mfp-type\');\r\n      $(this).magnificPopup({\r\n       type: type,\r\n       tClose: su_magnific_popup.close,\r\n       tLoading: su_magnific_popup.loading,\r\n       gallery: {\r\n        tPrev: su_magnific_popup.prev,\r\n        tNext: su_magnific_popup.next,\r\n        tCounter: su_magnific_popup.counter\r\n       },\r\n       image: {\r\n        tError: su_magnific_popup.error\r\n       },\r\n       ajax: {\r\n        tError: su_magnific_popup.error\r\n       }\r\n      }).magnificPopup(\'open\');\r\n     }\r\n    });\r\n    \/\/ Frame\r\n    $(\'.su-frame-align-center, .su-frame-align-none\').each(function() {\r\n     var frame_width = $(this).find(\'img\').width();\r\n     $(this).css(\'width\', frame_width + 12);\r\n    });\r\n    \/\/ Tooltip\r\n    $(\'.su-tooltip\').each(function() {\r\n     var $tt = $(this),\r\n      $content = $tt.find(\'.su-tooltip-content\'),\r\n      is_advanced = $content.length > 0,\r\n      data = $tt.data(),\r\n      config = {\r\n       style: {\r\n        classes: data.classes\r\n       },\r\n       position: {\r\n        my: data.my,\r\n        at: data.at,\r\n        viewport: $(window)\r\n       },\r\n       content: {\r\n        title: \'\',\r\n        text: \'\'\r\n       }\r\n      };\r\n     if (data.title !== \'\') config.content.title = data.title;\r\n     if (is_advanced) config.content.text = $content;\r\n     else config.content.text = $tt.attr(\'title\');\r\n     if (data.close === \'yes\') config.content.button = true;\r\n     if (data.behavior === \'click\') {\r\n      config.show = \'click\';\r\n      config.hide = \'click\';\r\n      $tt.on(\'click\', function(e) {\r\n       e.preventDefault();\r\n       e.stopPropagation();\r\n      });\r\n      $(window).on(\'scroll resize\', function() {\r\n       $tt.qtip(\'reposition\');\r\n      });\r\n     } else if (data.behavior === \'always\') {\r\n      config.show = true;\r\n      config.hide = false;\r\n      $(window).on(\'scroll resize\', function() {\r\n       $tt.qtip(\'reposition\');\r\n      });\r\n     } else if (data.behavior === \'hover\' && is_advanced) {\r\n      config.hide = {\r\n       fixed: true,\r\n       delay: 600\r\n      };\r\n     }\r\n     $tt.qtip(config);\r\n    });\r\n   \r\n    \/\/ Expand\r\n    $(\'body:not(.su-other-shortcodes-loaded)\').on(\'click\', \'.su-expand-link\', function() {\r\n     var $this = $(this),\r\n      $container = $this.parents(\'.su-expand\'),\r\n      $content = $container.children(\'.su-expand-content\');\r\n   \r\n     if ($container.hasClass(\'su-expand-collapsed\')) {\r\n      $content.css(\'max-height\', \'none\');\r\n     }\r\n     else {\r\n      $content.css(\'max-height\', $container.data(\'height\') + \'px\');\r\n     }\r\n   \r\n     $container.toggleClass(\'su-expand-collapsed\');\r\n    });\r\n   \r\n    function is_transition_supported() {\r\n     var thisBody = document.body || document.documentElement,\r\n      thisStyle = thisBody.style,\r\n      support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;\r\n   \r\n     return support;\r\n    }\r\n   \r\n    \/\/ Animations is supported\r\n    if (is_transition_supported()) {\r\n     \/\/ Animate\r\n     $(\'.su-animate\').each(function() {\r\n      $(this).one(\'inview\', function(e) {\r\n       var $this = $(this),\r\n        data = $this.data();\r\n       window.setTimeout(function() {\r\n        $this.addClass(data.animation);\r\n        $this.addClass(\'animated\');\r\n        $this.css(\'visibility\', \'visible\');\r\n       }, data.delay * 1000);\r\n      });\r\n     });\r\n    }\r\n    \/\/ Animations isn\'t supported\r\n    else {\r\n     $(\'.su-animate\').css(\'visibility\', \'visible\');\r\n    }\r\n   \r\n    function tabs_height() {\r\n     $(\'.su-tabs-vertical\').each(function() {\r\n      var $tabs = $(this),\r\n       $nav = $tabs.children(\'.su-tabs-nav\'),\r\n       $panes = $tabs.find(\'.su-tabs-pane\'),\r\n       height = 0;\r\n      $panes.css(\'min-height\', $nav.outerHeight(true));\r\n     });\r\n    }\r\n   \r\n    function anchor_nav() {\r\n     \/\/ Check hash\r\n     if (document.location.hash === \'\') return;\r\n     \/\/ Go through tabs\r\n     $(\'.su-tabs-nav span[data-anchor]\').each(function() {\r\n      if (\'#\' + $(this).data(\'anchor\') === document.location.hash) {\r\n       var $tabs = $(this).parents(\'.su-tabs\'),\r\n        bar = ($(\'#wpadminbar\').length > 0) ? 28 : 0;\r\n       \/\/ Activate tab\r\n       $(this).trigger(\'click\');\r\n       \/\/ Scroll-in tabs container\r\n       window.setTimeout(function() {\r\n        $(window).scrollTop($tabs.offset().top - bar - 10);\r\n       }, 100);\r\n      }\r\n     });\r\n     \/\/ Go through spoilers\r\n     $(\'.su-spoiler[data-anchor]\').each(function() {\r\n      if (\'#\' + $(this).data(\'anchor\') === document.location.hash) {\r\n       var $spoiler = $(this),\r\n        bar = ($(\'#wpadminbar\').length > 0) ? 28 : 0;\r\n       \/\/ Activate tab\r\n       if ($spoiler.hasClass(\'su-spoiler-closed\')) $spoiler.find(\'.su-spoiler-title:first\').trigger(\'click\');\r\n       \/\/ Scroll-in tabs container\r\n       window.setTimeout(function() {\r\n        $(window).scrollTop($spoiler.offset().top - bar - 10);\r\n       }, 100);\r\n      }\r\n     });\r\n    }\r\n   \r\n    if (\'onhashchange\' in window) $(window).on(\'hashchange\', anchor_nav);\r\n   \r\n    $(\'body\').addClass(\'su-other-shortcodes-loaded\');\r\n   });\r\n   \r\n<\/script>\r\n<script>jQuery(document).ready(function($) { RESPONSIVEUI.responsiveTabs(); })<\/script>";
  }
  else if(no==2)
  {
    return header="<!doctype html>\r\n<a href=\"https:\/\/1.bp.blogspot.com\/-JElvuAe-fSs\/XoCYCdbuIQI\/AAAAAAAAxfA\/ADTnuw-v5LE_z81tJE0Q_IR6q97LjiRxACPcBGAYYCw\/s1600\/Copy-of-VPN-2.jpg\" imageanchor=\"1\" ><img border=\"0\" src=\"https:\/\/1.bp.blogspot.com\/-JElvuAe-fSs\/XoCYCdbuIQI\/AAAAAAAAxfA\/ADTnuw-v5LE_z81tJE0Q_IR6q97LjiRxACPcBGAYYCw\/s1600\/Copy-of-VPN-2.jpg\" data-original-width=\"560\" data-original-height=\"397\"  style=\"display:none;\" alt=\"First Year KTU Solved Question Papers\"><\/a>\r\n<meta property=\"fb:pages\" content=\"1156506657810335\" \/>\r\n<meta charset=\"UTF-8\">\r\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\r\n<meta name=\"description\" content=\"Solved Question Papers for First year KTU Students are available to download. The Solved Question paper is for S1 - semester 1 And Semester 2 - S2\"\/>\r\n<link rel=\"canonical\" href=\"\/2020\/03\/first-year-ktu-solved-question-papers.html\"\/>\r\n<meta property=\"og:locale\" content=\"en_US\" \/>\r\n<meta property=\"og:type\" content=\"article\" \/>\r\n<meta property=\"og:title\" content=\"Solved Question Papers for First year KTU Students are available to download. The Solved Question paper is for S1 - semester 1 And Semester 2 - S2\" \/>\r\n<meta property=\"og:url\" content=\"\/2020\/03\/first-year-ktu-solved-question-papers.html\" \/>\r\n<meta property=\"og:site_name\" content=\"KtuQBank\" \/>\r\n<meta property=\"article:publisher\" content=\"https:\/\/www.facebook.com\/ktuqbank\/\" \/>\r\n<meta property=\"article:tag\" content=\"btech\" \/>\r\n<meta property=\"article:tag\" content=\"solved\" \/>\r\n<meta property=\"article:tag\" content=\"First Year KTU Solved Question Papers\" \/>\r\n<meta property=\"article:tag\" content=\"answer key\" \/>\r\n<meta property=\"article:tag\" content=\"S1 S2\" \/>\r\n<meta property=\"article:tag\" content=\"paper\" \/>\r\n<meta property=\"article:tag\" content=\"question\" \/>\r\n<meta property=\"article:tag\" content=\"solution\" \/>\r\n<meta property=\"article:tag\" content=\"answer\" \/>\r\n<meta property=\"article:section\" content=\"Btech\" \/>\r\n<meta property=\"article:published_time\" content=\"2017-06-08T21:04:54+05:30\" \/>\r\n<meta property=\"article:modified_time\" content=\"2019-01-31T16:41:20+05:30\" \/>\r\n<meta property=\"og:updated_time\" content=\"2019-01-31T16:41:20+05:30\" \/>\r\n<meta property=\"og:image\" content=\"https:\/\/1.bp.blogspot.com\/-JElvuAe-fSs\/XoCYCdbuIQI\/AAAAAAAAxfA\/ADTnuw-v5LE_z81tJE0Q_IR6q97LjiRxACPcBGAYYCw\/s1600\/Copy-of-VPN-2.jpg\" \/>\r\n<meta name=\"twitter:card\" content=\"summary\" \/>\r\n<meta name=\"twitter:description\" content=\"Solved Question Papers for First year KTU Students are available to download. The Solved Question paper is for S1 - semester 1 And Semester 2 - S2\" \/>\r\n<meta name=\"twitter:title\" content=\"First Year KTU Solved Question Papers\" \/>\r\n<meta name=\"twitter:site\" content=\"@ktuqbank\" \/>\r\n<meta name=\"twitter:image\" content=\"https:\/\/1.bp.blogspot.com\/-JElvuAe-fSs\/XoCYCdbuIQI\/AAAAAAAAxfA\/ADTnuw-v5LE_z81tJE0Q_IR6q97LjiRxACPcBGAYYCw\/s1600\/Copy-of-VPN-2.jpg\" \/>";
  }

 
}
/////////////////////////////////////////////////////////////////////////Generate Spoiler Subject code/////////////////////////////////////////////////////////
function spoilergen(rowyearwise,rows,year,uniquesubjectcode,no)
{ var uniquecodewise=[];

  var number=no+1;
   
  
  if(year==1)
  {
  
  for(var x=0;x<rowyearwise[0].length;x++)
  {
     if(rowyearwise[0][x][4]==uniquesubjectcode)
      {
        subjectname=rowyearwise[0][x][5];
                 
      }
  
  }
  
  var insidecontent="<div class=\"su-spoiler su-spoiler-style-fancy su-spoiler-icon-plus su-spoiler-closed\">\r\n            <div class=\"su-spoiler-title\" tabindex=\"0\" role=\"button\"><span class=\"su-spoiler-icon\"><\/span>"+number+". "+uniquesubjectcode+" "+subjectname+"<\/div>\r\n            <div class=\"su-spoiler-content su-clearfix\">";
  
  
   var count=1;
   for(var x=0;x<rowyearwise[0].length;x++)
    { 
     
     var intercontent="";
    
      if(rowyearwise[0][x][4]==uniquesubjectcode)
      {
      
       uniquecodewise.push(rowyearwise[0][x]);
       var month=rowyearwise[0][x][6].getMonth()+1;
       intercontent=" <b>\r\n                  <p><\/p>\r\n                  <p><a href=\""+rowyearwise[0][x][7]+"\" target=\"_blank\">"+count+". "+rowyearwise[0][x][5]+" "+ month +"/"+rowyearwise[0][x][6].getFullYear()+"<\/a><\/p>\r\n               <\/b>\r\n            ";
       count++;
      }
      
      insidecontent=insidecontent+intercontent
      
    }
  
   insidecontent=insidecontent+"  <\/div>\r\n         <\/div>";
   
  }
  else
  {
      for(var x=0;x<rowyearwise[year-1].length;x++)
       {
          if(rowyearwise[year-1][x][4]==uniquesubjectcode)
            {
              var subjectname=rowyearwise[year-1][x][5];   
            }
       }
       
        var insidecontent="<div class=\"su-spoiler su-spoiler-style-fancy su-spoiler-icon-plus su-spoiler-closed\">\r\n            <div class=\"su-spoiler-title\" tabindex=\"0\" role=\"button\"><span class=\"su-spoiler-icon\"><\/span>"+number+". "+uniquesubjectcode+" "+subjectname+"<\/div>\r\n            <div class=\"su-spoiler-content su-clearfix\">";
  
       var count=1;
   for(var x=0;x<rowyearwise[year-1].length;x++)
    { 
     
     var intercontent="";
    
      if(rowyearwise[year-1][x][4]==uniquesubjectcode)
      {
      
       uniquecodewise.push(rowyearwise[0][x]);
       var month=rowyearwise[year-1][x][6].getMonth()+1;
       intercontent=" <b>\r\n                  <p><\/p>\r\n                  <p><a href=\""+rowyearwise[year-1][x][7]+"\" target=\"_blank\">"+count+". "+rowyearwise[year-1][x][5]+" "+ month +"/"+rowyearwise[year-1][x][6].getFullYear()+"<\/a><\/p>\r\n               <\/b>\r\n            ";
       count++;
      }
      
      insidecontent=insidecontent+intercontent
      
    }
  
   insidecontent=insidecontent+"  <\/div>\r\n         <\/div>";
   
  }
  
  
  return(insidecontent);
}
////////////////////////////////////////////////////////////2/3/4 Year Generation//////////////////////////////////////////////////////////////////////////////
function othergeneration(semsarray,rowyearwise,sems,uniquesem,year,rows,branch,publishid,url,selfLink)
{

  var finalreturn="";
            
  for(var x=0;x<uniquesem.length;x++)
  {
   var accordion="";
   var accordion=" <div class=\"su-note\" style=\"border-color:#c7e5c7;border-radius:3px;-moz-border-radius:3px;-webkit-border-radius:3px;\">\r\n   <div class=\"su-note-inner su-clearfix\" style=\"background-color:#ddffdd;border-color:#f8fff8;color:#000000;border-radius:3px;-moz-border-radius:3px;-webkit-border-radius:3px;\">\r\n <center><h2>"+sems[x]+"</h2></center>      <div class=\"su-accordion\">";
           
    for(var y=0;y<uniquesem[x].length;y++)
    {
    
       accordion=accordion+spoilergen(rowyearwise,rows,year,uniquesem[x][y],y);
    }
    
    accordion=accordion+"  <\/div>\r\n   <\/div>\r\n<\/div>";
    finalreturn=finalreturn+accordion;  
  }
  
   var title=branch+" | Year : "+year+" | KTU Solved Question Papers";
          
          var labels=   [ year,branch,"solved question papers"];
          labels.concat(uniquesem);
          var today = new Date();
          
         
          
          console.log(labels);
         
      var payload={
 "kind": "blogger#post",
 "id": publishid,
 "blog": {
  "id": "2916909995879942251"
 },
 "url": url,
 "selfLink": selfLink,
 "title": title,
        
 "content": customheadergen(year,branch,sems,url)+returnstatic(1)+finalreturn+"<a class=\"item\">\r\n        <div class=\"ui red horizontal label\">Updated On : <\/div>"+ today.getDate()+"/"+(today.getMonth()+1)+"/"+ today.getFullYear()+"\r\n      <\/a>",
 "labels":  labels
};



 if(branch=="Electrical & Electronics"&& year=="2")
          {
              var payload={
 "kind": "blogger#post",
 "id": publishid,
 "blog": {
  "id": "2916909995879942251"
 },
 "url": url,
 "selfLink": selfLink,
 "title": title,
        
 "content": customheadergen(year,branch,sems,url)+returnstatic(1)+finalreturn+"<a class=\"item\">\r\n        <div class=\"ui red horizontal label\">Updated On : <\/div>"+ today.getDate()+"/"+(today.getMonth()+1)+"/"+ today.getFullYear()+"\r\n      <\/a>"
};
          }


       return payload;
    
    
}
  
//////////////////////////////////////////////customheaderset////////////////////////////////////////////////////////////////////////////////////////////////
function customheadergen(year,branch,sems,url)
{
 if(branch=="Computer Science"&&year=="2")
 {
   var thumbnail="https://1.bp.blogspot.com/-tyPpeewwqhs/XoC25h4b50I/AAAAAAAAxfk/kD19HudINcEyK62Q7p_nx_2cMvTqhPsOgCK4BGAsYHg/s560/Copy-of-VPN-1.jpg";
 }
 else if(branch=="Computer Science"&&( year=="3" || year=="4" ))
 {
  var thumbnail="https://3.bp.blogspot.com/-O8Ms7OJKMDQ/XoC_oe9OkLI/AAAAAAAAxfs/VXo98YUjw6QxyoQM4yLddj6dqQufMJpDACPcBGAYYCw/s1600/computer-science-engineering-question-paper-1-year%2B%25282%2529.jpg";
 }
 else if(branch=="Civil Engineering"&&year=="3")
 {
  var thumbnail="https://4.bp.blogspot.com/-VsMeVcwMlcU/XoDLYdDq_zI/AAAAAAAAxgE/BofDcCVykz8_j6T2cnEB6ipsdGlvP68GgCLcBGAsYHQ/s1600/Copy-of-VPN-9.jpg";
 }
  else if(branch=="Electronics & Communication"&&year=="2")
 {
  var thumbnail="https://1.bp.blogspot.com/-aNItWaNdZCs/XoDNKL5uurI/AAAAAAAAxgQ/R8nOkEnBuBAKj9_vdU_YxZaQ2xIZBITXACLcBGAsYHQ/s1600/VPN-2.jpg";
 }
 else if(branch=="Electronics & Communication"&&year=="3")
 {
  var thumbnail="https://1.bp.blogspot.com/-Nh67VVmXIBY/XoDg_2eePCI/AAAAAAAAxg0/wnmcNvAVDawqZgMXfxyxa6KiF1hQ_YlsACLcBGAsYHQ/s1600/Copy-of-VPN-7.jpg";
 }
 else if(branch=="Electrical & Electronics"&&( year=="3" || year=="2" ))
 {
  var thumbnail="https://4.bp.blogspot.com/-KeAM0SjR474/XoDjWPeqlsI/AAAAAAAAxhk/F3yYgpT3SLMdak7PV4MdgXuH6mCZjXiOgCLcBGAsYHQ/s1600/Copy-of-VPN-6.jpg";
 }
 
 var semcon="";
 
 for(var x=0;x<sems.length;x++)
 {
   var semcon=semcon+sems[x]+",";
  
 }
  
  return header="\r\n\r\n\r\n<!doctype html>\r\n<a href=\""+thumbnail+"\" imageanchor=\"1\" ><img border=\"0\" src=\""+thumbnail+"\" data-original-width=\"560\" data-original-height=\"397\"  style=\"display:none;\" alt=\""+branch+" | Year : "+year+" | KTU Solved Question Papers"+"\"><\/a>\r\n<meta property=\"fb:pages\" content=\"1156506657810335\" \/>\r\n<meta charset=\"UTF-8\">\r\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\r\n<meta name=\"description\" content=\"Solved Question Papers for year "+year+" KTU Students are available to download. The Solved Question paper is for "+semcon+" "+branch+"\"\/>\r\n<link rel=\"canonical\" href=\""+url+"\"\/>\r\n<meta property=\"og:locale\" content=\"en_US\" \/>\r\n<meta property=\"og:type\" content=\"article\" \/>\r\n<meta property=\"og:title\" content=\"Solved Question Papers for year "+year+" KTU Students are available to download. The Solved Question paper is for "+semcon+" "+branch+"\" \/>\r\n<meta property=\"og:url\" content=\""+url+"\" \/>\r\n<meta property=\"og:site_name\" content=\"KtuQBank\" \/>\r\n<meta property=\"article:publisher\" content=\"https:\/\/www.facebook.com\/ktuqbank\/\" \/>\r\n<meta property=\"article:tag\" content=\"btech\" \/>\r\n<meta property=\"article:tag\" content=\"solved\" \/>\r\n<meta property=\"article:tag\" content=\""+branch+" | Year : "+year+" | KTU Solved Question Papers"+"\" \/>\r\n<meta property=\"article:tag\" content=\"answer key\" \/>\r\n<meta property=\"article:tag\" content=\""+semcon+"\" \/>\r\n<meta property=\"article:tag\" content=\""+branch+"\" \/>\r\n<meta property=\"article:tag\" content=\"question\" \/>\r\n<meta property=\"article:tag\" content=\"solution\" \/>\r\n<meta property=\"article:tag\" content=\"answer\" \/>\r\n<meta property=\"article:section\" content=\"Btech\" \/>\r\n\r\n<meta property=\"og:image\" content=\""+thumbnail+"\" \/>\r\n<meta name=\"twitter:card\" content=\"summary\" \/>\r\n<meta name=\"twitter:description\" content=\"Solved Question Papers for year "+year+" KTU Students are available to download. The Solved Question paper is for "+semcon+" "+year+" "+branch+"\" \/>\r\n<meta name=\"twitter:title\" content=\""+branch+" | Year : "+year+" | KTU Solved Question Papers"+"\" \/>\r\n<meta name=\"twitter:site\" content=\"@ktuqbank\" \/>\r\n<meta name=\"twitter:image\" content=\""+thumbnail+"\" \/>";
}
