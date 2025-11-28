import type { $Fetch } from 'ofetch';
import type { ApiResponse } from '..';

export class VpsApiService {
    public constructor(private apiFetch: $Fetch) {}

    /**
     * Perform an action on a VPS
     * @param id Service ID
     * @param action Action to perform
     */
    public performAction(id: string, action: VpsAction) {
        return this.apiFetch<ApiResponse<void>>(`/services/${id}/vps/action`, {
            method: 'POST',
            body: { action },
        });
    }

    /**
     * Restore a VPS backup
     * @param id Service ID
     * @param file Name of the backup file
     */
    public restoreBackup(id: string, file: string) {
        return this.apiFetch<ApiResponse<void>>(`/services/${id}/vps/backups/${file}/restore`, {
            method: 'POST',
        });
    }

    /**
     * Update a VPS backup
     * @param id Service ID
     * @param file Name of the backup file
     * @param data Backup update data
     */
    public updateBackup(id: string, file: string, data: VpsUpdateBackupData) {
        return this.apiFetch<ApiResponse<void>>(`/services/${id}/vps/backups/${file}`, {
            method: 'PATCH',
            body: data,
        });
    }

    /**
     * Get VPS backups
     * @param id Service ID
     */
    public getBackups(id: string) {
        return this.apiFetch<ApiResponse<VpsBackup[]>>(`/services/${id}/vps/backups`);
    }

    /**
     * Create a new VPS backup
     * @param id Service ID
     */
    public createBackup(id: string) {
        return this.apiFetch<ApiResponse<void>>(`/services/${id}/vps/backups`, {
            method: 'POST',
        });
    }

    /**
     * Change the daily backup status of a VPS
     * @param id Service ID
     * @param data Daily backup status data
     */
    public changeDailyBackupStatus(id: string, data: VpsDailyBackupStatusData) {
        return this.apiFetch<ApiResponse<void>>(`/services/${id}/vps/backups/daily-backups`, {
            method: 'PUT',
            body: data,
        });
    }

    /**
     * Change the password of a VPS
     * @param id Service ID
     * @param username User whose password will be changed
     * @param password New password for the VPS
     */
    public changePassword(id: string, data: VpsChangePasswordData) {
        return this.apiFetch<ApiResponse<void>>(`/services/${id}/vps/change-password`, {
            method: 'POST',
            body: data,
        });
    }

    /**
     * Get VPS usage statistics graphs
     * @param id Service ID
     */
    public getUsageStatistics(id: string) {
        return this.apiFetch<ApiResponse<VpsUsageGraphEntry[]>>(`/services/${id}/vps/graphs`);
    }

    /**
     * Get VPS details
     * @param id Service ID
     */
    public getDetails(id: string) {
        return this.apiFetch<ApiResponse<VpsDetails>>(`/services/${id}/vps/info`);
    }

    /**
     * Get available OS templates for a VPS
     * @param id Service ID
     */
    public getOsTemplates(id: string) {
        return this.apiFetch<ApiResponse<VpsOsTemplate[]>>(`/services/${id}/vps/os-templates`);
    }

    /**
     * Reinstall a VPS with a new OS
     * @param id Service ID
     */
    public reinstall(id: string, data: VpsReinstallData) {
        return this.apiFetch<ApiResponse<void>>(`/services/${id}/vps/reinstall`, {
            method: 'POST',
            body: data,
        });
    }

    /**
     * Get VPS tasks
     * @param id Service ID
     */
    public getTasks(id: string) {
        return this.apiFetch<ApiResponse<VpsTask[]>>(`/services/${id}/vps/tasks`);
    }
}

/**
 * Represents the action to be performed on a VPS.
 */
export enum VpsAction {
    Start = 'start',
    Shutdown = 'shutdown',
    Reset = 'reset',
    Stop = 'stop',
}

/**
 * Represents a backup of a VPS.
 */
export interface VpsBackup {
    /**
     * Name of the backup file
     * @example "backup-pool:backup/vm/2702/2025-08-09T18:11:41Z"
     */
    file: string;

    /**
     * Notes about the backup
     * @example "Backup created before major update"
     */
    notes: string;

    /**
     * Unix timestamp when the backup was created
     * @example 1625251200000
     */
    createdAt: number;
}

/**
 * Represents the data required to change the password of a VPS.
 */
export interface VpsChangePasswordData {
    /**
     * User whose password will be changed
     * @example "Administrator"
     */
    username: string;
    /**
     * New password for the VPS
     * @example "StrongPassword123!"
     */
    password: string;
}

/**
 * Represents a single entry in the VPS usage statistics graph.
 */
export interface VpsUsageGraphEntry {
    /**
     * Network outbound traffic in bytes.
     * @example 12345
     */
    netOut: number;

