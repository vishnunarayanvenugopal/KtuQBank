# KtuQbank

A website for KTU students with study materials, syllabus , question papers etc. We provide automated updates on telegram and whatsapp.

## Getting Started

1. Automation : 
   
         (i) Automation Whatsapp KTU Updates
   
        (ii) Automation telegram bot KTU Updates
   
        (iii) Automation KTU Question Papers (2015 Batch & 2019 Batch)
        
        (iv) Automation Study Materials (2019 Batch)
        
        (v) Automation Solved Qp (2015 Batch)
   
2 . Blogspot :

     (i) Custom Page Designs
   
     (ii) Blogger KtuQbank Backup
   
     (iii) Google Form to custom HTML form with Javascript
   
3 . Admin Dashboard With all important links 

4 . study material bot (WEB API) 
   
     (i) API responding dialogflow requests
   
     (ii) public form to Main database feeding
   

### Prerequisites

1. Automation

a) Autoupdates on whatsapp

Send updates from KTU website automatically to whatsapp users.

```
Requires: (Android)
  i) Tasker (https://bit.ly/3bRU1Ho)
  ii) Autoweb (https://bit.ly/3aLx72Y)
  iii) Autoinput (https://bit.ly/2KQnmWw)
  iv) Webalert (https://bit.ly/3bSuj5o)
  v) webalert xp (https://bit.ly/3bRUmcX)
  vi ) Autoapps (https://bit.ly/2YqQg81)
```

b) Autoupdates on Telegram

Send updates from KTU website automatically to telegram users or groups.

```
Requires: (Android)
  i) google app script
  ii) telegram bot
```

c) Google Sheet As a Database To Autowebsite Update Using Google App script

Upload Question Papers via google form and get it updated in website automatically. The Question Paper gets sorted automatically as full question papers, sorted exam wise and yearwise.

   2015 QP
   2019 Qp

```
Requires: (Google Account)
  i) google Form
  ii) Google Sheet
  iii) Google App script
```


### Installing

1. Automation

a) Autoupdates on whatsapp

```
(i) Install these applications 
(ii) import the tasker profiles and backups in the folder tasker under automation.
(iii) import the api backups into autoweb
(iv) import webalert backups
(v) open all and configure intial settings if any and wait for update
```
b) Autoupdates on telegram
```
(i) create a bot using botfather and get api key 
(ii) create an excel sheet for storing chat id and copy paste getchat id file contents
(iii) create another excel file and paste Autoupdatebot.js contents into google app script 
```

c) AutoQuestion Paper

```
(i) Set Up google form and corresponding google sheet
ii) copy paste code in code.gs
iii) after getting form responses just run the script (RUN THIS)
v) make sure u installed auth 2.0 library
iv) for first use set up blogger API and authenticate (GET SERVICE & BLOGGER API)

```
d) Autostudymaterial

```
(i) Set Up google form and corresponding google sheet
ii) copy paste code in code.gs
iii) after getting form responses just run the script (RUN THIS)
v) make sure u installed auth 2.0 library
iv) for first use set up blogger API and authenticate (GET SERVICE & BLOGGER API)

```

## Built With

* tasker
* google app script

## Authors

* **Vishnu Narayan V** - *Initial work* - [vichuroxx](https://github.com/vichuroxx)

## License

meant for internal use & educational purposes, not for commercial purposes.

## Acknowledgments

* Thanks to autoapps (joaoapps)
* Thanks to google app script
