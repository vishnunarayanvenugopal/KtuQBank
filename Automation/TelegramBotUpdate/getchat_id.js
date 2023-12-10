// FULL SCRIPT BELOW:
// How to connect your Telegram Bot to a Google Spreadsheet (Google Apps Script)
// 
// FILL IN THE GLOBAL VARIABLES token, webAppUrl and ssId
//

//Documentation on 11-11-2023
// Tasker API webhook if not configured can be set up using setWebhook()
// Deletion is not required since it will only add row if it doesnt exist in sheet
// This is a deployment and any changes need to be versioned as new

var token = "xxxxxxxx"; // FILL IN YOUR OWN TOKEN
var telegramUrl = "https://api.telegram.org/bot" + token;
var webAppUrl = "https://script.google.com/macros/s/AKfycbzVrnhC2Os08veruWO3ClKyAtl3RDauT9V2Le-VoDxTP4yRSH4E/exec"; // FILL IN YOUR GOOGLE WEB APP ADDRESS
var ssId = "16SUqeYftPtoLgGPk9ZoTfKF-rBHR1SmO7iRg-N6ii4w"; // FILL IN THE ID OF YOUR SPREADSHEET
var AllID=[].concat.apply([], SpreadsheetApp.openById("16SUqeYftPtoLgGPk9ZoTfKF-rBHR1SmO7iRg-N6ii4w").getSheets()[0].getRange("B1:B").getValues().filter(String));


function getMe() {
  var url = telegramUrl + "/getMe";
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function setWebhook() {
  var url = telegramUrl + "/setWebhook?url=" + webAppUrl;
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function sendText(id,text) {
  var url = telegramUrl + "/sendMessage?chat_id=" + id + "&text=" + text;
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function doGet(e) {
  return HtmlService.createHtmlOutput("Hi there");
}

function doPost(e) {
  // this is where telegram works
  var data = JSON.parse(e.postData.contents);
  var text = data.message.text;
  var id = data.message.chat.id;
  var name = data.message.chat.first_name + " " + data.message.chat.last_name;
  var answer = "I am Here";
  //start
  if(text=="/start" && String(id).startsWith("-") && AllID.indexOf(id)==-1)
  {
    var answer = "You will receive live updates from KTU";
    sendText(id,answer);
  }
   else if(text=="/start" && AllID.indexOf(id)!=-1)
  {
    var answer = "You are already subscribed for updates: If issues persist mail to ktuqbank@gmail.com";
    sendText(id,answer);
  }

  else
  {
    var answer = "This bot works with groups only..!! Check if you added bot to a group";
    sendText(id,answer);
  }
  //end
//sendText(id,answer);
 if (AllID.indexOf(id)==-1 && String(id).startsWith("-"))
  { SpreadsheetApp.openById(ssId).getSheets()[0].appendRow([new Date(),id,name,text,answer]);
  console.log("rejected: "+id)
  }
 
 //var tempo= AllID.indexOf(id)==-1 && String(id).startsWith("-");
//SpreadsheetApp.openById(ssId).getSheets()[0].appendRow([new Date(),id,name,text,answer,tempo]);
 //  console.log("rejected: "+id)
  
  
  if(/^@/.test(text)) {
    var sheetName = text.slice(1).split(" ")[0];
    var sheet = SpreadsheetApp.openById(ssId).getSheetByName(sheetName) ? SpreadsheetApp.openById(ssId).getSheetByName(sheetName) : SpreadsheetApp.openById(ssId).insertSheet(sheetName);
    var comment = text.split(" ").slice(1).join(" ");
    sheet.appendRow([new Date(),id,name,comment,answer]);
  }
}
