import { createClient, type Client, type Config } from './generated/client';
import { GeneratedNodestyApiClient } from './generated/facade.gen';

export const NODESTY_API_BASE_URL = 'https://nodesty.com';

export type NodestyClient = Client;

export interface NodestyClientOptions extends Omit<Config, 'auth' | 'baseUrl'> {
    /** Personal access token without the `PAT ` prefix. */
    accessToken?: string;
    /** Override this for tests, proxies, or self-hosted compatible APIs. */
    baseUrl?: string;
}

/** Creates an isolated client that can be passed to every generated SDK function. */
export const createNodestyClient = ({
    accessToken,
    baseUrl = NODESTY_API_BASE_URL,
    ...config
}: NodestyClientOptions = {}): NodestyClient =>
    createClient({
        ...config,
        auth: accessToken ? `PAT ${accessToken}` : undefined,
        baseUrl,
    });

/** Stripe.js-style grouped Nodesty API client. */
export class NodestyApiClient extends GeneratedNodestyApiClient {
    public constructor(options: NodestyClientOptions = {}) {
        super(createNodestyClient(options));
    }
}

export default NodestyApiClient;
