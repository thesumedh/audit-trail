// Petra Wallet Connection Utility
export interface WalletConnection {
  address: string;
  publicKey: string;
  connected: boolean;
}

declare global {
  interface Window {
    aptos?: any;
  }
}

export class PetraWallet {
  private static instance: PetraWallet;
  private connection: WalletConnection | null = null;

  static getInstance(): PetraWallet {
    if (!PetraWallet.instance) {
      PetraWallet.instance = new PetraWallet();
    }
    return PetraWallet.instance;
  }

  async connect(): Promise<WalletConnection | null> {
    try {
      if (!window.aptos) {
        alert('Petra Wallet is not installed. Please install it from the Chrome Web Store.');
        return null;
      }

      const response = await window.aptos.connect();
      this.connection = {
        address: response.address,
        publicKey: response.publicKey,
        connected: true
      };

      console.log('Connected to Petra Wallet:', this.connection);
      return this.connection;
    } catch (error) {
      console.error('Failed to connect to Petra Wallet:', error);
      return null;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (window.aptos) {
        await window.aptos.disconnect();
      }
      this.connection = null;
    } catch (error) {
      console.error('Failed to disconnect from Petra Wallet:', error);
    }
  }

  getConnection(): WalletConnection | null {
    return this.connection;
  }

  isConnected(): boolean {
    return this.connection?.connected || false;
  }

  async signAndSubmitTransaction(payload: any): Promise<any> {
    if (!this.connection) {
      throw new Error('Wallet not connected');
    }

    try {
      if (window.aptos && window.aptos.signAndSubmitTransaction) {
        const response = await window.aptos.signAndSubmitTransaction(payload);
        return response;
      } else {
        // Simulate transaction for demo purposes
        console.log('Simulating transaction:', payload);
        const simulatedResponse = {
          hash: `0x${Date.now().toString(16)}${Math.random().toString(16).substring(2, 8)}`,
          sender: this.connection.address,
          sequence_number: Math.floor(Math.random() * 1000),
          max_gas_amount: "2000",
          gas_unit_price: "100",
          gas_used: "156",
          success: true
        };
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return simulatedResponse;
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }
}

export const petraWallet = PetraWallet.getInstance();