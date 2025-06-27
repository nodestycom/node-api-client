import type { $Fetch } from 'ofetch';
import type { ApiResponse } from '..';

export class DedicatedServerApiService {
    public constructor(private apiFetch: $Fetch) {}

    /**
     * Perform an action on a dedicated server
     * @param id Service ID
     * @param action Action to perform
     */
    public performAction(id: string, action: DedicatedServerAction) {
        return this.apiFetch<ApiResponse<void>>(`/services/${id}/dedicated/action`, {
            method: 'POST',
            body: { action },
        });
    }

    /**
     * Get hardware components of a dedicated server
     * @param id Service ID
     */
    public getHardwareComponents(id: string) {
        return this.apiFetch<ApiResponse<DedicatedServerHardwareComponent>>(
            `/services/${id}/dedicated/hardware`,
        );
    }

    /**
     * Get dedicated server details
     * @param id Service ID
     */
    public getDetails(id: string) {
        return this.apiFetch<ApiResponse<DedicatedServerDetails>>(`/services/${id}/dedicated/info`);
    }

    /**
     * Get available OS templates for a dedicated server
     * @param id Service ID
     */
    public getOsTemplates(id: string) {
        return this.apiFetch<ApiResponse<DedicatedServerOsTemplate[]>>(
            `/services/${id}/dedicated/os-templates`,
        );
    }

    public getReinstallStatus(id: string) {
        return this.apiFetch<ApiResponse<DedicatedServerReinstallStatus>>(
            `/services/${id}/dedicated/reinstall-status`,
        );
    }

    /**
     * Reinstall a dedicated server with a new OS
     * @param id Service ID
     */
    public reinstall(id: string, data: DedicatedServerReinstallData) {
        return this.apiFetch<ApiResponse<void>>(`/services/${id}/dedicated/reinstall`, {
            method: 'POST',
            body: data,
        });
    }

    /**
     * Get dedicated server tasks
     * @param id Service ID
     */
    public getTasks(id: string) {
        return this.apiFetch<ApiResponse<DedicatedServerTask[]>>(`/services/${id}/dedicated/tasks`);
    }
}

/**
 * Represents the action to be performed on a dedicated server.
 */
export enum DedicatedServerAction {
    Start = 'setPowerOn',
    Stop = 'setPowerOff',
    Restart = 'setPowerReset',
}

/**
 * Represents CPU details and usage for a dedicated server.
 */
export interface DedicatedServerCpuDetails {
    /**
     * Model of the CPU.
     * @example "AMD Ryzen 9 5950X"
     */
    model: string;

    /**
     * Base speed of the CPU in MHz.
     * @example 3500
     */
    speed: number;

    /**
     * Turbo speed of the CPU in MHz.
     * @example 4900
     */
    turboSpeed: number;

    /**
     * Number of CPU cores.
     * @example 16
     */
    cores: number;

    /**
     * Number of CPU threads.
     * @example 32
     */
    threads: number;
}

/**
 * Represents the detailed information about a dedicated server.
 */
export interface DedicatedServerDetails {
    /**
     * Unique identifier for the dedicated server.
     * @example "1"
     */
    dedicatedId: string;

    /**
     * Current status of the dedicated server.
     * @example true
     */
    status: boolean;

    /**
     * List of available actions for the dedicated server.
     */
    availableActions: DedicatedServerAction[];

    /**
     * Model of the mainboard.
     * @example "ASUS ROG Strix X570-E Gaming"
     */
    mainboard: string;

    /**
     * Amount of RAM in GB.
     * @example 128
     */
    ram: number;

    /**
     * Total disk space in GB.
     * @example 1000
     */
    disk: number;

    /**
     * CPU details for the dedicated server.
     */
    cpu: DedicatedServerCpuDetails;
}

/**
 * Represents an operating system template available for a dedicated server.
 */
export interface DedicatedServerOsTemplate {
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
 * Represents the data required to reinstall a dedicated server with a new OS.
 */
export interface DedicatedServerReinstallData {
    /**
     * New root password for the dedicated server
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
 * Represents a task related to a dedicated server, such as rebooting or restoring a backup.
 */
export interface DedicatedServerTask {
    /**
     * Description of the task action.
     * @example "Server reboot initiated"
     */
    action: string;

    /**
     * Unix timestamp when the task started.
     * @example 1625251200000
     */
    startedAt: number;

    /**
     * Unix timestamp when the task was last updated.
     * @example 1625254800000
     */
    updatedAt: number;
}

/**
 * Represents a hardware component of a dedicated server, including its model and specifications.
 */
export interface DedicatedServerHardwareComponent {
    /**
     * Hardware component name.
     * @example "CPU Model"
     */
    component: string;

    /**
     * Model of the hardware component.
     * @example "AMD Ryzen 9 9950X"
     */
    model: string;

    /**
     * Value of the hardware component.
     * @example 5000
     */
    value: number;

    /**
     * Unit of the value.
     * @example " MHz"
     */
    valueSuffix: string;
}

/**
 * Enum representing the steps of the reinstall process for a dedicated server.
 */
export enum DedicatedServerReinstallStep {
    RebootingServer = 0,
    PreparingBootEnvironment = 1,
    InstallingOperatingSystem = 2,
    InstallationCompleted = 3,
}

/**
 * Represents the status of the reinstall process for a dedicated server.
 */
export interface DedicatedServerReinstallStatus {
    /**
     * Whether the reinstall process is completed.
     * @example true
     */
    completed: boolean;

    /**
     * Current step of the reinstall process.
     * @example 1
     * @enum {0, 1, 2, 3}
     */
    step: DedicatedServerReinstallStep;
}
