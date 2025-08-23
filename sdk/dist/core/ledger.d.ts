import { AuditRecord, VerificationResult, SnapshotData, LedgerConfig } from '../types';
export declare class ImmutableLedger {
    private client;
    private account?;
    private records;
    private hashChain;
    constructor(config: LedgerConfig);
    createRecord(content: string, author: string, metadata: any): Promise<AuditRecord>;
    verifyRecord(recordId: string): Promise<VerificationResult>;
    createSnapshot(): SnapshotData;
    getRecords(): AuditRecord[];
    searchRecords(query: string): AuditRecord[];
    private getCurrentBlockHeight;
    private submitToBlockchain;
    private verifyChainIntegrity;
}
//# sourceMappingURL=ledger.d.ts.map