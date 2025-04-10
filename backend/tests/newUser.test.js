const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const app = require('../app'); // Adjust path as needed

// Import models
const hub_user = require('../models/hub_user');
const user_stats = require('../models/user_stats');
const user_profile = require('../models/user_profile');

// Mock bcrypt for password hashing
jest.mock('bcrypt');

describe('User Controller - Manual User Creation', () => {
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
  });

  it('should create a new manual user successfully with valid data', async () => {
    // Setup valid user data for manual platform
    const userData = {
      userName: 'testManualUser',
      platform: 'manually',
      password: 'securePassword123',
      victories: 10,
      numberofCarsOwned: 5,
      garageValue: 500000,
      timeDriven: 120,
      mostValuableCar: 'Ferrari',
      totalWinnningsinCR: 25000,
      favoriteCar: 'BMW',
      longestSkillChain: '50',
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
    
    // Verify user data was saved correctly
    const savedUser = await hub_user.findOne({ userName: 'testManualUser' });
    expect(savedUser).not.toBeNull();
    expect(savedUser.platform).toBe('manually');
    expect(savedUser.password).toBe('hashedPassword123');
    expect(savedUser.verify).toBe(false);
    expect(savedUser.gameId).toBeUndefined();
    
    // Verify stats were saved correctly
    const savedStats = await user_stats.findOne({ userName: 'testManualUser' });
    expect(savedStats).not.toBeNull();
    expect(savedStats.victories).toBe(10);
    expect(savedStats.numberofCarsOwned).toBe(5);
    expect(savedStats.garageValue).toBe(500000);
    expect(savedStats.timeDriven).toBe(120);
    expect(savedStats.mostValuableCar).toBe('Ferrari');
    expect(savedStats.totalWinnningsinCR).toBe(25000);
    expect(savedStats.favoriteCar).toBe('BMW');
    expect(savedStats.longestSkillChain).toBe('50');
    expect(savedStats.distanceDrivenInMiles).toBe(1500);
    expect(savedStats.longestJump).toBe(80);
    expect(savedStats.topSpeed).toBe(200);
    expect(savedStats.biggestAir).toBe(30);
    
    // Verify profile was created with default avatar
    const savedProfile = await user_profile.findOne({ userName: 'testManualUser' });
    expect(savedProfile).not.toBeNull();
    expect(savedProfile.level).toBe(0);
    expect(savedProfile.profilePic).toBe("https://avatarfiles.alphacoders.com/282/thumb-1920-282375.jpg");
    expect(savedProfile.platform).toBe('manually');
  });

  it('should return 400 when manual user already exists', async () => {
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
      longestSkillChain: '30',
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
    
    // Verify no new entries were added
    const userCount = await hub_user.countDocuments();
    expect(userCount).toBe(1);
  });

  it('should return 400 when required fields are missing for manual user', async () => {
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

  it('should return 400 when car stats are missing for manual user', async () => {
    // Missing required car stats
    const missingCarStats = {
      userName: 'testUser',
      platform: 'manually',
      password: 'password123',
      victories: 5,
      numberofCarsOwned: 10,
      garageValue: 100000,
      timeDriven: 50,
      // Missing mostValuableCar and favoriteCar
      totalWinnningsinCR: 10000,
      // Missing longestSkillChain
      distanceDrivenInMiles: 800,
      longestJump: 40,
      topSpeed: 180,
      biggestAir: 20
    };

    // Make the request
    const res = await request(app)
      .post('/api/userAccount/create')
      .send(missingCarStats);

    // Assertions
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'Not a valid response' });
    
    // Verify no user was created
    const userCount = await hub_user.countDocuments();
    expect(userCount).toBe(0);
  });

  it('should return 400 when stats are negative for manual user', async () => {
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
      longestSkillChain: '30',
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

  it('should handle server errors properly for manual user creation', async () => {
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
      longestSkillChain: '50',
      distanceDrivenInMiles: 1500,
      longestJump: 80,
      topSpeed: 200,
      biggestAir: 30
    };

    // Mock a database error by making bcrypt.hash throw an error
    const errorMessage = 'Hashing failed';
    bcrypt.hash.mockRejectedValue(new Error(errorMessage));

    // Make the request
    const res = await request(app)
      .post('/api/userAccount/create')
      .send(userData);

    // Assertions
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Server error while creating the user.');
    expect(res.body.error).toBe(errorMessage);
    
    // Verify no user was created
    const userCount = await hub_user.countDocuments();
    expect(userCount).toBe(0);
  });
});