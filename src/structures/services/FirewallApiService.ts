import type { $Fetch } from 'ofetch';
import type { ApiResponse } from '..';

export class FirewallApiService {
    public constructor(private apiFetch: $Fetch) {}

    /**
     * Get nShield statistics for a specific IP address on a VPS or Dedicated Server
     * @param id Service ID
     * @param ip IP Address
     */
    public getAttackLogs(id: string, ip: string) {
        return this.apiFetch<ApiResponse<FirewallAttackLog[]>>(
            `/services/${id}/firewall/${ip}/attack-logs`,
        );
    }

    /**
     * Get attack notification settings for a specific IP address on a VPS or Dedicated Server
     * @param id Service ID
     * @param ip IP Address
     */
    public getAttackNotificationSettings(id: string, ip: string) {
        return this.apiFetch<ApiResponse<AttackNotificationSettings>>(
            `/services/${id}/firewall/${ip}/attack-notification`,
        );
    }

    /**
     * Update attack notification settings for a specific IP address on a VPS or Dedicated Server
     * @param id Service ID
     * @param ip IP Address
     * @param settings New attack notification settings
     */
    public updateAttackNotificationSettings(
        id: string,
        ip: string,
        data: AttackNotificationSettings,
    ) {
        return this.apiFetch<ApiResponse<AttackNotificationSettings>>(
            `/services/${id}/firewall/${ip}/attack-notification`,
            {
                method: 'PUT',
                body: data,
            },
        );
    }

    /**
     * Reset reverse DNS (rDNS) for a specific IP address on a VPS or Dedicated Server
     * @param id Service ID
     * @param ip IP Address
     */
    public resetReverseDns(id: string, ip: string) {
        return this.apiFetch<ApiResponse<void>>(`/services/${id}/firewall/${ip}/rdns`, {
            method: 'DELETE',
        });
    }

    /**
     * Get reverse DNS (rDNS) for a specific IP address on a VPS or Dedicated Server
     * @param id Service ID
     * @param ip IP Address
     */
    public getReverseDns(id: string, ip: string) {
        return this.apiFetch<ApiResponse<FirewallReverseDns>>(
            `/services/${id}/firewall/${ip}/rdns`,
        );
    }

    /**
     * Set or update reverse DNS (rDNS) for a specific IP address on a VPS or Dedicated Server
     * @param id Service ID
     * @param ip IP Address
     */
    public upsertReverseDns(id: string, ip: string, data: FirewallReverseDns) {
        return this.apiFetch<ApiResponse<void>>(`/services/${id}/firewall/${ip}/rdns`, {
            method: 'PUT',
            body: data,
        });
    }

    /**
     * Delete a nShield rule for a specific IP address on a VPS or Dedicated Server
     * @param id Service ID
     * @param ip IP Address
     * @param ruleId Rule ID
     */
    public deleteRule(id: string, ip: string, ruleId: string) {
        return this.apiFetch<ApiResponse<void>>(`/services/${id}/firewall/${ip}/rules/${ruleId}`, {
            method: 'DELETE',
        });
    }

    /**
     * Get nShield rules for a specific IP address on a VPS or Dedicated Server
     * @param id Service ID
     * @param ip IP Address
     */
    public getRules(id: string, ip: string) {
        return this.apiFetch<ApiResponse<FirewallRule[]>>(`/services/${id}/firewall/${ip}/rules`);
    }

    /**
     * Get nShield statistics for a specific IP address on a VPS or Dedicated Server
     * @param id Service ID
     * @param ip IP Address
     */
    public getStatistics(id: string, ip: string) {
        return this.apiFetch<ApiResponse<FirewallStatistics[]>>(
            `/services/${id}/firewall/${ip}/stats`,
        );
    }
}

/**
 * Represents a log entry for an attack detected by the nShield.
 */
export interface FirewallAttackLog {
    /**
     * Timestamp when the attack started.
     * @example 1700000000000
     */
    startedAt: number;

    /**
     * Timestamp when the attack ended, null if ongoing.
     * @example 1700000000000
     * @nullable true
     */
    endedAt: number | null;

    /**
     * List of attack vectors used during the attack.
     * @example ["TCP_SYN", "ICMP"]
     */
    vectors: string[];

    /**
     * Peak traffic during the attack in packets per second.
     * @example 5000
     */
    peak: number;
}

/**
 * Represents the settings for attack notifications on a VPS or Dedicated Server.
 */
export interface AttackNotificationSettings {
    /**
     * Whether email notifications are enabled for attack alerts.
     * @example true
     */
    emailNotification: boolean;

    /**
     * Discord webhook URL for attack notifications.
     * @example "https://discord.com/api/webhooks/123456789012345678/abcdefghijklmnopqrstuvwxyz"
     * @nullable true
     */
    discordWebhookURL: string | null;
}

/**
 * Represents the Reverse DNS (rDNS) settings for an IP address.
 */
export interface FirewallReverseDns {
    /**
     * Reverse DNS entry for the IP address.
     * @example "example.domain.com"
     */
    rdns: string | null;
}

/**
 * Represents a nShield rule for a specific IP address on a VPS or Dedicated Server.
 */
export interface FirewallRule {
    /**
     * Rule ID.
     * @example 12345
     */
    id: number;

    /**
     * Protocol used by the rule.
     * @example "TCP"
     */
    protocol: string;

    /**
     * Service associated with the rule.
     * @example "Minecraft"
     */
    service: string;

    /**
     * Port number for the rule.
     * @example 25565
     */
    port: number;
}

/**
 * Represents nShield statistics for a specific IP address on a VPS or Dedicated Server.
 */
export interface FirewallStatistics {
    /**
     * Timestamp of the traffic data.
     * @format date-time
     */
    timestamp: number;

    /**
     * Total traffic that passed through the nShield.
     * @example "10248576"
     */
    totalPassTraffic: string;

    /**
     * Total traffic that was dropped by the nShield.
     * @example "2048576"
     */
    totalDropTraffic: string;
}
