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
exports.ASMCompletionProposer = void 0;
const vscode = __importStar(require("vscode"));
const GlobalVariabels_1 = require("./GlobalVariabels");
class ASMCompletionProposer {
    constructor() {
        this.output = [];
        this.instructionItems = [];
        vscode.workspace.findFiles("**/*.{acl}", null, undefined).then((files) => {
            files.forEach((fileURI) => {
                GlobalVariabels_1.URIS.add(fileURI);
                const textDocuments = vscode.workspace.textDocuments;
                for (let index = 0; index < textDocuments.length; index++) {
                    const element = textDocuments[index];
                    if (element.languageId !== "acl")
                        return;
                    if (GlobalVariabels_1.FilePaths.includes(element)) {
                        return;
                    }
                    else if (element.uri.path === fileURI.path) {
                        if (!GlobalVariabels_1.FilePaths.includes(element)) {
                            GlobalVariabels_1.FilePaths.push(element);
                        }
                    }
                }
            });
        });
        const watcher = vscode.workspace.createFileSystemWatcher("**/*.{acl}");
        watcher.onDidCreate((uri) => {
            GlobalVariabels_1.URIS.add(uri);
            vscode.workspace.textDocuments.forEach(document => {
                if (document.languageId !== "acl")
                    return;
                if (GlobalVariabels_1.FilePaths.includes(document)) {
                    return;
                }
                else if (document.uri == uri) {
                    if (!GlobalVariabels_1.FilePaths.includes(document)) {
                        GlobalVariabels_1.FilePaths.push(document);
                    }
                }
            });
        });
        watcher.onDidDelete((uri) => {
            GlobalVariabels_1.URIS.delete(uri);
            let TempFilePaths = GlobalVariabels_1.FilePaths;
            for (let index = 0; index < GlobalVariabels_1.FilePaths.length; index++) {
                GlobalVariabels_1.FilePaths.pop();
            }
            TempFilePaths.forEach(document => {
                if (document.uri === uri) {
                    for (let index = 0; index < TempFilePaths.length; index++) {
                        const element = TempFilePaths[index];
                        if (TempFilePaths[index].uri !== uri) {
                            GlobalVariabels_1.FilePaths.push(element);
                        }
                    }
                }
            });
        });
    }
    provideCompletionItems(document, position, token, context) {
        this.output = [];
        GlobalVariabels_1.GetSymbolsFrom(document, true);
        const Line = document.lineAt(position.line).text;
        const CurrentLine = Line.trim();
        const firstchar = CurrentLine[0];
        let currentchar = Line[position.character - 1];
        let Lastchar = Line[position.character - 2];
        // Split the line into sections using spaces
        const sections = CurrentLine.split(/\s+/);
        const triggerCharacter = context.triggerCharacter;
        if (firstchar == '.' && currentchar != ' ' && CurrentLine.length < 2) {
            // define storage small
            this.NewItem('.db', vscode.CompletionItemKind.Field, "this will define a byte in memory", "db");
            this.NewItem('.dw', vscode.CompletionItemKind.Field, "this will define a word (2 bytes) in memory", "dw");
            this.NewItem('.dt', vscode.CompletionItemKind.Field, "this will define a tbyte (3 bytes) in memory", "dt");
            this.NewItem('.dd', vscode.CompletionItemKind.Field, "this will define a dword (4 bytes) in memory", "dd");
            // define storage
            this.NewItem('.byte', vscode.CompletionItemKind.Field, "this will define a byte in memory", "db");
            this.NewItem('.word', vscode.CompletionItemKind.Field, "this will define a word (2 bytes) in memory", "dw");
            this.NewItem('.tbyte', vscode.CompletionItemKind.Field, "this will define a tbyte (3 bytes) in memory", "dt");
            this.NewItem('.dword', vscode.CompletionItemKind.Field, "this will define a dword (4 bytes) in memory", "dd");
            this.NewItem(".org", vscode.CompletionItemKind.Field, "this set the origin to what ever is specified", "org");
            this.NewItem(".string", vscode.CompletionItemKind.Field, "", "string");
            this.NewItem(".str", vscode.CompletionItemKind.Field, "", "str");
            this.NewItem(".include", vscode.CompletionItemKind.Field, "this will include a file into the file list", "include");
            this.NewItem(".includeil", vscode.CompletionItemKind.Field, "this will include a file in line", "includeil");
            this.NewItem(".global", vscode.CompletionItemKind.Field, "this will set a label to be global", "global");
            this.NewItem(".ENDM", vscode.CompletionItemKind.Field, "the end of a marco", "ENDM");
            this.NewItem(".end struct", vscode.CompletionItemKind.Field, "the end of a struct", "end struct");
        }
        else if (triggerCharacter === '[') {
            this.CodeCompletionLabels();
        }
        else if (triggerCharacter === '&') {
            this.CodeCompletionLabels();
        }
        else if (sections.length <= 1) {
            this.CodeCompletionInstructions(CurrentLine);
        }
        else if (sections.length >= 1) {
            this.CodeCompletionRegister(currentchar.toUpperCase());
        }
        else {
            this.NewItem("AX", vscode.CompletionItemKind.Field, "23 bit register", "AX");
            this.NewItem("BX", vscode.CompletionItemKind.Field, "23 bit register", "BX");
            this.NewItem("CX", vscode.CompletionItemKind.Field, "23 bit register", "CX");
            this.NewItem("DX", vscode.CompletionItemKind.Field, "23 bit register", "DX");
            this.NewItem("[HL]", vscode.CompletionItemKind.Field, "32 bit register addressed", "[HL]");
        }
        return this.output;
    }
    NewItem(triggerCharacter, triggerKind, detail = "", insertText = "") {
        let BufferItem = new vscode.CompletionItem(triggerCharacter, triggerKind);
        let MarkDownText = new vscode.MarkdownString(detail);
        MarkDownText.supportHtml = true;
        BufferItem.documentation = MarkDownText;
        BufferItem.insertText = insertText;
        this.output.push(BufferItem);
    }
    CodeCompletionLabels() {
        for (let index = 0; index < GlobalVariabels_1.Labels.length; index++) {
            const element = GlobalVariabels_1.Labels[index];
            this.NewItem(element.name, vscode.CompletionItemKind.Field, "", element.name);
        }
        for (let index = 0; index < GlobalVariabels_1.Variabels.length; index++) {
            const element = GlobalVariabels_1.Variabels[index];
            this.NewItem(element, vscode.CompletionItemKind.Field, "", element);
        }
        for (let index = 0; index < GlobalVariabels_1.GlobalLabels.length; index++) {
            const element = GlobalVariabels_1.GlobalLabels[index];
            this.NewItem(element, vscode.CompletionItemKind.Field, "", element);
        }
    }
    CodeCompletionRegister(CurrentLine) {
        if (CurrentLine.startsWith("A")) {
            this.NewItem("AX", vscode.CompletionItemKind.Field, "16 bit register", "AX");
            this.NewItem("AL", vscode.CompletionItemKind.Field, "the low 8 bits part of AX", "AL");
            this.NewItem("AH", vscode.CompletionItemKind.Field, "the high 8 bits part of AX", "AH");
        }
        else if (CurrentLine.startsWith("B")) {
            this.NewItem("BP", vscode.CompletionItemKind.Field, "base pointer", "BP");
            this.NewItem("BPX", vscode.CompletionItemKind.Field, "base pointer", "BPX");
            this.NewItem("BX", vscode.CompletionItemKind.Field, "16 bit register", "BX");
            this.NewItem("BL", vscode.CompletionItemKind.Field, "the low 8 bits part of BX", "BL");
            this.NewItem("BH", vscode.CompletionItemKind.Field, "the high 8 bits part of BX", "BH");
        }
        else if (CurrentLine.startsWith("C")) {
            this.NewItem("CX", vscode.CompletionItemKind.Field, "16 bit register", "CX");
            this.NewItem("CL", vscode.CompletionItemKind.Field, "the low 8 bits part of CX", "CL");
            this.NewItem("CH", vscode.CompletionItemKind.Field, "the high 8 bits part of CX", "CH");
        }
        else if (CurrentLine.startsWith("D")) {
            this.NewItem("DS", vscode.CompletionItemKind.Field, "16 bit segment data register", "DS");
            this.NewItem("DX", vscode.CompletionItemKind.Field, "16 bit register", "DX");
            this.NewItem("DL", vscode.CompletionItemKind.Field, "the low 8 bits part of DX", "DL");
            this.NewItem("DH", vscode.CompletionItemKind.Field, "the high 8 bits part of DX", "DH");
        }
        else if (CurrentLine.startsWith("F")) {
            this.NewItem("FA", vscode.CompletionItemKind.Field, "32 bit float register", "FA");
            this.NewItem("FB", vscode.CompletionItemKind.Field, "32 bit float register", "FB");
            this.NewItem("FC", vscode.CompletionItemKind.Field, "32 bit float register", "FC");
            this.NewItem("FD", vscode.CompletionItemKind.Field, "32 bit float register", "FD");
            this.NewItem("F", vscode.CompletionItemKind.Field, "flags", "F");
        }
        else if (CurrentLine.startsWith("H")) {
            this.NewItem("HL", vscode.CompletionItemKind.Field, "32 bit register", "HL");
            this.NewItem("H", vscode.CompletionItemKind.Field, "the high 16 bits part of HL", "H");
        }
        else if (CurrentLine.startsWith("I")) {
        }
        else if (CurrentLine.startsWith("L")) {
            this.NewItem("L", vscode.CompletionItemKind.Field, "the low 16 bits part of HL", "L");
        }
        else if (CurrentLine.startsWith("M")) {
        }
        else if (CurrentLine.startsWith("P")) {
            this.NewItem("PC", vscode.CompletionItemKind.Field, "program Counter", "PC");
        }
        else if (CurrentLine.startsWith("R")) {
            this.NewItem("R1", vscode.CompletionItemKind.Field, "16 bit register", "R1");
            this.NewItem("R2", vscode.CompletionItemKind.Field, "16 bit register", "R2");
            this.NewItem("R3", vscode.CompletionItemKind.Field, "16 bit register", "R3");
            this.NewItem("R4", vscode.CompletionItemKind.Field, "16 bit register", "R4");
        }
        else if (CurrentLine.startsWith("S")) {
            this.NewItem("SS", vscode.CompletionItemKind.Field, "16 bit stack segment register", "SS");
            this.NewItem("SP", vscode.CompletionItemKind.Field, "stack pointer", "SP");
            this.NewItem("SPX", vscode.CompletionItemKind.Field, "stack pointer", "SPX");
        }
    }
    CodeCompletionInstructions(CurrentLine) {
        for (let index = 0; index < GlobalVariabels_1.Instructions.length; index++) {
            const element = GlobalVariabels_1.Instructions[index];
            if (element[0].toUpperCase().includes(CurrentLine[0].toUpperCase())) {
                this.NewItem(element, vscode.CompletionItemKind.Keyword, "", element.padEnd(6, ' '));
            }
        }
    }
}
exports.ASMCompletionProposer = ASMCompletionProposer;
