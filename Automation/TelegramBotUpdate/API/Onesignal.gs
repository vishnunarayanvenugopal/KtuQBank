function callit()
{
  var heading="Result of MBA T6(S) Exam Feb 2020 FT is published.";
  var content="The result of MBA T6(S) Exam Feb 2020 FT is published herewith. Candidates who desire to apply for a copy of the answer scripts can register through the portal from 01.06.2020 to 06.06.2020 (date applicable for both student and college) by remitting a fee of ₹500. Late requests for answer scripts will not be allowed.";
  var url="https://www.ktuqbank.com/2020/05/result-of-mba-t6s-exam-feb-2020-ft-is.html";
  
  onesignalAPI(heading,content,url);
}

function onesignalAPI(heading,content,posturl)
{
  
var url = "https://onesignal.com/api/v1/notifications";
var data ={"app_id": "331d5750-052e-48b5-b32c-25c1b9f2f47a",
"contents": {"en": heading},
"included_segments": ["All"],
	"headings":{"en": heading },
	"subtitle":{"en": content },
	"url": posturl,
	"big_picture":"https://4.bp.blogspot.com/-HrWsTFFA6Wk/XpMb5AV2HhI/AAAAAAAAx_U/lRBaro0UkrQHfwwz92OJ2ksP2dOZgpEYQCLcBGAsYHQ/s1600/1-c3cQvYJrVezv_Az0CoDcbA.jpeg",
	"chrome_web_image":"https://4.bp.blogspot.com/-HrWsTFFA6Wk/XpMb5AV2HhI/AAAAAAAAx_U/lRBaro0UkrQHfwwz92OJ2ksP2dOZgpEYQCLcBGAsYHQ/s1600/1-c3cQvYJrVezv_Az0CoDcbA.jpeg",
	"chrome_big_picture":"https://4.bp.blogspot.com/-HrWsTFFA6Wk/XpMb5AV2HhI/AAAAAAAAx_U/lRBaro0UkrQHfwwz92OJ2ksP2dOZgpEYQCLcBGAsYHQ/s1600/1-c3cQvYJrVezv_Az0CoDcbA.jpeg"
	
};
var options = {
    'method' : 'post',
   'headers': {
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization': 'xxxx'
  },
    'payload' : JSON.stringify(data),
  };
var response = JSON.parse(UrlFetchApp.fetch(url, options));
 
return(response.link);
}
