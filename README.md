# cs-239-data-privacy
Repo containing all research and code for CS 239: Introduction to HCI at UCLA for Winter 2025.

##  Installation:

1) Clone into the repo on your local machine
2) You may need to download some packages:
   a) node.js
   In npm:
     b) axios
     c) cors
     d) express
     e) puppeteer
     f) vite

3) cd into server folder and run "node server.js"
       a) you should see "Puppeteer serving running..." in console
4) go to chrome settings -> extensions and click 'load unpacked'
5) go to the cs-239-data-privacy folder and then click the 'extension-files' folder in it, click select
6) You should now be able to go to Instagram.com or Facebook.com on chrome and click sign up, the popup should appear
7) NOTE: if you get a 401 error on the console from the express server, this means you need to add a new API key for openrouter.com. You can request these on openrouter.com and change the API key in the summarizer.js file

# Logo
![logo](./logo.png)
