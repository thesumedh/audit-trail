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
}

const AptosContext = createContext<AptosContextType | undefined>(undefined)

export function AptosProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<AptosClient | null>(null)
  const [account, setAccount] = useState<AptosAccount | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Initialize Aptos client for testnet
    const aptosClient = new AptosClient("https://fullnode.testnet.aptoslabs.com/v1")
    setClient(aptosClient)
  }, [])

  const connect = async () => {
    try {
      // For demo purposes, create a new account
      // In production, this would integrate with Petra wallet
      const newAccount = new AptosAccount()
      setAccount(newAccount)
      setConnected(true)

      // Fund the account on testnet
      if (client) {
        await client.fundAccount(newAccount.address(), 100000000) // 1 APT
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
    if (!client || !account) return null

    try {
      const txnRequest = await client.generateTransaction(account.address(), payload)
      const signedTxn = await client.signTransaction(account, txnRequest)
      const transactionRes = await client.submitTransaction(signedTxn)
      await client.waitForTransaction(transactionRes.hash)
      return transactionRes.hash
    } catch (error) {
      console.error("Transaction failed:", error)
      return null
    }
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
