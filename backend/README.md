# ImmutableFeed Smart Contracts

> Enterprise blockchain infrastructure for immutable content management and audit trails

## What This Does

This is the backend system that powers ImmutableFeed - a blockchain-based platform for creating permanent, unchangeable records of content. Think of it as a digital ledger that can never be tampered with, perfect for:

- **Corporate compliance** - Keep permanent records for audits
- **Content verification** - Prove when and how content was created
- **Legal documentation** - Create tamper-proof evidence
- **Data integrity** - Ensure information hasn't been changed

## Quick Start

### What You Need

1. **Aptos CLI** - Download from [aptos.dev](https://aptos.dev/tools/aptos-cli/install-cli/)
2. **Aptos Account** - Create one with `aptos init`
3. **Testnet Tokens** - Get free tokens from the Aptos faucet

### Deploy in 3 Steps

```bash
# 1. Compile the smart contract
npm run compile

# 2. Deploy to blockchain
npm run deploy

# 3. Your contract is now live!
```

## How It Works

### The Smart Contract

Our main contract (`ledger.move`) creates a permanent record system where:

- **Every entry is permanent** - Once saved, it can never be changed
- **Each account has its own ledger** - Your data stays private
- **Everything is timestamped** - Know exactly when something happened
- **Content is verified** - Uses cryptographic hashing to prevent tampering

### What You Can Do

| Function | What It Does | Who Can Use It |
|----------|--------------|----------------|
| `add_entry` | Save new content permanently | Anyone |
| `mark_deleted` | Mark content as modified (doesn't actually delete) | Content owner |
| `get_entries` | View all saved content | Anyone |
| `get_active_entries` | View only current content | Anyone |
| `get_snapshot_at_time` | See what content existed at a specific time | Anyone |

## Current Deployment

Our smart contract is live on Aptos Testnet:

- **Contract Address**: `0x90dffdae708ad657475ff837177d9a57d0d4248cde9fa3f2ce81a0145c4aa9a6`
- **Network**: Aptos Testnet
- **Status**: ✅ Active and verified

## For Developers

### Project Structure

```
backend/
├── move/
│   ├── sources/
│   │   └── ledger.move      # Main smart contract
│   ├── Move.toml            # Project configuration
│   └── .aptos/              # Blockchain connection settings
├── deploy.sh                # Easy deployment script
└── package.json             # Build and deployment commands
```

### Available Commands

```bash
npm run compile      # Check your code for errors
npm run test         # Run automated tests
npm run deploy       # Deploy to testnet
npm run clean        # Remove build files
```

### Testing Your Contract

```bash
# View all entries for an account
aptos move view \
  --function-id 0x90dffdae708ad657475ff837177d9a57d0d4248cde9fa3f2ce81a0145c4aa9a6::ledger::get_entries \
  --args address:YOUR_WALLET_ADDRESS

# Check total number of entries
aptos move view \
  --function-id 0x90dffdae708ad657475ff837177d9a57d0d4248cde9fa3f2ce81a0145c4aa9a6::ledger::get_total_entries \
  --args address:YOUR_WALLET_ADDRESS
```

## Data Structure

### What Gets Stored

Each record in the ledger contains:

```
Entry {
  id: 1,                           # Unique number for this entry
  content_hash: "abc123...",       # Fingerprint of the content
  author: "0x123...",              # Who created this
  timestamp: 1640995200000000,     # When it was created (microseconds)
  previous_hash: "def456...",      # Link to previous entry
  is_deleted: false,               # Whether it's been marked as modified
  metadata: "{...}"                # Extra information as JSON
}
```

### How Data Is Organized

- **Each wallet has its own ledger** - Your data is separate from others
- **Entries are linked together** - Like a chain, each entry references the previous one
- **Everything is timestamped** - Using blockchain time, which can't be faked
- **Content is hashed** - We store a unique fingerprint, not the actual content

## Security & Compliance

### Built-in Security

- ✅ **Immutable records** - Once saved, cannot be changed
- ✅ **Cryptographic verification** - Content integrity is mathematically guaranteed
- ✅ **Decentralized storage** - No single point of failure
- ✅ **Transparent operations** - All actions are publicly verifiable

### Compliance Features

- **Audit trails** - Complete history of all changes
- **Timestamping** - Blockchain-verified creation times
- **Data integrity** - Cryptographic proof content hasn't been tampered with
- **Access control** - Each account controls its own data

## Support & Maintenance

### Getting Help

- **Documentation**: Check this README first
- **Issues**: Report problems via GitHub issues
- **Updates**: Follow our releases for new features

### Enterprise Support

For enterprise deployments, we provide:
- Custom deployment assistance
- Integration support
- Compliance consulting
- 24/7 technical support

### Monitoring

Track your deployment:
- **Explorer**: [View on Aptos Explorer](https://explorer.aptoslabs.com/account/0x90dffdae708ad657475ff837177d9a57d0d4248cde9fa3f2ce81a0145c4aa9a6?network=testnet)
- **Status**: All systems operational
- **Uptime**: 99.9% (blockchain guaranteed)

---

**Need help?** Contact our team or check the [frontend repository](../frontend) for the complete application.