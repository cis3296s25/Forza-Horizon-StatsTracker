const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app'); // Adjust path as needed

// Import models
const hub_user = require('../models/hub_user'); // Adjust path as needed
const user_stats = require('../models/user_stats'); // Adjust path as needed
const user_profile = require('../models/user_profile'); // Adjust path as needed

// Mock the models
jest.mock('../models/hub_user');
jest.mock('../models/user_stats');
jest.mock('../models/user_profile');

describe('User Controller - deleteUsers', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a user successfully when user exists', async () => {
    // Mock the findOneAndDelete functions to return some data
    const mockUser = { userName: 'testUser'};
    
    hub_user.findOneAndDelete.mockResolvedValue(mockUser);
    user_stats.findOneAndDelete.mockResolvedValue(mockUser);
    user_profile.findOneAndDelete.mockResolvedValue(mockUser);

    // Make the request
    const res = await request(app)
      .delete('/api/userAccount/delete') // Adjust endpoint as needed
      .send({ userName: 'testUser' });

    // Assertions
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'User deleted successfully' });
    
    // Verify that findOneAndDelete was called with correct params
    expect(hub_user.findOneAndDelete).toHaveBeenCalledWith({ userName: 'testUser' });
    expect(user_stats.findOneAndDelete).toHaveBeenCalledWith({ userName: 'testUser' });
    expect(user_profile.findOneAndDelete).toHaveBeenCalledWith({ userName: 'testUser' });
  });

  it('should return 404 when user is not found', async () => {
    // Mock the findOneAndDelete functions to return null (user not found)
    hub_user.findOneAndDelete.mockResolvedValue(null);
    user_stats.findOneAndDelete.mockResolvedValue(null);
    user_profile.findOneAndDelete.mockResolvedValue(null);

    // Make the request
    const res = await request(app)
      .delete('/api/userAccount/delete') // Adjust endpoint as needed
      .send({ userName: 'nonExistentUser' });

    // Assertions
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: 'User not found' });
  });

  it('should handle server errors properly', async () => {
    // Mock the findOneAndDelete function to throw an error
    const errorMessage = 'Database connection failed';
    hub_user.findOneAndDelete.mockRejectedValue(new Error(errorMessage));

    // Make the request
    const res = await request(app)
      .delete('/api/userAccount/delete') // Adjust endpoint as needed
      .send({ userName: 'testUser' });

    // Assertions
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ 
      message: 'Error deleting user', 
      error: errorMessage 
    });
  });
});