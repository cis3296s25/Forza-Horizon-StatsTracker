const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const express = require('express');

// Import your model and controller
const hubUser = require('../models/hub_user'); // Adjust path as needed
const { getUsersList } = require('../controllers/users'); // Adjust path as needed

// Create an Express app for testing
const app = express();
app.get('/users', getUsersList);

let mongoServer;

// Setup before tests
beforeAll(async () => {
  // Create in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Cleanup after tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear the user collection before each test
beforeEach(async () => {
  await hubUser.deleteMany({});
});

describe('getUsersList API', () => {
  // Test successful retrieval with matching prefix
  test('should return users matching the prefix', async () => {
    // Set up test data
    const testUsers = [
      { userName: 'john123', platform: 'pc', password: 'pass123', verify: true },
      { userName: 'jane456', platform: 'xbox', password: 'pass456', verify: true },
      { userName: 'jack789', platform: 'steam', password: 'pass789', verify: true },
      { userName: 'mike101', platform: 'manually', password: 'pass101', verify: true }
    ];
    
    await hubUser.insertMany(testUsers);
    
    // Test with prefix 'j'
    const response = await request(app)
      .get('/users')
      .query({ prefix: 'j' });
    
    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.users).toBeDefined();
    expect(response.body.users.length).toBe(3); // Should find john123, jane456, jack789
    
    // Check if the response has the expected userNames
    const returnedUserNames = response.body.users.map(user => user.userName);
    expect(returnedUserNames).toContain('john123');
    expect(returnedUserNames).toContain('jane456');
    expect(returnedUserNames).toContain('jack789');
    expect(returnedUserNames).not.toContain('mike101');
    
    // Check that only userName field is returned
    response.body.users.forEach(user => {
      expect(Object.keys(user)).toHaveLength(2); // _id and userName
      expect(user).toHaveProperty('userName');
      expect(user).toHaveProperty('_id');
      expect(user).not.toHaveProperty('platform');
      expect(user).not.toHaveProperty('password');
    });
  });
  
  // Test with no matches
  test('should return empty array when no users match the prefix', async () => {
    // Set up test data
    const testUsers = [
      { userName: 'john123', platform: 'pc', password: 'pass123', verify: true },
      { userName: 'mike456', platform: 'xbox', password: 'pass456', verify: true }
    ];
    
    await hubUser.insertMany(testUsers);
    
    // Test with prefix 'z'
    const response = await request(app)
      .get('/users')
      .query({ prefix: 'z' });
    
    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.users).toBeDefined();
    expect(response.body.users).toHaveLength(0); // Should find no users
  });
  
  // Test with case insensitivity
  test('should perform case-insensitive search', async () => {
    // Set up test data
    const testUsers = [
      { userName: 'JOHN123', platform: 'pc', password: 'pass123', verify: true },
      { userName: 'john456', platform: 'xbox', password: 'pass456', verify: true }
    ];
    
    await hubUser.insertMany(testUsers);
    
    // Test with lowercase prefix 'j'
    const response = await request(app)
      .get('/users')
      .query({ prefix: 'j' });
    
    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.users).toHaveLength(2); // Should find both john123 and JOHN456
    
    const returnedUserNames = response.body.users.map(user => user.userName);
    expect(returnedUserNames).toContain('JOHN123');
    expect(returnedUserNames).toContain('john456');
  });
  
  // Test without prefix parameter
  test('should return all users when no prefix is provided', async () => {
    // Set up test data
    const testUsers = [
      { userName: 'john123', platform: 'pc', password: 'pass123', verify: true },
      { userName: 'jane456', platform: 'xbox', password: 'pass456', verify: true }
    ];
    
    await hubUser.insertMany(testUsers);
    
    // Test without providing prefix
    const response = await request(app)
      .get('/users');
    
    // It should match all users since regex will be empty
    expect(response.status).toBe(200);
    expect(response.body.users).toHaveLength(2);
  });
  
  // Test error handling
  test('should handle database errors', async () => {
    // Mock the find method to throw an error
    jest.spyOn(hubUser, 'find').mockImplementationOnce(() => {
      throw new Error('Database connection failed');
    });
    
    const response = await request(app)
      .get('/users')
      .query({ prefix: 'j' });
    
    // Assertions
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
    expect(response.body.error).toBe('Database connection failed');
    
    // Restore the original implementation
    hubUser.find.mockRestore();
  });
});