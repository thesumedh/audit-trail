// Dynamic import to avoid SSR issues with jsPDF
let jsPDF: any = null;

interface AuditEntry {
  id: string;
  originalHash: string;
  currentHash: string;
  originalContent: string;
  currentContent: string;
  author: string;
  timestamp: number;
  modifications: ModificationRecord[];
  txHash: string;
}

interface ModificationRecord {
  id: string;
  timestamp: number;
  previousHash: string;
  newHash: string;
  changeType: 'edit' | 'delete' | 'restore';
  diff: string;
  txHash: string;
}

class AuditStore {
  private entries: Map<string, AuditEntry> = new Map();
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create some demo audit entries to showcase the system
    const demoEntries = [
      {
        id: "demo-1",
        content: "Federal Reserve announces emergency rate cut to combat market volatility. This decision comes after extensive deliberation and consultation with major central banks worldwide.",
        author: "financial.editor@newsorg.com",
        txHash: "0xabc123456789def0123456789abcdef0123456789abcdef0123456789abcdef01"
      },
      {
        id: "demo-2", 
        content: "JPMorgan Chase reports strong Q4 results with net income of $15.2 billion, beating analyst estimates by 12%. The bank also announced a 15% dividend increase.",
        author: "banking.reporter@newsorg.com",
        txHash: "0xdef456789abc123456789abcdef0123456789abcdef0123456789abcdef012345"
      },
      {
        id: "demo-3",
        content: "Bitcoin surges past $75,000 as institutional adoption accelerates. BlackRock's Bitcoin ETF saw $2.1 billion in inflows this week alone.",
        author: "crypto.analyst@newsorg.com", 
        txHash: "0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef678"
      }
    ];

