"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASMDocumentSymbolProvider = void 0;
const GlobalVariabels_1 = require("./GlobalVariabels");
class ASMDocumentSymbolProvider {
    constructor() {
    }
    provideDocumentSymbols(document, token) {
        let symbols = [];
        symbols = (0, GlobalVariabels_1.GetDocumentSymbol)(document);
        return symbols;
    }
}
exports.ASMDocumentSymbolProvider = ASMDocumentSymbolProvider;
