const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app'); // Adjust path as needed

// Import models
const hub_user = require('../models/hub_user');
const user_stats = require('../models/user_stats');
const user_profile = require('../models/user_profile');

// Mock modules
jest.mock('../models/hub_user');
jest.mock('../models/user_stats');
jest.mock('../models/user_profile');
jest.mock('bcrypt');
jest.mock('node-fetch');

// Mock the environment variables
process.env.STEAM_API_KEY = 'mock-steam-key';
process.env.XBOX_API_KEY = 'mock-xbox-key';

describe('User Controller - newUser', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock bcrypt.hash to return a hashed password
    bcrypt.hash.mockResolvedValue('hashedPassword123');
    
    // Setup mock implementations for mongoose models
    hub_user.findOne = jest.fn();
    hub_user.prototype.save = jest.fn().mockResolvedValue({});
    user_stats.prototype.save = jest.fn().mockResolvedValue({});
    user_profile.prototype.save = jest.fn().mockResolvedValue({});
  });

  it('should create a new user successfully with valid data', async () => {
    // Mock user doesn't exist yet
    hub_user.findOne.mockResolvedValue(null);
    
    // Setup valid user data
    const userData = {
      userName: 'testUser',
      platform: 'manually',
      password: 'securePassword123',
      gameId: null,
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
    
    // Verify bcrypt was called
    expect(bcrypt.hash).toHaveBeenCalledWith('securePassword123', 10);
    
    // Verify model save methods were called
    expect(hub_user.prototype.save).toHaveBeenCalled();
    expect(user_stats.prototype.save).toHaveBeenCalled();
    expect(user_profile.prototype.save).toHaveBeenCalled();
  });

  it('should return 400 when user already exists', async () => {
    // Mock that user already exists
    hub_user.findOne.mockResolvedValueOnce({ userName: 'existingUser' });
    
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
    
    // Verify save methods were NOT called
    expect(hub_user.prototype.save).not.toHaveBeenCalled();
    expect(user_stats.prototype.save).not.toHaveBeenCalled();
    expect(user_profile.prototype.save).not.toHaveBeenCalled();
  });

  it('should return 400 when required fields are missing', async () => {
    // Mock that user doesn't exist yet
    hub_user.findOne.mockResolvedValue(null);
    
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
  });

  it('should return 400 when stats are negative', async () => {
    // Mock that user doesn't exist yet
    hub_user.findOne.mockResolvedValue(null);
    
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
  });

  it('should return 400 when platform ID is required but not provided', async () => {
    // Mock that user doesn't exist yet
    hub_user.findOne.mockResolvedValue(null);
    
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
    expect(res.body).toEqual({ 
      message: 'Platform ID is required for steam. Please provide your Steam/Xbox ID.'
    });
  });

  it('should handle server errors properly', async () => {
    // Mock that user doesn't exist yet
    hub_user.findOne.mockResolvedValue(null);
    
    // Mock save to throw an error
    const errorMessage = 'Database connection failed';
    hub_user.prototype.save.mockRejectedValue(new Error(errorMessage));
    
    const userData = {
      userName: 'testUser',
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
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ 
      message: 'Server error while creating the user.',
      error: errorMessage
    });
  });
});