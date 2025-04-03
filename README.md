# Forza Horizon Stats Tracker

## Overview
Forza Horizon 5 StatHub is a web application designed to allow users to view and compare their Forza Horizon 5 in-game stats with other players around the world. Stats will be gathered via users self-reporting their in-game stats into the web application. The stats that will be gathered will include: time played, credits earned, number of victories, time in first places, etc. Through this website, users will be able to view a global leaderboard where they can analyze the top players’ stats or compare their own stats with another identified user.

![homepage](./homepage.png)

## Features
- **Search for Stats**: User can search up their username for their Forza Horizon 5 Stats and it will display a stats table 

- **Compare Stats**: Signed-in user will be able to compare their stats with another user

- **View Community Leaderboard**: Users will be able to view a community leaderboard to see where they rank amongst other registered users

## Conceptual Design
- **Backend**: Node.js, express 

- **Frontend**: HTML, CSS, JavaScript

- **Framework**: React

- **Database**: MongoDB  

- **APIs**: Steam APIs, Xbox API

- **Verification**: Microsoft Auth, Auth2.O

- **Design**: Figma

- **Render**: Will be hosted on render.

## Live Website
Visit the live website: https://forza-horizon-statstracker.onrender.com/



## Installation & Running Locally 
To run the project locally, clone the repository and install dependencies:
``` bash 
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

## DISCLAIMER - For Users Signing Up with Xbox

On the signup page, if you have selected Xbox, you need to navigate to https://www.cxkes.me/xbox/xuid and put 
your Xbox username in the input box. Afterwards, you will need to copy and paste the XUID (DEC) for your account into the id field for the signup page. 

## Project Board

Project Board Link: https://github.com/orgs/cis3296s25/projects/65

## Example User Gamertag to Test Web Application
