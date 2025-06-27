import type { $Fetch } from 'ofetch';
import { createFetch, UserAPIService, type RestClientOptions } from '.';

export class NodestyAPIClient {
    public apiFetch: $Fetch;

    public constructor(options: RestClientOptions) {
        this.apiFetch = createFetch(options);
    }

    public get user() {
        return new UserAPIService(this.apiFetch);
    }
}
