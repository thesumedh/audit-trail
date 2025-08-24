"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImmutableLedger = void 0;
const aptos_1 = require("aptos");
const crypto_1 = require("../utils/crypto");
class ImmutableLedger {
    constructor(config) {
        this.records = new Map();
        this.hashChain = [];
        this.client = new aptos_1.AptosClient(config.aptosClient);
        if (config.privateKey) {
            this.account = new aptos_1.AptosAccount(Buffer.from(config.privateKey, 'hex'));
        }
    }
    async createRecord(content, author, metadata) {
        const contentHash = crypto_1.CryptoUtils.generateHash(content);
        const timestamp = Date.now();
        const previousHash = this.hashChain.length > 0 ? this.hashChain[this.hashChain.length - 1] : '';
        const record = {
            id: crypto_1.CryptoUtils.generateHash(`${contentHash}-${timestamp}`),
            contentHash,
            originalContent: content,
            author,
            timestamp,
            blockHeight: await this.getCurrentBlockHeight(),
            transactionHash: '',
            previousHash,
            signature: crypto_1.CryptoUtils.generateProof({ contentHash, author, timestamp, metadata }),
            metadata
        };
        // Submit to Aptos blockchain
        if (this.account) {
            try {
                const txHash = await this.submitToBlockchain(record);
                record.transactionHash = txHash;
            }
            catch (error) {
                console.warn('Blockchain submission failed, storing locally:', error);
            }
        }
        // Update hash chain
        const currentHash = crypto_1.CryptoUtils.generateHash(previousHash + record.signature);
        this.hashChain.push(currentHash);
        this.records.set(record.id, record);
        return record;
    }
    async verifyRecord(recordId) {
        const record = this.records.get(recordId);
        if (!record) {
            throw new Error('Record not found');
        }
        const proofHash = crypto_1.CryptoUtils.generateProof(record);
        const isValid = proofHash === record.signature;
        // Verify chain integrity
        const chainIntegrity = this.verifyChainIntegrity(record);
        return {
            isValid,
            record,
            proofHash,
            chainIntegrity,
            timestamp: Date.now()
        };
    }
    createSnapshot() {
        const records = Array.from(this.records.values());
        const hashes = records.map(r => r.contentHash);
        return {
            timestamp: Date.now(),
            blockHeight: records.length > 0 ? Math.max(...records.map(r => r.blockHeight)) : 0,
            recordCount: records.length,
            merkleRoot: crypto_1.CryptoUtils.generateMerkleRoot(hashes),
            records
        };
    }
    getRecords() {
        return Array.from(this.records.values()).sort((a, b) => a.timestamp - b.timestamp);
    }
    searchRecords(query) {
        return this.getRecords().filter(record => record.originalContent.toLowerCase().includes(query.toLowerCase()) ||
            record.author.toLowerCase().includes(query.toLowerCase()) ||
            record.id.includes(query));
    }
    async getCurrentBlockHeight() {
        try {
            const ledgerInfo = await this.client.getLedgerInfo();
            return parseInt(ledgerInfo.block_height);
        }
        catch {
            return Math.floor(Date.now() / 1000); // Fallback timestamp
        }
    }
    async submitToBlockchain(record) {
        if (!this.account)
            throw new Error('No account configured');
        const payload = {
            type: "entry_function_payload",
            function: "0x1::aptos_account::transfer",
            arguments: [this.account.address().hex(), "1"],
            type_arguments: ["0x1::aptos_coin::AptosCoin"]
        };
        const txnRequest = await this.client.generateTransaction(this.account.address(), payload);
        const signedTxn = await this.client.signTransaction(this.account, txnRequest);
        const transactionRes = await this.client.submitTransaction(signedTxn);
        await this.client.waitForTransaction(transactionRes.hash);
        return transactionRes.hash;
    }
    verifyChainIntegrity(record) {
        if (!record.previousHash)
            return true; // Genesis record
        const recordIndex = this.hashChain.findIndex(hash => crypto_1.CryptoUtils.verifyHashChain(hash, record.previousHash, record.signature));
        return recordIndex !== -1;
    }
}
exports.ImmutableLedger = ImmutableLedger;
//# sourceMappingURL=ledger.js.map