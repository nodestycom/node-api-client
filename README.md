# Nodesty API Client

Type-safe Node.js client generated from the [Nodesty OpenAPI schema](https://nodesty.com/_openapi.json).

## Installation

```bash
npm install @nodesty/api-client
```

Node.js 18.18 or newer is required. The client also works in runtimes that provide the standard Fetch API.

## Quick start

```ts
import { NodestyApiClient } from '@nodesty/api-client';

const client = new NodestyApiClient({
    accessToken: process.env.NODESTY_ACCESS_TOKEN,
});

const result = await client.user.getCurrentUser();

if (result.error) {
    console.error(result.error.message);
} else {
    console.log(result.data);
}
```

Keep personal access tokens in environment variables. Never commit them to source control.

## Resources

Operations are grouped by their OpenAPI category:

- `client.user`
- `client.billing`
- `client.virtualServer`
- `client.dedicatedServer`
- `client.firewall`
- `client.mailHosting`

Path parameters are positional. A request body is passed as the final data argument:

```ts
await client.billing.addOrder('group-id', 'product-id', {
    domain: 'example.com',
    billingCycle: 'Monthly',
});

await client.virtualServer.performAction('service-id', {
    action: 'start',
});

await client.firewall.getAttackLogs('service-id', '203.0.113.10');
```

All parameters, request bodies, response data, and documented errors are fully typed from OpenAPI.

## Responses

Methods return the parsed API body together with the standard Fetch API `Request` and `Response` objects.

### Successful response (200)

```ts
{
    data: { /* endpoint response */ },
    request: Request,
    response: Response, // response.status === 200
}
```

List endpoints return an array in `data`.

### Successful response without content (204)

```ts
{
    data: undefined,
    request: Request,
    response: Response, // response.status === 204
}
```

### Error response

```ts
{
    error: {
        error: true,
        message: 'Service not found',
        statusCode: 404,
        statusMessage: 'Not Found',
        url: '/api/services/example/vps/info',
    },
    request: Request,
    response: Response, // response.status === 404
}
```

The exact error fields depend on the endpoint. To throw the parsed API error instead of returning it, pass `throwOnError` in the final options argument:

```ts
const user = await client.user.getCurrentUser({ throwOnError: true });

await client.virtualServer.performAction('service-id', { action: 'start' }, { throwOnError: true });
```

## Configuration

The constructor accepts standard Fetch options and supports custom implementations for testing or proxies:

```ts
const client = new NodestyApiClient({
    accessToken: process.env.NODESTY_ACCESS_TOKEN,
    baseUrl: 'https://nodesty.com',
    headers: {
        'User-Agent': 'my-application/1.0.0',
    },
    fetch: customFetch,
});
```

The generated low-level SDK functions and request/response types are also exported for advanced integrations.

## License

[MIT](LICENSE)
