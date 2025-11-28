import type { $Fetch } from 'ofetch';
import type { ApiResponse } from '..';

export class MailHostingApiService {
    public constructor(private apiFetch: $Fetch) {}

    /**
     * Get information about a mail hosting service
     * @param id Service ID
     */
    public getDetails(id: string) {
        return this.apiFetch<ApiResponse<MailHostingDetails>>(`/services/${id}/mail/info`);
    }
}

/**
 * Represents the details of a mail hosting service.
 */
export interface MailHostingDetails {
    /**
     * Current status of the mail hosting service.
     * @example "active"
     */
    status: 'active' | 'pending';

    /**
     * Indicates if SpamExperts is enabled.
     * @example true
     */
    spamExperts: boolean;

    /**
     * Indicates if file storage is enabled.
     * @example true
     */
    fileStorage: boolean;

    /**
     * Indicates if Office integration is enabled.
     * @example true
     */
    office: boolean;

    /**
     * Domain alias usage and limits.
     */
    domainAlias: {
        /**
         * Number of domain aliases.
         * @example 2
         */
        count: number;
        /**
         * Maximum number of domain aliases.
         * @example 5
         */
        limit: number;
    };

    /**
     * Disk usage and limits.
     */
    disk: {
        /**
         * Disk usage in bytes.
         * @example 104857600
         */
        usage: number;
        /**
         * Disk limit in bytes.
         * @example 524288000
         */
        limit: number;
    };

    /**
     * User usage and limits.
     */
    users: {
        /**
         * Number of users.
         * @example 10
         */
        count: number;
        /**
         * Maximum number of users.
         * @example 20
         */
        limit: number;
        /**
         * Number of user aliases.
         * @example 5
         */
        aliasCount: number;
        /**
         * Maximum number of user aliases.
         * @example 10
         */
        aliasLimit: number;
    };

    /**
     * Archive years settings.
     */
    archiveYears: {
        /**
         * Number of archived years.
         * @example 0
         */
        number: number;
        /**
         * Status of archived years.
         * @example "disabled"
         */
        status: 'enabled' | 'disabled';
    };

    /**
     * Verification status and details.
     */
    verified: {
        /**
         * Verification status.
         * @example true
         */
        status: boolean;
        /**
         * Type of verification record.
         * @example "TXT"
         */
        type: 'TXT';
        /**
         * Verification TXT record.
         * @example "b9959b96-4d2a-4e54-b148-2a18f003de90"
         */
        record: string;
    };

    /**
     * List of DNS records.
     */
    dns: {
        /**
         * DNS record name.
         * @example "mail.example.com"
         */
        name: string;
        /**
         * DNS record type.
         * @example "MX"
         */
        type: 'MX' | 'CNAME' | 'TXT';
        /**
         * DNS record value.
         * @example "mail.example.com."
         */
        value: string;
        /**
         * DNS record priority.
         * @example 10
         */
        priority: number;
        /**
         * Status of DNS record verification.
         * @example true
         */
        status: boolean;
    }[];

    /**
     * DKIM record details.
     * @nullable true
     */
    dkim: {
        /**
         * DKIM record name.
         * @example "asdDjskladl2184._domainKey"
         */
        name: string;
        /**
         * DKIM record type.
         * @example "TXT"
         */
        type: string;
        /**
         * DKIM record value.
         * @example "mail.example.com."
         */
        value: string;
        /**
         * Status of DKIM record verification.
         * @example true
         */
        status: boolean;
    } | null;
}
