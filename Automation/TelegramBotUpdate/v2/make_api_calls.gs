function makeAPICallWithUniqueRef(uniqueRef, replacementMap) {
  var sheet = SpreadsheetApp.openById(updates_sheet_id).getSheetByName("API_Calls_Ref");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];  // First row contains the header names
  var headerMap = {};

  // Create a map of header names to column indexes
  headers.forEach(function(header, index) {
    headerMap[header] = index;
  });

  for (var i = 1; i < data.length; i++) {
    if (data[i][headerMap['UniqueRef']] == uniqueRef) {
      var endpoint = data[i][headerMap['Endpoint']];
      var methodType = data[i][headerMap['MethodType']];
      var headersValue = data[i][headerMap['Header']];
      var params = data[i][headerMap['Params']];
      var payload = data[i][headerMap['Payload']];

      // Replace placeholders in headers, params, and payload using the provided mapping
      var result = replacePlaceholdersAndHandleBlobs(endpoint, headersValue, params, payload, replacementMap);
      endpoint = result.endpoint;
      headersValue = result.headersValue;
      params = result.params;
      payload = result.payload;

      // Build URL and options for the request
      var url = params ? endpoint + '?' + params : endpoint;
      var options = {
        'method': methodType.toUpperCase(),
        'headers': parseHeaders(headersValue),
        'muteHttpExceptions': true
      };

      if (methodType.toUpperCase() === 'POST' && payload) {
        options.payload = payload;
      }

      try {
        var response = UrlFetchApp.fetch(url, options);
        var result = response.getContentText();
        Logger.log(url); 
        Logger.log(options)
        Logger.log(result);  // Print the result to the logs
        return result;  // Return the result instead of writing to the sheet
      } catch (e) {
        Logger.log(url); 
        Logger.log(options); 
        var errorMessage = 'Error: ' + e.message;
        Logger.log(errorMessage);  // Print the error to the logs
        return errorMessage;  // Return the error message
      }
      break;
    }
  }
}

// Function to parse headers in "key: value" format
function parseHeaders(headers) {
  var parsed = {};
  var headerArray = headers.split(',');

  headerArray.forEach(function(header) {
    var index = header.indexOf(':');
    if (index > -1) {
      var key = header.substring(0, index).trim();
      var value = header.substring(index + 1).trim();
      parsed[key] = value;
    }
  });

  return parsed;
}

// Function to replace both string placeholders and Blob objects in headers, params, and payload
function replacePlaceholdersAndHandleBlobs(endpoint, headersValue, params, payload, map) {
  // Replace placeholders in strings (like {key}) with corresponding values from the map
  endpoint = replacePlaceholders(endpoint, map);
  headersValue = replacePlaceholders(headersValue, map);
  params = replacePlaceholders(params, map);
  if (payload) {
    payload = replacePlaceholders(payload, map);
  }

  // Handle Blob objects by checking if any placeholder is a Blob
  for (var key in map) {
    if (map.hasOwnProperty(key) && map[key] && map[key].getBytes) {
      // Replace the placeholder in the payload with the actual Blob object
      if (payload && payload.includes(key)) {
        payload = payload.replace(new RegExp(key, 'g'), map[key]);
      }
    }
  }

  return { endpoint, headersValue, params, payload };
}

// Function to replace placeholders in a string using a provided map
function replacePlaceholders(str, map) {
  for (var key in map) {
    str = str.replace(new RegExp(key, 'g'), map[key]);
  }
  return str;
}
