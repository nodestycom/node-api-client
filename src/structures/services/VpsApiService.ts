import type { $Fetch } from 'ofetch';
import type { ApiResponse } from '..';

export class VpsApiService {
    public constructor(private apiFetch: $Fetch) {}

    /**
     * Perform an action on a VPS
     * @param id Service ID
     * @param action Action to perform (start, stop, restart, poweroff)
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
     * @param date Date of the backup
     * @param file Name of the backup file
     */
    public restoreBackup(id: string, data: Omit<VpsBackup, 'createdAt'>) {
        return this.apiFetch<ApiResponse<void>>(
            `/services/${id}/vps/backups/${data.date}/${data.file}`,
            {
                method: 'POST',
            },
        );
    }

    /**
     * Get VPS backups
     * @param id Service ID
     */
    public getBackups(id: string) {
        return this.apiFetch<ApiResponse<VpsBackup[]>>(`/services/${id}/vps/backups`);
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
        return this.apiFetch<ApiResponse<VpsUsageStatistics>>(`/services/${id}/vps/graphs`);
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

    public getTasks(id: string) {
        return this.apiFetch<ApiResponse<VpsTask[]>>(`/services/${id}/vps/tasks`);
    }
}

/**
 * Represents the action to be performed on a VPS.
 */
export type VpsAction = 'start' | 'stop' | 'restart' | 'poweroff';

/**
 * Represents a backup of a VPS.
 */
export interface VpsBackup {
    /**
     * Date of the backup
     * @example "2025-05-27"
     */
    date: string;

    /**
     * Name of the backup file
     * @example "vzdump-qemu-500-2025_05_27-04_13_58.vma"
     */
    file: string;

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
 * Represents a dictionary where keys are timestamps (or similar identifiers)
 * and values are numerical usage data (e.g., CPU, RAM, Disk, Inode usage).
 * @template T - The type of the value for each timestamp.
 */
export interface VpsTimedUsageData<T = number> {
    /**
     * Keys are typically timestamps (e.g., Unix milliseconds) and values are the corresponding usage.
     * @example { "1625251200000": 4.25, "1625251201000": 4.30 }
     */
    [timestamp: string]: T;
}

/**
 * Represents I/O speed data, including read, write, and corresponding timestamps.
 */
export interface VpsIoSpeedData {
    /**
     * Array of I/O read speeds at specific timestamps.
     * @items {number} I/O read speed at a specific timestamp
     * @example [1024, 1050, 1030]
     */
    read: number[];

    /**
     * Array of I/O write speeds at specific timestamps.
     * @items {number} I/O write speed at a specific timestamp
     * @example [2048, 2100, 2070]
     */
    write: number[];

    /**
     * Timestamps (categories) for I/O speed data. These usually correspond to the indices in `read` and `write` arrays.
     * @items {number} Timestamps for I/O speed data (Unix milliseconds)
     * @example [1625251200000, 1625251201000, 1625251202000]
     */
    categories: number[];
}

/**
 * Represents network speed data, including download, upload, and corresponding timestamps.
 */
export interface VpsNetworkSpeedData {
    /**
     * Array of network download speeds at specific timestamps.
     * @items {number} Network download speed at a specific timestamp
     * @example [512, 530, 500]
     */
    download: number[];

    /**
     * Array of network upload speeds at specific timestamps.
     * @items {number} Network upload speed at a specific timestamp
     * @example [256, 260, 250]
     */
    upload: number[];

    /**
     * Timestamps (categories) for network speed data. These usually correspond to the indices in `download` and `upload` arrays.
     * @items {number} Timestamps for network speed data (Unix milliseconds)
     * @example [1625251200000, 1625251201000, 1625251202000]
     */
    categories: number[];
}

/**
 * Represents various usage statistics for a VPS.
 */
export interface VpsUsageStatistics {
    /**
     * Average download speed in bytes per second
     * @example 123456
     */
    avgDownload: number;

    /**
     * Average upload speed in bytes per second
     * @example 654321
     */
    avgUpload: number;

    /**
     * Average I/O read speed in bytes per second
     * @example 789012
     */
    avgIoRead: number;

    /**
     * Average I/O write speed in bytes per second
     * @example 345678
     */
    avgIoWrite: number;

    /**
     * CPU usage data. Keys are timestamps, values are CPU usage percentages.
     */
    cpuUsage: VpsTimedUsageData;

    /**
     * Inode usage data. Keys are timestamps, values are inode counts.
     */
    inodeUsage: VpsTimedUsageData;

    /**
     * RAM usage data. Keys are timestamps, values are RAM usage in bytes.
     */
    ramUsage: VpsTimedUsageData;

    /**
     * Disk usage data. Keys are timestamps, values are disk usage in bytes.
     */
    diskUsage: VpsTimedUsageData;

    /**
     * I/O speed data, including read, write, and corresponding timestamps.
     */
    ioSpeed: VpsIoSpeedData;

