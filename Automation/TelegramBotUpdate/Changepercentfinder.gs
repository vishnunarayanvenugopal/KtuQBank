function callitt()
{
string1="The last date for submission of application for appointment to the post of Assistant Director on deputation basis in the University has been extended upto 05/06/2020 4.00 pm";
string2="The last date for submission of application for appointment to the post of Assistant Director on deputation basis in the University notified vide Notification No.KTU/AR(ADMN)/2017 Dated 24.04.2020 has been extended upto 05/06/2020 4.00 pm";
  
  if(changepercent(string1,string2)==-1)
  {
    console.log("sendupdate");
  }
}

function changepercent(string1,string2) {

  var s1Parts= string1.split(' ');
  var s2Parts= string2.split(' ');
  
  
const unique = (value, index, self) => {
  return self.indexOf(value) === index
}


const s1Partsnew = s1Parts.filter(unique);
const s2Partsnew = s2Parts.filter(unique);


  var matched = 0;

for(var i = 0; i<s1Partsnew.length; i++)
{
  for(var j = 0; j<s2Partsnew.length; j++)
      {
        if(s1Partsnew[i] == s2Partsnew[j])
         matched++;   
      }
   
}
  var percentage=(matched/Math.max(s1Partsnew.length, s2Partsnew.length))*100;
  
 
if(percentage<50)
{
  b=-1;
}
  else
  {
    b=0;
  }
  return b;

}
