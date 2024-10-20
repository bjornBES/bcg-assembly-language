import * as vscode from 'vscode';
import { GetDocumentSymbol } from './GlobalVariabels'

export class ASMDocumentSymbolProvider implements vscode.DocumentSymbolProvider {

    constructor() {

    }

    provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {
        let symbols: vscode.SymbolInformation[] = [];
        symbols = GetDocumentSymbol(document);
        return symbols;
    }
}