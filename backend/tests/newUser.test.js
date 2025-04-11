const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const hub_user = require('../models/hub_user');
const user_profile = require('../models/user_profile');

// Import the controller (adjust path as needed)
const userController = require('../controllers/users');

// Mock all dependencies
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../models/hub_user');
jest.mock('../models/user_profile');
jest.mock('node-fetch');

describe('User Controller - loginUsers (Manual Login)', () => {
  // Setup mock request and response objects
  let req, res;
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock request object
    req = {
      body: {
        userName: 'testUser',
        password: 'password123'
      }
    };
    
    // Mock response object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Mock JWT token generation
    jwt.sign.mockReturnValue('fake-jwt-token');
    
    // Mock default fetchPlayerData result (from the manually platform)
    process.env.JWT_SECRET = 'test-secret';
  });

  it('should log in a manually created user successfully', async () => {
    // Mock user with platform="manually"
    const mockUser = {
      _id: 'user123',
      userName: 'testUser',
      platform: 'manually',
      gameId: null,
      password: 'hashedPassword'
    };
    
    // Mock profile data for manual user
    const mockProfile = {
      userName: 'testUser',
      level: 0,
      profilePic: 'https://avatarfiles.alphacoders.com/282/thumb-1920-282375.jpg'
    };
    
    // Mock database responses
    hub_user.findOne.mockResolvedValue(mockUser);
    user_profile.findOneAndUpdate.mockResolvedValue(mockProfile);
    
    // Mock successful password comparison
    bcrypt.compare.mockResolvedValue(true);
    
    // Call the controller function
    await userController.loginUsers(req, res);
    
    // Assertions
    expect(hub_user.findOne).toHaveBeenCalledWith({ userName: 'testUser' });
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: 'user123', userName: 'testUser' },
      'test-secret',
      { expiresIn: "1h" }
    );
    
    // For manual users, we expect the profile pic and level to be set to default values
    expect(user_profile.findOneAndUpdate).toHaveBeenCalled();
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Login successful",
      token: 'fake-jwt-token',
      user: mockUser
    });
  });

  it('should return 400 if username is missing', async () => {
    // Remove username from request
    req.body = { password: 'password123' };
    
    // Call the controller function
    await userController.loginUsers(req, res);
    
    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Username is required' });
    expect(hub_user.findOne).not.toHaveBeenCalled();
  });

  it('should return 400 if password is missing', async () => {
    // Remove password from request
    req.body = { userName: 'testUser' };
    
    // Call the controller function
    await userController.loginUsers(req, res);
    
    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Password is required' });
    expect(hub_user.findOne).not.toHaveBeenCalled();
  });

  it('should return 404 if user is not found', async () => {
    // Mock user not found
    hub_user.findOne.mockResolvedValue(null);
    
    // Call the controller function
    await userController.loginUsers(req, res);
    
    // Assertions
    expect(hub_user.findOne).toHaveBeenCalledWith({ userName: 'testUser' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  it('should return 400 if password is incorrect', async () => {
    // Mock user found
    const mockUser = {
      userName: 'testUser',
      password: 'hashedPassword'
    };
    hub_user.findOne.mockResolvedValue(mockUser);
    
    // Mock failed password comparison
    bcrypt.compare.mockResolvedValue(false);
    
    // Call the controller function
    await userController.loginUsers(req, res);
    
    // Assertions
    expect(hub_user.findOne).toHaveBeenCalledWith({ userName: 'testUser' });
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Incorrect password' });
    expect(user_profile.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it('should return 404 if user profile is not found', async () => {
    // Mock user found
    const mockUser = {
      _id: 'user123',
      userName: 'testUser',
      platform: 'manually',
      password: 'hashedPassword'
    };
    hub_user.findOne.mockResolvedValue(mockUser);
    
    // Mock successful password comparison
    bcrypt.compare.mockResolvedValue(true);
    
    // Mock profile not found
    user_profile.findOneAndUpdate.mockResolvedValue(null);
    
    // Call the controller function
    await userController.loginUsers(req, res);
    
    // Assertions
    expect(hub_user.findOne).toHaveBeenCalledWith({ userName: 'testUser' });
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    expect(user_profile.findOneAndUpdate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User profile not found' });
  });

  it('should handle server errors properly', async () => {
    // Mock database error
    const errorMessage = 'Database connection failed';
    hub_user.findOne.mockRejectedValue(new Error(errorMessage));
    
    // Call the controller function
    await userController.loginUsers(req, res);
    
    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Internal server error',
      error: errorMessage
    });
  });
});