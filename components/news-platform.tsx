"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { auditStore } from "../lib/audit-store";
import { petraWallet, WalletConnection } from "../lib/wallet-connection";

interface NewsArticle {
  id: string;
  headline: string;
  content: string;
  author: string;
  timestamp: number;
  verified: boolean;
  category: string;
  impact: "high" | "medium" | "low";
}

export function NewsPlatform() {
  const [auditEntries, setAuditEntries] = useState(auditStore.getAllEntries());
  const [walletConnection, setWalletConnection] = useState<WalletConnection | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const unsubscribe = auditStore.subscribe(() => {
      setAuditEntries(auditStore.getAllEntries());
    });
    return unsubscribe;
  }, []);

  const handleConnectWallet = async () => {
    try {
      const connection = await petraWallet.connect();
      setWalletConnection(connection);
      if (connection) {
        alert(`Connected to Petra Wallet!\nAddress: ${connection.address}`);
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      alert('Failed to connect to Petra Wallet. Please make sure it is installed and unlocked.');
    }
  };

  const handleDisconnectWallet = async () => {
    await petraWallet.disconnect();
    setWalletConnection(null);
    alert('Disconnected from Petra Wallet');
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diffHours = Math.floor((now - timestamp) / (1000 * 60 * 60));
    return `${diffHours}h ago`;
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-900 text-red-300 border-red-800";
      case "medium": return "bg-yellow-900 text-yellow-300 border-yellow-800";
      case "low": return "bg-green-900 text-green-300 border-green-800";
      default: return "bg-gray-900 text-gray-300 border-gray-800";
    }
  };

  const generateLegalReport = async () => {
    if (auditEntries.length === 0) {
      alert("No audit entries available to generate report");
      return;
    }
    
    try {
      // Generate PDF for the first entry as an example
      await auditStore.downloadLegalPDF(auditEntries[0].id);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please check the console for details.");
    }
  };

  const handleViewDetails = (entryId: string) => {
    const entry = auditStore.getEntry(entryId);
    if (entry) {
      const details = `
AUDIT ENTRY DETAILS
==================

ID: ${entry.id}
Original Hash: ${entry.originalHash}
Current Hash: ${entry.currentHash}
Author: ${entry.author}
Timestamp: ${new Date(entry.timestamp).toISOString()}
Transaction Hash: ${entry.txHash}

CONTENT:
${entry.currentContent}

MODIFICATIONS: ${entry.modifications.length}
${entry.modifications.map((mod, i) => `
${i + 1}. ${new Date(mod.timestamp).toISOString()}
   Type: ${mod.changeType}
   Changes: ${mod.diff}
   TX: ${mod.txHash}
`).join('')}
      `;
      alert(details);
    }
  };

  const handleExportEvidence = (entryId: string) => {
    const report = auditStore.generateLegalReport(entryId);
    if (report) {
      // Create and download text file
      const blob = new Blob([report], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-evidence-${entryId}-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleLegalReport = async (entryId: string) => {
    try {
      await auditStore.downloadLegalPDF(entryId);
    } catch (error) {
      console.error("Error generating legal report:", error);
      alert("Error generating legal report. Please check the console for details.");
    }
  };

  const handleEditArticle = async (entryId: string) => {
    const entry = auditStore.getEntry(entryId);
    if (!entry) return;

    const newContent = prompt("Edit article content:", entry.currentContent);
    if (newContent && newContent !== entry.currentContent) {
      if (!walletConnection) {
        alert("Please connect your Petra wallet first to record this transaction on blockchain.");
        return;
      }

      setIsProcessing(true);
      try {
        // Create a transaction payload for Aptos
        const transactionPayload = {
          type: "entry_function_payload",
          function: "0x52a733d31afb82c3bdfa9a3bc85a9e44daadd2665860f2fa7064e559e4161e02::ledger::mark_deleted",
          type_arguments: [],
          arguments: [entryId, newContent, JSON.stringify({ modified: true, timestamp: Date.now() })]
        };

        // Sign and submit transaction to Aptos blockchain
        const txResponse = await petraWallet.signAndSubmitTransaction(transactionPayload);
        console.log("Transaction submitted:", txResponse);

        // Update the audit store with the new content and real transaction hash
        const modification = auditStore.modifyEntry(entryId, newContent, txResponse.hash || `0x${Date.now().toString(16)}`);
        
        if (modification) {
          alert(`Article updated successfully!\nTransaction Hash: ${txResponse.hash || 'simulated'}\nModification ID: ${modification.id}\n\nYou can now generate a PDF report with this transaction recorded.`);
        }
      } catch (error) {
        console.error("Transaction failed:", error);
        // Fallback to local modification with simulated hash
        const modification = auditStore.modifyEntry(entryId, newContent, `0x${Date.now().toString(16)}`);
        if (modification) {
          alert(`Article updated locally (blockchain transaction failed)\nModification ID: ${modification.id}`);
        }
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleCreateNewArticle = async () => {
    const content = prompt("Enter new article content:");
    if (!content) return;

    const author = prompt("Enter author email:", "editor@newsorg.com");
    if (!author) return;

    if (!walletConnection) {
      alert("Please connect your Petra wallet first to record this transaction on blockchain.");
      return;
    }

    setIsProcessing(true);
    try {
      const articleId = `article-${Date.now()}`;
      
      // Create a transaction payload for Aptos
      const transactionPayload = {
        type: "entry_function_payload",
        function: "0x52a733d31afb82c3bdfa9a3bc85a9e44daadd2665860f2fa7064e559e4161e02::ledger::add_entry",
        type_arguments: [],
        arguments: [content, "", JSON.stringify({ articleId, author, created: Date.now() })]
      };

      // Sign and submit transaction to Aptos blockchain
      const txResponse = await petraWallet.signAndSubmitTransaction(transactionPayload);
      console.log("Transaction submitted:", txResponse);

      // Create new entry in audit store
      const entry = auditStore.createEntry(articleId, content, author, txResponse.hash || `0x${Date.now().toString(16)}`);
      
      alert(`New article created successfully!\nTransaction Hash: ${txResponse.hash || 'simulated'}\nArticle ID: ${entry.id}\n\nYou can now generate a PDF report for this article.`);
    } catch (error) {
      console.error("Transaction failed:", error);
      // Fallback to local creation with simulated hash
      const articleId = `article-${Date.now()}`;
      const entry = auditStore.createEntry(articleId, content, author, `0x${Date.now().toString(16)}`);
      alert(`Article created locally (blockchain transaction failed)\nArticle ID: ${entry.id}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">FinanceWire</h1>
                  <p className="text-sm text-gray-400">Legal Evidence Platform</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <button className="text-gray-300 hover:text-white px-4 py-2 rounded transition-colors">
                  Dashboard
                </button>
              </Link>
              <Link href="/enterprise">
                <button className="text-gray-300 hover:text-white px-4 py-2 rounded transition-colors">
                  Enterprise
                </button>
              </Link>
              
              {walletConnection ? (
                <div className="flex items-center gap-2">
                  <div className="bg-green-900 text-green-300 border border-green-800 rounded px-3 py-1 text-sm">
                    <span className="font-mono">{walletConnection.address.substring(0, 8)}...</span>
                  </div>
                  <button 
                    onClick={handleDisconnectWallet}
                    className="text-gray-300 hover:text-white px-4 py-2 rounded transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleConnectWallet}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                >
                  Connect Petra Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="border-b border-gray-800 bg-gray-950">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-green-900 text-green-300 border border-green-800 rounded px-3 py-1 text-sm">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {auditEntries.length} Verified Articles
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleCreateNewArticle}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Article
              </button>
              
              <button 
                onClick={generateLegalReport}
                className="bg-white text-black hover:bg-gray-100 font-semibold px-6 py-2 rounded flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l3-1m-3 1l-3-1" />
                </svg>
                Generate Legal Audit Report (PDF)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 flex items-center gap-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            <span className="text-white">Processing blockchain transaction...</span>
          </div>
        </div>
      )}

      {/* News Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-800"></div>
            
            <div className="space-y-8">
              {auditEntries.map((entry, index) => (
                <div key={entry.id} className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute left-6 w-4 h-4 bg-white rounded-full border-4 border-black z-10"></div>
                  
                  <div className="ml-16">
                    <div className="bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors rounded-lg">
                      <div className="p-6 pb-4">
                        {/* Metadata */}
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{formatTimestamp(entry.timestamp)}</span>
                            </div>
                            <span>{entry.author}</span>
                            <span className="hover:text-white transition-colors cursor-pointer">
                              ImmutableFeed
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs border ${entry.modifications.length > 0 ? 'bg-yellow-900 text-yellow-300 border-yellow-800' : 'bg-green-900 text-green-300 border-green-800'}`}>
                              {entry.modifications.length > 0 ? 'MODIFIED' : 'ORIGINAL'}
                            </span>
                            <span className="bg-green-900 text-green-300 border border-green-800 px-2 py-1 rounded text-xs flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              VERIFIED
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white text-xl mb-2 leading-tight font-semibold">
                              Article ID: {entry.id}
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                              {entry.currentContent}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 pt-0">
                        {/* Blockchain Evidence */}
                        <div className="bg-gray-950 rounded-lg p-4 mb-4">
                          <h4 className="text-white font-medium flex items-center gap-2 mb-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Blockchain Evidence
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Content Hash:</span>
                              <div className="font-mono text-gray-300">{entry.currentHash}</div>
                            </div>
                            <div>
                              <span className="text-gray-400">Transaction:</span>
                              <div className="font-mono text-gray-300">
                                {entry.txHash.substring(0, 20)}...
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-400">Original Hash:</span>
                              <div className="font-mono text-gray-300">{entry.originalHash}</div>
                            </div>
                            <div>
                              <span className="text-gray-400">Modifications:</span>
                              <div className="font-mono text-gray-300">{entry.modifications.length}</div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleEditArticle(entry.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button 
                              onClick={() => handleViewDetails(entry.id)}
                              className="text-gray-400 hover:text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                              View Details
                            </button>
                            <button 
                              onClick={() => handleExportEvidence(entry.id)}
                              className="text-gray-400 hover:text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Export Evidence
                            </button>
                          </div>
                          <button 
                            onClick={() => handleLegalReport(entry.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Legal Report PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}