    /**
     * Network inbound traffic in bytes.
     * @example 12345
     */
    netIn: number;

    /**
     * RAM usage in bytes.
     * @example 12345
     */
    ramUsage: number;

    /**
     * CPU usage in percentage.
     * @example 12.34
     */
    cpuUsage: number;

    /**
     * Disk read in bytes.
     * @example 12345
     */
    diskRead: number;

    /**
     * Disk write in bytes.
     * @example 12345
     */
    diskWrite: number;

    /**
     * Unix timestamp of the data.
     * @format date-time
     * @example 1704067200000
     */
    timestamp: number;
}

/**
 * Represents VNC connection details for a VPS.
 */
export interface VpsVncDetails {
    /**
     * Port for VNC access
     * @example "5900"
     */
    port: string;

    /**
     * VNC ticket
     */
    ticket: string;
}

/**
 * Represents operating system details of a VPS.
 */
export interface VpsOsDetails {
    /**
     * ID of the operating system
     * @example "debian"
     */
    id: string;

    /**
     * Name of the operating system
     * @example "Debian GNU/Linux 12 (bookworm)"
     */
    name: string;
}

/**
 * Represents CPU details and usage for a VPS.
 */
export interface VpsCpuDetails {
    /**
     * CPU usage percentage
     * @format float
     * @example 75.5
     */
    percent: number;

    /**
     * Number of CPU cores assigned to the VPS
     * @example 4
     */
    cores: number;
}

/**
 * Represents RAM usage details for a VPS.
 */
export interface VpsRamUsage {
    /**
     * RAM limit in bytes
     * @example 2147483648
     */
    limit: number;

    /**
     * Used RAM in bytes
     * @example 1073741824
     */
    used: number;

    /**
     * Free RAM in bytes
     * @example 1073741824
     */
    free: number;

    /**
     * Percentage of used RAM
     * @format float
     * @example 50
     */
    percent: number;
}

/**
 * Represents the detailed information about a VPS.
 */
export interface VpsDetails {
    /**
     * Unique identifier for the VPS
     * @example 12345
     */
    vpsId: number;

    /**
     * Proxmox ID of the VPS
     * @example 67890
     */
    proxmoxId: number;

    /**
     * Hostname of the VPS
     * @example "vps.example.com"
     */
    hostname: string;

    /**
     * Current status of the VPS (true for active, false for inactive)
     * @example true
     */
    status: boolean;

    /**
     * VNC connection details for the VPS.
     */
    vnc: VpsVncDetails;

    /**
     * Operating system details of the VPS.
     */
    os: VpsOsDetails;

    /**
     * Total disk space in bytes
     * @example 10737418240
     */
    disk: number;

    /**
     * IP addresses assigned to the VPS
     * @items {string} IP address assigned to the VPS
     * @example ["192.168.1.100", "203.0.113.45"]
     */
    ips: string[];

    /**
     * CPU details and usage for the VPS.
     */
    cpu: VpsCpuDetails;

    /**
     * RAM usage details for the VPS.
     */
    ram: VpsRamUsage;
}

/**
 * Represents an operating system template available for a VPS.
 */
export interface VpsOsTemplate {
    /**
     * OS version ID.
     * @example 1
     */
    id: number;

    /**
     * OS version name.
     * @example "Debian 9.5"
     */
    name: string;
}

/**
 * Represents the data required to reinstall a VPS with a new OS.
 */
export interface VpsReinstallData {
    /**
     * New root password for the VPS
     * @example "StrongPassword123!"
     */
    password: string;

    /**
     * ID of the new OS to install
     * @example 1
     */
    osId: number;
}

/**
 * Represents a task related to a VPS, such as rebooting or restoring a backup.
 */
export interface VpsTask {
    /**
     * Action of the task.
     * @example "qmshutdown"
     */
    action: string;

    /**
     * Status of the task.
     * @example "OK"
     */
    status: string;

    /**
     * Unix timestamp when the task started.
     * @example 1625251200000
     */
    startedAt: number;

    /**
     * Unix timestamp when the task ended or null if not ended.
     * @nullable true
     * @example 1625254800000
     */
    endedAt: number | null;
}

/**
 * Represents the data required to update a VPS backup.
 */
export interface VpsUpdateBackupData {
    /**
     * Whether the backup is locked.
     * @example true
     */
    locked?: boolean;

    /**
     * Notes about the backup.
     * @example "Backup created before major update"
     */
    notes?: string;
}

/**
 * Represents the data required to change the daily backup status of a VPS.
 */
export interface VpsDailyBackupStatusData {
    /**
     * Whether daily backups are enabled.
     * @example true
     */
    enabled: boolean;
}
