const { getUserStats, getProfileStats, getCompareStats } = require('../controllers/user');
const user_stats = require('../models/user_stats');
const user_profile = require('../models/user_profile');

// Mocking the models
jest.mock('../models/user_stats');
jest.mock('../models/user_profile');

describe('User Controller Tests', () => {
  // Reset all mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // getUserStats tests
  describe('getUserStats', () => {
    test('should return user stats when authorized', async () => {
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
      
      // Execute
      await getUserStats(req, res);
      
      // Assert
      expect(user_stats.findOne).toHaveBeenCalledWith({ userName: 'testUser' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "Stats fetched successfully", 
        stats: mockStats 
      });
    });

    test('should return 403 when unauthorized', async () => {
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
  });

  // getProfileStats tests
  describe('getProfileStats', () => {
    test('should return profile stats successfully', async () => {
      // Setup mocks
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
      
      // Execute
      await getProfileStats(req, res);
      
      // Assert
      expect(user_profile.findOne).toHaveBeenCalledWith({ userName: 'testUser' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "Profile stats fetched successfully", 
        level: 10,
        avatar: 'avatar.jpg',
        platform: 'steam'
      });
    });

    test('should return 404 when profile not found', async () => {
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
  });

  // getCompareStats tests
  describe('getCompareStats', () => {
    test('should compare stats of two users successfully', async () => {
      // Setup mocks
      const mockUsers = [
        { 
          userName: 'user1',
          timeDriven: 100,
          numberofCarsOwned: 5,
          mostValuableCar: 'Ferrari',
          totalWinnningsinCR: 10,
          favoriteCar: 'BMW',
          garageValue: 500000,
          longestSkillChain: 20,
          distanceDrivenInMiles: 200,
          longestJump: 50,
          topSpeed: 150,
          biggestAir: 30,
          victories: 8
        },
        { 
          userName: 'user2',
          timeDriven: 200,
          numberofCarsOwned: 10,
          mostValuableCar: 'Lamborghini',
          totalWinnningsinCR: 20,
          favoriteCar: 'Audi',
          garageValue: 1000000,
          longestSkillChain: 40,
          distanceDrivenInMiles: 400,
          longestJump: 100,
          topSpeed: 180,
          biggestAir: 60,
          victories: 15
        }
      ];
      
      user_stats.find = jest.fn().mockResolvedValue(mockUsers);
      
      const req = {
        query: { userName1: 'user1', userName2: 'user2' }
      };
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      // Execute
      await getCompareStats(req, res);
      
      // Assert
      expect(user_stats.find).toHaveBeenCalledWith({ 
        userName: { $in: ['user1', 'user2'] } 
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Stats comparison successful",
        users: expect.any(Array)
      });
      expect(res.json.mock.calls[0][0].users.length).toBe(2);
    });

    test('should return 400 when usernames are missing', async () => {
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
  });
});