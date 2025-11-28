import type { $Fetch } from 'ofetch';
import type { ApiResponse } from '..';

export class UserApiService {
    public constructor(private apiFetch: $Fetch) {}

    /**
     * Get the current user services
     */
    public getServices() {
        return this.apiFetch<ApiResponse<Service[]>>('/services');
    }

    /**
     * Get the current user ticket by ID
     * @param ticketId Ticket ID
     */
    public getTicketById(ticketId: string) {
        return this.apiFetch<ApiResponse<Ticket>>(`/tickets/${ticketId}`);
    }

    /**
     * Get the current user tickets
     */
    public getTickets() {
        return this.apiFetch<ApiResponse<Omit<Ticket, 'messages'>[]>>('/tickets');
    }

    /**
     * Get the current user information
     */
    public getCurrentUser() {
        return this.apiFetch<ApiResponse<User>>('/users/@me');
    }

    /**
     * Get the current user invoice by ID
     * @param invoiceId Invoice ID
     */
    public getInvoiceById(invoiceId: string) {
        return this.apiFetch<ApiResponse<Invoice>>(`/users/@me/invoices/${invoiceId}`);
    }

    /**
     * Get the current user invoices
     */
    public getInvoices() {
        return this.apiFetch<ApiResponse<Omit<Invoice, 'items'>[]>>('/users/@me/invoices');
    }

    /**
     * Get the current user sessions
     */
    public getSessions() {
        return this.apiFetch<ApiResponse<Session[]>>('/users/@me/sessions');
    }

    /**
     * Get the current user referral code
     */
    public getReferralCode() {
        return this.apiFetch<ApiResponse<UserReferralCode>>('/users/@me/referral');
    }
}

/**
 * Represents the billing cycle for a service or addon.
 */
export type BillingCycle =
    | 'Monthly'
    | 'Quarterly'
    | 'Semi-Annually'
    | 'Annually'
    | 'Biennially'
    | 'Triennially';

/**
 * Represents the current status of a service or addon.
 */
export type ServiceStatus =
    | 'Pending'
    | 'Active'
    | 'Suspended'
    | 'Terminated'
    | 'Completed'
    | 'Cancelled'
    | 'Fraud';

/**
 * Represents an addon associated with a service.
 */
export interface ServiceAddon {
    /**
     * Name of the addon
     * @example "2x IPv4 Addresses"
     */
    name: string;

    /**
     * Recurring amount for the addon
     * @example 10
     */
    recurringAmount: number;

    /**
     * Billing cycle for the addon
     * @example "Monthly"
     */
    billingCycle: BillingCycle;

    /**
     * Current status of the addon
     * @example "Active"
     */
    status: ServiceStatus;

    /**
     * Unix timestamp of the registration date for the addon
     * @format date-time
     * @example 1704067200000
     */
    registerDate: number;

    /**
     * Unix timestamp of the next due date for the addon
     * @format date-time
     * @example 1704067200000
     */
    nextDueDate: number;
}

/**
 * Represents a service provided to a client.
 */
export interface Service {
    /**
     * Unique identifier for the service
     * @example 1
     */
    id: number;

    /**
     * Product ID associated with the service
     * @example 123
     */
    productId: number;

    /**
     * Group ID of the service, if applicable
     * @nullable true
     * @example 456
     */
    groupId: number | null;

    /**
     * Name of the service
     * @example "Dedicated Server - i7-7700"
     */
    name: string;

    /**
     * Raw name of the service without any modifications
     * @example "Fiziksel Sunucu - i7-7700"
     */
    rawName: string;

    /**
     * Name of the service without the group name prefix
     * @example "i7-7700"
     */
    nameWithoutGroupName: string;

    /**
     * Domain associated with the service
     * @example "abcdefgh.nodesty.com"
     */
    domain: string;

    /**
     * Amount charged for the first payment
     * @example 100
     */
    firstPaymentAmount: number;

    /**
     * Recurring amount charged for the service
     * @example 50
     */
    recurringAmount: number;

    /**
     * Billing cycle for the service
     * @example "Monthly"
     */
    billingCycle: BillingCycle;

    /**
     * Unix timestamp of the next due date for payment
     * @format date-time
     * @example 1704067200000
     */
    nextDueDate: number;

    /**
     * Current status of the service
     * @example "Active"
     */
    status: ServiceStatus;

    /**
     * Username associated with the service
     * @nullable true
     * @example "user123"
     */
    username: string | null;

    /**
     * Password associated with the service
     * @nullable true
     * @example "securepassword123"
     */
    password: string | null;

    /**
     * VPS ID if applicable, otherwise null
     * @nullable true
     * @example 12345
     */
    vpsId: number | null;

