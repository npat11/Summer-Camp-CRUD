# Final Project: Summer Camp Application

## Due Date: Thursday, July 18, 2024 11:55 PM EST
## Objectives: To implement both a server and web client for a complete web application as well as data persistence with mongodb

## Specifications/Requirements  

 For this project you will implement an app called <strong>SummerCamp</strong> that allow users to submit an application for a summer camp. You will define a server (using Node.js) that will allow users to submit information and retrieve that information form a MongoDB database. A video showing the system's functionality can be found at <a href="https://umd.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=240ec4ed-6258-41e4-a152-ae8a00fe04ce">Application Video</a>.<strong>You should watch this video before you continue reading.</strong>

 We have provided you with the main page as well as a sample page to give you hints as to how you could design your application. You are free to decide how you want to implement your application views but you need to complete the `server.js` file where you will define your endpoints that will serve the views back to the client, as well as the `applicationDB.js` file - in this file you just need to complete the functions with TODO statements inside their fucntion body and then use those functions inside of `server.js` as well as `application.js`.  The `application.js` file will create an api that will provide all the CRUD functionality associated with an application: create an application, update an application, retrieve all applications, retrieve an individual application, retrieve an application based on query parameters, delete an individual applicaiton and delete all applications.
 __You need to enter your directory id inside of the `.env` file on line 3. You must do this first!__

* You will need to commit your changes and push them to your repository on the University Gitlab server. __After you push your changes you should verify that you see your code in your repo in the cloud.__
*  __Carefully Read - As we don't have automatic testing performed by the submit server, we will only grade the last submission you provide. If you provide both an on time and a late submission, we will only grade the last submission and apply a 12 pts penalty to it.__
