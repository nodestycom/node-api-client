import type { $Fetch } from 'ofetch';
import {
    createFetch,
    UserApiService,
    VpsApiService,
    FirewallApiService,
    DedicatedServerApiService,
    type RestClientOptions,
} from '.';

export class NodestyAPIClient {
    public apiFetch: $Fetch;

    public constructor(options: RestClientOptions) {
        this.apiFetch = createFetch(options);
    }

    /**
     * Get the User API Service instance
     */
    public get user() {
        return new UserApiService(this.apiFetch);
    }

    /**
     * Get the VPS API Service instance
     */
    public get vps() {
        return new VpsApiService(this.apiFetch);
    }

    /**
     * Get the Firewall API Service instance
     */
    public get firewall() {
        return new FirewallApiService(this.apiFetch);
    }

    /**
     * Get the Dedicated Server API Service instance
     */
    public get dedicatedServer() {
        return new DedicatedServerApiService(this.apiFetch);
    }
}
