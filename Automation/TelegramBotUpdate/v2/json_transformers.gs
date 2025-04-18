function processKTUAnnouncementData(data) {
  if (!data || !data.content || data.content.length === 0) {
    Logger.log("No announcements found.");
    return "[]";  // empty JSON array
  }
  var notifications = data.content.map(function(item) {
    return {
      title:       item.subject       || "",
      description: item.message       || "",
      attachments: item.attachmentList || []
    };
  });
  return notifications;
}
