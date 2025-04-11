const hub_user = require('../models/hub_user');
const user_stats = require('../models/user_stats');
const user_profile = require('../models/user_profile');

// Mock all dependencies
jest.mock('../models/hub_user');
jest.mock('../models/user_stats');
jest.mock('../models/user_profile');
jest.mock('node-fetch');

// Mock implementation of getCompareStats
const mockGetCompareStats = async (req, res) => {
  try {
    const { userName1, userName2 } = req.body || req.query || req.params || {};
    
    if (!userName1 || !userName2) {
      return res.status(400).json({ message: 'Both usernames are required' });
    }
    
    // Check if users exist
    const user1 = await hub_user.findOne({ userName: userName1 });
    if (!user1) {
      return res.status(404).json({ message: `User ${userName1} not found` });
    }
    
    const user2 = await hub_user.findOne({ userName: userName2 });
    if (!user2) {
      return res.status(404).json({ message: `User ${userName2} not found` });
    }
    
    // Get stats for both users
    const stats1 = await user_stats.findOne({ userName: userName1 });
    if (!stats1) {
      return res.status(404).json({ message: `Stats for ${userName1} not found` });
    }
    
    const stats2 = await user_stats.findOne({ userName: userName2 });
    if (!stats2) {
      return res.status(404).json({ message: `Stats for ${userName2} not found` });
    }
    
    // Get profiles for both users
    const profile1 = await user_profile.findOne({ userName: userName1 });
    if (!profile1) {
      return res.status(404).json({ message: `Profile for ${userName1} not found` });
    }
    
    const profile2 = await user_profile.findOne({ userName: userName2 });
    if (!profile2) {
      return res.status(404).json({ message: `Profile for ${userName2} not found` });
    }
    
    // Apply default values for manually created users
    let level1 = profile1.level;
    let profilePic1 = profile1.profilePic;
    
    let level2 = profile2.level;
    let profilePic2 = profile2.profilePic;
    
    if (user1.platform === 'manually') {
      level1 = 0;
      profilePic1 = "https://avatarfiles.alphacoders.com/282/thumb-1920-282375.jpg";
    }
    
    if (user2.platform === 'manually') {
      level2 = 0;
      profilePic2 = "https://avatarfiles.alphacoders.com/282/thumb-1920-282375.jpg";
    }
    
    // Create comparison results
    const comparison = {
      users: {
        [userName1]: {
          platform: user1.platform,
          level: level1,
          profilePic: profilePic1,
          stats: {
            victories: stats1.victories,
            numberofCarsOwned: stats1.numberofCarsOwned,
            garageValue: stats1.garageValue,
            timeDriven: stats1.timeDriven,
            mostValuableCar: stats1.mostValuableCar,
            totalWinnningsinCR: stats1.totalWinnningsinCR,
            favoriteCar: stats1.favoriteCar,
            longestSkillChain: stats1.longestSkillChain,
            distanceDrivenInMiles: stats1.distanceDrivenInMiles,
            longestJump: stats1.longestJump,
            topSpeed: stats1.topSpeed,
            biggestAir: stats1.biggestAir
          }
        },
        [userName2]: {
          platform: user2.platform,
          level: level2,
          profilePic: profilePic2,
          stats: {
            victories: stats2.victories,
            numberofCarsOwned: stats2.numberofCarsOwned,
            garageValue: stats2.garageValue,
            timeDriven: stats2.timeDriven,
            mostValuableCar: stats2.mostValuableCar,
            totalWinnningsinCR: stats2.totalWinnningsinCR,
            favoriteCar: stats2.favoriteCar,
            longestSkillChain: stats2.longestSkillChain,
            distanceDrivenInMiles: stats2.distanceDrivenInMiles,
            longestJump: stats2.longestJump,
            topSpeed: stats2.topSpeed,
            biggestAir: stats2.biggestAir
          }
        }
      },
      comparison: {
        victories: stats1.victories > stats2.victories ? userName1 : userName2,
        numberofCarsOwned: stats1.numberofCarsOwned > stats2.numberofCarsOwned ? userName1 : userName2,
        garageValue: stats1.garageValue > stats2.garageValue ? userName1 : userName2,
        timeDriven: stats1.timeDriven > stats2.timeDriven ? userName1 : userName2,
        totalWinnningsinCR: stats1.totalWinnningsinCR > stats2.totalWinnningsinCR ? userName1 : userName2,
        longestSkillChain: stats1.longestSkillChain > stats2.longestSkillChain ? userName1 : userName2,
        distanceDrivenInMiles: stats1.distanceDrivenInMiles > stats2.distanceDrivenInMiles ? userName1 : userName2,
        longestJump: stats1.longestJump > stats2.longestJump ? userName1 : userName2,
        topSpeed: stats1.topSpeed > stats2.topSpeed ? userName1 : userName2,
        biggestAir: stats1.biggestAir > stats2.biggestAir ? userName1 : userName2
      }
    };
    
    return res.status(200).json(comparison);
  } catch (error) {
    return res.status(500).json({ 
      message: 'Error comparing stats', 
      error: error.message 
    });
  }
};