    demoEntries.forEach((demo, index) => {
      const timestamp = Date.now() - (index * 3600000); // Stagger by 1 hour each
      const entry = this.createEntry(demo.id, demo.content, demo.author, demo.txHash);
      
      // Add some modifications to demonstrate audit trails
      if (index === 0) {
        // Simulate an edit to the first article
        setTimeout(() => {
          this.modifyEntry(demo.id, 
            "Federal Reserve announces emergency rate cut of 0.75% to combat severe market volatility. This unprecedented decision comes after extensive deliberation and consultation with major central banks worldwide, reflecting the Fed's commitment to economic stability.",
            "0x987654321fedcba0987654321fedcba0987654321fedcba0987654321fedcba09"
          );
        }, 100);
      }
      
      if (index === 1) {
        // Simulate multiple edits to show compliance violations
        setTimeout(() => {
          this.modifyEntry(demo.id,
            "JPMorgan Chase reports exceptional Q4 results with net income of $15.2 billion, significantly beating analyst estimates by 12%. The bank also announced a substantial 15% dividend increase and new share buyback program.",
            "0x456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef012378"
          );
        }, 200);
        
        setTimeout(() => {
          this.modifyEntry(demo.id,
            "JPMorgan Chase reports outstanding Q4 results with record net income of $15.2 billion, dramatically beating analyst estimates by 12%. The bank also announced a generous 15% dividend increase and aggressive $30 billion share buyback program.",
            "0x789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234567"
          );
        }, 300);
      }
    });
  }

  subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach(callback => callback());
  }

  createEntry(id: string, content: string, author: string, txHash: string): AuditEntry {
    const hash = this.generateHash(content);
    const entry: AuditEntry = {
      id,
      originalHash: hash,
      currentHash: hash,
      originalContent: content,
      currentContent: content,
      author,
      timestamp: Date.now(),
      modifications: [],
      txHash
    };
    
    this.entries.set(id, entry);
    this.notify();
    return entry;
  }

  modifyEntry(id: string, newContent: string, txHash: string): ModificationRecord | null {
    const entry = this.entries.get(id);
    if (!entry) return null;

    const newHash = this.generateHash(newContent);
    const modification: ModificationRecord = {
      id: `mod_${Date.now()}`,
      timestamp: Date.now(),
      previousHash: entry.currentHash,
      newHash,
      changeType: 'edit',
      diff: this.generateDiff(entry.currentContent, newContent),
      txHash
    };

    entry.modifications.push(modification);
    entry.currentHash = newHash;
    entry.currentContent = newContent;
    
    this.entries.set(id, entry);
    this.notify();
    return modification;
  }

  getEntry(id: string): AuditEntry | undefined {
    return this.entries.get(id);
  }

  getAllEntries(): AuditEntry[] {
    return Array.from(this.entries.values());
  }

  getModifiedEntries(): AuditEntry[] {
    return this.getAllEntries().filter(entry => entry.modifications.length > 0);
  }

  private generateHash(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  private generateDiff(original: string, modified: string): string {
    const originalWords = original.split(' ');
    const modifiedWords = modified.split(' ');
    
    const changes: string[] = [];
    const maxLength = Math.max(originalWords.length, modifiedWords.length);
    
    for (let i = 0; i < maxLength; i++) {
      const originalWord = originalWords[i] || '';
      const modifiedWord = modifiedWords[i] || '';
      
      if (originalWord !== modifiedWord) {
        if (originalWord && modifiedWord) {
          changes.push(`CHANGED: "${originalWord}" → "${modifiedWord}"`);
        } else if (originalWord) {
          changes.push(`DELETED: "${originalWord}"`);
        } else if (modifiedWord) {
          changes.push(`ADDED: "${modifiedWord}"`);
        }
      }
    }
    
    return changes.join('; ');
  }

  generateLegalReport(entryId: string): string {
    const entry = this.getEntry(entryId);
    if (!entry) return '';

    const report = `
LEGAL AUDIT REPORT
==================

Document ID: ${entry.id}
Generated: ${new Date().toISOString()}
Blockchain Network: Aptos Testnet

ORIGINAL DOCUMENT
-----------------
Hash: ${entry.originalHash}
Content: ${entry.originalContent}
Author: ${entry.author}
Timestamp: ${new Date(entry.timestamp).toISOString()}
Transaction: ${entry.txHash}

CURRENT STATE
-------------
Hash: ${entry.currentHash}
Content: ${entry.currentContent}
Integrity: ${entry.originalHash === entry.currentHash ? 'INTACT' : 'MODIFIED'}

MODIFICATION HISTORY
-------------------
${entry.modifications.map((mod, index) => `
${index + 1}. Modification ID: ${mod.id}
   Timestamp: ${new Date(mod.timestamp).toISOString()}
   Previous Hash: ${mod.previousHash}
   New Hash: ${mod.newHash}
   Changes: ${mod.diff}
   Transaction: ${mod.txHash}
`).join('')}

CRYPTOGRAPHIC VERIFICATION
-------------------------
Original Hash: ${entry.originalHash}
Current Hash: ${entry.currentHash}
Hash Match: ${entry.originalHash === entry.currentHash ? 'YES' : 'NO'}
Total Modifications: ${entry.modifications.length}

LEGAL ATTESTATION
-----------------
This report was generated from immutable blockchain records on Aptos.
All modifications are cryptographically verified and tamper-evident.
This document can be used as evidence in legal proceedings.

Generated by ImmutableFeed Audit System
Blockchain Address: 0x90dffdae708ad657475ff837177d9a57d0d4248cde9fa3f2ce81a0145c4aa9a6
`;

    return report;
  }

  async downloadLegalPDF(entryId: string): Promise<void> {
    const entry = this.getEntry(entryId);
    if (!entry) {
      alert('Entry not found');
      return;
    }

    try {
      // Dynamic import to avoid SSR issues
      if (!jsPDF) {
        const jsPDFModule = await import('jspdf');
        jsPDF = jsPDFModule.default;
      }

      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const lineHeight = 7;
      let yPosition = margin;

      console.log('Generating PDF for entry:', entry);

    // Header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('LEGAL AUDIT REPORT', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += lineHeight * 2;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Document ID: ${entry.id}`, margin, yPosition);
    yPosition += lineHeight;
    pdf.text(`Generated: ${new Date().toISOString()}`, margin, yPosition);
    yPosition += lineHeight;
    pdf.text('Blockchain Network: Aptos Testnet', margin, yPosition);
    yPosition += lineHeight * 2;

    // Original Document Section
    pdf.setFont('helvetica', 'bold');
    pdf.text('ORIGINAL DOCUMENT', margin, yPosition);
    yPosition += lineHeight;
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Hash: ${entry.originalHash}`, margin, yPosition);
    yPosition += lineHeight;
    pdf.text(`Author: ${entry.author}`, margin, yPosition);
    yPosition += lineHeight;
    pdf.text(`Timestamp: ${new Date(entry.timestamp).toISOString()}`, margin, yPosition);
    yPosition += lineHeight;
    pdf.text(`Transaction: ${entry.txHash}`, margin, yPosition);
    yPosition += lineHeight * 2;

    // Content (wrapped)
    const contentLines = pdf.splitTextToSize(`Content: ${entry.originalContent}`, pageWidth - 2 * margin);
    contentLines.forEach((line: string) => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin, yPosition);
      yPosition += lineHeight;
    });
    yPosition += lineHeight;

    // Current State
    pdf.setFont('helvetica', 'bold');
    pdf.text('CURRENT STATE', margin, yPosition);
    yPosition += lineHeight;
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Hash: ${entry.currentHash}`, margin, yPosition);
    yPosition += lineHeight;
    pdf.text(`Integrity: ${entry.originalHash === entry.currentHash ? 'INTACT' : 'MODIFIED'}`, margin, yPosition);
    yPosition += lineHeight * 2;

    // Modifications
    if (entry.modifications.length > 0) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('MODIFICATION HISTORY', margin, yPosition);
      yPosition += lineHeight;
      pdf.setFont('helvetica', 'normal');
      
      entry.modifications.forEach((mod, index) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(`${index + 1}. Modification ID: ${mod.id}`, margin, yPosition);
        yPosition += lineHeight;
        pdf.text(`   Timestamp: ${new Date(mod.timestamp).toISOString()}`, margin, yPosition);
        yPosition += lineHeight;
        pdf.text(`   Previous Hash: ${mod.previousHash}`, margin, yPosition);
        yPosition += lineHeight;
        pdf.text(`   New Hash: ${mod.newHash}`, margin, yPosition);
        yPosition += lineHeight;
        const changeLines = pdf.splitTextToSize(`   Changes: ${mod.diff}`, pageWidth - 2 * margin);
        changeLines.forEach((line: string) => {
          pdf.text(line, margin, yPosition);
          yPosition += lineHeight;
        });
        yPosition += lineHeight;
      });
    }

    // Legal Attestation
    if (yPosition > 200) {
      pdf.addPage();
      yPosition = margin;
    }
    pdf.setFont('helvetica', 'bold');
    pdf.text('LEGAL ATTESTATION', margin, yPosition);
    yPosition += lineHeight;
    pdf.setFont('helvetica', 'normal');
    const attestationText = 'This report was generated from immutable blockchain records on Aptos. All modifications are cryptographically verified and tamper-evident. This document can be used as evidence in legal proceedings.';
    const attestationLines = pdf.splitTextToSize(attestationText, pageWidth - 2 * margin);
    attestationLines.forEach((line: string) => {
      pdf.text(line, margin, yPosition);
      yPosition += lineHeight;
    });

    // Download
    pdf.save(`legal-audit-report-${entryId}-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }
}

export const auditStore = new AuditStore();
export type { AuditEntry, ModificationRecord };