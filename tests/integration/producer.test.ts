import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { Express } from 'express';
import { setupApp, teardownApp } from './setup';
import { StatusCodes } from 'http-status-codes';

describe('Producer Awards Interval API', () => {
  let app: Express;

  beforeAll(async () => {
    app = await setupApp();
  });

  afterAll(async () => {
    await teardownApp();
  });

  describe('GET /api/producers/awards-interval', () => {
    it('should return status 200', async () => {
      const response = await request(app).get('/api/producers/awards-interval');
      expect(response.status).toBe(StatusCodes.OK);
    });

    it('should return an object with min and max arrays', async () => {
      const response = await request(app).get('/api/producers/awards-interval');
      
      expect(response.body).toHaveProperty('min');
      expect(response.body).toHaveProperty('max');
      expect(Array.isArray(response.body.min)).toBe(true);
      expect(Array.isArray(response.body.max)).toBe(true);
    });

    it('should return valid interval objects with required fields', async () => {
      const response = await request(app).get('/api/producers/awards-interval');
      
      if (response.body.min.length > 0) {
        const minItem = response.body.min[0];
        expect(minItem).toHaveProperty('producer');
        expect(minItem).toHaveProperty('interval');
        expect(minItem).toHaveProperty('previousWin');
        expect(minItem).toHaveProperty('followingWin');
        expect(typeof minItem.producer).toBe('string');
        expect(typeof minItem.interval).toBe('number');
        expect(typeof minItem.previousWin).toBe('number');
        expect(typeof minItem.followingWin).toBe('number');
      }

      if (response.body.max.length > 0) {
        const maxItem = response.body.max[0];
        expect(maxItem).toHaveProperty('producer');
        expect(maxItem).toHaveProperty('interval');
        expect(maxItem).toHaveProperty('previousWin');
        expect(maxItem).toHaveProperty('followingWin');
      }
    });

    it('should have followingWin greater than previousWin', async () => {
      const response = await request(app).get('/api/producers/awards-interval');
      
      for (const item of response.body.min) {
        expect(item.followingWin).toBeGreaterThan(item.previousWin);
        expect(item.interval).toBe(item.followingWin - item.previousWin);
      }

      for (const item of response.body.max) {
        expect(item.followingWin).toBeGreaterThan(item.previousWin);
        expect(item.interval).toBe(item.followingWin - item.previousWin);
      }
    });

    it('should have min interval less than or equal to max interval', async () => {
      const response = await request(app).get('/api/producers/awards-interval');
      
      if (response.body.min.length > 0 && response.body.max.length > 0) {
        const minInterval = response.body.min[0].interval;
        const maxInterval = response.body.max[0].interval;
        expect(minInterval).toBeLessThanOrEqual(maxInterval);
      }
    });
  });
});
