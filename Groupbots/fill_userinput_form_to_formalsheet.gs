function starthere() {
  
  var subjects_firstyr=["Linear Algebra & Calculus","Engineering Physics A","Engineering Physics B","Engineering Chemistry","Engineering Mechanics","Engineering Graphics","Basics Of Civil & Mechanical Engineering","Basics Of Electrical & Electronics Engineering","Life Skills","Vector Calculus , Differential Equations & Transforms","Professional Communication","Programming In C"];
  var subjectcode_firstyr=["MAT101","PHT100","PHT110","CYT100","EST100","EST110","EST120","EST130","HUN101","MAT102","HUN102","EST102"];
  
  var status=SpreadsheetApp.openById("1X-5aa6n9HFQAYhBSkTTr3GnuO9dnsJ0kxAdOwQw6OwM").getSheets()[0].getRange("G2:G").getValues();
  var year=SpreadsheetApp.openById("1X-5aa6n9HFQAYhBSkTTr3GnuO9dnsJ0kxAdOwQw6OwM").getSheets()[0].getRange("C2:C").getValues();
  var subjectname=SpreadsheetApp.openById("1X-5aa6n9HFQAYhBSkTTr3GnuO9dnsJ0kxAdOwQw6OwM").getSheets()[0].getRange("D2:D").getValues();
  var scheme=SpreadsheetApp.openById("1X-5aa6n9HFQAYhBSkTTr3GnuO9dnsJ0kxAdOwQw6OwM").getSheets()[0].getRange("B2:B").getValues();
  var moduleno=SpreadsheetApp.openById("1X-5aa6n9HFQAYhBSkTTr3GnuO9dnsJ0kxAdOwQw6OwM").getSheets()[0].getRange("H2:H").getValues();
  var fileurl=SpreadsheetApp.openById("1X-5aa6n9HFQAYhBSkTTr3GnuO9dnsJ0kxAdOwQw6OwM").getSheets()[0].getRange("F2:F").getValues();
  var namecontributor=SpreadsheetApp.openById("1X-5aa6n9HFQAYhBSkTTr3GnuO9dnsJ0kxAdOwQw6OwM").getSheets()[0].getRange("I2:I").getValues();
  var designation=SpreadsheetApp.openById("1X-5aa6n9HFQAYhBSkTTr3GnuO9dnsJ0kxAdOwQw6OwM").getSheets()[0].getRange("J2:J").getValues();
  var materialtype=SpreadsheetApp.openById("1X-5aa6n9HFQAYhBSkTTr3GnuO9dnsJ0kxAdOwQw6OwM").getSheets()[0].getRange("E2:E").getValues();
  
  
   for(var j=0;j<status.filter(String).length;j++)  
        {
          if(status[j][0]=="New")
          {
            if(scheme[j][0]=="2019 Scheme")
            {
              if(year[j][0]=="1st Year")
               {
                  for(var i=0;i<subjects_firstyr.filter(String).length;i++)
                      {
                        if(subjectname[j][0]==subjects_firstyr[i])
                        {
                          var row=j+2;
                          console.log("Time","New","2019 Batch","1","Common",subjectname[j][0],subjectcode_firstyr[i],"https://4.bp.blogspot.com/-8MSIODOfhLA/XoWGHWHDNBI/AAAAAAAAxt4/5ohH77dStsQo_tt8KIa2Td-UKadE-PhygCPcBGAYYCw/s1600/VPN%2B%25282%2529.jpg",materialtype[j][0],moduleno[j][0],fileurl[j][0],namecontributor[j][0],designation[j][0]);
                           SpreadsheetApp.openById("1Sjxm5L7K7dYBfevFeSM4dBUPykWKwnmR1AOUKVxMYNo").getSheets()[0].appendRow(["Time","New","2019 Batch","1","Common","Common",subjectname[j][0],subjectcode_firstyr[i],"https://4.bp.blogspot.com/-8MSIODOfhLA/XoWGHWHDNBI/AAAAAAAAxt4/5ohH77dStsQo_tt8KIa2Td-UKadE-PhygCPcBGAYYCw/s1600/VPN%2B%25282%2529.jpg",materialtype[j][0],moduleno[j][0],fileurl[j][0],namecontributor[j][0],designation[j][0]]);
                          SpreadsheetApp.openById("1X-5aa6n9HFQAYhBSkTTr3GnuO9dnsJ0kxAdOwQw6OwM").getSheets()[0].getRange('G'+row).setValue("Updated");
                        }
                      }
           
               }
            }
          }
        }
  
}
