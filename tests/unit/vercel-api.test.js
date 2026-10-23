const { test, describe } = require('node:test');
const assert = require('node:assert');
const path = require('path');

const carsHandler = require('../../api/cars.js');
const configHandler = require('../../api/config.js');
const healthHandler = require('../../api/health.js');

function createMockReqRes(method = 'GET', body = null) {
  const headers = {};
  const res = {
    statusCode: 200,
    headers: {},
    body: '',
    setHeader(k, v) {
      this.headers[k.toLowerCase()] = v;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = JSON.stringify(data);
      return this;
    },
    end(data) {
      if (data) this.body = data;
    }
  };

  const req = {
    method,
    headers: {},
    body
  };

  return { req, res };
}

describe('Vercel Serverless API Handlers', () => {
  test('GET /api/health returns healthy payload', async () => {
    const { req, res } = createMockReqRes('GET');
    await healthHandler(req, res);
    assert.strictEqual(res.statusCode, 200);
    const parsed = JSON.parse(res.body);
    assert.strictEqual(parsed.status, 'healthy');
    assert.strictEqual(parsed.platform, 'Vercel Serverless');
  });

  test('GET /api/config returns safe public config structure', async () => {
    const { req, res } = createMockReqRes('GET');
    await configHandler(req, res);
    assert.strictEqual(res.statusCode, 200);
    const parsed = JSON.parse(res.body);
    assert.ok('supabaseUrl' in parsed);
    assert.ok('supabaseAnonKey' in parsed);
    assert.ok('cloudinaryCloudName' in parsed);
    assert.ok('cloudinaryUploadPreset' in parsed);
    assert.strictEqual(res.headers['access-control-allow-origin'], '*');
  });

  test('GET /api/cars returns 11 vehicles from fallback fleet', async () => {
    const { req, res } = createMockReqRes('GET');
    await carsHandler(req, res);
    assert.strictEqual(res.statusCode, 200);
    const parsed = JSON.parse(res.body);
    assert.ok(Array.isArray(parsed));
    assert.strictEqual(parsed.length, 11);
    assert.strictEqual(parsed[0].name, 'Mahindra Thar 4x4');
    assert.strictEqual(res.headers['access-control-allow-origin'], '*');
  });

  test('OPTIONS /api/cars handles CORS preflight', async () => {
    const { req, res } = createMockReqRes('OPTIONS');
    await carsHandler(req, res);
    assert.strictEqual(res.statusCode, 204);
    assert.strictEqual(res.headers['access-control-allow-origin'], '*');
  });
});