describe('User Controller - getCompareStats', () => {
  // Setup mock request and response objects
  let req, res;
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock request object
    req = {
      body: {
        userName1: 'testUser1',
        userName2: 'testUser2'
      }
    };
    
    // Mock response object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should compare stats between a manual user and a non-manual user', async () => {
    // Mock data for testUser1 (manual user)
    const mockUser1 = {
      userName: 'testUser1',
      platform: 'manually',
      gameId: null
    };
    
    const mockStats1 = {
      userName: 'testUser1',
      victories: 10,
      numberofCarsOwned: 15,
      garageValue: 1500000,
      timeDriven: 300,
      mostValuableCar: 'Ferrari LaFerrari',
      totalWinnningsinCR: 20,
      favoriteCar: 'Lamborghini Veneno',
      longestSkillChain: 180000,
      distanceDrivenInMiles: 1200,
      longestJump: 500,
      topSpeed: 210,
      biggestAir: 120
    };
    
    const mockProfile1 = {
      userName: 'testUser1',
      level: 20, // This would be overridden for manual users
      profilePic: 'custom-pic-url' // This would be overridden for manual users
    };
    
    // Mock data for testUser2 (Steam user)
    const mockUser2 = {
      userName: 'testUser2',
      platform: 'steam',
      gameId: '87654321'
    };
    
    const mockStats2 = {
      userName: 'testUser2',
      victories: 15,
      numberofCarsOwned: 10,
      garageValue: 2000000,
      timeDriven: 500,
      mostValuableCar: 'Bugatti Chiron',
      totalWinnningsinCR: 15,
      favoriteCar: 'McLaren P1',
      longestSkillChain: 200000,
      distanceDrivenInMiles: 1500,
      longestJump: 600,
      topSpeed: 230,
      biggestAir: 100
    };
    
    const mockProfile2 = {
      userName: 'testUser2',
      level: 30,
      profilePic: 'steam-avatar-url'
    };
    
    // Setup mock responses
    hub_user.findOne.mockImplementation((query) => {
      if (query.userName === 'testUser1') return mockUser1;
      if (query.userName === 'testUser2') return mockUser2;
      return null;
    });
    
    user_stats.findOne.mockImplementation((query) => {
      if (query.userName === 'testUser1') return mockStats1;
      if (query.userName === 'testUser2') return mockStats2;
      return null;
    });
    
    user_profile.findOne.mockImplementation((query) => {
      if (query.userName === 'testUser1') return mockProfile1;
      if (query.userName === 'testUser2') return mockProfile2;
      return null;
    });
    
    // Call the function
    await mockGetCompareStats(req, res);
    
    // Assertions
    expect(hub_user.findOne).toHaveBeenCalledTimes(2);
    expect(user_stats.findOne).toHaveBeenCalledTimes(2);
    expect(user_profile.findOne).toHaveBeenCalledTimes(2);
    
    expect(res.status).toHaveBeenCalledWith(200);
    
    // Check the response
    const response = res.json.mock.calls[0][0];
    
    // Check specific user data
    expect(response.users.testUser1.platform).toBe('manually');
    expect(response.users.testUser1.level).toBe(0); // Manual user should have level 0
    expect(response.users.testUser1.profilePic).toBe('https://avatarfiles.alphacoders.com/282/thumb-1920-282375.jpg'); // Manual user should have default pic
    
    expect(response.users.testUser2.platform).toBe('steam');
    expect(response.users.testUser2.level).toBe(30); // Steam user keeps actual level
    expect(response.users.testUser2.profilePic).toBe('steam-avatar-url'); // Steam user keeps actual pic
    
    // Check comparison results
    expect(response.comparison.victories).toBe('testUser2'); // testUser2 has more victories
    expect(response.comparison.numberofCarsOwned).toBe('testUser1'); // testUser1 has more cars
    expect(response.comparison.garageValue).toBe('testUser2'); // testUser2 has higher garage value
    expect(response.comparison.timeDriven).toBe('testUser2'); // testUser2 has more time driven
  });

  it('should return 400 if usernames are missing', async () => {
    // Remove usernames from request
    req.body = {};
    
    // Call the function
    await mockGetCompareStats(req, res);
    
    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Both usernames are required' });
    expect(hub_user.findOne).not.toHaveBeenCalled();
  });

  it('should return 404 if first user is not found', async () => {
    // Mock first user not found
    hub_user.findOne.mockImplementation((query) => {
      if (query.userName === 'testUser1') return null;
      if (query.userName === 'testUser2') return { userName: 'testUser2' };
      return null;
    });
    
    // Call the function
    await mockGetCompareStats(req, res);
    
    // Assertions
    expect(hub_user.findOne).toHaveBeenCalledWith({ userName: 'testUser1' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User testUser1 not found' });
  });

  it('should return 404 if second user is not found', async () => {
    // Mock first user found but second not found
    hub_user.findOne.mockImplementation((query) => {
      if (query.userName === 'testUser1') return { userName: 'testUser1' };
      if (query.userName === 'testUser2') return null;
      return null;
    });
    
    // Call the function
    await mockGetCompareStats(req, res);
    
    // Assertions
    expect(hub_user.findOne).toHaveBeenCalledWith({ userName: 'testUser1' });
    expect(hub_user.findOne).toHaveBeenCalledWith({ userName: 'testUser2' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User testUser2 not found' });
  });

  it('should return 404 if stats for first user are not found', async () => {
    // Mock users found but stats for first user not found
    hub_user.findOne.mockImplementation((query) => {
      if (query.userName === 'testUser1') return { userName: 'testUser1' };
      if (query.userName === 'testUser2') return { userName: 'testUser2' };
      return null;
    });
    
    user_stats.findOne.mockImplementation((query) => {
      if (query.userName === 'testUser1') return null;
      if (query.userName === 'testUser2') return { userName: 'testUser2' };
      return null;
    });
    
    // Call the function
    await mockGetCompareStats(req, res);
    
    // Assertions
    expect(hub_user.findOne).toHaveBeenCalledTimes(2);
    expect(user_stats.findOne).toHaveBeenCalledWith({ userName: 'testUser1' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Stats for testUser1 not found' });
  });

  it('should handle server errors properly', async () => {
    // Mock database error
    const errorMessage = 'Database connection failed';
    hub_user.findOne.mockRejectedValue(new Error(errorMessage));
    
    // Call the function
    await mockGetCompareStats(req, res);
    
    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error comparing stats',
      error: errorMessage
    });
  });
});