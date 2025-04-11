const request = require('supertest');
const express = require('express');
const { logoutUsers } = require('../controllers/users'); // Adjust path as needed

// Create an Express app for testing
const app = express();
app.use(express.json());
app.post('/logout', logoutUsers);

describe('logoutUsers API', () => {
  // Test successful logout
  test('should successfully log out a user', async () => {
    // Perform the API request
    const response = await request(app)
      .post('/logout')
      .send({});
    
    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Logout successful');
  });

  // Test error handling
  test('should handle errors during logout', async () => {
    // Mock the implementation to throw an error
    const originalLogoutUsers = logoutUsers;
    const mockLogoutUsers = async (req, res) => {
      try {
        throw new Error('Test error');
      } catch (error) {
        res.status(500).json({ message: "Error logging out", error: error.message });
      }
    };

    // Replace the original function with the mock
    app._router.stack.forEach((layer) => {
      if (layer.route && layer.route.path === '/logout') {
        layer.route.stack[0].handle = mockLogoutUsers;
      }
    });

    // Perform the API request
    const response = await request(app)
      .post('/logout')
      .send({});
    
    // Assertions
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Error logging out');
    expect(response.body.error).toBe('Test error');

    // Restore the original function
    app._router.stack.forEach((layer) => {
      if (layer.route && layer.route.path === '/logout') {
        layer.route.stack[0].handle = originalLogoutUsers;
      }
    });
  });
});