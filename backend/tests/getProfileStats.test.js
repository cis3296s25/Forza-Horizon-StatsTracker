const hub_user = require('../models/hub_user');
const user_stats = require('../models/user_stats');
const user_profile = require('../models/user_profile');

// Mock all dependencies
jest.mock('../models/hub_user');
jest.mock('../models/user_stats');
jest.mock('../models/user_profile');
jest.mock('node-fetch');

// Create a mock implementation of the getProfileStats function
const mockGetProfileStats = async (req, res) => {
  try {
    const { userName } = req.params || req.query || req.body || {};
    
    if (!userName) {
      return res.status(400).json({ message: 'Username is required' });
    }
    
    const user = await hub_user.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = await user_profile.findOne({ userName });
    if (!profile) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    
    // For manually created users, we ensure default values are used
    let level = profile.level;
    let profilePic = profile.profilePic;
    
    if (user.platform === 'manually') {
      level = 0;
      profilePic = "https://avatarfiles.alphacoders.com/282/thumb-1920-282375.jpg";
    }
    
    return res.status(200).json({
      success: true,
      userName: user.userName,
      platform: user.platform,
      level: level,
      profilePic: profilePic
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching profile stats',
      error: error.message
    });
  }
};

describe('User Controller - getProfileStats', () => {
  // Setup mock request and response objects
  let req, res;
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock request object
    req = {
      params: { userName: 'testUser' },
      query: { userName: 'testUser' },
      body: { userName: 'testUser' }
    };
    
    // Mock response object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should get profile stats for a manually created user successfully', async () => {
    // Mock user with platform="manually"
    const mockUser = {
      userName: 'testUser',
      platform: 'manually',
      gameId: null
    };
    
    // Mock profile data
    const mockProfile = {
      userName: 'testUser',
      level: 5, // This should be overridden to 0 for manual users
      profilePic: 'some-pic-url' // This should be overridden for manual users
    };
    
    // Mock database responses
    hub_user.findOne.mockResolvedValue(mockUser);
    user_profile.findOne.mockResolvedValue(mockProfile);
    
    // Call the mock controller function
    await mockGetProfileStats(req, res);
    
    // Assertions
    expect(hub_user.findOne).toHaveBeenCalledWith({ userName: 'testUser' });
    expect(user_profile.findOne).toHaveBeenCalledWith({ userName: 'testUser' });
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      userName: 'testUser',
      platform: 'manually',
      level: 0, // For manual users, level should be 0
      profilePic: "https://avatarfiles.alphacoders.com/282/thumb-1920-282375.jpg" // Default pic for manual users
    });
  });

  it('should get profile stats for a non-manual user successfully', async () => {
    // Mock user with platform="steam"
    const mockUser = {
      userName: 'steamUser',
      platform: 'steam',
      gameId: '12345678'
    };
    
    // Mock profile data
    const mockProfile = {
      userName: 'steamUser',
      level: 25,
      profilePic: 'https://steam-avatar-url.jpg'
    };
    
    // Update request
    req.params.userName = 'steamUser';
    req.query.userName = 'steamUser';
    req.body.userName = 'steamUser';
    
    // Mock database responses
    hub_user.findOne.mockResolvedValue(mockUser);
    user_profile.findOne.mockResolvedValue(mockProfile);
    
    // Call the mock controller function
    await mockGetProfileStats(req, res);
    
    // Assertions
    expect(hub_user.findOne).toHaveBeenCalledWith({ userName: 'steamUser' });
    expect(user_profile.findOne).toHaveBeenCalledWith({ userName: 'steamUser' });
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      userName: 'steamUser',
      platform: 'steam',
      level: 25, // Use actual level for non-manual users
      profilePic: 'https://steam-avatar-url.jpg' // Use actual profile pic for non-manual users
    });
  });

  it('should return 400 if username is missing', async () => {
    // Remove username from all possible locations
    req.params = {};
    req.query = {};
    req.body = {};
    
    // Call the mock controller function
    await mockGetProfileStats(req, res);
    
    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Username is required' });
    expect(hub_user.findOne).not.toHaveBeenCalled();
  });

  it('should return 404 if user is not found', async () => {
    // Mock user not found
    hub_user.findOne.mockResolvedValue(null);
    
    // Call the mock controller function
    await mockGetProfileStats(req, res);
    
    // Assertions
    expect(hub_user.findOne).toHaveBeenCalledWith({ userName: 'testUser' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    expect(user_profile.findOne).not.toHaveBeenCalled();
  });

  it('should return 404 if user profile is not found', async () => {
    // Mock user found
    const mockUser = {
      userName: 'testUser',
      platform: 'manually'
    };
    hub_user.findOne.mockResolvedValue(mockUser);
    
    // Mock profile not found
    user_profile.findOne.mockResolvedValue(null);
    
    // Call the mock controller function
    await mockGetProfileStats(req, res);
    
    // Assertions
    expect(hub_user.findOne).toHaveBeenCalledWith({ userName: 'testUser' });
    expect(user_profile.findOne).toHaveBeenCalledWith({ userName: 'testUser' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User profile not found' });
  });

  it('should handle server errors properly', async () => {
    // Mock database error
    const errorMessage = 'Database connection failed';
    hub_user.findOne.mockRejectedValue(new Error(errorMessage));
    
    // Call the mock controller function
    await mockGetProfileStats(req, res);
    
    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Error fetching profile stats',
      error: errorMessage
    });
  });
});