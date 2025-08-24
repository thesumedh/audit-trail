"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { AptosClient, AptosAccount } from "aptos"

interface AptosContextType {
  client: AptosClient | null
  account: AptosAccount | null
  connected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  submitTransaction: (payload: any) => Promise<string | null>
  petraAccount: any
  getAddress: () => string
}

const AptosContext = createContext<AptosContextType | undefined>(undefined)

export function AptosProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<AptosClient | null>(null)
  const [account, setAccount] = useState<AptosAccount | null>(null)
  const [connected, setConnected] = useState(false)
  const [petraAccount, setPetraAccount] = useState<any>(null)

  useEffect(() => {
    // Initialize Aptos client for testnet
    const aptosClient = new AptosClient("https://fullnode.testnet.aptoslabs.com/v1")
    setClient(aptosClient)
    
    // Check if already connected to Petra
    checkPetraConnection()
  }, [])

  const checkPetraConnection = async () => {
    if (typeof window !== 'undefined' && window.petra) {
      try {
        const response = await window.petra.account()
        if (response) {
          setPetraAccount(response)
          setConnected(true)
          
          // Create AptosAccount from Petra for SDK compatibility
          const aptosAccount = new AptosAccount()
          setAccount(aptosAccount)
        }
      } catch (error) {
        console.log("Petra not connected")
      }
    }
  }

  const connect = async () => {
    try {
      if (typeof window !== 'undefined' && window.petra) {
        // Connect to Petra Wallet
        const response = await window.petra.connect()
        setPetraAccount(response)
        setConnected(true)
        
        // Create AptosAccount for SDK compatibility
        const aptosAccount = new AptosAccount()
        setAccount(aptosAccount)
        
        console.log("Connected to Petra:", response.address)
      } else {
        // Fallback: Create demo account with your testnet address
        const demoAccount = new AptosAccount()
        setAccount(demoAccount)
        setConnected(true)
        setPetraAccount({
          address: "0x90dffdae708ad657475ff837177d9a57d0d4248cde9fa3f2ce81a0145c4aa9a6",
          publicKey: "demo_public_key"
        })

        // Fund the demo account on testnet
        if (client) {
          try {
            await client.fundAccount(demoAccount.address(), 100000000) // 1 APT
          } catch (error) {
            console.log("Funding failed (account may already be funded)")
          }
        }
      }
    } catch (error) {
      console.error("Failed to connect:", error)
    }
  }

  const disconnect = () => {
    setAccount(null)
    setConnected(false)
  }

  const submitTransaction = async (payload: any): Promise<string | null> => {
    if (!client) return null

    try {
      if (window.petra && petraAccount) {
        // Use Petra wallet for real transactions
        const response = await window.petra.signAndSubmitTransaction(payload)
        await client.waitForTransaction(response.hash)
        return response.hash
      } else if (account) {
        // Fallback to SDK account
        const txnRequest = await client.generateTransaction(account.address(), payload)
        const signedTxn = await client.signTransaction(account, txnRequest)
        const transactionRes = await client.submitTransaction(signedTxn)
        await client.waitForTransaction(transactionRes.hash)
        return transactionRes.hash
      }
      return null
    } catch (error) {
      console.error("Transaction failed:", error)
      return null
    }
  }

  const getAddress = (): string => {
    if (petraAccount) return petraAccount.address
    if (account) return account.address().hex()
    return "0x90dffdae708ad657475ff837177d9a57d0d4248cde9fa3f2ce81a0145c4aa9a6"
  }

  return (
    <AptosContext.Provider
      value={{
        client,
        account,
        connected,
        connect,
        disconnect,
        submitTransaction,
        petraAccount,
        getAddress,
      }}
    >
      {children}
    </AptosContext.Provider>
  )
}

export function useAptos() {
  const context = useContext(AptosContext)
  if (context === undefined) {
    throw new Error("useAptos must be used within an AptosProvider")
  }
  return context
}
