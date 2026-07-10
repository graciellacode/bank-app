export interface User {
    id: number;
    fullName: string;
    email: string;
    role: string;
}

export interface Account {
    accountNumber: string;
    balance: string;
    createdAt: string;
}

export interface LoginResponse {
    message: string;
    accessToken: string;
    refreshToken: string; // tambahan baru
    user: User;
}

export interface RegisterResponse {
    message: string;
    user: User & { accountNumber: string };
}

export interface Transaction {
    id: number;
    type: 'debit' | 'credit';
    amount: string;
    balanceAfter: string;
    description: string;
    createdAt: string;
}

export interface TransactionHistoryResponse {
    data: Transaction[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface TransferResponse {
    message: string;
    transferId: number;
    newBalance: number;
}

export interface InquiryResponse {
    accountNumber: string;
    accountHolderName: string;
}

export interface TopUpResponse {
    message: string;
    newBalance: number;
}

export interface AdminAccountInfo {
    id: number;
    accountNumber: string;
    balance: string;
    isFrozen: boolean;
}

export interface AdminUser {
    id: number;
    fullName: string;
    email: string;
    role: string;
    createdAt: string;
    account: AdminAccountInfo;
}

export interface AdminUsersResponse {
    data: AdminUser[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface AdminTransaction {
    id: number;
    type: 'debit' | 'credit';
    amount: string;
    balanceAfter: string;
    description: string;
    createdAt: string;
    account: {
        accountNumber: string;
        user: { fullName: string };
    };
}

export interface AdminTransactionsResponse {
    data: AdminTransaction[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface UserProfile {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string | null;
    role: string;
    createdAt: string;
    account: {
        accountNumber: string;
        balance: string;
    };
}

export interface NotificationPreferences {
    id: number;
    pushEnabled: boolean;
    incomingTransferPush: boolean;
    paymentReminderPush: boolean;
    monthlyStatementEmail: boolean;
    highValueSms: boolean;
}