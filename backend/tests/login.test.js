const userController = require('../controllers/users'); // Adjust path as needed
const hub_user = require('../models/hub_user'); // Adjust path as needed
const user_profile = require('../models/user_profile'); // Adjust path as needed
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../models/hub_user');
jest.mock('../models/user_profile');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('User Controller - loginUsers (Manual Platform)', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  it('should successfully login a manually created user', async () => {
    // Mock successful user lookup with manual platform
    const mockUser = { 
      _id: 'user123',
      userName: 'testUser', 
      password: 'hashedPassword',
      platform: 'manually',
      gameId: null
    };
    hub_user.findOne.mockResolvedValue(mockUser);
    
    // Mock successful password comparison
    bcrypt.compare.mockResolvedValue(true);
    
    // Mock successful profile update
    const mockUpdatedProfile = {
      userName: 'testUser',
      level: 0,
      profilePic: 'https://avatarfiles.alphacoders.com/282/thumb-1920-282375.jpg'
    };
    user_profile.findOneAndUpdate.mockResolvedValue(mockUpdatedProfile);
    
    // Mock JWT token generation
    const mockToken = 'jwt-token-123';
    jwt.sign.mockReturnValue(mockToken);

    // Mock request and response
    const req = {
      body: { userName: 'testUser', password: 'correctPassword' }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Execute the controller
    await userController.loginUsers(req, res);

    // Assertions
    
    // 1. Verify user was looked up correctly
    expect(hub_user.findOne).toHaveBeenCalledWith({ userName: 'testUser' });
    
    // 2. Verify password was compared
    expect(bcrypt.compare).toHaveBeenCalledWith('correctPassword', 'hashedPassword');
    
    // 3. Verify profile was updated with correct manual platform values
    expect(user_profile.findOneAndUpdate).toHaveBeenCalledWith(
      { userName: 'testUser' },
      { 
        $set: { 
          level: 0, 
          profilePic: 'https://avatarfiles.alphacoders.com/282/thumb-1920-282375.jpg' 
        } 
      },
      { new: true }
    );
    
    // 4. Verify token was generated
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: 'user123', userName: 'testUser' },
      'test-secret',
      { expiresIn: '1h' }
    );
    
    // 5. Verify response
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Login successful",
      token: mockToken,
      user: mockUser
    });
  });

  it('should return 404 if user profile for manually created user is not found during update', async () => {
    // Mock successful user lookup with manual platform
    const mockUser = { 
      _id: 'user123',
      userName: 'testUser', 
      password: 'hashedPassword',
      platform: 'manually',
      gameId: null
    };
    hub_user.findOne.mockResolvedValue(mockUser);
    
    // Mock successful password comparison
    bcrypt.compare.mockResolvedValue(true);
    
    // Mock failed profile update (not found)
    user_profile.findOneAndUpdate.mockResolvedValue(null);

    // Mock request and response
    const req = {
      body: { userName: 'testUser', password: 'correctPassword' }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Execute the controller
    await userController.loginUsers(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User profile not found" });
  });

  // Example of a more targeted error test for manual platform
  it('should handle database errors while updating profile for manual users', async () => {
    // Mock successful user lookup with manual platform
    const mockUser = { 
      _id: 'user123',
      userName: 'testUser', 
      password: 'hashedPassword',
      platform: 'manually',
      gameId: null
    };
    hub_user.findOne.mockResolvedValue(mockUser);
    
    // Mock successful password comparison
    bcrypt.compare.mockResolvedValue(true);
    
    // Mock database error during profile update
    const dbError = new Error('Database connection error');
    user_profile.findOneAndUpdate.mockRejectedValue(dbError);

    // Mock console.error to avoid polluting test output
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Mock request and response
    const req = {
      body: { userName: 'testUser', password: 'correctPassword' }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Execute the controller
    await userController.loginUsers(req, res);

    // Assertions
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error logging in:',
      expect.any(Error)
    );
    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Internal server error',
      error: 'Database connection error'
    });
    
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});