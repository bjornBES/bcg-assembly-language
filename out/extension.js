"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const hover_1 = require("./hover");
const completionProposer_1 = require("./completionProposer");
const GlobalShit = __importStar(require("./GlobalVariabels"));
const selector = { language: 'acl', scheme: 'file' };
function activate(context) {
    GlobalShit.GetInstructions();
    GlobalShit.GetRegister();
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(document => {
        if (document.languageId !== "acl")
            return;
        if (GlobalShit.FilePaths.includes(document))
            return;
        GlobalShit.URIS.forEach(uri => {
            if (document.uri.path == uri.path) {
                //vscode.window.showInformationMessage("Adding " + document.fileName);
                GlobalShit.FilePaths.push(document);
            }
        });
    }));
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(event => {
        const document = event.document;
        GlobalShit.GetSymbolsFrom(document, false);
    }));
    context.subscriptions.push(vscode.languages.registerHoverProvider(selector, new hover_1.ASMHoverProvider()));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(selector, new completionProposer_1.ASMCompletionProposer(), "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toLowerCase(), ".", "[", "&"));
    //context.subscriptions.push(vscode.languages.registerDocumentSemanticTokensProvider(selector, new ASMSyntaxHighlighting(), legend));
    //context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(selector, new ASMDocumentSymbolProvider()));
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
