const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app'); // Adjust path as needed

// Import models
const hub_user = require('../models/hub_user');
const user_stats = require('../models/user_stats');
const user_profile = require('../models/user_profile');

// Mock the models
jest.mock('../models/hub_user');
jest.mock('../models/user_stats');
jest.mock('../models/user_profile');
jest.mock('bcrypt');
jest.mock('node-fetch');

describe('User Controller - newUser with Manual Entry', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock bcrypt hash
    bcrypt.hash.mockResolvedValue('hashedPassword123');
  });

  it('should create a user successfully with manual entry', async () => {
    // Mock findOne to return null (user doesn't exist yet)
    hub_user.findOne.mockResolvedValue(null);
    
    // Mock save functions
    hub_user.prototype.save = jest.fn().mockResolvedValue({});
    user_stats.prototype.save = jest.fn().mockResolvedValue({});
    user_profile.prototype.save = jest.fn().mockResolvedValue({});

    // Test data for manual entry
    const userData = {
      userName: 'testUser',
      platform: 'manually',
      password: 'password123',
      gameId: null,
      victories: 10,
      numberofCarsOwned: 5,
      garageValue: 1000000,
      timeDriven: 500,
      mostValuableCar: 'Lamborghini Aventador',
      totalWinnningsinCR: 15,
      favoriteCar: 'Ferrari 488 GTB',
      longestSkillChain: 250000,
      distanceDrivenInMiles: 1500,
      longestJump: 700,
      topSpeed: 220,
      biggestAir: 150
    };

    // Make the request
    const res = await request(app)
      .post('/api/userAccount/new')
      .send(userData);

    // Assertions
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ message: 'User created successfully' });
    
    // Verify the correct models were created
    expect(hub_user).toHaveBeenCalledWith({
      userName: userData.userName,
      platform: userData.platform,
      password: 'hashedPassword123',
      verify: false,
      gameId: userData.gameId
    });
    
    expect(user_stats).toHaveBeenCalledWith({
      userName: userData.userName,
      victories: userData.victories,
      numberofCarsOwned: userData.numberofCarsOwned,
      garageValue: userData.garageValue,
      timeDriven: userData.timeDriven,
      mostValuableCar: userData.mostValuableCar,
      totalWinnningsinCR: userData.totalWinnningsinCR,
      favoriteCar: userData.favoriteCar,
      longestSkillChain: userData.longestSkillChain,
      distanceDrivenInMiles: userData.distanceDrivenInMiles,
      longestJump: userData.longestJump,
      topSpeed: userData.topSpeed,
      biggestAir: userData.biggestAir
    });
    
    expect(user_profile).toHaveBeenCalledWith({
      userName: userData.userName,
      platform: userData.platform,
      level: 0, // For manual entry, level should be 0
      profilePic: "https://avatarfiles.alphacoders.com/282/thumb-1920-282375.jpg" // Default pic for manual entry
    });
    
    // Verify models were saved
    expect(hub_user.prototype.save).toHaveBeenCalled();
    expect(user_stats.prototype.save).toHaveBeenCalled();
    expect(user_profile.prototype.save).toHaveBeenCalled();
  });

  it('should return 400 if user already exists', async () => {
    // Mock findOne to return an existing user
    hub_user.findOne.mockResolvedValue({ userName: 'testUser' });

    const userData = {
      userName: 'testUser',
      platform: 'manually',
      password: 'password123',
      victories: 10,
      numberofCarsOwned: 5,
      garageValue: 1000000,
      timeDriven: 500,
      mostValuableCar: 'Lamborghini Aventador',
      totalWinnningsinCR: 15,
      favoriteCar: 'Ferrari 488 GTB',
      longestSkillChain: 250000,
      distanceDrivenInMiles: 1500,
      longestJump: 700,
      topSpeed: 220,
      biggestAir: 150
    };

    const res = await request(app)
      .post('/api/userAccount/new')
      .send(userData);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'User already exists' });
    
    // Verify save was not called
    expect(hub_user.prototype.save).not.toHaveBeenCalled();
  });

  it('should return 400 if gameId already exists', async () => {
    // First call returns null (username doesn't exist)
    // Second call returns a user (gameId exists)
    hub_user.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce({ gameId: 'someId' });

    const userData = {
      userName: 'newUser',
      platform: 'manually',
      password: 'password123',
      gameId: 'someId',
      victories: 10,
      numberofCarsOwned: 5,
      garageValue: 1000000,
      timeDriven: 500,
      mostValuableCar: 'Lamborghini Aventador',
      totalWinnningsinCR: 15,
      favoriteCar: 'Ferrari 488 GTB',
      longestSkillChain: 250000,
      distanceDrivenInMiles: 1500,
      longestJump: 700,
      topSpeed: 220,
      biggestAir: 150
    };

    const res = await request(app)
      .post('/api/userAccount/new')
      .send(userData);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'User already exists' });
  });

  it('should return 400 if required fields are missing', async () => {
    // Mock findOne to return null (user doesn't exist)
    hub_user.findOne.mockResolvedValue(null);

    // Missing password
    const userData = {
      userName: 'testUser',
      platform: 'manually',
      // password: missing
      victories: 10,
      numberofCarsOwned: 5,
      garageValue: 1000000,
      timeDriven: 500,
      mostValuableCar: 'Lamborghini Aventador',
      totalWinnningsinCR: 15,
      favoriteCar: 'Ferrari 488 GTB',
      longestSkillChain: 250000,
      distanceDrivenInMiles: 1500,
      longestJump: 700,
      topSpeed: 220,
      biggestAir: 150
    };

    const res = await request(app)
      .post('/api/userAccount/new')
      .send(userData);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'All fields are required' });
  });

  it('should return 400 if car-related fields are missing', async () => {
    // Mock findOne to return null (user doesn't exist)
    hub_user.findOne.mockResolvedValue(null);

    // Missing favoriteCar
    const userData = {
      userName: 'testUser',
      platform: 'manually',
      password: 'password123',
      victories: 10,
      numberofCarsOwned: 5,
      garageValue: 1000000,
      timeDriven: 500,
      mostValuableCar: 'Lamborghini Aventador',
      totalWinnningsinCR: 15,
      // favoriteCar: missing
      longestSkillChain: 250000,
      distanceDrivenInMiles: 1500,
      longestJump: 700,
      topSpeed: 220,
      biggestAir: 150
    };

    const res = await request(app)
      .post('/api/userAccount/new')
      .send(userData);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'Not a valid response' });
  });

  it('should return 400 if stats are negative', async () => {
    // Mock findOne to return null (user doesn't exist)
    hub_user.findOne.mockResolvedValue(null);

    // Negative victories
    const userData = {
      userName: 'testUser',
      platform: 'manually',
      password: 'password123',
      victories: -5, // Negative value
      numberofCarsOwned: 5,
      garageValue: 1000000,
      timeDriven: 500,
      mostValuableCar: 'Lamborghini Aventador',
      totalWinnningsinCR: 15,
      favoriteCar: 'Ferrari 488 GTB',
      longestSkillChain: 250000,
      distanceDrivenInMiles: 1500,
      longestJump: 700,
      topSpeed: 220,
      biggestAir: 150
    };

    const res = await request(app)
      .post('/api/userAccount/new')
      .send(userData);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'Stats cannot be negative' });
  });

  it('should handle server errors properly', async () => {
    // Mock findOne to return null (user doesn't exist)
    hub_user.findOne.mockResolvedValue(null);
    
    // Mock save to throw an error
    const errorMessage = 'Database connection failed';
    hub_user.prototype.save = jest.fn().mockRejectedValue(new Error(errorMessage));

    const userData = {
      userName: 'testUser',
      platform: 'manually',
      password: 'password123',
      victories: 10,
      numberofCarsOwned: 5,
      garageValue: 1000000,
      timeDriven: 500,
      mostValuableCar: 'Lamborghini Aventador',
      totalWinnningsinCR: 15,
      favoriteCar: 'Ferrari 488 GTB',
      longestSkillChain: 250000,
      distanceDrivenInMiles: 1500,
      longestJump: 700,
      topSpeed: 220,
      biggestAir: 150
    };

    const res = await request(app)
      .post('/api/userAccount/new')
      .send(userData);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ 
      message: 'Server error while creating the user.',
      error: errorMessage
    });
  });
});