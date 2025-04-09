const request = require('supertest');
const app = require('../app'); // Path to your Express app
const hub_user = require('../models/hub_user');
const user_stats = require('../models/user_stats');
const user_profile = require('../models/user_profile');
const mockingoose = require('mockingoose');

describe('DELETE /api/userAccount/delete', () => {
    let userName = 'testUser';

    beforeEach(() => {
        mockingoose(hub_user).reset(); // Reset mock state before each test
        mockingoose(user_stats).reset();
        mockingoose(user_profile).reset();
    });

    it('should delete the user and related data successfully', async () => {
        // Mock the deletion of the user, userStats, and userProfile
        mockingoose(hub_user).toReturn({ userName }, 'findOneAndDelete');
        mockingoose(user_stats).toReturn({ userName }, 'findOneAndDelete');
        mockingoose(user_profile).toReturn({ userName }, 'findOneAndDelete');

        const res = await request(app).delete('/api/userAccount/delete')
            .send({ userName });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('User deleted successfully');
    });

    it('should return 404 if user or related data not found', async () => {
        // Mock the deletion to return null (not found)
        mockingoose(hub_user).toReturn(null, 'findOneAndDelete');
        mockingoose(user_stats).toReturn(null, 'findOneAndDelete');
        mockingoose(user_profile).toReturn(null, 'findOneAndDelete');

        const res = await request(app).delete('/api/userAccount/delete')
            .send({ userName });

        expect(res.status).toBe(404);
        expect(res.body.message).toBe('User not found');
    });

    it('should return 500 if an error occurs during deletion', async () => {
        // Mock an error in the deletion process
        mockingoose(hub_user).toReturn(new Error('Database error'), 'findOneAndDelete');

        const res = await request(app).delete('/api/userAccount/delete')
            .send({ userName });

        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Error deleting user');
        expect(res.body.error).toBe('Database error');
    });
});
