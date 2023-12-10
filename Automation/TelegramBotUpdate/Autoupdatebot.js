//Global Variables

generalSheetID = "1udxxfno3NfBojTCb6jp74orQOeNWJ9U1r7SFJpgtK1s";
chatIDSheetID = "16SUqeYftPtoLgGPk9ZoTfKF-rBHR1SmO7iRg-N6ii4w";
gDrivefolderid = "1wSV1UfLWZcA5CoLbA7s5UnzHsZBYIooU";

//Blogger Service

var CLIENT_ID = 'xxxxxx';
var CLIENT_SECRET = 'xxxxxxxx';

//Sheet Details

overallUpdateSheet = SpreadsheetApp.openById(generalSheetID);

chatIDSheet = SpreadsheetApp.openById(chatIDSheetID).getSheets()[0].getRange("I1:I").getValues().filter(String);
chatIDSheet = [].concat(...chatIDSheet);

autoupdateSheetData = overallUpdateSheet.getSheets()[0].getRange("A1:A").getValues().filter(String);
autoupdateSheetData = [].concat(...autoupdateSheetData);

payloadAPIData = overallUpdateSheet.getSheets()[1].getDataRange().getValues();
templateData = overallUpdateSheet.getSheets()[2].getDataRange().getValues();

//Blogger Settings
var bloggerPostLabels = ["ktu updates", "announcement", "notification"];

function runThis() {
   var response = callAPIbyReference("announcementsKTU");
   ktuAnnouncementHandler(response);
   maintainRows(20);

}

function ktuAnnouncementHandler(responseData) {

   

   for (var i = 0; i < responseData.content.length; i++) {
      var notificationTitle = responseData.content[i].subject;

      console.log(notificationTitle);
      console.log(autoupdateSheetData[0]);
      console.log(calculateTextDifference(notificationTitle,autoupdateSheetData[0]));

      if (autoupdateSheetData.indexOf(notificationTitle) == -1 && calculateTextDifference(notificationTitle,autoupdateSheetData[0])==0) {
        
         var ocrText = "";
         var linkbuttoncode = "";
         var iframeCode = "";
         var telegramButtons = [];

         var notificationDescription = "";
         var fileIDs = [];

         if (responseData.content[i].message) {
            notificationDescription = responseData.content[i].message;
         }

         //Handle Multiple Attachments here
         for (var j = 0; j < responseData.content[i].attachmentList.length; j++) {
            var attachmentEncryptID = [];
            var attachmentName = "";

            attachmentEncryptID.push(responseData.content[i].attachmentList[j].encryptId);
            attachmentName=responseData.content[i].attachmentList[j].attachmentName;

            var fileBlob = callAPIbyReference("GetAttachment", replacables = [
               ["{encryptId}", attachmentEncryptID]
            ]);

            var fileID = uploadToDrive(fileBlob, gDrivefolderid, attachmentName)

            //Get OCR of PDF

            var ocrTextTemp = callAPIbyReference("pdfOCRAPI", replacables = [
               ["{url}", buildDriveIDLink(fileID)]
            ]);
            ocrText += ocrTextTemp.ParsedResults[0].ParsedText;

            //Button & Iframe Generate

            linkbuttoncode += linkbuttongen(attachmentName, buildDriveDownloadLink(fileID))
            iframeCode += iframegen(buildDrivePreviewLink(fileID));

            //Telegram Button Generate
            telegramButtons.push({"text":attachmentName,"url":buildDriveDownloadLink(fileID)});

            fileIDs.push(fileID);
         }

         //Publish Blogger Post
          bloggerURL = publishBloggerPost(notificationTitle, notificationDescription, ocrText, linkbuttoncode, iframeCode, bloggerPostLabels);

         bitlyResponse=callAPIbyReference("BitlyShortenURL", replacables = [
               ["{long_url}", bloggerURL]
            ]);
         shortenBlogLink=bitlyResponse.link;

         //Add new Row at Sheet top
         overallUpdateSheet.getSheets()[0].insertRowBefore(1).getRange(1, 1, 1, 1).setValues([
            [notificationTitle]
         ]);

        // Code to Handle Delay of insertion

        Utilities.sleep(1000); 
     
        if(SpreadsheetApp.openById(generalSheetID).getSheets()[0].getRange('A1').getValues()=="")
        {
        SpreadsheetApp.openById(generalSheetID).getSheets()[0].getRange('A1').setValue([[notificationTitle]]); 
        Utilities.sleep(2000);
        }

         //Onesignal Announcement

         callAPIbyReference("oneSignalAPI", replacables = [
               ["{heading}", notificationTitle],
               ["{heading}", notificationTitle],
               ["{content}", notificationDescription],
               ["{posturl}", bloggerURL],
            ]);

          //Call Telegram API

         broadcastTelegram(notificationTitle,notificationDescription,shortenBlogLink,telegramButtons);

      }
   }
}

