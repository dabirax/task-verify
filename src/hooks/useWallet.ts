import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletApi } from '../services/walletApi';

export function useWallet() {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: walletApi.getWallet,
  });
}

export function useWalletTransactions() {
  return useQuery({
    queryKey: ['wallet', 'transactions'],
    queryFn: walletApi.getTransactions,
  });
}

export function useGenerateVirtualAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: walletApi.generateVirtualAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wallet'] }),
  });
}

export function useRequestWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: walletApi.requestWithdrawal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['wallet', 'transactions'] });
    },
  });
}
