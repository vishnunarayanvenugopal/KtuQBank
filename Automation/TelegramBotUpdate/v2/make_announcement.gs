//-----> settings start<------
const announcementTargetChatId = "dummy"; // null or "-100XXXXXXXXXX" for supergroups
//-----> settings end<------

/**
 * Announcement Data: The data to be sent in the announcement
 */
const announcementData = {
  message: "*📢 Important Update!*\n\nNew circular released. Check the official site for details.\n\n🕒 " + new Date().toLocaleString(),
  image_url: "dummy.jpg", // Optional image URL or null
  document_blob: null, // Optional - provide a Blob object for documents
  document_name: "Circular.pdf", // Optional - required if document_blob is given
  file_url: null, // Optional file URL in "",
  imageCaption: "image caption", // Optional image caption in "" or null 
};

/**
 * Send a Telegram Text Message to a Chat
 * @param {string} chatId - The chat ID to send the message to
 * @param {string} message - The message to be sent
 */
function sendTelegramText(chatId, message) {
  const url = `https://api.telegram.org/bot${telegram_bot_token}/sendMessage`;
  const options = {
    method: "post",
    payload: {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown"  // Use markdown for text formatting
    }
  };
  try {
    const response = UrlFetchApp.fetch(url, options);
    Logger.log(response.getContentText());  // Log the response for debugging
  } catch (error) {
    Logger.log("Error sending message: " + error);
  }
}

/**
 * Send an Image to a Telegram Chat
 * @param {string} chatId - The chat ID to send the image to
 * @param {string} imageUrl - The URL of the image to be sent
 * @param {string} caption - Optional caption for the image
 */
function sendTelegramImage(chatId, imageUrl, caption) {
  const url = `https://api.telegram.org/bot${telegram_bot_token}/sendPhoto`;
  const options = {
    method: "post",
    payload: {
      chat_id: chatId,
      photo: imageUrl,
      caption: caption || ""
    }
  };
  try {
    const response = UrlFetchApp.fetch(url, options);
    Logger.log(response.getContentText());  // Log the response for debugging
  } catch (error) {
    Logger.log("Error sending image: " + error);
  }
}

/**
 * Send a Document to a Telegram Chat (using a Blob)
 * @param {string} chatId - The chat ID to send the document to
 * @param {Blob} documentBlob - The document Blob to be sent
 * @param {string} documentName - The name of the document
 * @param {string} caption - Optional caption for the document
 */
function sendTelegramFile(chatId, documentBlob, documentName, caption) {
  const url = `https://api.telegram.org/bot${telegram_bot_token}/sendDocument`;
  const options = {
    method: "post",
    payload: {
      chat_id: chatId,
      document: documentBlob,
      caption: caption || "",
      filename: documentName
    }
  };
  try {
    const response = UrlFetchApp.fetch(url, options);
    Logger.log(response.getContentText());  // Log the response for debugging
  } catch (error) {
    Logger.log("Error sending document: " + error);
  }
}

/**
 * Send a Document to a Telegram Chat from a URL
 * @param {string} chatId - The chat ID to send the document to
 * @param {string} fileUrl - The URL of the file to be sent
 * @param {string} fileName - The file name for the document
 * @param {string} caption - Optional caption for the document
 */
function sendTelegramFileFromUrl(chatId, fileUrl, fileName, caption) {
  const url = `https://api.telegram.org/bot${telegram_bot_token}/sendDocument`;
  const options = {
    method: "post",
    payload: {
      chat_id: chatId,
      document: fileUrl,
      caption: caption || "",
      filename: fileName
    }
  };
  try {
    const response = UrlFetchApp.fetch(url, options);
    Logger.log(response.getContentText());  // Log the response for debugging
  } catch (error) {
    Logger.log("Error sending file from URL: " + error);
  }
}

/**
 * Send the Announcement to Telegram
 */
function sendTelegramAnnouncement() {
  const telegram_ids = telegram_id_sheet.getDataRange().getValues();
  let targetChatIds = [];

  // Check if announcementTargetChatId is set, and use it
  if (announcementTargetChatId) {
    targetChatIds = [announcementTargetChatId];
  } else {
    // If not, send to all chat IDs from the sheet
    for (let i = 0; i < telegram_ids.length; i++) {
      if (telegram_ids[i][1]) {
        targetChatIds.push(telegram_ids[i][1]);
      }
    }
  }

  // Send announcement to target chat IDs
  for (let i = 0; i < targetChatIds.length; i++) {
    const chatId = targetChatIds[i];

    // Send text message
    sendTelegramText(chatId, announcementData.message);

    // Optionally, send an image
    if (announcementData.image_url) {
      sendTelegramImage(chatId, announcementData.image_url, announcementData.imageCaption);
    }

    // Optionally, send a document (if blob is available)
    if (announcementData.document_blob) {
      sendTelegramFile(chatId, announcementData.document_blob, announcementData.document_name, "📄 Attached Circular");
    }

    // Optionally, send a file from URL
    if (announcementData.file_url) {
      sendTelegramFileFromUrl(chatId, announcementData.file_url, announcementData.document_name, "📄 Click here to download the file");
    }

    Utilities.sleep(1000); // Sleep for 1 second to avoid hitting the Telegram API rate limits
  }
}
