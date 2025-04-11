const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const express = require('express');

// Import your models and controller
const hubUser = require('../models/hub_user'); // Adjust path as needed
const userProfile = require('../models/user_profile'); // Adjust path as needed
const userStats = require('../models/user_stats'); // Adjust path as needed
const { searchUsers } = require('../controllers/users'); // Adjust path as needed

// Create an Express app for testing
const app = express();
app.use(express.json());
app.post('/search', searchUsers);

let mongoServer;

// Setup before tests
beforeAll(async () => {
  // Create in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Cleanup after tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear collections between tests
beforeEach(async () => {
  await hubUser.deleteMany({});
  await userProfile.deleteMany({});
  await userStats.deleteMany({});
});

describe('searchUsers API - Manual Users', () => {
  // Test successful search for manually created user
  test('should successfully find a manually created user', async () => {
    // Set up test data
    const testUser = new hubUser({
      userName: 'testManualUser',
      platform: 'manually',
      password: 'password123',
      verify: true,
      gameId: null
    });
    await testUser.save();

    const testProfile = new userProfile({
      userName: 'testManualUser',
      platform: 'manually',
      level: 5,
      profilePic: 'https://example.com/pic.jpg'
    });
    await testProfile.save();

    const testStats = new userStats({
      userName: 'testManualUser',
      timeDriven: '10h 30m',
      numberofCarsOwned: 5,
      mostValuableCar: 'Ferrari 488',
      totalWinnningsinCR: 50000,
      favoriteCar: 'Lamborghini Huracan',
      garageValue: '2,500,000 CR',
      longestSkillChain: '150,000 pts',
      distanceDrivenInMiles: 1500,
      longestJump: 500,
      topSpeed: 220,
      biggestAir: '100 meters',
      victories: 25
    });
    await testStats.save();

    // Perform the API request
    const response = await request(app)
      .post('/search')
      .send({ userName: 'testManualUser' });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User found');
    expect(response.body.userName).toBe('testManualUser');
    expect(response.body.platform).toBe('manually');
    
    // For manual users, level should be updated to 0
    expect(response.body.level).toBe(0);
    
    // For manual users, profilePic should be the default avatar
    expect(response.body.profilePic).toBe('https://avatarfiles.alphacoders.com/282/thumb-1920-282375.jpg');
    
    // Check user stats
    expect(response.body.userStats).toBeDefined();
    expect(response.body.userStats.platform).toBe(testStats.platform);
    expect(response.body.userStats.timeDriven).toBe(testStats.timeDriven);
    expect(response.body.userStats.numberofCarsOwned).toBe(testStats.numberofCarsOwned);
    expect(response.body.userStats.garageValue).toBe(testStats.garageValue);
    expect(response.body.userStats.distanceDrivenInMiles).toBe(testStats.distanceDrivenInMiles);
  });

  // Test when user does not exist
  test('should return 404 when user does not exist', async () => {
    const response = await request(app)
      .post('/search')
      .send({ userName: 'nonExistentUser' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });

  // Test when user profile does not exist
  test('should return 404 when user exists but profile not found', async () => {
    // Create user but not profile
    const testUser = new hubUser({
      userName: 'testUserNoProfile',
      platform: 'manually',
      password: 'password123',
      verify: true
    });
    await testUser.save();

    const response = await request(app)
      .post('/search')
      .send({ userName: 'testUserNoProfile' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User profile not found');
  });

  // Test when userName is not provided
  test('should return 400 when userName is not provided', async () => {
    const response = await request(app)
      .post('/search')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User name is required');
  });
});