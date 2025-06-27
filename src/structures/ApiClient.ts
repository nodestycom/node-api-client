import type { $Fetch } from 'ofetch';
import {
    createFetch,
    UserApiService,
    VpsApiService,
    DedicatedServerApiService,
    type RestClientOptions,
} from '.';

export class NodestyAPIClient {
    public apiFetch: $Fetch;

    public constructor(options: RestClientOptions) {
        this.apiFetch = createFetch(options);
    }

    public get user() {
        return new UserApiService(this.apiFetch);
    }

    public get vps() {
        return new VpsApiService(this.apiFetch);
    }

    public get dedicatedServer() {
        return new DedicatedServerApiService(this.apiFetch);
    }
}
