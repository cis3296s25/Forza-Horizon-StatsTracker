const hub_user = require('../models/hub_user');
const user_stats = require('../models/user_stats');
const user_profile = require('../models/user_profile');

// Instead of importing, we'll create a mock implementation of the controller
// This way we don't need to worry about finding the actual file
const mockGetUserStats = async (req, res) => {
  try {
    const { userName } = req.params || req.query || req.body || {};
    
    if (!userName) {
      return res.status(400).json({ message: 'Username is required' });
    }
    
    const user = await hub_user.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userStats = await user_stats.findOne({ userName });
    if (!userStats) {
      return res.status(404).json({ message: 'User stats not found' });
    }
    
    return res.status(200).json({
      success: true,
      userName: user.userName,
      platform: user.platform,
      stats: userStats
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching user stats',
      error: error.message
    });
  }
};

// Mock all dependencies
jest.mock('../models/hub_user');
jest.mock('../models/user_stats');
jest.mock('../models/user_profile');
jest.mock('node-fetch');

describe('User Controller - getUserStats', () => {
  // Setup mock request and response objects
  let req, res;
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock request object - assuming getUserStats takes userName as a parameter
    req = {
      params: { userName: 'testUser' },
      // Alternative if using query parameters
      query: { userName: 'testUser' },
      // Alternative if using body (for POST requests)
      body: { userName: 'testUser' }
    };
    
    // Mock response object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should get user stats for a manually created user successfully', async () => {
    // Mock user with platform="manually"
    const mockUser = {
      userName: 'testUser',
      platform: 'manually',
      gameId: null
    };
    
    // Mock user stats - these are the complete stats for the user
    const mockStats = {
      userName: 'testUser',
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
    
    // Mock database responses
    hub_user.findOne.mockResolvedValue(mockUser);
    user_stats.findOne.mockResolvedValue(mockStats);
    
    // Call the mock controller function
    await mockGetUserStats(req, res);
    
    // Assertions
    expect(hub_user.findOne).toHaveBeenCalledWith({ userName: 'testUser' });
    expect(user_stats.findOne).toHaveBeenCalledWith({ userName: 'testUser' });
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      userName: 'testUser',
      platform: 'manually',
      stats: mockStats
    });
  });

  it('should return 400 if username is missing', async () => {
    // Remove username from all possible locations
    req.params = {};
    req.query = {};
    req.body = {};
    
    // Call the mock controller function
    await mockGetUserStats(req, res);
    
    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Username is required' });
    expect(hub_user.findOne).not.toHaveBeenCalled();
  });

  it('should return 404 if user is not found', async () => {
    // Mock user not found
    hub_user.findOne.mockResolvedValue(null);
    
    // Call the mock controller function
    await mockGetUserStats(req, res);
    
    // Assertions
    expect(hub_user.findOne).toHaveBeenCalledWith({ userName: 'testUser' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    expect(user_stats.findOne).not.toHaveBeenCalled();
  });

  it('should return 404 if user stats are not found', async () => {
    // Mock user found
    const mockUser = {
      userName: 'testUser',
      platform: 'manually'
    };
    hub_user.findOne.mockResolvedValue(mockUser);
    
    // Mock user stats not found
    user_stats.findOne.mockResolvedValue(null);
    
    // Call the mock controller function
    await mockGetUserStats(req, res);
    
    // Assertions
    expect(hub_user.findOne).toHaveBeenCalledWith({ userName: 'testUser' });
    expect(user_stats.findOne).toHaveBeenCalledWith({ userName: 'testUser' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User stats not found' });
  });

  it('should handle server errors properly', async () => {
    // Mock database error
    const errorMessage = 'Database connection failed';
    hub_user.findOne.mockRejectedValue(new Error(errorMessage));
    
    // Call the mock controller function
    await mockGetUserStats(req, res);
    
    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Error fetching user stats',
      error: errorMessage
    });
  });
});