import assert from 'node:assert/strict';
import test from 'node:test';

import {
    billingGetStoreGroups,
    createNodestyClient,
    NodestyApiClient,
    userGetCurrentUser,
    virtualServerGetInformation,
} from '../dist/index.js';

const jsonResponse = (body = {}, status = 200) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json' },
    });

test('adds the PAT authorization header to protected requests', async () => {
    let capturedRequest;
    const client = createNodestyClient({
        accessToken: 'test-token',
        fetch: async (request) => {
            capturedRequest = request;
            return jsonResponse({ id: 'user-1' });
        },
    });

    const result = await userGetCurrentUser({ client });

    assert.equal(capturedRequest.url, 'https://nodesty.com/api/users/@me');
    assert.equal(capturedRequest.headers.get('authorization'), 'PAT test-token');
    assert.equal(result.data.id, 'user-1');
});

test('does not add authorization to public operations', async () => {
    let capturedRequest;
    const client = createNodestyClient({
        fetch: async (request) => {
            capturedRequest = request;
            return jsonResponse([]);
        },
    });

    await billingGetStoreGroups({ client });

    assert.equal(capturedRequest.headers.get('authorization'), null);
});

test('serializes generated path parameters safely', async () => {
    let capturedRequest;
    const client = createNodestyClient({
        accessToken: 'test-token',
        fetch: async (request) => {
            capturedRequest = request;
            return jsonResponse({});
        },
    });

    await virtualServerGetInformation({
        client,
        path: { id: 'service/id' },
    });

    assert.equal(capturedRequest.url, 'https://nodesty.com/api/services/service%2Fid/vps/info');
});

test('exposes generated operations through grouped category clients', async () => {
    const capturedRequests = [];
    const client = new NodestyApiClient({
        accessToken: 'test-token',
        fetch: async (request) => {
            capturedRequests.push(request);
            return jsonResponse({});
        },
    });

    await client.user.getCurrentUser();
    await client.billing.addOrder('group-id', 'product-id', {
        domain: 'example.com',
        billingCycle: 'Monthly',
    });
    await client.virtualServer.performAction('service-id', { action: 'start' });
    await client.virtualServer.getInformation('service-id');

    assert.deepEqual(
        capturedRequests.map((request) => [request.method, request.url]),
        [
            ['GET', 'https://nodesty.com/api/users/@me'],
            ['POST', 'https://nodesty.com/api/store/group-id/product-id/order'],
            ['POST', 'https://nodesty.com/api/services/service-id/vps/action'],
            ['GET', 'https://nodesty.com/api/services/service-id/vps/info'],
        ],
    );
    assert.equal(capturedRequests[0].headers.get('authorization'), 'PAT test-token');
    assert.deepEqual(await capturedRequests[1].json(), {
        domain: 'example.com',
        billingCycle: 'Monthly',
    });
    assert.deepEqual(await capturedRequests[2].json(), { action: 'start' });
});

test('returns stable result shapes for 200, 204, and error responses', async () => {
    const client = new NodestyApiClient({
        accessToken: 'test-token',
        fetch: async (request) => {
            if (request.url.endsWith('/action')) {
                return new Response(null, { status: 204 });
            }
            if (request.url.includes('/missing/')) {
                return jsonResponse(
                    {
                        error: true,
                        message: 'Service not found',
                        statusCode: 404,
                        statusMessage: 'Not Found',
                        url: request.url,
                    },
                    404,
                );
            }
            return jsonResponse({ id: 'user-1' });
        },
    });

    const success = await client.user.getCurrentUser();
    const noContent = await client.virtualServer.performAction('service-id', { action: 'start' });
    const failure = await client.virtualServer.getInformation('missing');

    assert.deepEqual(success.data, { id: 'user-1' });
    assert.equal(success.response.status, 200);
    assert.equal(noContent.data, undefined);
    assert.equal(noContent.response.status, 204);
    assert.deepEqual(failure.error, {
        error: true,
        message: 'Service not found',
        statusCode: 404,
        statusMessage: 'Not Found',
        url: 'https://nodesty.com/api/services/missing/vps/info',
    });
    assert.equal(failure.response.status, 404);
});
