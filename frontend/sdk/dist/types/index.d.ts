export interface AuditRecord {
    id: string;
    contentHash: string;
    originalContent: string;
    author: string;
    timestamp: number;
    blockHeight: number;
    transactionHash: string;
    previousHash?: string;
    signature: string;
    metadata: {
        platform: string;
        postId: string;
        activityPubId?: string;
    };
}
export interface VerificationResult {
    isValid: boolean;
    record: AuditRecord;
    proofHash: string;
    chainIntegrity: boolean;
    timestamp: number;
}
export interface SnapshotData {
    timestamp: number;
    blockHeight: number;
    recordCount: number;
    merkleRoot: string;
    records: AuditRecord[];
}
export interface LedgerConfig {
    aptosClient: string;
    privateKey?: string;
    contractAddress?: string;
}
export interface HashChainLink {
    hash: string;
    previousHash: string;
    data: string;
    timestamp: number;
}
//# sourceMappingURL=index.d.ts.map