    /**
     * Dedicated server ID if applicable, otherwise null
     * @nullable true
     * @example "s100"
     */
    dedicatedId: string | null;

    /**
     * Indicates if the service is a VPS
     * @example true
     */
    isVPS: boolean;

    /**
     * Indicates if the service is web hosting
     * @example false
     */
    isWebHosting: boolean;

    /**
     * Indicates if the service is a dedicated server
     * @example true
     */
    isDedicated: boolean;

    /**
     * Indicates if the service is mail hosting
     * @example false
     */
    isMailHosting: boolean;

    /**
     * Location code of the dedicated server if applicable, otherwise null
     * @nullable true
     * @example "FRA-01"
     */
    dedicatedServerLocation: 'FRA-01' | 'FRA-02' | 'FRA-03' | null;

    /**
     * List of addons associated with the service
     */
    addons: ServiceAddon[];

    /**
     * List of features associated with the service
     * @example ["Unlimited Bandwidth", "24/7 Support", "Free SSL Certificate"]
     */
    features: string[];

    /**
     * List of IP addresses associated with the service
     * @example ["192.168.1.1", "192.168.1.2"]
     */
    ips: string[];

    /**
     * Team ID if the service is associated with a team, otherwise null
     * @nullable true
     * @example 789
     */
    teamId: number | null;

    /**
     * Indicates if the current user is the owner of the service
     * @example true
     */
    owner: boolean;
}

/**
 * Represents user statistics.
 */
export interface UserStats {
    /**
     * Number of active services for the user
     * @example 5
     */
    activeServices: number;

    /**
     * Number of unpaid invoices for the user
     * @example 2
     */
    unpaidInvoices: number;

    /**
     * User's account balance
     * @format float
     * @example 150.75
     */
    balance: number;

    /**
     * Number of active support tickets for the user
     * @example 1
     */
    activeTickets: number;
}

/**
 * Represents a user's profile information.
 */
export interface User {
    /**
     * Unique identifier for the user
     * @example "12345"
     */
    id: string;

    /**
     * User's first name
     * @example "John"
     */
    firstName: string;

    /**
     * User's last name
     * @example "Doe"
     */
    lastName: string;

    /**
     * User's full name
     * @example "John Doe"
     */
    fullName: string;

    /**
     * User's email address
     * @example "john.doe@example.com"
     */
    email: string;

    /**
     * User's country
     * @example "US"
     */
    country: string;

    /**
     * User's city
     * @example "New York"
     */
    city: string;

    /**
     * User's state
     * @example "NY"
     */
    state: string;

    /**
     * User's address
     * @example "123 Main St"
     */
    address: string;

    /**
     * User's postal code
     * @example "10001"
     */
    postCode: string;

    /**
     * User's currency
     * @example "USD"
     */
    currency: string;

    /**
     * Symbol for the user's currency
     * @example "$"
     */
    currencySymbol: string;

    /**
     * User's phone number in international format
     * @example "+1 1234567890"
     */
    phoneNumber: string;

    /**
     * User's TCKN (Turkish Identification Number)
     * @example "12345678901"
     */
    tckn: string;

    /**
     * User's birth year
     * @example "1990"
     */
    birthYear: string;

    /**
     * Whether the user is banned
     * @example false
     */
    banned: boolean;

    /**
     * ID of the user's current session
     * @example "abcdef123456"
     */
    currentSessionId: string;

    /**
     * Whether TOTP (Authentication App) is enabled for the user
     * @example true
     */
    totpEnabled: boolean;

    /**
     * User statistics
     */
    stats: UserStats;

    /**
     * User's company name, if applicable
     * @nullable true
     * @example "Example Corp"
     */
    companyName: string | null;
}

/**
 * Represents the current status of a ticket.
 * @example "OPEN"
 */
export type TicketStatus = 'OPEN' | 'CLOSED';

/**
 * Represents the priority level of a ticket.
 * @example "HIGH"
 */
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';

/**
 * Represents the role of a message author (e.g., "USER", "ADMIN").
 * @example "USER"
 */
export type TicketMessageAuthorRole = 'USER' | 'ADMIN';

/**
 * Represents the author of a ticket message.
 */
export interface TicketMessageAuthor {
    /**
     * ID of the author
     * @example "12345"
     */
    id: string;

    /**
     * URL of the author's avatar
     * @format uri
     * @nullable true
     * @example "https://example.com/avatar.jpg"
     */
    avatar: string | null;

    /**
     * Name of the author
     * @example "John Doe"
     */
    name: string;

    /**
     * Role of the author
     * @example "USER"
     */
    role: TicketMessageAuthorRole;
}

/**
 * Represents a single message within a ticket.
 */
