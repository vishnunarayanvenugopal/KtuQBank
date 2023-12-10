function myFunction() {
   var lengthexact=SpreadsheetApp.getActiveSheet().getRange("A2:A").getValues().filter(String).length;
  var status=SpreadsheetApp.getActiveSheet().getRange("G2:G").getValues();
   var rows = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
  
 console.log(lengthexact);
  for(var i=0;i<lengthexact;i++)
  {
    if(status[i]!="Mailed")
    {
      var row=i+2;
      SpreadsheetApp.getActiveSheet().getRange('G'+row).setValue("Mailed");
      MailApp.sendEmail("xxxxx@gmail.com", "KtuQbank Bug Report", "Name:- "+rows[(i+1)][3]+"Mail:- "+rows[(i+1)][5]+"Whatsapp No:- "+rows[(i+1)][4]+"ISSUE:- "+rows[(i+1)][1]+"URL:- "+rows[(i+1)][2]);
       
    }
  }
}