function broadcastTelegram(title,description,bloggerURL,telegramButtons)
{
  var dateTime=getDateTime();
  var date=dateTime[0];
  var time=dateTime[1];

  processedTemplates=processMessageTemplates(telegramTemplateRef="telegramTemplate-ktuliveupdates",whatsappShareTemplateRef="whatsappShareTemplate-ktuliveupdates",rawTemplateRef="rawTemplate-ktuliveupdates",title,description,bloggerURL,date,time,telegramButtons)

  console.log(processedTemplates[1]);

  //Call Whatsapp Update

  whatsappEncodeURL="https://autoremotejoaomgcd.appspot.com/sendmessage?key=xxxxxxxxxxx&message="+encodeURIComponent(processedTemplates[1]);

  whatsappEncodeURL=callAPIbyReference("firebaseShortenURL", replacables = [
               ["{longLink}", whatsappEncodeURL]
            ]);

  UrlFetchApp.fetch(whatsappEncodeURL.shortLink);

  //Telegram Send Update

  for(i=0;i<chatIDSheet.length;i++)
  //for(i=0;i<0;i++)
  {
    if(chatIDSheet[i]=="@ktuinstantupdates")
    {

      processedTemplates=processMessageTemplates(telegramTemplateRef="telegramTemplate-akksu",whatsappShareTemplateRef="whatsappShareTemplate-akksu",rawTemplateRef="rawTemplate-akksu",title,description,bloggerURL,date,time,telegramButtons)

    }
    else
    {
      processedTemplates=processMessageTemplates(telegramTemplateRef="telegramTemplate-ktuliveupdates",whatsappShareTemplateRef="whatsappShareTemplate-ktuliveupdates",rawTemplateRef="rawTemplate-ktuliveupdates",title,description,bloggerURL,date,time,telegramButtons)
    }

    try {

     callAPIbyReference("telegramSendMessage", replacables = [
               ["{chatid}", chatIDSheet[i]],
               ["{update-text}", processedTemplates[0]],
               ["{raw}", processedTemplates[2]]
            ]);
      Utilities.sleep(40);

    }
    catch(e)
    {
       console.log(e);
       console.log(chatIDSheet[i]);
       kickhandler(e,chatIDSheet[i]);
       continue;   //If error continue looping
    }

  }

  MailApp.sendEmail("xxxxx",
                  "Update report",
                           "Update completed successfully to Count: "+i);

}

function processMessageTemplates(telegramTemplateRef,whatsappShareTemplateRef,rawTemplateRef,title,description,bloggerURL,date,time,telegramButtons)
{
      var processedTemplates=[];

      var matchedRow = returnRowDataByReference(templateData, "TemplateID", telegramTemplateRef);
      var telegramTemplate=matchedRow[1];

      var matchedRow = returnRowDataByReference(templateData, "TemplateID", whatsappShareTemplateRef);
      var whatsappShareTemplate=matchedRow[1];

      var matchedRow = returnRowDataByReference(templateData, "TemplateID", rawTemplateRef);
      var rawTemplate=matchedRow[1];

      telegramTemplate=telegramTemplate.replace(/{heading}/g,title);
      telegramTemplate=telegramTemplate.replace(/{description}/g,description);
      telegramTemplate=telegramTemplate.replace(/{blog-url}/g,bloggerURL);
      telegramTemplate=telegramTemplate.replace(/{date}/g,date);
      telegramTemplate=telegramTemplate.replace(/{time}/g,time);

      whatsappShareTemplate=whatsappShareTemplate.replace(/{heading}/g,title);
      whatsappShareTemplate=whatsappShareTemplate.replace(/{description}/g,description);
      whatsappShareTemplate=whatsappShareTemplate.replace(/{blog-url}/g,bloggerURL);
      whatsappShareTemplate=whatsappShareTemplate.replace(/{date}/g,date);
      whatsappShareTemplate=whatsappShareTemplate.replace(/{time}/g,time);

      encodedWhatsappTemplate="https://api.whatsapp.com/send?&text="+encodeURIComponent(whatsappShareTemplate);

      rawTemplate=rawTemplate.replace(/{watext}/g,encodedWhatsappTemplate);
      rawTemplate=rawTemplate.replace(/{individual_links}/g,JSON.stringify(telegramButtons));

      processedTemplates.push(telegramTemplate,whatsappShareTemplate,rawTemplate)
      return processedTemplates;

}

function publishBloggerPost(title, description, ocrtext, buttonContent, iframeCode, bloggerPostLabels) {
   var matchedRow = returnRowDataByReference(templateData, "TemplateID", "bloggerTemplate");

   var bloggerPostTemplate = matchedRow[1];

   bloggerPostTemplate = bloggerPostTemplate.replace(/{title}/g, title);
   bloggerPostTemplate = bloggerPostTemplate.replace(/{content}/g, description);
   bloggerPostTemplate = bloggerPostTemplate.replace(/{ocrtext}/g, ocrtext);
   bloggerPostTemplate = bloggerPostTemplate.replace(/{button-content}/g, buttonContent);
   bloggerPostTemplate = bloggerPostTemplate.replace(/{iframe-content}/g, iframeCode);

   console.log(bloggerPostTemplate);

   var blogger = callAPIbyReference("bloggerPublishAPI", replacables = [
      ["{title}", title],
      ["{content}", bloggerPostTemplate],
      ["{labels}", bloggerPostLabels],
      ["{BearerToken}", getBloggerService().getAccessToken()]
   ]);

   return blogger.url;

}


