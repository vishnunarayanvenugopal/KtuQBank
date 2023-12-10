function doPost(e) {
  console.log(e);
  Logger.log("I was called")
  if(typeof e !== 'undefined')
  Logger.log(e.parameter);
  var ss= SpreadsheetApp.openById("1VuERT1pGB9LnqbL-63U9pLjESj4Y82Z6EFbFSMpZ0DQ")
  var sheet = ss.getSheetByName("Sheet1")
  
  function gettelegram() {
  const url = "https://t.me/ktuliveupdates";
   
  const s = UrlFetchApp.fetch(url).getContentText();
  var new1=s.replace(/[\r\n]/g, '');
 
  var newnew=new1.match(/<div class=\"tgme_page_extra\">(.+?)subscribers<\/div><div class=\"tgme_page_description\" dir=\"auto\">/g);
   console.log(newnew);
  var content=newnew.toString().replace(/<div class=\"tgme_page_extra\">/g,"");
  var content=content.toString().replace(/subscribers<\/div><div class=\"tgme_page_description\" dir=\"auto\">/g,"");
  var content=content.toString().replace(/ /g,"");
  sheet.getRange('B2').setValue(content)
  }
  gettelegram();
  
  
  var [headers, ...rows] = SpreadsheetApp.openById("1VuERT1pGB9LnqbL-63U9pLjESj4Y82Z6EFbFSMpZ0DQ").getSheets()[0].getDataRange().getValues();
  var objects = convertToObjects(headers, rows);

  if(e.parameter.name!==undefined)
    {
      sheet.getRange('A2').setValue(e.parameter.name)
    }
 else if(e.parameter.insta!==undefined)
   {
      sheet.getRange('C2').setValue(e.parameter.insta)
   }
  
  return ContentService.createTextOutput(JSON.stringify(objects))
}

function convertToObjects(headers, rows)
{
  return rows.reduce((ctx, row) => {
    ctx.objects.push(ctx.headers.reduce((item, header, index) => {
      item[header] = row[index];
      return item;
    }, {}));
    return ctx;
  }, { objects: [], headers}).objects;
}

