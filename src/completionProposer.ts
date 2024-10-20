"use strict";

import * as vscode from 'vscode';
import * as path from 'path';
import { FilePaths, GlobalLabels, Labels, Variabels, Instructions, URIS, GetSymbolsFrom } from './GlobalVariabels';

export class ASMCompletionProposer implements vscode.CompletionItemProvider {
    instructionItems: vscode.CompletionItem[];
    output: vscode.CompletionItem[] = [];

    constructor() {
        this.instructionItems = [];

        vscode.workspace.findFiles("**/*.{acl}", null, undefined).then((files) => {
            files.forEach((fileURI) => {
                URIS.add(fileURI);
                const textDocuments = vscode.workspace.textDocuments;

                for (let index = 0; index < textDocuments.length; index++) {
                    const element: vscode.TextDocument = textDocuments[index];
                    if (element.languageId !== "acl") return;
                    if (FilePaths.includes(element)) {
                        return
                    }
                    else if (element.uri.path === fileURI.path) {
                        if (!FilePaths.includes(element)) {
                            FilePaths.push(element);
                        }
                    }
                }
            });
        });

        const watcher = vscode.workspace.createFileSystemWatcher("**/*.{acl}");
        watcher.onDidCreate((uri) => {
            URIS.add(uri);
            vscode.workspace.textDocuments.forEach(document => {
                if (document.languageId !== "acl") return;
                if (FilePaths.includes(document)) {
                    return
                }
                else if (document.uri == uri) {
                    if (!FilePaths.includes(document)) {
                        FilePaths.push(document);
                    }
                }
            });
        });

        watcher.onDidDelete((uri) => {
            URIS.delete(uri);
            let TempFilePaths = FilePaths;
            for (let index = 0; index < FilePaths.length; index++) {
                FilePaths.pop();
            }
            TempFilePaths.forEach(document => {
                if (document.uri === uri) {
                    for (let index = 0; index < TempFilePaths.length; index++) {
                        const element = TempFilePaths[index];
                        if (TempFilePaths[index].uri !== uri) {
                            FilePaths.push(element);
                        }
                    }
                }
            });
        });
    }

    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        this.output = []

        GetSymbolsFrom(document, true);

        const Line: string = document.lineAt(position.line).text;
        const CurrentLine: string = Line.trim();

        const firstchar: string = CurrentLine[0];
        let currentchar: string = Line[position.character - 1];
        let Lastchar: string = Line[position.character - 2];

        // Split the line into sections using spaces
        const sections: string[] = CurrentLine.split(/\s+/);

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
            this.NewItem(".local", vscode.CompletionItemKind.Field, "this will set a label to be local", "local");

            this.NewItem(".ENDM", vscode.CompletionItemKind.Field, "the end of a marco", "ENDM");
            this.NewItem(".endstruct", vscode.CompletionItemKind.Field, "the end of a struct", "endstruct");
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
            if (sections[0].toUpperCase() == "MOV") {
                this.NewItem("A CR0", vscode.CompletionItemKind.Field, "mov CR0 to A", "A,\tCR0");
                this.NewItem("CR0 A", vscode.CompletionItemKind.Field, "mov A to CR0", "CR0,\tA");
            }
            else if (sections[0].toUpperCase() == "SEZ") {
                this.NewItem("AX", vscode.CompletionItemKind.Field, "set AX to 0", "AX");
                this.NewItem("A", vscode.CompletionItemKind.Field, "set A to 0", "A");
            }
            else
            {
                this.CodeCompletionRegister(currentchar.toUpperCase());
            }

        }
        else {
            this.NewItem("AX", vscode.CompletionItemKind.Field, "32 bit register", "AX");
            this.NewItem("BX", vscode.CompletionItemKind.Field, "32 bit register", "BX");
            this.NewItem("CX", vscode.CompletionItemKind.Field, "32 bit register", "CX");
            this.NewItem("DX", vscode.CompletionItemKind.Field, "32 bit register", "DX");
            this.NewItem("[HL]", vscode.CompletionItemKind.Field, "32 bit register addressed", "[HL]");
        }

        return this.output;
    }

    NewItem(triggerCharacter: string, triggerKind: vscode.CompletionItemKind, detail = "", insertText = "") {
        let BufferItem = new vscode.CompletionItem(triggerCharacter, triggerKind);
        let MarkDownText = new vscode.MarkdownString(detail);
        MarkDownText.supportHtml = true;
        BufferItem.documentation = MarkDownText;
        BufferItem.insertText = insertText;
        this.output.push(BufferItem);
    }

    CodeCompletionLabels() {
        this.NewItem("DS:B", vscode.CompletionItemKind.Field, "use the DS segment register with B", "DS:B")
        this.NewItem("ES:B", vscode.CompletionItemKind.Field, "use the DS segment register with B", "ES:B")
        for (let index = 0; index < Labels.length; index++) {
            const element = Labels[index];
            this.NewItem(element.name, vscode.CompletionItemKind.Field, "", element.name);
        }
    }

    CodeCompletionRegister(CurrentLine: string) {
        if (CurrentLine.startsWith("A")) {
            this.NewItem("AX", vscode.CompletionItemKind.Field, "32 bit register", "AX");
            this.NewItem("AL", vscode.CompletionItemKind.Field, "the low 8 bits part of AX", "AL");
            this.NewItem("AH", vscode.CompletionItemKind.Field, "the high 8 bits part of AX", "AH");
        }
        else if (CurrentLine.startsWith("B")) {
            this.NewItem("BP", vscode.CompletionItemKind.Field, "base pointer", "BP");
            this.NewItem("BPX", vscode.CompletionItemKind.Field, "base pointer", "BPX");
            this.NewItem("BX", vscode.CompletionItemKind.Field, "32 bit register", "BX");
            this.NewItem("BL", vscode.CompletionItemKind.Field, "the low 8 bits part of BX", "BL");
            this.NewItem("BH", vscode.CompletionItemKind.Field, "the high 8 bits part of BX", "BH");
        }
        else if (CurrentLine.startsWith("C")) {
            this.NewItem("CX", vscode.CompletionItemKind.Field, "32 bit register", "CX");
            this.NewItem("CL", vscode.CompletionItemKind.Field, "the low 8 bits part of CX", "CL");
            this.NewItem("CH", vscode.CompletionItemKind.Field, "the high 8 bits part of CX", "CH");
        }
        else if (CurrentLine.startsWith("D")) {
            this.NewItem("DS", vscode.CompletionItemKind.Field, "16 bit segment data register", "DS");
            this.NewItem("DX", vscode.CompletionItemKind.Field, "32 bit register", "DX");
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

    CodeCompletionInstructions(CurrentLine: string) {
        for (let index = 0; index < Instructions.length; index++) {
            const element = Instructions[index];
            if (element[0].toUpperCase().includes(CurrentLine[0].toUpperCase())) {
                this.NewItem(Instructions[index], vscode.CompletionItemKind.Keyword, "", element.padEnd(6, ' '));
            }
        }
    }
}