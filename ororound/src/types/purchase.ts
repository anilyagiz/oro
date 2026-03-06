export type TransactionStatus = 'pending' | 'processing' | 'confirmed' | 'failed';

export interface PurchaseParams {
  projectId: string;
  amount: string;
  paymentToken: string;
}

export interface PurchaseReceipt {
  txHash: string;
  status: Exclude<TransactionStatus, 'processing'>;
  timestamp: number;
}

export interface Transaction {
  id: string;
  txHash: string;
  status: TransactionStatus;
  projectId: string;
  amount: string;
  paymentToken: string;
  timestamp: number;
  errorMessage?: string;
}

export interface TransactionStatusResponse {
  id: string;
  status: TransactionStatus;
  txHash?: string;
  timestamp: number;
  errorMessage?: string;
}

export interface GoldQuote {
  estimatedGold: string;
  exchangeRate: string;
  fees: {
    protocolFee: string;
    networkFee: string;
    totalFee: string;
  };
  paymentAmount: string;
  paymentToken: string;
  expiresAt: number;
}

export interface QuoteParams {
  amount: string;
  paymentToken: string;
  projectId?: string;
}

export interface PurchaseTransaction {
  id: string;
  serializedTx: string;
  status: 'pending' | 'signed' | 'submitted' | 'confirmed' | 'failed';
  quote: GoldQuote;
  createdAt: number;
}

export interface SignedTransaction {
  signature: string;
  serializedTx: string;
}

export type PurchaseStep =
  | 'idle'
  | 'getting-quote'
  | 'creating-purchase'
  | 'signing'
  | 'submitting'
  | 'completed'
  | 'error';

export interface PurchaseProgress {
  step: PurchaseStep;
  message: string;
  txHash?: string;
  error?: string;
}
