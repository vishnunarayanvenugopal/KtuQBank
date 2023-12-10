 var url = "https://api.telegram.org/xxxx/sendMessage";
  var raw = JSON.stringify({"inline_keyboard":[individual_links,[{"text":"Subcribe channel","url":"https://t.me/ktuliveupdates"},{"text":"Send to Whatsapp","url":watext}],[{"text":"Get Whatsapp Updates","url":"http://link.ktuqbank.com/join"}]]});
  var data ={
    'chat_id': newchat_id[i],
    'text': "\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\r\n\r\n      \uD83D\uDCD1\uD83D\uDCDB NEW UPDATE \uD83D\uDCDB\uD83D\uDCD1\r\n\r\n\uD83D\uDCCC " + heading[j] +" \r\n\r\n\u2763" + content[j] +"\r\n\r\n\uD83D\uDCE5 "+blogurl +"\r\n\r\n\uD83E\uDD16 add me to your telegram groups to get live updates @ktuupdatesbot\r\n\r\n\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\r\n\uD83D\uDDD3 "+ date +" @ "+ time +"\r\n\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796\u2796",
    'reply_markup': raw
  };
    
var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(data)
  };
  
  
var response = UrlFetchApp.fetch(url, options);
 console.log(response);
