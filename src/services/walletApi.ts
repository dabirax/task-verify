import { apiClient } from './apiClient';
import type { Wallet, WalletTransaction } from '../types';

export const walletApi = {
  getWallet: () =>
    apiClient<Wallet>('/api/v1/wallet'),

  getTransactions: () =>
    apiClient<WalletTransaction[]>('/api/v1/wallet/transactions'),

  generateVirtualAccount: () =>
    apiClient<{ success: boolean; virtualAccount: string }>('/api/v1/wallet/virtual-account', {
      method: 'POST',
    }),

  requestWithdrawal: (data: {
    amount: number;
    bankCode: string;
    bankAccountNumber: string;
    bankName: string;
  }) =>
    apiClient<{ success: boolean; message: string; wallet: Wallet }>('/api/v1/wallet/withdraw', {
      method: 'POST',
      body: data,
    }),
};
