import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { Express } from 'express';
import { setupApp, teardownApp } from './setup';
import { StatusCodes } from 'http-status-codes';

describe('Health Check API', () => {
  let app: Express;

  beforeAll(async () => {
    app = await setupApp();
  });

  afterAll(async () => {
    await teardownApp();
  });

  describe('GET /api/health', () => {
    it('should return status 200', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(StatusCodes.OK);
    });

    it('should return ok status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.body).toHaveProperty('status', 'ok');
    });

    it('should return a valid timestamp', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.body).toHaveProperty('timestamp');
      
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).not.toBeNaN();
    });

    it('should return JSON content type', async () => {
      const response = await request(app).get('/api/health');
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });
});
