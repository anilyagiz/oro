import {
  Connection,
  VersionedTransaction,
  TransactionSignature,
  Commitment,
} from '@solana/web3.js';

export interface TransactionResult {
  signature: TransactionSignature;
  status: 'confirmed' | 'failed';
  error?: string;
}

export interface SigningInstructions {
  walletType: string;
  signers?: string[];
  expiresAt: string;
}

export interface SerializedTransaction {
  txId: string;
  serializedTx: string;
  signingInstructions: SigningInstructions;
}

/**
 * Deserialize a base64-encoded transaction
 */
export function deserializeTransaction(serializedTx: string): VersionedTransaction {
  const txBytes = Buffer.from(serializedTx, 'base64');
  return VersionedTransaction.deserialize(txBytes);
}

/**
 * Sign a transaction with the user's wallet
 */
export async function signTransaction(
  transaction: VersionedTransaction,
  signTransaction: (tx: VersionedTransaction) => Promise<VersionedTransaction>
): Promise<VersionedTransaction> {
  return signTransaction(transaction);
}

/**
 * Submit a signed transaction to the Solana network
 */
export async function submitTransaction(
  connection: Connection,
  signedTransaction: VersionedTransaction,
  commitment: Commitment = 'confirmed'
): Promise<TransactionResult> {
  try {
    const signature = await connection.sendTransaction(signedTransaction, {
      skipPreflight: false,
      preflightCommitment: commitment,
    });

    const confirmation = await connection.confirmTransaction(
      {
        signature,
        blockhash: signedTransaction.message.recentBlockhash,
        lastValidBlockHeight: await connection.getBlockHeight(),
      },
      commitment
    );

    if (confirmation.value.err) {
      return {
        signature,
        status: 'failed',
        error: `Transaction failed: ${JSON.stringify(confirmation.value.err)}`,
      };
    }

    return {
      signature,
      status: 'confirmed',
    };
  } catch (error: any) {
    return {
      signature: '',
      status: 'failed',
      error: error.message || 'Transaction submission failed',
    };
  }
}

/**
 * Complete transaction flow: deserialize, sign, submit, and report to Oro API
 */
export async function completeTransactionFlow(
  serializedTx: string,
  signTransaction: (tx: VersionedTransaction) => Promise<VersionedTransaction>,
  connection: Connection,
  txId: string,
  submitToOroApi: (txId: string, signedSerializedTx: string) => Promise<any>
): Promise<TransactionResult> {
  try {
    // Step 1: Deserialize the transaction
    const transaction = deserializeTransaction(serializedTx);

    // Step 2: Sign with user's wallet
    const signedTransaction = await signTransaction(transaction);

    // Step 3: Submit to Solana network
    const result = await submitTransaction(connection, signedTransaction);

    if (result.status === 'failed') {
      return result;
    }

    // Step 4: Report back to Oro API
    const signedSerializedTx = Buffer.from(signedTransaction.serialize()).toString('base64');
    await submitToOroApi(txId, signedSerializedTx);

    return result;
  } catch (error: any) {
    return {
      signature: '',
      status: 'failed',
      error: error.message || 'Transaction flow failed',
    };
  }
}
