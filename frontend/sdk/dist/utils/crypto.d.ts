export declare class CryptoUtils {
    static generateHash(data: string): string;
    static generateMerkleRoot(hashes: string[]): string;
    static verifyHashChain(current: string, previous: string, data: string): boolean;
    static generateProof(record: any): string;
}
//# sourceMappingURL=crypto.d.ts.map