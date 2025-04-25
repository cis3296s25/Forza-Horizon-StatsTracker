# Forza Horizon Stats Tracker

## Overview
Forza Horizon 5 StatHub is a web application designed to allow users to view and compare their Forza Horizon 5 in-game stats with other players around the Forza Horizon 5 gaming community. Stats will be gathered via users self-reporting their in-game stats. Users will upload screenshots of their Forza Horizon 5 in-game stats in order for the web application to process and verify the validity of the stats. The stats that will be gathered will include: time played, credits earned, number of victories, etc. Through this website, users will be able to view a community leaderboard where they can analyze the top players’ stats or compare their own stats with another verified user.

![homepage](./homepage.png)

## Features
- **Search for Stats**: User can search up their username for their Forza Horizon 5 Stats and it will display a stats table 

- **Compare Stats**: Verified users will be able to compare their stats with other verified users in the community

- **View Leaderboard**: Users will be able to view a leaderboard of verified users to see where they rank amongst other users

- **Update Stats**: Registered users can update their existing stats to reflect their latest in-game progress.

- **Inputting Stats via Screenshots**: Users will be able to upload screenshots of their stats in the Forza Horizon 5 gmae instead of having to manually input data for each required stats field 

## Conceptual Design
- **Backend**: Node.js, Express.js

- **Frontend**: HTML, CSS, JavaScript

- **Framework**: React

- **Database**: MongoDB  

- **APIs**: Steam API, Xbox API, ChatGPT API
- **Design**: Figma

- **Render**: Will be hosted on render.

## Modifications to Project for Personal Use (.env file)

### Disclaimer for API Keys ### 

- You will need to create your own .env file in the backend folder, and this file will hold all the API keys mentioned below. 

<pre><code class="language-env">MONGO_URI = your_mongodb_uri 
PORT=3000 
STEAM_API_KEY = your_steam_api_key 
XBOX_API_KEY = your_xbox_api_key 
SERVER = http://localhost:5173/ 
JWT_SECRET = your_jwt_secret 
RESET_EMAIL = your_email@example.com 
RESET_EMAIL_PASSWORD = your_email_password 
OPENAI_API_KEY = your_openai_key</code></pre>

### Frontend .env file
1. Create a .env file in the frontend folder
2. Add VITE_SERVER=http://localhost:3000/ into the file like seen below

<pre><code class="language-env">VITE_SERVER=http://localhost:3000/</code></pre>


### How to get MongoDB URI:

1. To get your own MongoDB URI, create a MongoDB account if you don't have one with the following link: https://www.mongodb.com/cloud/atlas/register. 
2. Then, navigate to this link https://www.freecodecamp.org/news/get-mongodb-url-to-connect-to-a-nodejs-application/ and follow the steps given to acquire your own MongoDB URL. 
3. Copy the MongoDB URI and paste it into the .env file in the backend folder in the following manner: "MONGO_URI = your_mongo_uri_here".

### How to get Steam API Key: 
1. To get your own Steam API key, you will first need to create a Steam account if you do not have one already at https://store.steampowered.com/join. 
2. Afterwards, you will need to navigate to https://steamcommunity.com/dev/apikey and register for an API key here. 
3. When prompted for a domain name, you can enter the domain of your web applicaton or you can just input anything for the domain name in order to acquire the API key. 
4. After pressing the register button, you should see your Steam API key and you can copy and paste that into your .env file located in the backend folder in the following manner: "STEAM_API_KEY = your_steam_api_key_here". 

### How to get Xbox API Key:
1. To get your own Xbox API key, you will need to create a Microsoft account if you do not have one already at https://account.microsoft.com/account.
2. Then, you will need to go to https://xbl.io/ and click "Login with Xbox Live." 
3. After logging in with your Microsoft account, navigate to the "Personal API keys" section and press "Create+" to get a new Xbox API key. 
4. Lastly, copy the Xbox API key that you created, and paste it into your .env file located in the backend folder in the following manner: "XBOX_API_KEY = your_xbox_api_key_here".  

### JWT Token:
1. In the .env file you can input a random string and this will be used by the backend to generate a JWT token.
- Example: JWT_SECRET = secretjwtokenhere

### Reset Email & Password for Forget Password Functionality
1. First, create a brand new Gmail account and this will serve as the email that will send the forget password link to the user's email. 
2. This email will be the value for "RESET_EMAIL" in the .env file of the backend folder.
3. Next, you can get the app password using the instructions from this link: https://support.google.com/mail/answer/185833?hl=en
4. You will input the 16-digit app password that you retrieved and copy and paste it into the value for "RESET_EMAIL_PASSWORD" which is also in the .env file in the backend folder. 

### How to get ChatGPT API Key:
1. To get a ChatGPT API Key, you can follow the instructions in this link: https://www.merge.dev/blog/chatgpt-api-key

## Live Website
Visit the live website: https://forza-horizon-statstracker.onrender.com
Back-up website: https://forza-horizon-frontend-statstracker.onrender.com


## Installation & Running Locally 
Make sure you have to 
To run the project locally, clone the repository and install dependencies:
``` bash 
## have node installed
 go to this website and install node and npm: https://nodejs.org/en/download

# Clone the repository 

git clone https://github.com/cis3296s25/Forza-Horizon-StatsTracker

## Frontend setup 

# Change directory to frontend directory 
cd frontend

# Install dependencies 
npm install

# Start the development server
npm run dev 

## Backend setup

# Change directory to backend directory 
cd backend 

# Install dependencies 
npm install 

# Start backend server 
npx nodemon server.js 
```

## Open the Web Application 

In your browser, go to http://localhost:5173/

## How to Sign Up for Different Types of Users


### Xbox Users

On the signup page, if you have selected Xbox, you need to navigate to https://www.cxkes.me/xbox/xuid and put 
your Xbox username in the input box. Afterwards, you will need to copy and paste the XUID (DEC) for your account into the id field for the signup page. 

### Steam Users
In order to sign up with Steam, you must first make your Steam profile public. To do that follow the steps below.

1. Navigate to the Steam app and click on your profile to show the profile drop-down menu. (Top right of Steam page)
2. Click "View my Profile." (One of the options listed in the drop-down menu from previous step)
3. Click "Edit Profile" (It will show up on the top right of the Steam page)
4. Click "Privacy Settings" on the left sidebar
5. Lastly, click on "My Profile" and set your account to public, and in the sub settings of the "My Profile" section set the "Game Details" public. 

Afterwards, you will need your Steam ID and the steps to find your steam ID are below.

1. Click on your profile drop-down menu
2. Click account details
3. Now, the Steam ID should be on the top left under your account name



### Manual Sign-Up (For Users Who Do Not Own The Game or don't want to give xuid or steam id)
If you are a user who wants to test the web application, but do not want to give their xbox xuid or steam id then, you can create an account manually using the Signup page. Then you will need to upload a two screenshots of in game stats. The two screenshots needed are records and general tab. For general it dose not have to be all the stats, it can be the first 12 stats, and then you will be able to click submit and your account is created, use the username you created the account with in place for areas of the web application where it asks for a gamertag. For example, on the home page of the web application it asks to "Enter gamertag" in order to look up your stats, but in this case you will enter the username you created your account with in place of the gamertag. This will allow you to view your manually created stats.  




## Project Board

Project Board Link: https://github.com/orgs/cis3296s25/projects/65



