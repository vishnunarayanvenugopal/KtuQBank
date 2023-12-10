var SheetID="1Uk6GYhXjv5CKZDPdZkHpLoo-9PL4NVMGpcrCd-mFcSU";

function RUNTHIS()
{
  var Dates=SpreadsheetApp.openById(SheetID).getSheets()[0].getRange("B4:B").getValues().filter(String);
  var Days=SpreadsheetApp.openById(SheetID).getSheets()[0].getRange("C4:C").getValues().filter(String);
  var Examname=SpreadsheetApp.openById(SheetID).getSheets()[0].getRange("D1:D1").getValues().filter(String);
  
  var lengthof=Days.length;
  
  var S1=SpreadsheetApp.openById(SheetID).getSheets()[0].getRange("D4:D").getValues();
  var S2=SpreadsheetApp.openById(SheetID).getSheets()[0].getRange("E4:E").getValues();
  var S3=SpreadsheetApp.openById(SheetID).getSheets()[0].getRange("F4:F").getValues();
  var S4=SpreadsheetApp.openById(SheetID).getSheets()[0].getRange("G4:G").getValues();
  var S5=SpreadsheetApp.openById(SheetID).getSheets()[0].getRange("H4:H").getValues();
  var S6=SpreadsheetApp.openById(SheetID).getSheets()[0].getRange("I4:I").getValues();
  var S7=SpreadsheetApp.openById(SheetID).getSheets()[0].getRange("J4:J").getValues();
  var S8=SpreadsheetApp.openById(SheetID).getSheets()[0].getRange("K4:K").getValues();
  
  var main=[];
  
  main.push(S1.slice(0,lengthof));
  main.push(S2.slice(0,lengthof));
  main.push(S3.slice(0,lengthof));
  main.push(S4.slice(0,lengthof));
  main.push(S5.slice(0,lengthof));
  main.push(S6.slice(0,lengthof));
  main.push(S7.slice(0,lengthof));
  main.push(S8.slice(0,lengthof));
  
  var branchshortcode=["CST","MET","CET","EET","ECT","ITT","AET","BTT","BMT","ICT","AOT","AUT","CHT","EBT","FTT","IET","MUT","MPT","MRT","MTT","SBT","POT","PET","RAT","FST"];
  var Branches=["Computer Science Engineering","Mechanical Engineering","Civil Engineering","Electrical And Electronics Engineering","Electronics And Communication Engineering","Information Technology","Applied Electronics And Instrumentation","Biotechnology Engineering","Biomedical Engineering","Instrumentation & Control Engineering","Aeronautical Engineering","Automobile Engineering","Chemical Engineering","Electronics And Biomedical Engineering","Food Technology","Industrial Engineering","Mechanical (Automobile) Engineering","Mechanical Production Engineering","Mechatronics","Metallurgical & Materials Engineering","Naval Architecture & Ship building","Polymer Engineering","Production Engineering","Robotics & Automation","Safety & Fire Engineering"];
  
  var Datauniqcode=SpreadsheetApp.openById(SheetID).getSheets()[1].getRange("A1:A").getValues().filter(String);
  var Datauniqcode = [].concat.apply([], Datauniqcode);
  
  var Datasubcode=SpreadsheetApp.openById(SheetID).getSheets()[1].getRange("B1:B").getValues().filter(String);
  var Datasubcode = [].concat.apply([], Datasubcode);
  
  var Datasubname=SpreadsheetApp.openById(SheetID).getSheets()[1].getRange("C1:C").getValues().filter(String);
  var Datasubname = [].concat.apply([], Datasubname);

for(var k=0;k<branchshortcode.length;k++)
//for(var k=0;k<1;k++)
{ 
  var actualsheet=k+2;
  
  SpreadsheetApp.openById(SheetID).getSheets()[actualsheet].getRange(1,6,1,1)//(start row, start column, number of rows, number of columns
   .setValues([[Branches[k]+" - "+Examname+" - Detailed Timetable"]]);

  for(var i=0;i<main.length;i++)
  {
     var actualsem=i+1;
     if(main[i].filter(String).length>0)
     {
       SpreadsheetApp.openById(SheetID).getSheets()[actualsheet].appendRow([" "]);
       SpreadsheetApp.openById(SheetID).getSheets()[actualsheet].appendRow(["Semester-"+actualsem]);
       SpreadsheetApp.openById(SheetID).getSheets()[actualsheet].appendRow([" "]);
     }
     
    for(var j=0;j<main[i].length;j++)
      {
        if(main[i][j]!="")
              { 
                  
                  //console.log(branchshortcode[k]+"-"+i+"-"+main[i][j]);
                  var tosearch=branchshortcode[k]+"-"+actualsem+"-"+main[i][j];
                  
                  var indexmatched=getAllIndexes(Datauniqcode, tosearch);
                  var lengthreuse=indexmatched.length;
                  
                  console.log(tosearch);
                  console.log(indexmatched);
                  
                  if(lengthreuse>1)
                  {
                    var Avals = SpreadsheetApp.openById(SheetID).getSheets()[actualsheet].getRange("A1:A").getValues();
                    var Alast = Avals.filter(String).length;
                    
                    for(var q=0;q<lengthreuse;q++)
                    {
                      SpreadsheetApp.openById(SheetID).getSheets()[actualsheet].appendRow([Dates[j][0],Days[j][0],main[i][j][0],Datasubcode[indexmatched[q]],Datasubname[indexmatched[q]]]);
                    }
                  }
                  else
                  {
                    SpreadsheetApp.openById(SheetID).getSheets()[actualsheet].appendRow([Dates[j][0],Days[j][0],main[i][j][0],Datasubcode[indexmatched[0]],Datasubname[indexmatched[0]]]);
                  }
             }
      }
  }
}
 
  console.log("DOne");
}

function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
}