function callAPIbyReference(referenceAPI, replacables) {
   var matchedRow = returnRowDataByReference(payloadAPIData, "UniqueID", referenceAPI);

   var apiUrl = matchedRow[1];
   var requestType = matchedRow[2];
   var contentType = matchedRow[3];
   var returnType = matchedRow[5];
   var header = matchedRow[6];

   var requestPayload = matchedRow[4];

   if (replacables) {
      for (var i = 0; i < replacables.length; i++) {
         requestPayload = requestPayload.replace(replacables[i][0], replacables[i][1]);
         header = header.replace(replacables[i][0], replacables[i][1]);
         apiUrl = apiUrl.replace(replacables[i][0], replacables[i][1]);
      }
   }

   var header = JSON.parse(header);

   var requestPayload = JSON.stringify(requestPayload);

   if(referenceAPI=="whatsappUpdateCallPost")
   {
       var requestPayload = JSON.parse(requestPayload);
   }
  

   console.log(header);

   var options = {
      "method": requestType,
      "contentType": contentType,
      "payload": JSON.parse(requestPayload),
      "headers": header
   };

   console.log(apiUrl);
   console.log(options);

   var response = UrlFetchApp.fetch(apiUrl, options);

   if (response.getResponseCode() === 200 || response.getResponseCode() === 201) {
      if (returnType == "JSON") {
         console.log(response.getContentText());
         var responseData = JSON.parse(response.getContentText());
         return responseData;
      } else if (returnType == "FILE") {
         fileData = response.getContentText().split("&&");
         return fileData[0];
      }
      else
      {

      }
   } else {
      Logger.log("Error - Status code: " + response.getResponseCode());
      Logger.log("Response content: " + response.getContentText());
   }
}

function returnRowDataByReference(sheet, columnName, reference) {
   indexOfColumn = sheet[0].indexOf(columnName);

   for (var i = 0; i < sheet.length; i++) {
      if (sheet[i][indexOfColumn] == reference) {
         return (sheet[i]);
      }
   }
}

function uploadToDrive(blob, folderid, filename) {

   var byteArray = Utilities.base64Decode(blob);
   var blob = Utilities.newBlob(byteArray, undefined, filename);

   var folder = DriveApp.getRootFolder();
   if (folderid) {
      folder = DriveApp.getFolderById(folderid);
   }

   var file = folder.createFile(blob);
   file.setName(filename);
   file.setDescription("Downloaded from KTU");
   var driveFileId = file.getId();

   return driveFileId;
}

function calculateTextDifference(sentence1, sentence2) {
   const words1 = sentence1.split(' ');
   const words2 = sentence2.split(' ');

   const commonWords = words1.filter(word => words2.includes(word));

   const changePercentage = 100-(commonWords.length / Math.max(words1.length, words2.length)) * 100;

   console.log(changePercentage);

   if (changePercentage > 10) {
      return 0;
   } else {
      return -1;
   }
}

function buildDrivePreviewLink(fileID) {
   var newpreview = "https://drive.google.com/file/d/" + fileID + "/preview";
   return newpreview;

}

function buildDriveDownloadLink(fileID) {
   var downloadURL = "https://drive.google.com/uc?id=" + fileID + "&export=download";
   return downloadURL;

}

function buildDriveIDLink(fileID) {
   var downloadURL = "https://drive.google.com/uc?id=" + fileID;
   return downloadURL;

}

function iframegen(previewlink) {
   var iframe = '<br><iframe src=\\"' + previewlink + '\\" width=\\"640\\" height=\\"480\\"><\\/iframe><br>';
   return iframe;
}

function linkbuttongen(linktext, buttonlinkcollect) {

   linkbutton = '<a href=\\"' + buttonlinkcollect + '\\" class=\\"button5\\"   style=\\"background-color:#42cc8c;\\"  target=\\"_blank\\" >' + linktext + '<\\/a>\\r\\n\\u2003';

   return linkbutton;
}

function getDateTime() 
{
  data=[];
  var now = new Date();

  var formattedDate = Utilities.formatDate(now, Session.getScriptTimeZone(), "MM/dd/yyyy");

  var formattedTime = Utilities.formatDate(now, Session.getScriptTimeZone(), "hh:mm a");

  Logger.log("Formatted Date: " + formattedDate);
  Logger.log("Formatted Time: " + formattedTime);

  data.push(formattedDate);
  data.push(formattedTime);

  return data
}

function getBloggerService() {

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

function kickhandler(e,tempx)
{
 console.log(e);
 console.log(tempx);
  console.log(e.message);
  var errormes=  JSON.parse(e.message.match(/{(.+?)}/g));
  if (errormes != null){
    // your code here.

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
    
}

function maintainRows(count) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  var numRowsToRemove = lastRow - count;

  if (numRowsToRemove > 0) {
    sheet.deleteRows(lastRow - numRowsToRemove + 1, numRowsToRemove);
  }
}
