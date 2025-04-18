const updates_sheet_id = PropertiesService.getScriptProperties().getProperty('updates_sheet_id');
const telegram_sheet_id = PropertiesService.getScriptProperties().getProperty('telegram_sheet_id');
const telegram_bot_token = PropertiesService.getScriptProperties().getProperty('telegram_bot_token');
const ktu_secret_token = PropertiesService.getScriptProperties().getProperty('ktu_secret_token');

//define sheets
var ktu_update_sheet = SpreadsheetApp.openById(updates_sheet_id).getSheetByName("ktu_updates");
var telegram_id_sheet = SpreadsheetApp.openById(telegram_sheet_id).getSheetByName("telegram_id");

function runKTUNotifier() {
    notifications = fetch_and_process_notifications()
    update_result = new_update_exists(notifications)
    if (update_result[0]) {
        attachment_dict = processKTUAttachments(update_result[1]["attachments"])
        sendTelegramUpdate(update_result[1], attachment_dict)

    }


    cleanDataMoreThanLimit(limit = 15, range = "A:A", sheet = ktu_update_sheet)
}

function sendTelegramUpdate(notification_data, attachment_dict) {
    telegram_ids = telegram_id_sheet.getDataRange().getValues();
    for (let telegram_id = 0; telegram_id < telegram_ids.length; telegram_id++) {
        chat_id = telegram_ids[telegram_id][1]
        Logger.log(chat_id)

        var processedMessage = processTemplateWithUniqueRef("TelegramUpdateTemplate", {
            "{heading}": cleanHtmlToText(notification_data["title"]),
            "{content}": cleanHtmlToText(notification_data["description"]),
            "{blogUrl}": "ktuqbank.com",
            "{date}": getFormattedDateTime()["date"],
            "{time}": getFormattedDateTime()["time"],
        })

        const watext = `https://api.whatsapp.com/send?&text=${processedMessage}`;

        var inline_keyboard = processTemplateWithUniqueRef("TelegramUpdateButtonTemplate", {
            "{watext}": encodeURI(watext),
            // "{button_links}": JSON.stringify(attachment_urls)
        })

        sendMessageResponse = JSON.parse(makeAPICallWithUniqueRef("SendTelegramMessage", {
            "{bot_token}": telegram_bot_token,
            "{chatId}": chat_id,
            "{messageBody}": JSON.stringify(processedMessage),
            "{inline_keyboard}": inline_keyboard
        }))

        handleTelegramGroupCleanUp(sendMessageResponse)

        for (var i = 0; i < attachment_dict.length; i++) {
            var attachment = attachment_dict[i];
            sendMessageResponse = JSON.parse(uploadPdfToTelegram(attachment.file_content, attachment.file_name, chat_id, telegram_bot_token));
        }
        break
    }


}

function fetch_and_process_notifications() {
    var xtoken = generateRandomString(93) + 'F' + generateRandomString(2224) + ktu_secret_token;
    responseJSON = JSON.parse(makeAPICallWithUniqueRef("KTUGetAnnouncements", {
        "{xtoken}": xtoken
    }));
    processed_data = processKTUAnnouncementData(responseJSON)
    return processed_data
}

function download_attachments(file_encrypt_id) {
    var xtoken = generateRandomString(93) + 'F' + generateRandomString(2224) + ktu_secret_token;
    attachment_file = makeAPICallWithUniqueRef("KTUGetAttachment", {
        "{xtoken}": xtoken,
        "{EncryptID}": file_encrypt_id
    });
    file_content = attachment_file.split("&&")[0];
    file_name = attachment_file.split("&&")[1];
    return [file_content, file_name]
}

function processKTUAttachments(attachments) {
    Logger.log("processing attachments");
    Logger.log(attachments);

    let result = [];

    for (let each_attachment = 0; each_attachment < attachments.length; each_attachment++) {
        let attachment_item = attachments[each_attachment];
        let attachment_name = attachment_item.attachmentName;
        let attachment_encryptID = attachment_item.encryptId;

        attachment_data = download_attachments(attachment_encryptID)
        file_content = attachment_data[0]
        file_name = attachment_data[1]

        let attachment = {};
        attachment["file_content"] = attachment_data[0]
        attachment["file_name"] = attachment_data[1]
        result.push(attachment);
    }

    Logger.log(result);
    return result;
}

