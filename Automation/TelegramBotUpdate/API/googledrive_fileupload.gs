function main(){
url="https://ktu.edu.in/eu/att/attachments.htm?download=file&id=UH2rI4iTf9N8ruLH4bk2ArjxUiXlsNQ4DaEtThRilSo%3D&announcementId=GBOo2WCgX8Ud%2FGnFZDnf8Kg82lePCSl7Ul5WgrNnjM4%3D&fileName=Resultnotification-B.DesS1D19.pdf&downloadType=qK1BQytrymetvS5b1dtCP6Y%2FH1JXi4jkufaDd4aLVM4%3D";
  folderid="1eswf1VK87qH2MksEOoGKqD7A4nkcC6o2";
  filename="check";
  
  uploadToDrive(url, folderid, filename);
}

function uploadToDrive(url, folderid, filename) {
  var msg = '';
  var response;
var drivefileurl=[];
  try {
    response = UrlFetchApp.fetch(url, {
      // muteHttpExceptions: true,
      // validateHttpsCertificates: false,
      followRedirects: true  // Default is true anyway.
    });
  } catch(e) {
    return e.toString();
  }

  if (response.getResponseCode() === 200) {
    if (!filename) {
      // TODO: try content-disposition.
      filename = getFilenameFromURL(url);
    }

    if (!filename) {
      msg += 'Aborting: Filename not detected. Please supply a filename.\n'
    } else {
      var folder = DriveApp.getRootFolder();
      if (folderid) {
        folder = DriveApp.getFolderById(folderid);
      }
      var blob = response.getBlob();
      var file = folder.createFile(blob);
       file.setName(filename);
      file.setDescription("Downloaded from " + url);
      drivefileurl.push(file.getDownloadUrl());
     
      
      
      var headers = response.getHeaders();
      var content_length = NaN;
      for (var key in headers) {
        if (key.toLowerCase() == 'Content-Length'.toLowerCase()) {
          content_length = parseInt(headers[key], 10);
          break;
        }
      }

      var blob_length = blob.getBytes().length;
      msg += 'Saved "' + filename + '" (' + blob_length + ' bytes)';
      if (!isNaN(content_length)) {
        if (blob_length < content_length) {
          msg += ' WARNING: truncated from ' + content_length + ' bytes.';
        } else if (blob_length > content_length) {
          msg += ' WARNING: size is greater than expected ' + content_length + ' bytes from Content-Length header.';
        }
      }
      msg += '\nto folder "' + folder.getName() + '".\n';
    }
  } else {
    msg += 'Response code: ' + response.getResponseCode() + '\n';
  }

  // Debug: printing response headers.
  // msg += JSON.stringify(response.getHeaders(), undefined, 2) + '\n';
//console.log(drivefileurl);
  return drivefileurl;
}
