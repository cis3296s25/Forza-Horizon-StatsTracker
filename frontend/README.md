# Forza Horizon Stats Tracker

## Overview
Forza Horizon 5 StatHub is a web application designed to allow users to view and compare their Forza Horizon 5 in-game stats with other players around the world. Stats will be gathered via users self-reporting their in-game stats into the web application. The stats that will be gathered will include: time played, credits earned, number of victories, time in first places, etc. Through this website, users will be able to view a global leaderboard where they can analyze the top players’ stats or compare their own stats with another identified user.

![homepage](homepage.png)

## Features
- **Search for Stats**: User can search up their username for their Forza Horizon 5 Stats and it will display a stats table 

- **Compare Stats**: Signed-in user will be able to compare their stats with another user

- **View Leaderboard**: Users will be able to view a leaderboard of verified users to see where they rank amongst other users

- **Update Stats**: Registered users can update their existing stats to reflect their latest in-game progress.

## Conceptual Design
- **Backend**: Node.js, express 

- **Frontend**: HTML, CSS, JavaScript

- **Framework**: React

- **Database**: MongoDB  

- **APIs**: Steam API, Xbox API

- **Verification**: Microsoft Auth, Auth2.O

- **Design**: Figma

- **Render**: Will be hosted on render.

## Live Website
Visit the live website: https://forza-horizon-statstracker.onrender.com/



## Installation & Running Locally 
To run the project locally, clone the repository and install dependencies:
``` bash

# Need to download Node.js
 use this link to install node.js, if you don't have node installed https://nodejs.org/en/download

# Clone the repository 

git clone https://github.com/cis3296s25/Forza-Horizon-StatsTracker

do npm install

## Frontend setup 

# Change directory to frontend directory 
cd frontend

# Install dependencies 
npm install

# Start the development server
npm run dev

# open a new terminal for backend

## Backend setup

# Change directory to backend directory 
cd backend 

# Install dependencies 
npm install 

# Start backend server 
npm start
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

### Manual Sign-Up (For Users Who Do Not Own The Game)
If you are a user who wants to test the web application, but do not own the Forza Horizon 5 game, you can create an account manually using the Signup page. After inputting your information into the Signup form, use the username you created the account with in place for areas of the web application where it asks for a gamertag. For example, on the home page of the web application it asks to "Enter gamertag" in order to look up your stats, but in this case you will enter the username you created your account with in place of the gamertag. This will allow you to view your manually created stats.  




## Project Board

Project Board Link: https://github.com/orgs/cis3296s25/projects/65

## Example Accounts for Testing and Comparison

| Gamertag  | Password | Purpose                   |
|-----------|----------|---------------------------|
| Tester1   | 1234     | Use for testing as a verified user
| Natsh     |    | Use this gamertag to compare your stats to



