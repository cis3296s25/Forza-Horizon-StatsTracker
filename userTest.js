const { getUserStats, getProfileStats, getCompareStats } = require('../controllers/user');
const user_stats = require('../models/user_stats');
const user_profile = require('../models/user_profile');

// Mocking the models
jest.mock('../models/user_stats');
jest.mock('../models/user_profile');

describe('User Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // getUserStats tests
  describe('getUserStats', () => {
    test('should return user stats with success message when authorized', async () => {
      // Setup mocks
      const mockStats = { victories: 10, numberofCarsOwned: 5 };
      user_stats.findOne = jest.fn().mockResolvedValue(mockStats);
      
      const req = {
        user: { userName: 'testUser' },
        query: { userName: 'testUser' }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      await getUserStats(req, res);
      
      expect(user_stats.findOne).toHaveBeenCalledWith({ userName: 'testUser' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "Stats fetched successfully", 
        stats: mockStats 
      });
    });

    test('should return 403 with unauthorized message', async () => {
      const req = {
        user: { userName: 'testUser' },
        query: { userName: 'differentUser' }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      await getUserStats(req, res);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "You are not authorized to access this user's stats" 
      });
    });

    test('should return 404 with not found message', async () => {
    
      user_stats.findOne = jest.fn().mockResolvedValue(null);
      
      const req = {
        user: { userName: 'testUser' },
        query: { userName: 'testUser' }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      
      await getUserStats(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "User stats not found" 
      });
    });

    test('should return 500 with error message on exception', async () => {
      
      const errorMessage = 'Database error';
      user_stats.findOne = jest.fn().mockRejectedValue(new Error(errorMessage));
      
      const req = {
        user: { userName: 'testUser' },
        query: { userName: 'testUser' }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      
      await getUserStats(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "Error searching user stats", 
        error: errorMessage 
      });
    });
  });

  // getProfileStats tests
  describe('getProfileStats', () => {
    test('should return profile stats with success message', async () => {
      const mockProfile = { 
        userName: 'testUser', 
        level: 10,
        profilePic: 'avatar.jpg',
        platform: 'steam'
      };
      
      user_profile.findOne = jest.fn().mockResolvedValue(mockProfile);
      
      const req = {
        user: { userName: 'testUser' }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      
      await getProfileStats(req, res);
      
      expect(user_profile.findOne).toHaveBeenCalledWith({ userName: 'testUser' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "Profile stats fetched successfully", 
        level: 10,
        avatar: 'avatar.jpg',
        platform: 'steam'
      });
    });

    test('should return 400 with user does not exist message', async () => {
      const req = {
        user: { userName: null }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      await getProfileStats(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "User does not exist" 
      });
    });

    test('should return 404 with profile not found message', async () => {
      user_profile.findOne = jest.fn().mockResolvedValue(null);
      
      const req = {
        user: { userName: 'testUser' }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      await getProfileStats(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "User profile not found" 
      });
    });

    test('should return 500 with error message on exception', async () => {
      const errorMessage = 'Database error';
      user_profile.findOne = jest.fn().mockRejectedValue(new Error(errorMessage));
      
      const req = {
        user: { userName: 'testUser' }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      await getProfileStats(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "Error getting data", 
        error: errorMessage 
      });
    });
  });

  // getCompareStats tests
  describe('getCompareStats', () => {
    test('should compare stats with success message', async () => {
      const mockUsers = [
        { 
          userName: "Natsh",
          timeDriven: "45M",
          numberofCarsOwned: 13,
          mostValuableCar: "Ferrari",
          totalWinnningsinCR: 377980,
          favoriteCar: 'Audi',
          garageValue: "1000000 Cr",
          longestSkillChain: "10",
          distanceDrivenInMiles: 2827,
          longestJump: 18,
          topSpeed: 120,
          biggestAir: "15s",
          victories: 95
        },
        { 
          userName: "Tester1",
          timeDriven: "100 hours",
          numberofCarsOwned: 100,
          mostValuableCar: "Tester",
          totalWinnningsinCR: 50000,
          favoriteCar: 'Tester',
          garageValue: "1000 Cr",
          longestSkillChain: "500 points",
          distanceDrivenInMiles: 100,
          longestJump: 500,
          topSpeed: 250,
          biggestAir: "100 feet",
          victories: 100
        }
      ];
      
      user_stats.find = jest.fn().mockResolvedValue(mockUsers);
      
      const req = {
        query: { userName1: 'Natsh', userName2: 'Tester1' }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      await getCompareStats(req, res);
      
      expect(user_stats.find).toHaveBeenCalledWith({ 
        userName: { $in: ['Natsh', 'Tester1'] } 
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Stats comparison successful",
        users: expect.any(Array)
      });
      expect(res.json.mock.calls[0][0].users.length).toBe(2);
    });

    test('should return 400 with required usernames message', async () => {
      const req = {
        query: { userName1: 'user1' } // userName2 is missing
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      await getCompareStats(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "Both user names are required for comparison" 
      });
    });

    test('should return 404 with users not found message', async () => {
      user_stats.find = jest.fn().mockResolvedValue([{ userName: 'Natsh' }]);
      
      const req = {
        query: { userName1: 'user1', userName2: 'user2' }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      await getCompareStats(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "One or both users not found" 
      });
    });

    test('should return 500 with error message on exception', async () => {
      const errorMessage = 'Database error';
      user_stats.find = jest.fn().mockRejectedValue(new Error(errorMessage));
      
      const req = {
        query: { userName1: 'user1', userName2: 'user2' }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
    await getCompareStats(req, res);
      
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "Error comparing stats", 
        error: errorMessage 
      });
    });
  });
});
