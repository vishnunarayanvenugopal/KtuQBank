function processTemplateWithUniqueRef(uniqueRef, replacementMap) {
  var sheet = SpreadsheetApp.openById(updates_sheet_id).getSheetByName("Post_Templates");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];  // First row contains the header names
  var headerMap = {};

  // Create a map of header names to column indexes
  headers.forEach(function(header, index) {
    headerMap[header] = index;
  });

  for (var i = 1; i < data.length; i++) {
    if (data[i][headerMap['UniqueRef']] == uniqueRef) {
      var template_struct = data[i][headerMap['Template']];
      template_struct = replacePlaceholders(template_struct, replacementMap);
      return template_struct
    }
  }
}
