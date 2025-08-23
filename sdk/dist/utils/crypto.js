"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoUtils = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
class CryptoUtils {
    static generateHash(data) {
        return crypto_js_1.default.SHA256(data).toString();
    }
    static generateMerkleRoot(hashes) {
        if (hashes.length === 0)
            return '';
        if (hashes.length === 1)
            return hashes[0];
        const nextLevel = [];
        for (let i = 0; i < hashes.length; i += 2) {
            const left = hashes[i];
            const right = i + 1 < hashes.length ? hashes[i + 1] : left;
            nextLevel.push(this.generateHash(left + right));
        }
        return this.generateMerkleRoot(nextLevel);
    }
    static verifyHashChain(current, previous, data) {
        const computed = this.generateHash(previous + data);
        return computed === current;
    }
    static generateProof(record) {
        const payload = JSON.stringify({
            contentHash: record.contentHash,
            author: record.author,
            timestamp: record.timestamp,
            metadata: record.metadata
        });
        return this.generateHash(payload);
    }
}
exports.CryptoUtils = CryptoUtils;
//# sourceMappingURL=crypto.js.map