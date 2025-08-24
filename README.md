# audit-trail- Enterprise Legal Discovery Platform

**Production-ready audit trail system for corporate ActivityPub posts with immutable blockchain logging and legal discovery capabilities.**

## 🏢 Business Problem Solved

**Real-world scenario**: A financial news company delivers market updates to clients. Client files lawsuit claiming they made business decisions on X date based on information from the company's site. The company needs to prove exactly what information was displayed on that specific date for legal discovery - which may differ from current data due to edits, corrections, or deletions.

**Our Solution**: Immutable blockchain audit trail that captures every post, edit, and deletion with cryptographic proof, enabling point-in-time reconstruction for legal proceedings.

## 🚀 Live Demo & Features
<img width="1892" height="912" alt="image" src="https://github.com/user-attachments/assets/9f897d7f-5e14-4fe0-85ff-3adfc3274c0c" />
<img width="1902" height="907" alt="image" src="https://github.com/user-attachments/assets/1fb024fb-05f6-4b06-8e2b-3fdf2c9c5ffc" />




- **Corporate Dashboard**: [Main Audit Interface](/) - Real-time monitoring and compliance
- **Financial News Demo**: [FinanceWire](/financial-news) - Live example with Petra wallet
- **Compliance Timeline**: [Audit Feed](/) - Visual chronological audit logs
- **Legal Discovery**: [Point-in-Time Snapshots](/) - Historical data reconstruction
- **SDK Integration**: [Developer Tools](/sdk) - Enterprise integration guide

## 💼 Target Industries

- **Financial Services**: Market data, trading alerts, regulatory filings
- **Healthcare**: Patient communications, medical updates, compliance records  
- **Legal**: Client communications, case updates, regulatory notices
- **Corporate Communications**: Press releases, investor updates, internal memos

## 🏗️ Project Structure

```
aptos-audit/
├── app/                    # Next.js app router pages
├── components/             # React components
├── lib/                   # Utility libraries
├── sdk/                   # ImmutableFeed SDK package
├── move/                  # Aptos Move smart contracts
└── public/               # Static assets
```

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- Petra Wallet browser extension
- Aptos Testnet account with APT tokens

### Installation
```bash
git clone https://github.com/thesumedh/aptos.git
cd aptos
npm install
```

### Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Configure your Petra wallet address
NEXT_PUBLIC_CONTRACT_ADDRESS=0x90dffdae708ad657475ff837177d9a57d0d4248cde9fa3f2ce81a0145c4aa9a6
```

### Development
```bash
npm run dev
# Open http://localhost:3000
```

### Production Deployment
```bash
npm run build
npm start
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment guide.

## 📦 Enterprise SDK Usage

```typescript
import { createLedger } from '@corporateauditchain/sdk';

// Initialize audit ledger
const ledger = createLedger({
  aptosClient: 'https://fullnode.testnet.aptoslabs.com/v1',
  contractAddress: '0x90dffdae708ad657475ff837177d9a57d0d4248cde9fa3f2ce81a0145c4aa9a6'
});

// Log corporate communication
const auditRecord = await ledger.createRecord(
  "Q3 earnings report published: Revenue up 15%",
  "investor.relations@company.com",
  { 
    type: "financial_disclosure",
    category: "earnings",
    compliance_required: true,
    distribution_list: ["sec@gov", "investors@company.com"]
  }
);

// Legal discovery: Get point-in-time snapshot
const snapshot = await ledger.getSnapshotAtTime(
  new Date('2024-01-15T09:00:00Z')
);

// Generate court-admissible report
const legalReport = await ledger.generateLegalReport({
  targetDate: new Date('2024-01-15'),
  requestor: "Legal Counsel",
  caseNumber: "CV-2024-001234",
  description: "Discovery request for financial communications"
});
```

## 🔗 Move Smart Contract

The project includes a complete Move smart contract for immutable ledger operations:

- `ledger::add_entry` - Create immutable records
- `ledger::mark_deleted` - Mark entries as deleted (preserves history)
- `ledger::get_snapshot_at_time` - Point-in-time reconstruction

## 🎯 Features

- ✅ **Immutable Audit Trails** - Cryptographically secured records
- ✅ **Petra Wallet Integration** - Real blockchain transactions
- ✅ **Point-in-Time Snapshots** - Regulatory compliance
- ✅ **Hash Chain Verification** - Tamper-proof integrity
- ✅ **Enterprise SDK** - Easy integration for developers
- ✅ **Dark Mode Support** - Professional UI/UX
- ✅ **Real-time Updates** - Live blockchain monitoring

## 🏆 Hackathon Highlights

1. **Complete Ecosystem** - SDK + Demo + Smart Contract
2. **Real Blockchain Integration** - Live Aptos transactions
3. **Enterprise Use Case** - Financial compliance solution
4. **Professional UI/UX** - Production-ready interface
5. **Scalable Architecture** - Modular and extensible

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Static Hosting
```bash
npm run export
# Upload 'out' folder to any static host
```

### Environment Variables
```
NEXT_PUBLIC_APTOS_NETWORK=testnet
NEXT_PUBLIC_APTOS_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1
```

## 📄 License

MIT License - Built for Aptos Web3 Hackathon 2025
