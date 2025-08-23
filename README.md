# ImmutableFeed - Aptos Web3 Hackathon Project

Enterprise-grade audit trails for ActivityPub posts using Aptos blockchain, AI verification, and zero-knowledge proofs.

## 🚀 Live Demo

- **Main Dashboard**: [View Demo](/)
- **SDK Integration**: [View SDK](/sdk)
- **Live SDK Demo**: [Try SDK](/sdk-demo)
- **Move Contract Demo**: [Petra Wallet](/move-demo)
- **Financial News Demo**: [FinanceWire](/financial-news)

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
- Petra Wallet (for blockchain features)

### Installation
```bash
git clone <repository>
cd aptos-audit
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Deploy Static Site
```bash
npm run export
```

## 📦 SDK Usage

```typescript
import { createLedger } from '@immutablefeed/sdk';

// Initialize ledger
const ledger = createLedger();

// Create audit record
const record = await ledger.createRecord(
  "Hello, immutable world!",
  "alice@company.com",
  { platform: "mastodon", postId: "123" }
);

// Verify record
const verification = await ledger.verifyRecord(record.id);
console.log('Valid:', verification.isValid);
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

MIT License - Built for Aptos Web3 Hackathon 2024