# ImmutableFeed Frontend

This repository contains the Next.js frontend application for the ImmutableFeed project - a corporate audit chain and immutable content management system.

## Structure

```
frontend/
├── app/                     # Next.js app router
│   ├── api/                # API routes
│   ├── dashboard/          # Dashboard pages
│   ├── enterprise/         # Enterprise features
│   └── move-demo/          # Move contract demo
├── components/             # React components
│   ├── ui/                # UI components (shadcn/ui)
│   ├── aptos-provider.tsx # Aptos wallet integration
│   ├── petra-wallet-demo.tsx # Petra wallet demo
│   └── news-platform.tsx  # News platform component
├── lib/                    # Utility libraries
│   ├── audit-store.ts     # Audit data management
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
├── sdk/                    # Custom SDK for blockchain interaction
└── public/                 # Static assets
```

## Features

### Core Features
- **Immutable Content Ledger** - Blockchain-based content storage
- **Petra Wallet Integration** - Connect and interact with Aptos blockchain
- **Real-time Audit Trail** - Track all content modifications
- **Legal Discovery Tools** - Export audit trails for compliance
- **Enterprise Dashboard** - Corporate audit management

### Demo Features
- **Move Contract Demo** - Interactive blockchain contract testing
- **News Platform** - Immutable news content management
- **Audit Timeline** - Visual representation of content changes
- **Compliance Reports** - Generate legal discovery documents

## Getting Started

### Prerequisites

1. Node.js 18+ and npm
2. Petra Wallet browser extension
3. Aptos testnet account with APT tokens

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

```bash
# Aptos Configuration
NEXT_PUBLIC_APTOS_NETWORK=testnet
NEXT_PUBLIC_APTOS_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1
NEXT_PUBLIC_CONTRACT_ADDRESS=0x90dffdae708ad657475ff837177d9a57d0d4248cde9fa3f2ce81a0145c4aa9a6

# Application Configuration
NEXT_PUBLIC_APP_NAME=CorporateAuditChain
NEXT_PUBLIC_ENVIRONMENT=production
```

## Usage

### Connecting Wallet

1. Install Petra Wallet extension
2. Create or import an Aptos account
3. Switch to testnet
4. Get testnet APT from faucet
5. Connect wallet in the application

### Creating Immutable Records

1. Navigate to the Move Demo page
2. Connect your Petra wallet
3. Enter content to be recorded
4. Submit transaction to blockchain
5. View your immutable record in the ledger

### Audit Trail

1. Go to Dashboard
2. View all recorded entries
3. Track modifications and timestamps
4. Export compliance reports

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Key Components

- **AptosProvider** - Manages wallet connections and blockchain state
- **PetraWalletDemo** - Interactive demo for blockchain operations
- **NewsPlatform** - Content management with immutable storage
- **AuditDashboard** - Enterprise audit trail visualization
- **LegalDiscovery** - Compliance and legal export tools

### API Routes

- `/api/audit/*` - Audit trail and compliance endpoints
- `/api/posts/*` - Content management endpoints
- `/api/wallet/*` - Wallet integration endpoints
- `/api/reports/*` - Report generation endpoints

## Blockchain Integration

### Smart Contract Interaction

The frontend interacts with the Move smart contract deployed at:
- **Address**: `0x90dffdae708ad657475ff837177d9a57d0d4248cde9fa3f2ce81a0145c4aa9a6`
- **Module**: `immutable_feed::ledger`

### Key Functions Used

```typescript
// Add new entry to blockchain
const payload = {
  type: "entry_function_payload",
  function: "0x90dffdae708ad657475ff837177d9a57d0d4248cde9fa3f2ce81a0145c4aa9a6::ledger::add_entry",
  arguments: [contentHash, previousHash, metadata]
}

// Mark entry as modified
const payload = {
  type: "entry_function_payload", 
  function: "0x90dffdae708ad657475ff837177d9a57d0d4248cde9fa3f2ce81a0145c4aa9a6::ledger::mark_deleted",
  arguments: [entryId, newContentHash, metadata]
}
```

## Deployment

### Vercel Deployment

1. Connect repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Manual Deployment

```bash
npm run build
npm run start
```

## Architecture

### State Management
- React Context for wallet state
- Local storage for UI preferences
- Blockchain as source of truth for data

### Styling
- Tailwind CSS for styling
- shadcn/ui for component library
- Responsive design for all devices

### Type Safety
- Full TypeScript implementation
- Strict type checking enabled
- Generated types for blockchain data

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## License

This project is licensed under the MIT License.