function handleTelegramGroupCleanUp(sendMessageResponse, chat_id) {
    if (sendMessageResponse) {
        var parsedResponse = sendMessageResponse;

        if (parsedResponse.ok === false && parsedResponse.error_code === 400 || parsedResponse.error_code === 403 || parsedResponse.error_code === 429) {
            var description = parsedResponse.description;

            // Case 1: Chat not found
            if (description === "Bad Request: chat not found") {
                deleteRowsByColumnValue(telegram_id_sheet, 2, chat_id);
                Logger.log("Deleted chat ID " + chat_id + " from sheet due to invalid chat.");
            }

            // Case 2: Group upgraded to supergroup
            else if (description === "Bad Request: group chat was upgraded to a supergroup chat" && parsedResponse.parameters && parsedResponse.parameters.migrate_to_chat_id) {
                var newChatId = parsedResponse.parameters.migrate_to_chat_id;
                updateAllColumnValues(telegram_id_sheet, 2, chat_id, newChatId);
                Logger.log("Updated chat ID from " + chat_id + " to " + newChatId);
            }

            // Case 3: Not enough rights to send messages
            else if (description === "Bad Request: not enough rights to send text messages to the chat") {
                deleteRowsByColumnValue(telegram_id_sheet, 2, chat_id);
                Logger.log("Deleted chat ID " + chat_id + " from sheet due to insufficient rights.");
            }

            // Case 4: Group chat was deleted
            else if (description === "Forbidden: the group chat was deleted") {
                deleteRowsByColumnValue(telegram_id_sheet, 2, chat_id);
                Logger.log("Deleted chat ID " + chat_id + " from sheet due to deleted group.");
            }

            // Case 5: Bot was kicked from group
            else if (description === "Forbidden: bot was kicked from the group chat") {
                deleteRowsByColumnValue(telegram_id_sheet, 2, chat_id);
                Logger.log("Deleted chat ID " + chat_id + " — bot was kicked from the group.");
            }

            // Case 6: Bot was blocked by the user
            else if (description === "Forbidden: bot was blocked by the user") {
                deleteRowsByColumnValue(telegram_id_sheet, 2, chat_id);
                Logger.log("Deleted chat ID " + chat_id + " — bot was blocked by the user.");
            }

            // Case 7: Message is not modified
            else if (description === "Bad Request: message is not modified") {
                Logger.log("Skipped chat ID " + chat_id + " — message not modified.");
            }

            // Case 8: Rate limit exceeded
            else if (description.startsWith("Too Many Requests")) {
                Logger.log("Rate limit reached. Consider retrying after delay for chat ID: " + chat_id);
                Utilities.sleep(1000);
            }

            // Fallback for unknown 400/403/429 errors
            else {
                Logger.log("Unhandled error for chat ID " + chat_id + ": " + description);
            }
        }
    }
}




function new_update_exists(notifications) {
    const dataRange = ktu_update_sheet.getDataRange().getValues();
    const existingMessages = dataRange.map(row => row[0]);

    const latest_update = existingMessages[0];

    for (let each_notification = 0; each_notification < notifications.length; each_notification++) {
        const item = notifications[each_notification];
        const title = item.title;
        const message = item.message;

        if (existingMessages.includes(title)) {
            Logger.log("Exact announcement already exists in gsheets, skipping");
        } else {
            Logger.log("Calculating difference between :" + title + "and latest heading:" + latest_update);

            const percent = calculateWordDifferencePercentage(latest_update, title);

            if (percent > 70) {
                Logger.log(`Changes more than 50%,` + percent + ` inserting "${title}" into sheet`);
                ktu_update_sheet.insertRowBefore(1).getRange(1, 1, 1, 1).setValues([
                    [title]
                ]);
                Utilities.sleep(2000);
                return [true, item];
            } else {
                Logger.log("Not much changes..!!");
                ktu_update_sheet.insertRowBefore(1).getRange(1, 1, 1, 1).setValues([
                    [title]
                ]);
                return [false, null];
            }
        }
    }
    return [false, null];
}
