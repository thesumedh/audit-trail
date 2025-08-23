import CryptoJS from 'crypto-js';

export class CryptoUtils {
  static generateHash(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }

  static generateMerkleRoot(hashes: string[]): string {
    if (hashes.length === 0) return '';
    if (hashes.length === 1) return hashes[0];
    
    const nextLevel: string[] = [];
    for (let i = 0; i < hashes.length; i += 2) {
      const left = hashes[i];
      const right = i + 1 < hashes.length ? hashes[i + 1] : left;
      nextLevel.push(this.generateHash(left + right));
    }
    
    return this.generateMerkleRoot(nextLevel);
  }

  static verifyHashChain(current: string, previous: string, data: string): boolean {
    const computed = this.generateHash(previous + data);
    return computed === current;
  }

  static generateProof(record: any): string {
    const payload = JSON.stringify({
      contentHash: record.contentHash,
      author: record.author,
      timestamp: record.timestamp,
      metadata: record.metadata
    });
    return this.generateHash(payload);
  }
}