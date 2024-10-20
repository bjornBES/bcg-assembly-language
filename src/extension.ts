import * as vscode from 'vscode';
import { ASMHoverProvider } from './hover';
import { ASMCompletionProposer } from './completionProposer';
import { ASMSyntaxHighlighting, legend } from './SyntaxHighlighting'
import { ASMDocumentSymbolProvider } from './SymbolProvider'
import * as GlobalShit from './GlobalVariabels';
import path from 'node:path';
import * as glob from 'glob';

const selector = { language: 'acl', scheme: 'file' };

export function activate(context: vscode.ExtensionContext) {

    GlobalShit.GetInstructions();
    GlobalShit.GetRegister();

    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(document => {
        if (document.languageId !== "acl") return;
        if (GlobalShit.FilePaths.includes(document)) return;
        GlobalShit.URIS.forEach(uri => {
            if (document.uri.path == uri.path) {
                //vscode.window.showInformationMessage("Adding " + document.fileName);
                GlobalShit.FilePaths.push(document);
            }
        });
    }))
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(event => {
        const document = event.document;
        GlobalShit.GetSymbolsFrom(document, false);
    }));

    context.subscriptions.push(vscode.languages.registerHoverProvider(selector, new ASMHoverProvider()));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(selector, new ASMCompletionProposer(), "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toLowerCase(), ".", "[", "&"))
    //context.subscriptions.push(vscode.languages.registerDocumentSemanticTokensProvider(selector, new ASMSyntaxHighlighting(), legend));
    //context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(selector, new ASMDocumentSymbolProvider()));

}

export function deactivate() {
}