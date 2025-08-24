# ImmutableFeed - Project Structure

This document outlines the reorganized project structure with separate frontend and backend repositories.

## Repository Structure

```
immutablefeed/
├── frontend/                # Next.js Frontend Application
│   ├── app/                # Next.js app router
│   ├── components/         # React components
│   ├── lib/               # Utility libraries
│   ├── sdk/               # Custom blockchain SDK
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   └── README.md          # Frontend documentation
│
├── backend/                # Move Smart Contracts
│   ├── move/              # Move contract source
│   │   ├── sources/       # Move source files
│   │   │   └── ledger.move # Main ledger contract
│   │   ├── Move.toml      # Move package config
│   │   └── .aptos/        # Aptos CLI config
│   ├── deploy.sh          # Deployment script
│   ├── package.json       # Backend scripts
│   └── README.md          # Backend documentation
│
└── PROJECT_STRUCTURE.md    # This file
```

## Quick Start

### Backend (Smart Contracts)

```bash
cd backend
npm run compile    # Compile Move contracts
npm run test       # Run Move tests
npm run deploy     # Deploy to testnet
```

### Frontend (Web Application)

```bash
cd frontend
npm install        # Install dependencies
npm run dev        # Start development server
npm run build      # Build for production
```

## Development Workflow

### 1. Smart Contract Development
- Work in `backend/move/sources/`
- Test with `npm run test`
- Deploy with `npm run deploy`

### 2. Frontend Development
- Work in `frontend/`
- Connect to deployed contracts
- Test with Petra wallet

### 3. Integration
- Update contract addresses in frontend
- Test end-to-end functionality
- Deploy both components

## Deployment

### Backend Deployment
1. Configure Aptos CLI with your account
2. Run `cd backend && npm run deploy`
3. Note the deployed contract address

### Frontend Deployment
1. Update contract address in `.env.local`
2. Deploy to Vercel or your preferred platform
3. Configure environment variables

## Key Features

### Smart Contract (Backend)
- ✅ Immutable ledger entries
- ✅ Auto-initialization for accounts
- ✅ Content hashing and integrity
- ✅ Historical data retrieval
- ✅ Event emission for tracking

### Web Application (Frontend)
- ✅ Petra wallet integration
- ✅ Real-time blockchain interaction
- ✅ Audit trail visualization
- ✅ Legal discovery tools
- ✅ Enterprise dashboard

## Technology Stack

### Backend
- **Move Language** - Smart contract development
- **Aptos Blockchain** - Layer 1 blockchain platform
- **Aptos CLI** - Development and deployment tools

### Frontend
- **Next.js 14** - React framework with app router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **Aptos SDK** - Blockchain integration

## Current Deployment

### Smart Contract
- **Network**: Aptos Testnet
- **Address**: `0x90dffdae708ad657475ff837177d9a57d0d4248cde9fa3f2ce81a0145c4aa9a6`
- **Module**: `immutable_feed::ledger`

### Frontend
- **Platform**: Local development / Vercel
- **URL**: `http://localhost:3000` (development)

## Next Steps

1. **Separate Git Repositories**: Create individual repos for frontend and backend
2. **CI/CD Pipeline**: Set up automated testing and deployment
3. **Documentation**: Expand API documentation and user guides
4. **Testing**: Add comprehensive test suites for both components
5. **Security Audit**: Professional security review of smart contracts

## Contributing

Each repository has its own contribution guidelines:
- See `backend/README.md` for smart contract development
- See `frontend/README.md` for frontend development

## Support

For questions and support:
- Smart Contract issues: Check `backend/README.md`
- Frontend issues: Check `frontend/README.md`
- General questions: Create an issue in the main repository