export interface TicketMessage {
    /**
     * Unique identifier for the message
     * @example "1"
     */
    id: string;

    /**
     * Message ID for tracking purposes
     * @example "346534763346"
     */
    messageId: string;

    /**
     * Content of the message
     * @example "This is a message content."
     */
    content: string;

    /**
     * List of attachments associated with the message
     * @items {string} URL of the attachment
     * @example ["https://example.com/attachment.jpg"]
     */
    attachments: string[];

    /**
     * ID of the user who authored the message
     * @example "12345"
     */
    authorId: string;

    /**
     * Timestamp when the message was created
     * @format date-time
     * @example "2023-10-01T12:00:00Z"
     */
    createdAt: string;

    /**
     * Details of the author of the message
     */
    author: TicketMessageAuthor;
}

/**
 * Represents a support ticket, including its messages.
 */
export interface Ticket {
    /**
     * Unique identifier for the ticket
     * @example "1"
     */
    id: string;

    /**
     * Subject of the ticket
     * @example "Issue with my VPS"
     */
    subject: string;

    /**
     * Current status of the ticket
     * @example "OPEN"
     */
    status: TicketStatus;

    /**
     * Priority level of the ticket
     * @example "HIGH"
     */
    priority: TicketPriority;

    /**
     * Timestamp of the last reply to the ticket
     * @format date-time
     * @example "2023-10-01T12:00:00Z"
     */
    lastReply: string;

    /**
     * Indicates if the ticket is marked as important
     * @default false
     * @example true
     */
    marked: boolean;

    /**
     * List of messages associated with the ticket
     */
    messages: TicketMessage[];
}

/**
 * Represents the status of an invoice.
 */
export type InvoiceStatus =
    | 'Draft'
    | 'Paid'
    | 'Unpaid'
    | 'Overdue'
    | 'Cancelled'
    | 'Refunded'
    | 'Payment Pending';

/**
 * Represents an item within an invoice.
 */
export interface InvoiceItem {
    /**
     * Unique identifier for the invoice item
     * @example 1
     */
    id: number;

    /**
     * Type of the invoice item
     * @example "Hosting"
     */
    type: string;

    /**
     * Description of the invoice item
     * @example "Web Hosting Service"
     */
    description: string;

    /**
     * Amount for the invoice item
     * @example 10
     */
    amount: number;
}

/**
 * Represents an invoice.
 */
export interface Invoice {
    /**
     * Unique identifier for the invoice
     * @example 1
     */
    id: number;

    /**
     * Unix timestamp of the invoice due date
     * @format date-time
     * @example 1700000000000
     */
    dueDate: number;

    /**
     * Unix timestamp of the invoice payment date, null if not paid
     * @format date-time
     * @nullable true
     * @example 1700000000000
     */
    datePaid: number | null;

    /**
     * Subtotal amount of the invoice
     * @example 100
     */
    subTotal: number;

    /**
     * Total amount of the invoice
     * @example 120
     */
    total: number;

    /**
     * Status of the invoice
     * @example "Unpaid"
     */
    status: InvoiceStatus;

    /**
     * Balance applied to the invoice
     * @example 20
     */
    appliedBalance: number;

    /**
     * List of items in the invoice
     */
    items: InvoiceItem[];
}

/**
 * Represents the operating system type of a session.
 */
export type SessionOs = 'Desktop' | 'Mobile';

/**
 * Represents an active user session.
 */
export interface Session {
    /**
     * Unique identifier for the session
     */
    id: string;

    /**
     * IP address of the session
     * @example "192.168.1.1"
     */
    ip: string;

    /**
     * Geographical location of the session
     * @example "New York, USA"
     */
    location: string;

    /**
     * Operating system of the session
     * @example "Desktop"
     */
    os: SessionOs;

    /**
     * Platform of the session, such as web browser
     * @example "Chrome"
     */
    platform: string;

    /**
     * Timestamp of the last time the session was active
     * @format date-time
     * @example "2023-10-01T12:00:00Z"
     */
    lastSeen: string;
}

/**
 * Represents the referral code information for a user.
 */
export interface UserReferralCode {
    /**
     * Referral code of the user.
     * @example "cmdvq1hjm000008kvmkkk4gb6"
     */
    code: string;

    /**
     * Usage details of the referral code.
     */
    uses: {
        /**
         * Number of times the referral code has been used.
         * @example 5
         */
        count: number;

        /**
         * List of referral usages.
         */
        data: {
            /**
             * Timestamp of when the referral was used.
             * @example 1700000000000
             */
            date: number;

            /**
             * Amount earned from the referral use.
             * @example 10
             */
            amount: number;
        }[];
    };
}
