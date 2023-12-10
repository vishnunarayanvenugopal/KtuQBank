function doGet(e) 
{
var type=e.parameter.type;
var subjectcode=e.parameter.subjectcode;
  
  if(type=="qp2019")
  {
  return HtmlService.createHtmlOutput(qp(subjectcode,"2019"));
  }
  else
  {
    return HtmlService.createHtmlOutput(qp(subjectcode,"2015"));
  }
}


function doPost(e)
{ 
  var short=e.postData.contents;
  
  var tempshort= JSON.stringify(e.postData.contents);
  var tempshort1=tempshort.match(/parameters(.+?)}/g);
  var tempshort2=(tempshort1[0].replace("\"code","")).match(/\"(.+?)\"/g);
 
  
  if(tempshort2!=null)
  {
    var matchedsubjecode=((tempshort2[1].replace("\"","")).replace("\"","")).replace("\\","");
     var subjectcode=matchedsubjecode.toUpperCase();
  
  }
  else
  {
 
 var tempsubject=short.match(/\"queryText\": \"(.+?)\"/g);
  var temp2=tempsubject[0].replace("\"queryText\": \"/",""); 
 var temp3=temp2.replace("\"queryText\": \"",""); ;  
 var temp4=temp3.replace("\"",""); 
  
    var subjectcode=temp4.toUpperCase();
  }
  
  
  
  
  var tempsubject=short.match(/\"displayName\": \"(.+?)\"/g);


  
  if(tempsubject=="\"displayName\": \"1 . 2019qpbatch - custom\"")
  {
    var body={
  "fulfillmentMessages": [
    {
      "text": {
        "text": [
          qp(subjectcode,"2019")
        ]
      }
    }
  ]
}
    return ContentService.createTextOutput(JSON.stringify(body));
  }
  else if(tempsubject=="\"displayName\": \"2 . 2015batch - custom\"")
  {
    
  var body2={
  "fulfillmentMessages": [
    {
      "text": {
        "text": [
          qp(subjectcode,"2015")
        ]
      }
    }
  ]
}
    return  ContentService.createTextOutput(JSON.stringify(body2));
  }
  else if(tempsubject=="\"displayName\": \"StudyMaterials2019batch - custom\"" && subjectcode!="STATUS")
  {
      var sm2019={
  "fulfillmentMessages": [
    {
      "text": {
        "text": [
          studymaterial(subjectcode,"2019")
        ]
      }
    }
  ]
}
    return  ContentService.createTextOutput(JSON.stringify(sm2019));
  }
  else if(tempsubject=="\"displayName\": \"StudyMaterials2019batch - custom\"" && subjectcode=="STATUS")
  {
      var statussm={
  "fulfillmentMessages": [
    {
      "text": {
        "text": [
          statusgensm2019()
        ]
      }
    }
  ]
}
    return  ContentService.createTextOutput(JSON.stringify(statussm));
  }
  else if(tempsubject=="\"displayName\": \"1 . 2019 batch - fallback\"" || tempsubject=="\"displayName\": \"2 . 2015batch - fallback\"")
  {
     var gsearcheme={
  "fulfillmentMessages": [
    {
      "text": {
        "text": [
          searchFor(subjectcode +" Ktu Question Paper")
        ]
      }
    }
  ]
}
    return  ContentService.createTextOutput(JSON.stringify(gsearcheme));
  }
  else if(tempsubject=="\"displayName\": \"StudyMaterials2019batch - fallback\"" || tempsubject=="\"displayName\": \"StudyMaterials - 2015batch - fallback\"")
  {
    var gsearcheme={
  "fulfillmentMessages": [
    {
      "text": {
        "text": [
          searchFor(subjectcode +" ktu Study Materials")
        ]
      }
    }
  ]
}
    return  ContentService.createTextOutput(JSON.stringify(gsearcheme));
  }
    else if(tempsubject=="\"displayName\": \"Syllabus - 2019 - custom\"")
  {
    var gsearcheme={
  "fulfillmentMessages": [
    {
      "text": {
        "text": [
          syllabus(subjectcode)
        ]
      }
    }
  ]
}
    return  ContentService.createTextOutput(JSON.stringify(gsearcheme));
  }
  else if(tempsubject=="\"displayName\": \"Syllabus - 2015 - fallback\"" || tempsubject=="\"displayName\": \"Syllabus - 2019 - fallback\"")
  {
    var gsearcheme={
  "fulfillmentMessages": [
    {
      "text": {
        "text": [
          searchFor(subjectcode +" ktu syllabus")
        ]
      }
    }
  ]
}
    return  ContentService.createTextOutput(JSON.stringify(gsearcheme));
  }
  else if(tempsubject=="\"displayName\": \"branch+year\"")
  {
    var YearCodegen=JSON.parse(JSON.stringify((JSON.parse(short)).queryResult)).parameters.Years;
    var BranchCodegen=JSON.parse(JSON.stringify((JSON.parse(short)).queryResult)).parameters.Branch;
    var gsearcheme={
  "fulfillmentMessages": [
    {
      "text": {
        "text": [
          subjectcodemessagegenerator(YearCodegen,BranchCodegen)
        ]
      }
    }
  ]
}
   // return  ContentService.createTextOutput(JSON.stringify(tempshort));
    return  ContentService.createTextOutput(JSON.stringify(gsearcheme));
  }
  
  
  function statusgensm2019()
  {
     var status=SpreadsheetApp.openById("1Sjxm5L7K7dYBfevFeSM4dBUPykWKwnmR1AOUKVxMYNo").getSheets()[0].getRange("O2:O").getValues();
    var message="";
    for(var j=0;j<status.filter(String).length;j++)  
    {
      message=message+status[j]+"\r\n\r\n";
    }
    return message;
  }
  
 
  
  
  var type=e.parameter.type;

  
  if(type=="qp2019")
  {
  return ContentService.createTextOutput(qp(subjectcode,"2019"));
  }
  else
  {
    return  ContentService.createTextOutput(qp(subjectcode,"2015"));
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function qp(subjectcode,year)
{
 
  
    if(year=="2019")
    {
       var output=returnmatchedrows("1z72GChPfCrPbuPRDHCKLkWunCewV-pNUG5lxotmLgmc","H2:H",subjectcode);
       var sheetdata=SpreadsheetApp.openById("1z72GChPfCrPbuPRDHCKLkWunCewV-pNUG5lxotmLgmc").getSheets()[0].getDataRange().getValues();
    }
  else
  {
    var output=returnmatchedrows("1UmLOX5Sm8H0IDQaeH8SERULxsT4FuDIQqzcZ_TNA_Y4","H2:H",subjectcode);
       var sheetdata=SpreadsheetApp.openById("1UmLOX5Sm8H0IDQaeH8SERULxsT4FuDIQqzcZ_TNA_Y4").getSheets()[0].getDataRange().getValues();
  }

 var message= "*"+subjectcode + " " + "Question Papers* \r\n ";
  
      for(var j=0;j<=output.filter(String).length-1;j++)
      {
        var qpno=j+1;
      // console.log(sheetdata[output[j]+1]);
        message=message+"\r\n\uD83D\uDCDC  "+"QP No :"+qpno+" "+"*Date :* "+sheetdata[output[j]+1][10]+"\/ "+sheetdata[output[j]+1][11]+" \r\n\r\n\uD83D\uDD17 "+sheetdata[output[j]+1][12]+"\r\n";
        
      } 
       message=message+"\r\n\uD83E\uDD16.   Ktuqbank Bot ";   
 console.log(message);
  return(message);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function studymaterial(subjectcode,year)
{
 
  var classnoterow=[];
    var pdfrow =[];
    var pptrow = [];
    var mod = [];
  
   if(year=="2019")
    {
       var output=returnmatchedrows("1Sjxm5L7K7dYBfevFeSM4dBUPykWKwnmR1AOUKVxMYNo","H2:H",subjectcode);
       var sheetdata=SpreadsheetApp.openById("1Sjxm5L7K7dYBfevFeSM4dBUPykWKwnmR1AOUKVxMYNo").getSheets()[0].getDataRange().getValues();
    }
  else
  {
    
  }
  var message= "\uD83D\uDCDA *"+subjectcode + " " + "Study Materials* \r\n\r\n";
  
  
  for(var i=0;i<=output.filter(String).length-1;i++)
      {
        
        if(sheetdata[output[i]+1][9]=="Printed Note PDF")
        {
          pdfrow.push(output[i]);
         
        }
        else  if(sheetdata[output[i]+1][9]=="Class Notes (Handwritten)")
        {
          classnoterow.push(output[i]);
        
        }
         else  if(sheetdata[output[i]+1][9]=="PPT")
        {
          pptrow.push(output[i]);
         
        }
      }
//console.log(sheetdata[output[i]+1][9]);
  
    var classnoterownew = modulesorting(classnoterow,sheetdata);
    var pptrownew = modulesorting(pptrow,sheetdata);
    var pdfrownew = modulesorting(pdfrow,sheetdata);
  
    var cnotegen=gencontent("Class Notes (Handwritten)",classnoterownew,sheetdata);
    var pdfgen=gencontent("Printed Note PDF",pdfrownew,sheetdata);
    var pptgen=gencontent("PPT",pptrownew,sheetdata);
  
  message=message+cnotegen+pdfgen+pptgen;
  
      
       message=message+"\uD83E\uDD16.   Ktuqbank Bot \r\n\r\n📤 *Upload Notes to Bot* : bit.ly/2zezizk";   
 console.log(message);
  return(message);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function returnmatchedrows(sheetID,range,subjectcode)
{ 
  var rowmatched=[];
  var subjectcodes=SpreadsheetApp.openById(sheetID).getSheets()[0].getRange(range).getValues(); 
  for(var j=0;j<=subjectcodes.filter(String).length;j++)
    {
    if(subjectcodes[j]==subjectcode)
    {
      rowmatched.push(j);
    }
    }
  return(rowmatched);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function modulesorting(pdfrow,fullrowsstudymaterials)
{
  var mod = [];
  
  var mod1 = [];
  var mod2 = [];
  var mod3 = [];
  var mod4 = [];
  var mod5 = [];
  var mod6 = [];
  
    for(var y=0;y<pdfrow.length;y++)
    {
      if(fullrowsstudymaterials[pdfrow[y]+1][10]=="1")
      {
        
        mod1.push(pdfrow[y]+1);
      }
      else if(fullrowsstudymaterials[pdfrow[y]+1][10]=="2")
      {
        
        mod2.push(pdfrow[y]+1);
      }
       else if(fullrowsstudymaterials[pdfrow[y]+1][10]=="3")
      {
        
        mod3.push(pdfrow[y]+1);
      }
       else if(fullrowsstudymaterials[pdfrow[y]+1][10]=="4")
      {
        
        mod4.push(pdfrow[y]+1);
      }
       else if(fullrowsstudymaterials[pdfrow[y]+1][10]=="5")
      {
        
        mod5.push(pdfrow[y]+1);
      }
       else if(fullrowsstudymaterials[pdfrow[y]+1][10]=="6")
      {
        
        mod6.push(pdfrow[y]+1);
      }
    }
  mod.push(mod1,mod2,mod3,mod4,mod5,mod6);
  console.log(mod);
  return mod;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function gencontent(type,modarray,sheetdata)
{
 
 
  var modulearr="\uD83D\uDC68\u200D\uD83C\uDF93 *"+type+"*\r\n\r\n";
  
  for(var l=0;l<modarray.length;l++)       // module wise array iteration
   {
     var spoiler="";
     var append="";
     for(var m=0;m<modarray[l].length;m++)   //individual module location iteration
     {
       var num=m+1;
       spoiler=spoiler+"\u2763\uFE0F "+num+" "+sheetdata[modarray[l][m]][11]+"\r\n\r\n";
       
    // console.log(spoiler);
     }
     var moduleno=l+1;
     if(modarray[l].length>0)
     {
       var append="\uD83D\uDC49 *Module "+moduleno+"*\r\n\r\n"+spoiler;
     }
    
     modulearr=modulearr+append;
   }
  //console.log(modulearr);
  return modulearr;

  
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function syllabus(subjectcode)
{
  
  var row=returnmatchedrows("1tf2ufh4aBYHUbCLm6vpcvEGWP-jz5_8mtci5x5EXfpo","D2:D",subjectcode);
  
  var subjectname=SpreadsheetApp.openById("1tf2ufh4aBYHUbCLm6vpcvEGWP-jz5_8mtci5x5EXfpo").getSheets()[0].getRange("E2:E").getValues();
  var url=SpreadsheetApp.openById("1tf2ufh4aBYHUbCLm6vpcvEGWP-jz5_8mtci5x5EXfpo").getSheets()[0].getRange("F2:F").getValues();
  var subjectcode=SpreadsheetApp.openById("1tf2ufh4aBYHUbCLm6vpcvEGWP-jz5_8mtci5x5EXfpo").getSheets()[0].getRange("D2:D").getValues();

  var message="\uD83D\uDCF2 *Syllabus : "+subjectname[row[0]]+" "+subjectcode[row[0]]+"*\r\n\r\n\uD83D\uDD16 "+url[row[0]]+"\r\n\r\n\uD83E\uDD16 Bot";
  return message;
  
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function searchenginegen(twod,key)
{
 
// var heading=twod[0];
// var content=twod[1];
  
  var message="🌐 *Web Search :* "+key+"\r\n\r\n";

 for(var j=0;j<5;j++)
 {
   message=message+"\uD83D\uDD16 *"+twod[j].title+"* \r\n\r\n";
   message=message+"\uD83D\uDCCC "+twod[j].link+" \r\n\r\n";
   
 }
  message=message+"\uD83E\uDD16.   Bot ";
 
 return message;
 
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Use Google's customsearch API to perform a search query.
 * See https://developers.google.com/custom-search/json-api/v1/using_rest.
 *
 * @param {string} query   Search query to perform, e.g. "test"
 *
 * returns {object}        See response data structure at
 *                         https://developers.google.com/custom-search/json-api/v1/reference/cse/list#response
 */
function searchFor(query) {

  // Base URL to access customsearch
  var urlTemplate = "https://www.googleapis.com/customsearch/v1?key=xxxxxx";

  // Script-specific credentials & search engine
  var ApiKey = "xxxxxx";
  var searchEngineID = "xxxxxx";

  // Build custom url
  var url = urlTemplate
    .replace("%KEY%", encodeURIComponent(ApiKey))
    .replace("%CX%", encodeURIComponent(searchEngineID))
    .replace("%Q%", encodeURIComponent(query));

  var params = {
    muteHttpExceptions: true
  };

  // Perform search
  console.log( UrlFetchApp.getRequest(url, params) );  // Log query to be sent
  var response = UrlFetchApp.fetch(url, params);
  var respCode = response.getResponseCode();
  
  
  if (respCode !== 200) {
    return("Google Search Down. Try contents already in Me");
  }
 
    // Successful search, log & return results
    var result = JSON.parse(response.getContentText());
   // console.log( "Obtained %s search results in %s seconds.",
               result.items[0].title;
               result.items[0].link;
    //return (result.items.slice(0, 4),query);
  
 // console.log(searchenginegen(result.items.slice(0, 5),query));
  return(searchenginegen(result.items.slice(0, 5),query));
}
///////////////////////////////////////////////////////<------- SUBJECT CODE GENERATION --->>>//////////////////////////////////////////////////////////////////
function subjectcodemessagegenerator(Semester,BranchCode)
{console.log("Start")
  curriculumDataID="1JLuI-8pxINuJG93cMt-g1Uf32Dd9-gvQZxY56oYg8BY";
 
 var fullsheetmain=SpreadsheetApp.openById(curriculumDataID).getSheets()[0].getDataRange().getValues();
 var fullsheetVAC=SpreadsheetApp.openById(curriculumDataID).getSheets()[1].getDataRange().getValues();
 
// console.log(fullsheetmain);
 
  var status=[];
  var statusvac=[];
  
  var slots=[];
  var uniqcode=[];
  var subnames=[];
  var credits=[];

var vacslot=[];
var vacuniqcode=[];
var vacsubnames=[];
var vacbasket=[];
var vaccredits=[];
var vactype=[];
 
  var subjectcodessheet=[];
  var subjectcodevacsheet=[];
 
  for(var f=1;f<fullsheetmain.length;f++)
    {
       status.push(fullsheetmain[f][5]);
       slots.push(fullsheetmain[f][3]);
      subnames.push(fullsheetmain[f][6]);
      credits.push(fullsheetmain[f][9]);
      uniqcode.push(fullsheetmain[f][6]);
    }
  
   for(var f=1;f<fullsheetVAC.length;f++)
    {
       statusvac.push(fullsheetVAC[f][4]);
       vacslot.push(fullsheetVAC[f][3]);
      vacsubnames.push(fullsheetVAC[f][5]);
      vacbasket.push(fullsheetVAC[f][8]);
      vaccredits.push(fullsheetVAC[f][7]);
      vactype.push(fullsheetVAC[f][9]);
    }
  
  subnames=subnames.filter(String);
  slots= slots.filter(String);
  status= status.filter(String);
 credits= credits.filter(String);
 statusvac=statusvac.filter(String);
 vacslot=vacslot.filter(String);
 vacsubnames=vacsubnames.filter(String);
 vacbasket=vacbasket.filter(String);
 vaccredits=vaccredits.filter(String);
 vactype=vactype.filter(String);
  
  
  var main=[];
  
  var Branches=["Computer Science Engineering","Mechanical Engineering","Civil Engineering","Electrical And Electronics Engineering","Electronics And Communication Engineering","Information Technology","Applied Electronics And Instrumentation","Biotechnology Engineering","Biomedical Engineering","Instrumentation & Control Engineering","Aeronautical Engineering","Automobile Engineering","Chemical Engineering","Electronics And Biomedical Engineering","Food Technology","Industrial Engineering","Mechanical (Automobile) Engineering","Mechanical Production Engineering","Mechatronics","Metallurgical & Materials Engineering","Naval Architecture & Ship building","Polymer Engineering","Production Engineering","Robotics & Automation","Safety & Fire Engineering"];
var branchshortcode=["CST","MET","CET","EET","ECT","ITT","AET","BTT","BMT","ICT","AOT","AUT","CHT","EBT","FTT","IET","MUT","MPT","MRT","MTT","SBT","POT","PET","RAT","FST"];

  
   var ComputerScienceEngineering=[["MAT101","PHT100","CYT100","EST100","EST110","EST120","EST130","HUN101","PHL120","CYL120","ESL120","ESL130"],["MAT102","PHT100","CYT100","EST100","EST110","EST120","EST130","HUN102","EST102","PHL120","CYL120","ESL120","ESL130"],["MAT203","CST201","CST203","CST205","EST200","HUT200","MCN201","CSL201","CSL203",[["CST281"],["CST283"],["CST285"]]],["MAT206","CST202","CST204","CST206","EST200","HUT200","MCN202","CSL202","CSL204",[["CST282"],["CST284"],["CST286"],["CST292"],["CST294"],["CST296"]]],["CST301","CST303","CST305","CST307","CST309","MCN301","CSL331","CSL333","VACS55"],["CST302","CST304","CST306",["CST312","CST322","CST332","CST342","CST352","CST362","CST372"],"HUT300","CST308","CSL332","CSD334","VACS66"],["CST401",["CST413","CST423","CST433","CST443","CST453","CST463","CST473"],["CST415","CST425","CST435","CST445","CST455"],"MCN401","CSL411","CSQ413","CSD415","VACS77"],["CST402",["CST414","CST424","CST434","CST444","CST454","CST464","CST474"],["CST416","CST426","CST436","CST446","CST456","CST466","CST476"],["CST418","CST428","CST438","CST448","CST458","CST468","CST478"],"CST404","CSD416","VACS88"]];
  var MechanicalEngineering=[["MAT101","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN101","PHL120","CYL120","ESL120","ESL130"],["MAT102","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN102","EST102","PHL120","CYL120","ESL120","ESL130"],["MAT201","MET201","MET203","MET205","EST200","HUT200","MCN201","MEL201","MEL203",[["MET281"],["MET283"],["MET285"]]],["MAT202","MET202","MET204","MET206","EST200","HUT200","MCN202","MEL202","MEL204",[["MET282"],["MET284"],["MET286"],["MET292"],["MET294"],["MET296"]]],["MET301","MET303","MET305","MET307","HUT300","HUT310","MCN301","MEL331","MEL333","VACS55"],["MET302","MET304","MET306",["MET312","MET322","MET332","MET342","MET352","MET362","MET372"],"HUT300","HUT310","MET308","MEL332","MEL334","VACS66"],["MET401",["MET413","MET423","MET433","MET443","MET453","MET463","MET473"],["MET415","MET425","MET435","MET445","MET455"],"MCN401","MEL411","MEQ413","MED415","VACS77"],["MET402",["MET414","MET424","MET434","MET444","MET454","MET464","MET474"],["MET416","MET426","MET436","MET446","MET456","MET466","MET476"],["MET418","MET428","MET438","MET448","MET458","MET468","MET478"],"MET404","MED416","VACS88"]];
  var CivilEngineering=[["MAT101","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN101","PHL120","CYL120","ESL120","ESL130"],["MAT102","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN102","EST102","PHL120","CYL120","ESL120","ESL130"],["MAT201","CET201","CET203","CET205","EST200","HUT200","MCN201","CEL201","CEL203",[["CET281"],["CET283"],["CET285"]]],["MAT202","CET202","CET204","CET206","EST200","HUT200","MCN202","CEL202","CEL204",[["CET282"],["CET284"],["CET286"],["CET292"],["CET294"],["CET296"]]],["CET301","CET303","CET305","CET307","CET309","MCN301","CEL331","CEL333","VACS55"],["CET302","CET304","CET306",["CET312","CET322","CET332","CET342","CET352","CET362","CET372"],"HUT300","CET308","CEL332","CEL334","VACS66"],["CET401",["CET413","CET423","CET433","CET443","CET453","CET463","CET473"],["CET415","CET425","CET435","CET445","CET455","CET465"],"MCN401","CEL411","CEQ413","CED415","VACS77"],["CET402",["CET414","CET424","CET434","CET444","CET454","CET464","CET474"],["CET416","CET426","CET436","CET446","CET456","CET466","CET476"],["CET418","CET428","CET438","CET448","CET458","CET468","CET478"],"CET404","CED416","VACS88"]];
  var ElectricalElectronics=[["MAT101","PHT100","CYT100","EST100","EST110","EST120","EST130","HUN101","PHL120","CYL120","ESL120","ESL130"],["MAT102","PHT100","CYT100","EST100","EST110","EST120","EST130","HUN102","EST102","PHL120","CYL120","ESL120","ESL130"],["MAT201","EET201","EET203","EET205","EST200","HUT200","MCN201","EEL201","EEL203",[["EET281"],["EET283"],["EET285"]]],["MAT204","EET202","EET204","EET206","EST200","HUT200","MCN202","EEL202","EEL204",[["EET282"],["EET284"],["EET286"],["EET292"],["EET294"],["EET296"]]],["EET301","EET303","EET305","EET307","HUT300","HUT310","MCN301","EEL331","EEL333","VACS55"],["EET302","EET304","EET306",["EET312","EET322","EET332","EET342","EET352","EET362","EET372"],"HUT300","HUT310","EET308","EEL332","EEL334","VACS66"],["EET401",["EET413","EET423","EET433","EET443","EET453","EET463","EET473"],["EET415","EET425","EET435","EET445","EET455"],"MCN401","EEL411","EEQ413","EED415","VACS77"],["EET402",["EET414","EET424","EET434","EET444","EET454","EET464","EET474"],["EET416","EET426","EET436","EET446","EET456","EET466","EET476"],["EET418","EET428","EET438","EET448","EET458","EET468","EET478"],"EET404","EED416","VACS88"]];  var main = [];
  var ElectronicsCommunication=[["MAT101","PHT100","CYT100","EST100","EST110","EST120","EST130","HUN101","PHL120","CYL120","ESL120","ESL130"],["MAT102","PHT100","CYT100","EST100","EST110","EST120","EST130","HUN102","EST102","PHL120","CYL120","ESL120","ESL130"],["MAT201","ECT201","ECT203","ECT205","EST200","HUT200","MCN201","ECL201","ECL203",[["ECT281"],["ECT283"],["ECT285"]]],["MAT204","ECT202","ECT204","ECT206","EST200","HUT200","MCN202","ECL202","ECL204",[["ECT282"],["ECT284"],["ECT286"],["ECT292"],["ECT294"],["ECT296"]]],["ECT301","ECT303","ECT305","ECT307","HUT300","HUT310","MCN301","ECL331","ECL333","VACS55"],["ECT302","ECT304","ECT306",["ECT312","ECT322","ECT332","ECT342","ECT352","ECT362","ECT372"],"HUT300","HUT310","ECT308","ECL332","ECD334","VACS66"],["ECT401",["ECT413","ECT423","ECT433","ECT443","ECT453","ECT463","ECT473"],["ECT415","ECT425","ECT435","ECT445","ECT455"],"MCN401","ECL411","ECQ413","ECD415","VACS77"],["ECT402",["ECT414","ECT424","ECT434","ECT444","ECT454","ECT464","ECT474"],["ECT416","ECT426","ECT436","ECT446","ECT456","ECT466","ECT476"],["ECT418","ECT428","ECT438","ECT448","ECT458","ECT468","ECT478"],"ECT404","ECD416","VACS88"]];
  var InformationTechnology=[["MAT101","PHT100","CYT100","EST100","EST110","EST120","EST130","HUN101","PHL120","CYL120","ESL120","ESL130"],["MAT102","PHT100","CYT100","EST100","EST110","EST120","EST130","HUN102","EST102","PHL120","CYL120","ESL120","ESL130"],["MAT203","ITT201","ITT203","ITT205","EST200","HUT200","MCN201","ITL201","ITL203",[["ITT281"],["ITT283"],["ITT285"]]],["MAT208","ITT202","ITT204","ITT206","EST200","HUT200","MCN202","ITL202","ITL204",[["ITT282"],["ITT284"],["ITT286"],["ITT292"],["ITT294"],["ITT296"]]],["ITT301","ITT303","ITT305","ITT307","ITT309","MCN301","ITL331","ITL333","VACS55"],["ITT302","ITT304","ITT306",["ITT312","ITT322","ITT332","ITT342","ITT352","ITT362","ITT372"],"HUT300","ITT308","ITL332","ITD334","VACS66"],["ITT401",["ITT413","ITT423","ITT433","ITT443","ITT453","ITT463","ITT473"],["ITT415","ITT425","ITT435","ITT445"],"MCN401","ITL411","ITQ413","ITD415","VACS77"],["ITT402",["ITT414","ITT424","ITT434","ITT444","ITT454","ITT464","IIT474"],["ITT416","ITT426","ITT436","ITT446","ITT456","ITT466","ITT476"],["ITT418","ITT428","ITT438","ITT448","ITT458","ITT468","ITT478"],"ITT404","ITD416","VACS88"]];
  var AppliedElectronicsInstrumentation=[["MAT101","PHT100","CYT100","EST100","EST110","EST120","EST130","HUN101","PHL120","CYL120","ESL120","ESL130"],["MAT102","PHT100","CYT100","EST100","EST110","EST120","EST130","HUN102","EST102","PHL120","CYL120","ESL120","ESL130"],["MAT201","ECT201","ECT203","ECT205","EST200","HUT200","MCN201","ECL201","ECL203",[["AET281"],["AET283"],["AET285"]]],["MAT204","ECT202","ECT204","AET206","EST200","HUT200","MCN202","ECL202","AEL204",[["AET282"],["AET284"],["AET286"],["AET292"],["AET294"],["AET296"]]],["AET301","AET303","AET305","AET307","HUT300","HUT310","MCN301","AEL331","AEL333","VACS55"],["AET302","AET304","AET306",["ECT312","AET322","AET332","AET342","AET352","AET362","AET372"],"HUT300","HUT310","AET308","AEL332","AED334","VACS66"],["AET401",["AET413","AET423","AET433","AET443","AET453","AET463","AET473"],["AET415","AET425","AET435","AET445"],"MCN401","AEL411","AEQ413","AED415","VACS77"],["AET402",["AET414","AET424","AET434","AET444","AET454","AET464","AET474"],["AET416","AET426","AET436","AET446","AET456","AET466","AET476"],["ECT418","AET428","AET438","AET448","AET458","AET468","AET478"],"AET404","AED416","VACS88"]];
  var BioTechnology=[["MAT101","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN101","PHL120","CYL120","ESL120","ESL130"],["MAT102","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN102","EST102","PHL120","CYL120","ESL120","ESL130"],["MAT201","BTT201","BTT203","BTT205","EST200","HUT200","MCN201","BTL201","BTL203",[["BTT281"],["BTT283"],["BTT285"]]],["MAT202","BTT202","BTT204","BTT206","EST200","HUT200","MCN202","BTL202","BTL204",[["BTT282"],["BTT284"],["BTT286"],["BTT292"],["BTT294"],["BTT296"]]],["BTT301","BTT303","BTT305","BTT307","HUT300","HUT310","MCN301","BTL331","BTL333","VACS55"],["BTT302","BTT304","BTT306",["BTT312","BTT322","BTT332","BTT342","BTT352","BTT362"],"HUT300","HUT310","BTT308","BTL332","BTL334","VACS66"],["BTT401",["BTT413","BTT423","BTT433","BTT443","BTT453","BTT463"],["BTT415","BTT425","BTT435","BTT445","BTT455"],"MCN401","BTL411","BTQ413","BTD415","VACS77"],["BTT402",["BTT414","BTT424","BTT434","BTT444","BTT454","BTT464"],["BTT416","BTT426","BTT436","BTT446","BTT456","BTT466"],["BTT418","BTT428","BTT438","BTT448","BTT458","BTT468"],"BTT404","BTD416","VACS88"]];
  var BioMedical=[["MAT101","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN101","PHL120","CYL120","ESL120","ESL130"],["MAT102","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN102","EST102","PHL120","CYL120","ESL120","ESL130"],["MAT201","BMT201","BMT203","BMT205","EST200","HUT200","MCN201","BML201","BML203",[["BMT281"],["BMT283"],["BMT285"]]],["MAT202","BMT202","BMT204","BMT206","EST200","HUT200","MCN202","BML202","BML204",[["BMT282"],["BMT284"],["BMT286"],["BMT292"],["BMT294"],["BMT296"]]],["BMT301","BMT303","BMT305","BMT307","HUT300","HUT310","MCN301","BML331","BML333","VACS55"],["BMT302","BMT304","BMT306",["BMT312","BMT322","BMT332","BMT342","BMT352","BMT362","BMT372"],"HUT300","HUT310","BMT308","BML332","BMD334","VACS66"],["BMT401",["BMT413","BMT423","BMT433","BMT443","BMT453","BMT463","BMT473"],["BMT415","BMT425","BMT435","BMT445"],"MCN401","BML411","BMQ413","BMD415","VACS77"],["BMT402",["BMT414","BMT424","BMT434","BMT444","BMT454","BMT464","BMT474"],["BMT416","BMT426","BMT436","BMT446","BMT456","BMT466","BMT476"],["BMT418","BMT428","BMT438","BMT448","BMT458","BMT468","BMT478"],"BMT404","BMD416","VACS88"]];
  var IntrumentationAndControlEngineering=[["MAT101","PHT100","CYT100","EST100","EST110","EST120","EST130","HUN101","PHL120","CYL120","ESL120","ESL130"],["MAT102","PHT100","CYT100","EST100","EST110","EST120","EST130","HUN102","EST102","PHL120","CYL120","ESL120","ESL130"],["MAT201","ICT201","ICT203","ICT205","EST200","HUT200","MCN201","ICL201","ICL203",[["ICT281"],["ICT283"]]],["MAT202","ICT202","ICT204","ICT206","EST200","HUT200","MCN202","ICL202","ICL204",[["ICT282"],["ICT284"],["ICT292"],["ICT294"]]],["ICT301","ICT303","ICT305","ICT307","HUT300","HUT310","MCN301","ICL331","ICL333","VACS55"],["ICT302","ICT304","ICT306",["ICT312","ICT322","ICT332","ICT342","ICT352","ICT362","ICT372"],"HUT300","HUT310","ICT308","ICL332","ICD334","VACS66"],["ICT401",["ICT413","ICT423","ICT433","ICT443","ICT453","ICT463","ICT473"],["ICT415","ICT425","ICT435"],"MCN401","ICL411","ICQ413","ICD415","VACS77"],["ICT402",["ICT414","ICT424","ICT434","ICT444","ICT454","ICT464","ICT474"],["ICT416","ICT426","ICT436","ICT446","ICT456","ICT466","ICT476"],["ICT418","ICT428","ICT438","ICT448","ICT458","ICT468","ICT478"],"ICT404","ICD416","VACS88"]];
  var AeronauticalEngineering=[["MAT101","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN101","PHL120","CYL120","ESL120","ESL130"],["MAT102","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN102","EST102","PHL120","CYL120","ESL120","ESL130"],["MAT201","AOT201","MET203","AOT205","EST200","HUT200","MCN201","AOL201","AOL203",[["AOT281"],["AOT281"],["AOT281"]]],["MAT202","AOT202","AOT204","AOT206","EST200","HUT200","MCN202","AOL202","AOL204",[["AOT282"],["AOT284"],["AOT286"],["AOT292"],["AOT294"],["AOT296"]]],["AOT301","AOT303","AOT305","AOT307","HUT300","HUT310","MCN301","AOL331","AOL333","VACS55"],["AOT302","AOT304","AOT306",["AOT312","AOT322","AOT332","AOT342","AOT352","AOT362","AOT372"],"HUT300","HUT310","AOT308","AOL332","AOD334","VACS66"],["AOT401",["AOT413","AOT423","AOT433","AOT443","AOT453","AOT463","AOT473"],["AOT415","AOT425","AOT435","AOT445"],"MCN401","AOL411","AOQ413","AOD415","VACS77"],["AOT402",["AOT414","AOT424","AOT434","AOT444","AOT454","AOT464","AOT474"],["AOT416","AOT426","AOT436","AOT446","AOT456","AOT466","AOT476"],["AOT418","AOT428","AOT438","AOT448","AOT458","AOT468","AOT478"],"AOT404","AOD416","VACS88"]];
  var AutomobileEngineering=[["MAT101","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN101","PHL120","CYL120","ESL120","ESL130"],["MAT102","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN102","EST102","PHL120","CYL120","ESL120","ESL130"],["MAT201","MET201","AUT201","AUT203","EST200","HUT200","MCN201","AUL201","MEL203",[["AUT281"]]],["MAT202","AUT202","AUT204","AUT206","EST200","HUT200","MCN202","MEL202","AUL202",[["AUT282"],["AUT292"]]],["AUT301","AUT303","AUT305","AUT307","HUT300","HUT310","MCN301","MUL331","MEL333","VACS55"],["MET302","AUT304","AUT306",["AUT312","AUT322","AUT332","AUT342","AUT352","AUT362","AUT372"],"HUT300","HUT310","AUT308","MEL332","AUL334","VACS66"],["AUT401",["AUT413","AUT423","AUT433","AUT443","AUT453","AUT463","AUT473"],["AUT415","AUT425","AUT435","AUT445","AUT455"],"MCN401","AUL411","AUQ413","AUD415","VACS77"],["AUT402",["AUT414","AUT424","AUT434","AUT444","AUT454","AUT464","AUT474"],["AUT416","AUT426","AUT436"],["AUT418","AUT428","AUT438","AUT448","AUT458","AUT468","AUT478"],"AUT404","AUD416","VACS88"]];
  var ChemicalEngineering=[["MAT101","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN101","PHL120","CYL120","ESL120","ESL130"],["MAT102","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN102","EST102","PHL120","CYL120","ESL120","ESL130"],["MATTTT","CHT201","CHT203","CHT205","EST200","HUT200","MCN201","CHL201","CHL203",[["CHT281"]]],["MATTTT","CHT202","CHT204","CHT206","EST200","HUT200","MCN202","CHL202","CHL204",[["CHT282"],["CHT284"],["CHT286"],["CHT292"],["CHT294"],["CHT296"]]],["CHT301","CHT303","CHT305","CHT307","HUT300","HUT310","MCN301","CHL331","CHL333","VACS55"],["CHT302","CHT304","CHT306",["CHT312","CHT322","CHT332","CHT342","CHT352","CHT362","CHT372"],"HUT300","HUT310","CHT308","CHL332","CHL334","VACS66"],["CHT401",["CHT413","CHT423","CHT433","CHT443","CHT453","CHT463","CHT473"],["CHT415","CHT425","CHT435","CHT445"],"MCN401","CHL411","CHQ413","CHD415","VACS77"],["CHT402",["CHT414","CHT424","CHT434","CHT444","CHT454","CHT464","CHT474"],["CHT416","CHT426","CHT436","CHT446","CHT456","CHT466","CHT476"],["CHT418","CHT428","CHT438","CHT448","CHT458","CHT468","CHT478"],"CHT404","CHD416","VACS88"]];
  var ElectronicsandBiomedicalEngineering=[["MAT101","PHT100","CYT100","EST100","EST110","EST120","EST130","HUN101","PHL120","CYL120","ESL120","ESL130"],["MAT102","PHT100","CYT100","EST100","EST110","EST120","EST130","HUN102","EST102","PHL120","CYL120","ESL120","ESL130"],["MAT201","EBT201","EBT203","EBT205","EST200","HUT200","MCN201","EBL201","EBL203",[["EBT281"],["EBT283"],["EBT285"]]],["MAT204","EBT202","EBT204","EBT206","EST200","HUT200","MCN202","EBL202","EBL204",[["EBT282"],["EBT284"],["EBT286"],["EBT292"],["EBT294"],["EBT296"]]],["EBT301","EBT303","EBT305","EBT307","HUT300","HUT310","MCN301","EBL331","EBL333","VACS55"],["EBT302","EBT304","EBT306",["EBT312","EBT322","EBT332","EBT342","EBT352","EBT362","EBT372"],"HUT300","HUT310","EBT308","EBL332","EBD334","VACS66"],["EBT401",["EBT413","EBT423","EBT433","EBT443","EBT453","EBT463","EBT473"],["EBT415","EBT425","EBT435","EBT445"],"MCN401","EBL411","EBQ413","EBD415","VACS77"],["EBT402",["EBT414","EBT424","EBT434","EBT444","EBT454","EBT464","EBT474"],["EBT416","EBT426","EBT436","EBT446","EBT456","BMT466","EBT476"],["EBT418","EBT428","EBT438","EBT448","EBT458","EBT468","EBT478"],"EBT404","EBD416","VACS88"]];
  var FoodTechnology=[["MAT101","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN101","PHL120","CYL120","ESL120","ESL130"],["MAT102","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN102","EST102","PHL120","CYL120","ESL120","ESL130"],["MAT201","FTT201","FTT203","FTT205","EST200","HUT200","MCN201","FTL201","FTL203",[["FTT281"],["FTT283"],["FTT285"]]],["MAT202","FTT202","FTT204","FTT206","EST200","HUT200","MCN202","FTL202","FTL204",[["FTT282"],["FTT284"],["FTT286"],["FTT292"],["FTT294"],["FTT296"]]],["FTT301","FTT303","FTT305","FTT307","HUT300","HUT310","MCN301","FTL331","FTL333","VACS55"],["FTT302","FTT304","FTT306",["FTT312","FTT322","FTT332","FTT342","FTT352","FTT362","FTT372"],"HUT300","HUT310","FTT308","FTL332","FTD334","VACS66"],["FTT401",["FTT413","FTT423","FTT433","FTT443","FTT453","FTT463","FTT473"],["FTT415","FTT425","FTT435","FTT445"],"MCN401","FTL411","FTQ413","FTD415","VACS77"],["FTT402",["FTT414","FTT424","FTT434","FTT444","FTT454","FTT464","FTT474"],["FTT416","FTT426","FTT436","FTT446","FTT456","FTT466","FTT476"],["FTT418","FTT428","FTT438","FTT448","FTT458","FTT468","FTT478"],"FTT404","FTD416","VACS88"]];
  var IndustrialEngineering=[["MAT101","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN101","PHL120","CYL120","ESL120","ESL130"],["MAT102","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN102","EST102","PHL120","CYL120","ESL120","ESL130"],["MAT201","IET201","IET203","IET205","EST200","HUT200","MCN201","IEL201","MEL203",[["IET281"]]],["MAT212","IET202","IET204","IET206","EST200","HUT200","MCN202","IEL202","IEL204",[["IET282"],["IET292"],["IET294"]]],["IET301","IET303","IET305","IET307","HUT300","HUT310","MCN301","IEL331","IEL333","VACS55"],["IET302","IET304","IET306",["MET312","IET322","MET332","MET342","MET352","MET362","MET372"],"HUT300","HUT310","IET308","IEL332","IEL334","VACS66"],["IET401",["MET413","IET423","MET433","IET443","MET453","IET463","IET473"],["IET415","IET425","IET435","IET445","IET455"],"MCN401","IEL411","IEQ413","IED415","VACS77"],["IET402",["IET414","MET424","IET434","IET444","IET454","MET464","IET474"],["MET416","MET426","IET436","IET446","MET456","MET466","IET476"],["MET418","MET428","IET438","IET448","IET458","MET468","IET478"],"IET404","IED416","VACS88"]];
  var MechanicalAutomobileengineering=[["MAT101","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN101","PHL120","CYL120","ESL120","ESL130"],["MAT102","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN102","EST102","PHL120","CYL120","ESL120","ESL130"],["MAT201","MUT201","MUT203","MET205","EST200","HUT200","MCN201","MEL201","MUL203",[["MUT281"]]],["MAT202","MET202","MUT204","MUT206","EST200","HUT200","MCN202","MUL202","MUL204",[["AUT282"],["MUT292"]]],["MUT301","AUT303","MUT305","MUT307","HUT300","HUT310","MCN301","MUL331","MEL333","VACS55"],["AUT302","MUT304","MUT306",["MUT312","MET312","MUT322","MUT332","MUT342","MUT362","MUT372"],"HUT300","HUT310","MUT308","MEL332","MUL332","VACS66"],["MUT401",["MUT413","MUT423","MUT433","MUT443","MET423","MUT463","MUT473"],["MUT415","MUT425","MUT435","MUT445","MUT455"],"MCN401","MUL411","MUQ413","MUD415","VACS77"],["MUT402",["MUT414","MET434","MUT434","MUT444","MET464","MUT464","MUT474"],["MUT416","MUT426","MUT436","MUT446"],["MET468","MUT428","MUT438","MUT448","MUT458","MUT468","MUT478"],"MUT404","MUD416","VACS88"]];
  var MechanicalProductionEngineering=[["MAT101","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN101","PHL120","CYL120","ESL120","ESL130"],["MAT102","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN102","EST102","PHL120","CYL120","ESL120","ESL130"],["MAT201","MET201","MPT203","MET205","EST200","HUT200","MCN201","MPL201","MEL203",[["MPT281"]]],["MAT202","MPT202","MET204","MPT206","EST200","HUT200","MCN202","MEL202","MPL204",[["MPT282"],["MPT292"],["MPT294"]]],["MPT301","MPT303","MET305","MPT307","HUT300","HUT310","MCN301","MPL331","MPL333","VACS55"],["MPT302","MPT304","MPT306",["MPT312","MPT322","MPT332","MPT342","MPT352","MET312","MET352"],"HUT300","HUT310","MPT308","MEL332","MPL334","VACS66"],["MPT401",["MPT413","MPT423","MPT433","MPT443","MPT453","MET433","MET473"],["MPT415","MPT435","MPT445","MET425"],"MCN401","MPL411","MPQ413","MPD415","VACS77"],["MET402",["MPT414","MPT424","MPT434","MPT444","MPT454","MPT464","MPT474"],["MPT416","MPT426","MPT436","MPT446","MPT456","MPT466","MPT476"],["MPT418","MPT428","MPT438","MPT448","MPT458","MET458","MET478"],"MPT404","MPD416","VACS88"]];
  var mechatronics=[["MAT101","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN101","PHL120","CYL120","ESL120","ESL130"],["MAT102","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN102","EST102","PHL120","CYL120","ESL120","ESL130"],["MAT201","MRT201","MRT203","MRT205","EST200","HUT200","MCN201","MRL201","MRL203",[["MRT281"],["MRT281"]]],["MAT202","MRT202","MRT204","MRT206","EST200","HUT200","MCN202","MRL202","MRL204",[["MRT282"],["MRT284"],["MRT292"],["MRT294"]]],["MET301","MRT303","MRT305","MRT307","HUT300","HUT310","MCN301","MRL331","MRL333","VACS55"],["MRT302","MRT304","MRT306",["MRT312","MRT322","MRT332","MRT342","MRT352","MRT362","MET372"],"HUT300","HUT310","MRT308","MRL332","MRD334","VACS66"],["MRT401",["MRT413","MRT423","MRT433","MRT443","MRT453","MRT463","MRT473"],["MRT415","MRT425"],"MCN401","MRL411","MRQ413","MRD415","VACS77"],["MRT402",["MRT414","MRT424","MRT434","MRT444","MRT454","MRT464","MRT474"],["MRT416","MRT426","MRT436","MRT446","MRT456","MRT466","MRT476"],["MRT418","MRT428","MRT438","MRT448","MRT458","MRT468","MRT478"],"MRT404","MRD416","VACS88"]];
  var MetallurgicalMaterialsEngineering=[["MAT101","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN101","PHL120","CYL120","ESL120","ESL130"],["MAT102","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN102","EST102","PHL120","CYL120","ESL120","ESL130"],["MAT201","MTT201","MTT203","MTT205","EST200","HUT200","MCN201","MTL201","MTL203",[["MTT281"],["MTT283"],["MTT285"]]],["MAT202","MTT202","MTT204","MTT206","EST200","HUT200","MCN202","MTL202","MTL204",[["MTT282"],["MTT284"],["MTT286"],["MTT292"],["MTT294"],["MTT296"]]],["MTT301","MTT303","MTT305","MTT307","HUT300","HUT310","MCN301","MTL331","MTL333","VACS5"],["MTT302","MTT304","MTT306",["MTT312","MTT322","MTT332","MTT342","MTT352","MTT362","MTT372"],"HUT300","HUT310","MTT308","MTL332","MTL334","VACS66"],["MTT401",["MTT413","MTT423","MTT433","MTT443","MTT453","MTT463","MTT473"],["MTT415","MTT425","MTT435","MTT445"],"MCN401","MTL411","MTQ413","MTD415","VACS77"],["MTT402",["MTT414","MTT424","MTT434","MTT444","MTT454","MTT464","MTT474"],["MTT416","MTT426","MTT436","MTT446","MTT456","MTT466","MTT476"],["MTT418","MTT428","MTT438","MTT448","MTT458","MTT468","MTT478"],"MTT404","MTD416","VACS88"]];
  var NavalArchitectureShipbuilding=[["MAT101","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN101","PHL120","CYL120","ESL120","ESL130"],["MAT102","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN102","EST102","PHL120","CYL120","ESL120","ESL130"],["MAT201","SBT201","SBT203","SBT205","EST200","HUT200","MCN201","SBL201","SBL203",[["SBT281"]]],["MAT202","SBT202","SBT204","SBT206","EST200","HUT200","MCN202","SBL202","SBL204",[["SBT282"],["SBT292"]]],["SBT301","SBT303","SBT305","SBT307","HUT300","HUT310","MCN301","SBL331","SBL333","VACS55"],["SBT302","SBT304","SBT306",["SBT312","SBT322","SBT332","SBT342"],"HUT300","HUT310","SBT308","SBL332","SBL334","VACS66"],["SBT401",["SBT413","SB423","SBT433","SBT443"],["SBT415","SBT425","SBT435"],"MCN401","SBL411","SBQ413","SBD415","VACS77"],["SBT402",["SBT414","SBT424","SBT434","SBT444"],["SBT416","SBT426","SBT436","SBT446"],["SBT418","SBT428","SBT438","SBT448"],"SBT404","SBD416","VACS88"]];
  var polymerengineering=[["MAT101","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN101","PHL120","CYL120","ESL120","ESL130"],["MAT102","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN102","EST102","PHL120","CYL120","ESL120","ESL130"],["MAT201","CHT201","POT201","POT203","EST200","HUT200","MCN201","POL201","POL203","VACS33"],["MAT202","CHT202","POT202","POT204","EST200","HUT200","MCN202","POL202","POL204",[["POT292"],["POT294"],["POT296"]]],["POT301","POT303","POT305","POT307","HUT300","HUT310","MCN301","POL331","POL333","VACS55"],["POT302","POT304","POT306",["POT312","POT322","POT332","POT342","POT352","POT362","POT372"],"HUT300","HUT310","POT308","POL332","POD334","VACS66"],["POT401",["POT413","POT423","POT433","POT443","POT453","POT463","POT473"],[],"MCN401","POL411","POQ413","POD415","VACS77"],["POT402",["POT414","POT424","POT434","POT444","POT454","POT464","POT474"],["POT416","POT426","POT436","POT446","POT456","POT466","POT476"],["POT418","POT428","POT438","POT448","POT458","POT468","POT478"],"POT404","POD416","VACS88"]];
  var productionengineering=[["MAT101","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN101","PHL120","CYL120","ESL120","ESL130"],["MAT102","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN102","EST102","PHL120","CYL120","ESL120","ESL130"],["MAT201","PET201","PET203","PET205","EST200","HUT200","MCN201","PEL201","PEL203",[["PET281"]]],["MAT202","EET212","PET204","PET206","EST200","HUT200","MCN202","EEL212","PEL204",[["PET282"],["PET292"]]],["PET301","PET303","PET305","PET307","HUT300","HUT310","MCN301","PEL331","PEL333","VACS55"],["PET302","PET304","PET306",["PET312","PET322","PET332","PET342","PET352","PET362","PET372"],"HUT300","HUT310","PET308","PEL332","PEL334","VACS66"],["PET401",["PET413","PET423","PET433","PET443","PET453","PET463","PET473"],["PET415","PET425","PET435","PET445","PET455"],"MCN401","PEL411","PEQ413","PED415","VACS77"],["PET402",["PET414","PET424","PET434","PET444","PET454","PET464","PET474"],["PET416","PET426","PET436","PET446","PET456","PET466","PET476"],["PET418","PET428","PET438","PET448","PET458","PET468","PET478"],"PET404","PED416","VACS88"]];
  var roboticsandautomation=[["MAT101","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN101","PHL120","CYL120","ESL120","ESL130"],["MAT102","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN102","EST102","PHL120","CYL120","ESL120","ESL130"],["MAT201","RAT201","RAT203","RAT205","EST200","HUT200","MCN201","RAL201","RAL203",[["RAT281"]]],["MAT202","RAT202","RAT204","RAT206","EST200","HUT200","MCN202","RAL202","RAL204",[["RAT282"],["RAT292"]]],["RAT301","RAT303","RAT305","RAT307","HUT300","HUT310","MCN301","RAL331","RAL333","VACS55"],["RAT302","RAT304","RAT306",["RAT312","RAT322","RAT332","RAT342","RAT352","RAT362","RAT372"],"HUT300","HUT310","RAT308","RAL332","RAD334","VACS66"],["RAT401",["RAT413","RAT423","RAT433","RAT443","RAT453","RAT463","RAT473"],["RAT415","RAT425","RAT435","RAT445"],"MCN401","RAL411","RAQ413","RAD415","VACS77"],["RAT402",["RAT414","RAT424","RAT434","RAT444","RAT454","RAT464","RAT474"],["RAT416","RAT426","RAT436","RAT446"],["RAT418","RAT428","RAT438","RAT448","RAT458","RAT468","RAT478"],"RAT404","RAD416","VACS88"]];
  var safetyandfireengineering=[["MAT101","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN101","PHL120","CYL120","ESL120","ESL130"],["MAT102","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN102","EST102","PHL120","CYL120","ESL120","ESL130"],["MAT201","FST201","FST203","FST205","EST200","HUT200","MCN201","FSL201","FSL203",[["FST281"]]],["MAT202","FST202","FST204","FST206","EST200","HUT200","MCN202","FSL202","FSL204",[["FST282"],["FST292"]]],["FST301","FST303","FST305","FST307","HUT300","HUT310","MCN301","FSL331","FSL333","VACS55"],["FST302","FST304","FST306",["FST312","FST322","FST332","FST342","FST352","FST362","FST372"],"HUT300","HUT310","FST308","FSL332","FSD334","VACS66"],["FST401",["FST413","FST423","FST433","FST443","FST453","FST463","FST473"],["FST415","FST425"],"MCN401","FSL411","FSQ413","FSD415","VACS77"],["FST402",["FST414","FST424","FST434","FST444","FST454","FST464","FST474"],["FST416","FST426","FST436","FST446"],["FST418","FST428","FST438","FST448","FST458","FST468","FST478"],"FST404","FSD416","VACS88"]];
  
  main.push(ComputerScienceEngineering,MechanicalEngineering,CivilEngineering,ElectricalElectronics,ElectronicsCommunication,InformationTechnology,AppliedElectronicsInstrumentation,BioTechnology,BioMedical,IntrumentationAndControlEngineering,AeronauticalEngineering,AutomobileEngineering,ChemicalEngineering,ElectronicsandBiomedicalEngineering,FoodTechnology,IndustrialEngineering,MechanicalAutomobileengineering,MechanicalProductionEngineering,mechatronics,MetallurgicalMaterialsEngineering,NavalArchitectureShipbuilding,polymerengineering,productionengineering,roboticsandautomation,safetyandfireengineering);  
  
  var i=branchshortcode.indexOf(BranchCode);
  
 var j=Semester;
  
  var header="\uD83D\uDDC2\uFE0F *KTU SLOTWISE SUBJECT LIST*\r\n\r\n\uD83D\uDC68\u200D\uD83C\uDF93 *Branch :-* "+Branches[i]+"\r\n\r\n\uD83E\uDDEE *Semester :-"+Semester+"*\r\n*-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-*";
  
  
 
         var semheader="\r\n\r\n\uD83E\uDDCA  *Semester "+(j-1+1)+" (S"+(j-1+1)+")* \uD83E\uDDCA";
  
        var electiveheader="";
        var vacheader="";
     for(var k=0;k<main[i][j-1].length;k++)                       //Branch-> Semester-->Semester subjects Loop
             {
               var electiveouter="";
               var vacouter="";
               
               var subjectlist="";
                
                if(main[i][j-1][k].length==6 && Array.isArray(main[i][j-1][k])==false)
                  {
                    var temp=status.indexOf(main[i][j-1][k]);
                   // console.log(main[i][j-1][k]);                    //subjects
                    subjectlist=subjectlist+"\r\n\r\n\u2712\uFE0F *"+main[i][j-1][k]+"* :: *"+subnames[temp]+"* :: "+slots[temp]+" :: *("+credits[temp]+")*";
                  }
               
               var electivecount=0;
               var vaccounter=0;
               var outertemp="";
               var VACoutertemp="";
               for(var l=0;l<main[i][j-1][k].length;l++)                     //Branch-> Semester-->Elective subjects Loop
                {
                  var elective="";
                  var vac="";
                   if(main[i][j-1][k][l].length == 6 &&  ((main[i][j-1][k][l].match(/[a-z]/i))||(main[i][j-1][k][l].match(/[0-9]/i))))  //elective subjects
                       {
                          var temp=status.indexOf(main[i][j-1][k][l]);
                          elective=elective+"\r\n\r\n\uD83D\uDEF8 *"+main[i][j-1][k][l]+"* :: *"+subnames[temp]+"* :: "+slots[temp]+" :: *("+credits[temp]+")*";
                         electivecount++;
                       }
                
                  
                   if(main[i][j-1][k][l][0].length !== 1 && ((main[i][j-1][k][l][0].match(/[a-z]/i))||(main[i][j-1][k][l][0].match(/[0-9]/i)))) //VAC Subject
                       {
                          var temp=statusvac.indexOf(main[i][j-1][k][l][0]);
                          vac=vac+"\r\n\r\n\uD83E\uDDE9 *"+main[i][j-1][k][l][0]+"* :: *"+vacsubnames[temp]+"* :: "+vacslot[temp]+" :: *("+vaccredits[temp]+")*";
                         vaccounter++;
                       }
                  outertemp=outertemp+elective;
                  VACoutertemp=VACoutertemp+vac;
                }
               if(electivecount>0)
               {
                 var electiveouter="\r\n\r\n*Elective ::*"+outertemp;
               }
               if(vaccounter>0)
               {
                 var vacouter="\r\n\r\n*R/Minor/Honours ::*"+VACoutertemp;
               }
               semheader=semheader+subjectlist;
               electiveheader=electiveheader+electiveouter;
                vacheader=vacheader+vacouter;
             }
        header=header+semheader+ electiveheader+vacheader;
      
  return(header);
}
