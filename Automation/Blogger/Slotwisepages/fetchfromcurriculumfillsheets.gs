function fetchsubjectdata() {

 var lengthexact=SpreadsheetApp.getActiveSheet().getRange("D2:D").getValues().filter(String).length;
  var code=SpreadsheetApp.getActiveSheet().getRange("D2:D").getValues();
   var rows = SpreadsheetApp.getActiveSheet().getDataRange().getValues(); 
    var CurriculumData = SpreadsheetApp.openById("1JLuI-8pxINuJG93cMt-g1Uf32Dd9-gvQZxY56oYg8BY").getSheets()[0].getDataRange().getValues().filter(String); 
    var codeincurriculum=[];
    
    for(var j=0;j<CurriculumData.length;j++)
    {
      codeincurriculum.push(CurriculumData[j][4]);
    }
   
  for(var i=0;i<(lengthexact+1);i++)
  {
    if(rows[i][4]=="")
    {
     var a = codeincurriculum.indexOf(rows[i][3]);
      var row=i+1;
      SpreadsheetApp.openById("1tf2ufh4aBYHUbCLm6vpcvEGWP-jz5_8mtci5x5EXfpo").getSheets()[0].getRange('A'+row).setValue("_");
      SpreadsheetApp.openById("1tf2ufh4aBYHUbCLm6vpcvEGWP-jz5_8mtci5x5EXfpo").getSheets()[0].getRange('B'+row).setValue(CurriculumData[a][1]);
      SpreadsheetApp.openById("1tf2ufh4aBYHUbCLm6vpcvEGWP-jz5_8mtci5x5EXfpo").getSheets()[0].getRange('C'+row).setValue(CurriculumData[a][2]);
      SpreadsheetApp.openById("1tf2ufh4aBYHUbCLm6vpcvEGWP-jz5_8mtci5x5EXfpo").getSheets()[0].getRange('E'+row).setValue(CurriculumData[a][6]);
    }
  }
  
}

