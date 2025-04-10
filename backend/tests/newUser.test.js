const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const app = require('../app'); // Adjust path as needed

// Import models
const hub_user = require('../models/hub_user');
const user_stats = require('../models/user_stats');
const user_profile = require('../models/user_profile');

// Mock external dependencies that should not connect to real services
jest.mock('bcrypt');
jest.mock('node-fetch');

// Mock environment variables
process.env.STEAM_API_KEY = 'mock-steam-key';
process.env.XBOX_API_KEY = 'mock-xbox-key';
process.env.JWT_SECRET = 'test-jwt-secret';

describe('User Controller - newUser', () => {
  let mongoServer;

  // Set up the MongoDB Memory Server before tests
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  // Clean up after tests
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // Clear database between tests
  beforeEach(async () => {
    await hub_user.deleteMany({});
    await user_stats.deleteMany({});
    await user_profile.deleteMany({});
    
    // Mock bcrypt hash
    bcrypt.hash.mockResolvedValue('hashedPassword123');
    
    // Mock node-fetch for external APIs
    const fetch = require('node-fetch');
    fetch.mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          response: {
            games: [{ appid: 1551360 }],
            player_level: 10,
            players: [{ avatar: 'avatar-url' }]
          },
          people: [{ 
            displayPicRaw: 'xbox-avatar', 
            gamerScore: 5000 
          }]
        })
      })
    );
  });

  it('should create a new user successfully with valid data', async () => {
    // Setup valid user data
    const userData = {
      userName: 'testUser',
      platform: 'manually',
      password: 'securePassword123',
      victories: 10,
      numberofCarsOwned: 5,
      garageValue: 500000,
      timeDriven: 120,
      mostValuableCar: 'Ferrari',
      totalWinnningsinCR: 25000,
      favoriteCar: 'BMW',
      longestSkillChain: 50,
      distanceDrivenInMiles: 1500,
      longestJump: 80,
      topSpeed: 200,
      biggestAir: 30
    };

    // Make the request
    const res = await request(app)
      .post('/api/userAccount/create') // Adjust endpoint as needed
      .send(userData);

    // Assertions
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ message: 'User created successfully' });
    
    // Verify data was saved to database
    const savedUser = await hub_user.findOne({ userName: 'testUser' });
    expect(savedUser).not.toBeNull();
    expect(savedUser.platform).toBe('manually');
    
    const savedStats = await user_stats.findOne({ userName: 'testUser' });
    expect(savedStats).not.toBeNull();
    expect(savedStats.victories).toBe(10);
    
    const savedProfile = await user_profile.findOne({ userName: 'testUser' });
    expect(savedProfile).not.toBeNull();
  });

  it('should return 400 when user already exists', async () => {
    // Create a user first
    const existingUser = new hub_user({
      userName: 'existingUser',
      platform: 'manually',
      password: 'hashedExistingPassword',
      verify: false
    });
    await existingUser.save();
    
    // Try to create the same user again
    const userData = {
      userName: 'existingUser',
      platform: 'manually',
      password: 'password123',
      victories: 5,
      numberofCarsOwned: 10,
      garageValue: 100000,
      timeDriven: 50,
      mostValuableCar: 'Lamborghini',
      totalWinnningsinCR: 10000,
      favoriteCar: 'Audi',
      longestSkillChain: 30,
      distanceDrivenInMiles: 800,
      longestJump: 40,
      topSpeed: 180,
      biggestAir: 20
    };

    // Make the request
    const res = await request(app)
      .post('/api/userAccount/create')
      .send(userData);

    // Assertions
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'User already exists' });
    
    // Verify no new entries were created
    const userCount = await hub_user.countDocuments();
    expect(userCount).toBe(1);
  });

  it('should return 400 when required fields are missing', async () => {
    // Missing required fields
    const incompleteData = {
      userName: 'testUser',
      platform: 'manually'
      // Missing password and other required fields
    };

    // Make the request
    const res = await request(app)
      .post('/api/userAccount/create')
      .send(incompleteData);

    // Assertions
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'All fields are required' });
    
    // Verify no user was created
    const userCount = await hub_user.countDocuments();
    expect(userCount).toBe(0);
  });

  it('should return 400 when stats are negative', async () => {
    // Data with negative stats
    const negativeStatsData = {
      userName: 'testUser',
      platform: 'manually',
      password: 'password123',
      victories: -5, // Negative value
      numberofCarsOwned: 10,
      garageValue: 100000,
      timeDriven: 50,
      mostValuableCar: 'Lamborghini',
      totalWinnningsinCR: 10000,
      favoriteCar: 'Audi',
      longestSkillChain: 30,
      distanceDrivenInMiles: 800,
      longestJump: 40,
      topSpeed: 180,
      biggestAir: 20
    };

    // Make the request
    const res = await request(app)
      .post('/api/userAccount/create')
      .send(negativeStatsData);

    // Assertions
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'Stats cannot be negative' });
    
    // Verify no user was created
    const userCount = await hub_user.countDocuments();
    expect(userCount).toBe(0);
  });

  it('should return 400 when platform ID is required but not provided', async () => {
    // Steam platform without gameId
    const steamWithoutId = {
      userName: 'testUser',
      platform: 'steam', // Steam platform requires gameId
      password: 'password123',
      victories: 5,
      numberofCarsOwned: 10,
      garageValue: 100000,
      timeDriven: 50,
      mostValuableCar: 'Lamborghini',
      totalWinnningsinCR: 10000,
      favoriteCar: 'Audi',
      longestSkillChain: 30,
      distanceDrivenInMiles: 800,
      longestJump: 40,
      topSpeed: 180,
      biggestAir: 20
    };

    // Make the request
    const res = await request(app)
      .post('/api/userAccount/create')
      .send(steamWithoutId);

    // Assertions
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('Platform ID is required for steam');
    
    // Verify no user was created
    const userCount = await hub_user.countDocuments();
    expect(userCount).toBe(0);
  });

  it('should create a new Steam user with valid gameId', async () => {
    // Valid Steam user
    const steamUserData = {
      userName: 'steamUser',
      platf