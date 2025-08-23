# ImmutableFeed SDK

Enterprise-grade audit trail SDK for ActivityPub posts on Aptos blockchain.

## Installation

```bash
npm install @immutablefeed/sdk
```

## Quick Start

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

// Create snapshot
const snapshot = ledger.createSnapshot();
console.log('Merkle Root:', snapshot.merkleRoot);
```

## Features

- ✅ Immutable audit trails
- ✅ Hash chain verification
- ✅ Point-in-time snapshots
- ✅ Aptos blockchain integration
- ✅ Real-time verification
- ✅ Enterprise compliance

## API Reference

### `createLedger(config?)`
Creates a new ledger instance.

### `ledger.createRecord(content, author, metadata)`
Creates an immutable audit record.

### `ledger.verifyRecord(recordId)`
Verifies record integrity and authenticity.

### `ledger.createSnapshot()`
Creates point-in-time snapshot with Merkle root.

### `ledger.searchRecords(query)`
Searches records by content, author, or hash.