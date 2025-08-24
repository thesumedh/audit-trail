"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SDK_VERSION = exports.CryptoUtils = exports.ImmutableLedger = void 0;
exports.createLedger = createLedger;
var ledger_1 = require("./core/ledger");
Object.defineProperty(exports, "ImmutableLedger", { enumerable: true, get: function () { return ledger_1.ImmutableLedger; } });
var crypto_1 = require("./utils/crypto");
Object.defineProperty(exports, "CryptoUtils", { enumerable: true, get: function () { return crypto_1.CryptoUtils; } });
__exportStar(require("./types"), exports);
const ledger_2 = require("./core/ledger");
// SDK Version
exports.SDK_VERSION = '1.0.0';
// Quick start helper
function createLedger(aptosRpcUrl = 'https://fullnode.testnet.aptoslabs.com/v1') {
    return new ledger_2.ImmutableLedger({ aptosClient: aptosRpcUrl });
}
//# sourceMappingURL=index.js.map