    /**
     * Network speed data, including download, upload, and corresponding timestamps.
     */
    networkSpeed: VpsNetworkSpeedData;
}

/**
 * Represents VNC connection details for a VPS.
 */
export interface VpsVncDetails {
    /**
     * Whether VNC is enabled for the VPS
     * @example true
     */
    enabled: boolean;

    /**
     * IP address for VNC access
     * @nullable true
     * @example "192.168.1.100"
     */
    ip: string | null;

    /**
     * Port for VNC access
     * @nullable true
     * @example "5900"
     */
    port: string | null;

    /**
     * VNC password
     * @nullable true
     * @example "securepassword123"
     */
    password: string | null;
}

/**
 * Represents operating system details of a VPS.
 */
export interface VpsOsDetails {
    /**
     * Name of the operating system
     * @example "Ubuntu 20.04"
     */
    name: string;

    /**
     * Distribution of the operating system
     * @example "ubuntu"
     */
    distro: string;
}

/**
 * Represents disk usage details for a VPS.
 */
export interface VpsDiskUsage {
    /**
     * Disk space limit in bytes
     * @example 10737418240
     */
    limit: number;

    /**
     * Used disk space in bytes
     * @example 5368709120
     */
    used: number;

    /**
     * Free disk space in bytes
     * @example 5368709120
     */
    free: number;

    /**
     * Percentage of used disk space
     * @format float
     * @example 50
     */
    percent: number;
}

/**
 * Represents CPU details and usage for a VPS.
 */
export interface VpsCpuDetails {
    /**
     * CPU manufacturer
     * @example "Intel"
     */
    manu: string;

    /**
     * CPU limit in MHz
     * @example 2000
     */
    limit: number;

    /**
     * Used CPU in MHz
     * @example 1500
     */
    used: number;

    /**
     * Free CPU in MHz
     * @example 500
     */
    free: number;

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
 * Represents Inode usage details for a VPS.
 */
export interface VpsInodeUsage {
    /**
     * Inode limit
     * @example 100000
     */
    limit: number;

    /**
     * Used inodes
     * @example 50000
     */
    used: number;

    /**
     * Free inodes
     * @example 50000
     */
    free: number;

    /**
     * Percentage of used inodes
     * @format float
     * @example 50
     */
    percent: number;
}

/**
 * Represents network speed details for a VPS.
 */
export interface VpsNetworkSpeed {
    /**
     * Network speed in Mbps for incoming traffic
     * @example 100
     */
    in: number;

    /**
     * Network speed in Mbps for outgoing traffic
     * @example 100
     */
    out: number;
}

/**
 * Represents total bandwidth usage for a VPS.
 */
export interface VpsTotalBandwidth {
    /**
     * Total bandwidth usage in bytes
     * @example 10737418240
     */
    usage: number;

    /**
     * Total incoming bandwidth in bytes
     * @example 5368709120
     */
    in: number;

    /**
     * Total outgoing bandwidth in bytes
     * @example 5368709120
     */
    out: number;
}

/**
 * Represents daily bandwidth usage for a VPS, including total, incoming, and outgoing traffic over time.
 */
export interface VpsBandwidthDetails {
    /**
     * Total bandwidth usage statistics.
     */
    total: VpsTotalBandwidth;

    /**
     * Daily total bandwidth usage in bytes.
     * @items {number} Daily bandwidth usage in bytes
     * @example [104857600, 105000000, 103000000]
     */
    usage: number[];

    /**
     * Daily incoming bandwidth in bytes.
     * @items {number} Daily incoming bandwidth in bytes
     * @example [52428800, 52500000, 51000000]
     */
    in: number[];

    /**
     * Daily outgoing bandwidth in bytes.
     * @items {number} Daily outgoing bandwidth in bytes
     * @example [52428800, 52500000, 52000000]
     */
    out: number[];

    /**
     * Array of timestamps (dates) representing the days for which bandwidth data is available.
     * @items {string} Date string for bandwidth data
     * @format date-time
     */
    categories: string[];
}

/**
 * Represents the detailed information about a Virtual Private Server (VPS).
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
     * Number of allowed OS reinstalls
     * @example 3
     */
    osReinstallLimit: number;

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
     * Disk usage details for the VPS.
     */
    disk: VpsDiskUsage;

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

    /**
     * Inode usage details for the VPS.
     */
    inode: VpsInodeUsage;

    /**
     * Network speed details for the VPS.
     */
    netspeed: VpsNetworkSpeed;

    /**
     * Bandwidth usage details for the VPS.
     */
    bandwidth: VpsBandwidthDetails;
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
     * Description of the task action.
     * @example "VM reboot initiated"
     */
    action: string;

    /**
     * Progress of the task (0-100% or Task Completed).
     * @example "50%"
     */
    progress: string;

    /**
     * Unix timestamp when the task started.
     * @example 1625251200000
     */
    startedAt: number;

    /**
     * Unix timestamp when the task ended or null if not ended.
     * @example 1625254800000
     * @nullable true
     */
    endedAt: number | null;
}
