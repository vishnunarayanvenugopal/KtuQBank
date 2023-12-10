ssId="1UmLOX5Sm8H0IDQaeH8SERULxsT4FuDIQqzcZ_TNA_Y4";

function getpublishedpostdata(){
  
  
  
var path="/2020/03/calculus-ma101-ktu-question-papers-2015.html";
var subjectcode="MA101";
  
  
  

var url = "https://www.googleapis.com/blogger/v3/blogs/2916909995879942251/posts/bypath?path="+path+"&key=xxxx";
var options = {
    'method' : 'get'
    };
var response = JSON.parse(UrlFetchApp.fetch(url, options));
console.log(response.id);
console.log(response.url);
console.log(response.selfLink);  
  var publishid=SpreadsheetApp.openById(ssId).getSheets()[0].getRange("O2:O").getValues();
  for(var i=0;i<publishid.length;i++)
      {
        row=i+2;
       if(publishid[i]==subjectcode)
       {
         SpreadsheetApp.getActiveSheet().getRange('P'+row).setValue(response.id);
         SpreadsheetApp.getActiveSheet().getRange('Q'+row).setValue(response.url);
         SpreadsheetApp.getActiveSheet().getRange('R'+row).setValue(response.selfLink);
       }
      }    
  
return(response.link);  
 
}
