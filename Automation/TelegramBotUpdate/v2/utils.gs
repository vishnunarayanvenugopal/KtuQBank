//*************String Utils************************//

//Generate random strings by length
function generateRandomString(len) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({length: len}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function cleanHtmlToText(htmlString) {
  return htmlString
    .replace(/<[^>]+>/g, '')         // Remove all HTML tags
    .replace(/&nbsp;/g, ' ')         // Replace &nbsp; with space
    .replace(/&ndash;/g, '-')        // Optional: handle other HTML entities
    .replace(/\s+/g, ' ')            // Collapse multiple spaces/newlines
    .trim();                         // Remove leading/trailing spaces
}

//convert base64 to file & save to drive
function saveBase64PdfToDrive(base64Data, fileName) {
  var decodedBytes = Utilities.base64Decode(base64Data);
  var blob = Utilities.newBlob(decodedBytes, 'application/pdf', fileName);
  var file = DriveApp.createFile(blob);

  // Make the file public
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  // Generate the preview URL
  var fileId = file.getId();
  var previewUrl = 'https://drive.google.com/file/d/' + fileId + '/preview';

  Logger.log('Public PDF preview URL: ' + previewUrl);
  return previewUrl;
}

//Telegram Utils
function uploadPdfToTelegram(base64Data, fileName, chatId, botToken) {
  var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), 'application/pdf', fileName);
  // makeAPICallWithUniqueRef("SendTelegramFile", {
  //       "{bot_token}": botToken,
  //       "{chat_id}": chatId,
  //       "{file_url_or_file_blob}":blob,
  //       "{file_caption}":  fileName
  //   })
  return sendDocumentToTelegram(blob, fileName, chatId, botToken)
}

function sendDocumentToTelegram(blob, fileName, chatId, botToken) {
  var url = "https://api.telegram.org/bot" + botToken + "/sendDocument";
  
  var formData = {
    "chat_id": String(chatId),
    "caption": String(fileName),
    "document": blob  // Blob goes here
  };

  var options = {
    method: "POST",
    muteHttpExceptions: true,
    payload: formData
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    Logger.log(response.getContentText());
    return response.getContentText()
  } catch (error) {
    Logger.log("Error sending document: " + error.message);
    return "{}"
  }
}


//compare 2 strings and flag if percent change more than 50
function calculateWordDifferencePercentage(string1, string2) {

  function getUniqueWords(str) {
    if (!str || typeof str !== 'string') {
      return new Set();
    }
    const words = str.toLowerCase()
                     .replace(/[(),\/]/g, ' ')
                     .split(/\s+/)
                     .filter(word => word && word.length > 0);
    return new Set(words);
  }

  const uniqueWords1 = getUniqueWords(string1);
  const uniqueWords2 = getUniqueWords(string2);

  const unionSet = new Set([...uniqueWords1, ...uniqueWords2]);

  const intersectionSet = new Set();
  for (const word of uniqueWords1) {
    if (uniqueWords2.has(word)) {
      intersectionSet.add(word);
    }
  }

  if (unionSet.size === 0) {
    return 0;
  }

  const differingWordsCount = unionSet.size - intersectionSet.size;
  const differencePercentage = (differingWordsCount / unionSet.size) * 100;

  return differencePercentage;
}

//*************SHEET Utils************************//

function cleanDataMoreThanLimit(limit, range, sheet) {
  var rangeObj = sheet.getRange(range);
  var numRows = rangeObj.getNumRows();
  var numCols = rangeObj.getNumColumns();

  if (numRows === 1 && numCols > limit) {
    // Horizontal range: Delete extra columns
    var startCol = rangeObj.getColumn() + limit;
    var numToDelete = numCols - limit;
    sheet.deleteColumns(startCol, numToDelete);
  } else if (numCols === 1 && numRows > limit) {
    // Vertical range: Delete extra rows
    var startRow = rangeObj.getRow() + limit;
    var numToDelete = numRows - limit;
    sheet.deleteRows(startRow, numToDelete);
  } else {
    Logger.log("No cleanup needed or unsupported range shape.");
  }
}

function deleteRowsByColumnValue(sheet, columnNumber, valueToDelete) {
  var data = sheet.getDataRange().getValues();
  
  for (var i = data.length - 1; i >= 0; i--) {
    if (data[i][columnNumber - 1] == valueToDelete) {
      sheet.deleteRow(i + 1);  // Sheet rows are 1-indexed
      Logger.log("Deleted row: " + (i + 1));
    }
  }
}

function updateAllColumnValues(sheet, columnNumber, currentValue, newValue) {
  var data = sheet.getDataRange().getValues();
  
  for (var i = 0; i < data.length; i++) {
    if (data[i][columnNumber - 1] == currentValue) {
      sheet.getRange(i + 1, columnNumber).setValue(newValue);
      Logger.log("Updated row " + (i + 1) + ", column " + columnNumber + " from '" + currentValue + "' to '" + newValue + "'");
    }
  }

  Logger.log("Completed updating all instances of '" + currentValue + "' in column " + columnNumber);
}


//*************Date Time Utils************************//
function getFormattedDateTime() {
  var d = new Date();
  
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var date = day + "/" + month + "/" + d.getFullYear();
  
  var hours = d.getHours();
  var minutes = d.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;

  var time = hours + ':' + minutes + ' ' + ampm;

  return {
    date: date,
    time: time
  };
}

