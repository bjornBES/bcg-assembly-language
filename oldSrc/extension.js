const vscode = require('vscode');
const hoverFunctions = require('./hoverFunctions.js');
const errorFunction = require('./ErrorFunction.js');
const GlobalVariabels = require('./GlobalVariabels.js');
const fs = require("fs");
const path = require("node:path");

const diagnosticCollection = vscode.languages.createDiagnosticCollection('acl');

function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from your VSCode Extension!');
    });
    context.subscriptions.push(disposable);

    // hover shit
    let hoverDisposable = vscode.languages.registerHoverProvider('acl', {
        provideHover(document, position, token) {
            return hoverFunctions.OnHover(document, position, token);
        }
    });
    context.subscriptions.push(hoverDisposable);

    // error shit
    let errorDisposable = vscode.workspace.onDidChangeTextDocument(event => {
        const document = event.document;
        getVariables(document);
        diagnosticCollection.set(document.uri, errorFunction.ErrorDetection(document))
    });
    context.subscriptions.push(errorDisposable);

    const LSPDisposable = vscode.languages.registerCompletionItemProvider(
        { scheme: 'file', language: 'acl' },
        {
            provideCompletionItems
        },
        '.',
        ',',
        '&',
        ' ',
        '=',
        '%',
        '[',
        "/^[A-Za-z]+$/"
    )
    context.subscriptions.push(LSPDisposable);
}

function provideCompletionItems(document, position, token, context) {
    CompletionItems = [];

    const Line = document.lineAt(position.line).text;
    const CurrentLine = Line.trim();

    let Arguments;
    if (CurrentLine.match(/^\S+\s+(\S.*)$/) !== null) {
        Arguments = CurrentLine.match(/^\S+\s+(\S.*)$/)[1];
    }

    const firstchar = CurrentLine[0];
    let currentchar = Line[position.character - 1];
    let Lastchar = Line[position.character - 2];

    // Split the line into sections using spaces
    const sections = CurrentLine.split(/\s+/);

    let triggerCharacter = context.triggerCharacter;

    // directives
    if (firstchar == '.' && currentchar != ' ' && CurrentLine.length < 2) {
        // define storage
        NewItem('.db', vscode.CompletionItemKind.Field, "this will define a byte in memory", "db");
        NewItem('.dw', vscode.CompletionItemKind.Field, "this will define a word (2 bytes) in memory", "dw");
        NewItem('.dt', vscode.CompletionItemKind.Field, "this will define a tbyte (3 bytes) in memory", "dt");
        NewItem('.dd', vscode.CompletionItemKind.Field, "this will define a dword (4 bytes) in memory", "dd");

        NewItem(".org", vscode.CompletionItemKind.Field, "this set the origin to what ever is specified", "org");

        NewItem(".string", vscode.CompletionItemKind.Field, "", "string");
        NewItem(".str", vscode.CompletionItemKind.Field, "", "str");

        NewItem(".include", vscode.CompletionItemKind.Field, "this will include a file into the file list", "include");
        NewItem(".includeil", vscode.CompletionItemKind.Field, "this will include a file in line", "includeil");

        NewItem(".global", vscode.CompletionItemKind.Field, "this will set a label to be global", "global");

        NewItem(".ENDM", vscode.CompletionItemKind.Field, "the end of a marco", "ENDM");
        NewItem(".end struct", vscode.CompletionItemKind.Field, "the end of a struct", "end struct");
    }
    else if (triggerCharacter == '[') {
        CodeCompletionLabels();
    }
    else if (GlobalVariabels.Instructions.includes(sections[0].toUpperCase())) {
        CodeCompletionRegister(CurrentLine);
    }
    else if (sections.length == 1) {
        CodeCompletionInstructions(CurrentLine);
    }
    else if (triggerCharacter == '&') {

    }

    return CompletionItems;
}

let CompletionItems = [];

/**
 * @param {string} triggerCharacter 
 * @param {vscode.CompletionItemKind} triggerKind 
 * @param {string} detail 
 * @param {string} insertText 
 */
function NewItem(triggerCharacter, triggerKind, detail = "", insertText = "") {
    let BufferItem = new vscode.CompletionItem(triggerCharacter, triggerKind);
    let MarkDownText = new vscode.MarkdownString(detail);
    MarkDownText.supportHtml = true;
    BufferItem.documentation = MarkDownText;
    BufferItem.insertText = insertText;
    CompletionItems.push(BufferItem);
}

function CodeCompletionLabels() {
    for (let index = 0; index < Lables.length; index++) {
        const element = Lables[index];
        NewItem(element, vscode.CompletionItemKind.Field, "", element);
    }
    for (let index = 0; index < Variables.length; index++) {
        const element = Variables[index];
        NewItem(element, vscode.CompletionItemKind.Field, "", element);
    }
}

function CodeCompletionRegister(CurrentLine) {
    if (CurrentLine.startsWith("A")) {
        NewItem("AX", vscode.CompletionItemKind.Field, "16 bit register", "AX");
        NewItem("AL", vscode.CompletionItemKind.Field, "the low 8 bits part of AX", "AL");
        NewItem("AH", vscode.CompletionItemKind.Field, "the high 8 bits part of AX", "AH");
    }
    else if (CurrentLine.startsWith("B")) {
        NewItem("BP", vscode.CompletionItemKind.Field, "base pointer", "BP");
        NewItem("BX", vscode.CompletionItemKind.Field, "16 bit register", "BX");
        NewItem("BL", vscode.CompletionItemKind.Field, "the low 8 bits part of BX", "BL");
        NewItem("BH", vscode.CompletionItemKind.Field, "the high 8 bits part of BX", "BH");
    }
    else if (CurrentLine.startsWith("C")) {
        NewItem("CX", vscode.CompletionItemKind.Field, "16 bit register", "CX");
        NewItem("CL", vscode.CompletionItemKind.Field, "the low 8 bits part of CX", "CL");
        NewItem("CH", vscode.CompletionItemKind.Field, "the high 8 bits part of CX", "CH");
    }
    else if (CurrentLine.startsWith("D")) {
        NewItem("DS", vscode.CompletionItemKind.Field, "16 bit segment data register", "DS");
        NewItem("DX", vscode.CompletionItemKind.Field, "16 bit register", "DX");
        NewItem("DL", vscode.CompletionItemKind.Field, "the low 8 bits part of DX", "DL");
        NewItem("DH", vscode.CompletionItemKind.Field, "the high 8 bits part of DX", "DH");
    }
    else if (CurrentLine.startsWith("F")) {
        NewItem("FA", vscode.CompletionItemKind.Field, "32 bit float register", "FA");
        NewItem("FB", vscode.CompletionItemKind.Field, "32 bit float register", "FB");
        NewItem("F1", vscode.CompletionItemKind.Field, "32 bit float register", "F1");
        NewItem("F2", vscode.CompletionItemKind.Field, "32 bit float register", "F2");
        NewItem("F3", vscode.CompletionItemKind.Field, "32 bit float register", "F3");
        NewItem("F4", vscode.CompletionItemKind.Field, "32 bit float register", "F4");
        NewItem("FDS", vscode.CompletionItemKind.Field, "16 bit segment file register", "FDS");
        NewItem("F", vscode.CompletionItemKind.Field, "flags", "F");
    }
    else if (CurrentLine.startsWith("H")) {
        NewItem("HL", vscode.CompletionItemKind.Field, "32 bit register", "HL");
        NewItem("H", vscode.CompletionItemKind.Field, "the high 16 bits part of HL", "H");
    }
    else if (CurrentLine.startsWith("I")) {
        NewItem("IL", vscode.CompletionItemKind.Field, "8 bit interrupt location register", "IR");
    }
    else if (CurrentLine.startsWith("L")) {
        NewItem("L", vscode.CompletionItemKind.Field, "the low 16 bits part of HL", "L");
    }
    else if (CurrentLine.startsWith("M")) {
        NewItem("MB", vscode.CompletionItemKind.Field, "4 bit memory bank", "MB");
    }
    else if (CurrentLine.startsWith("P")) {
        NewItem("PC", vscode.CompletionItemKind.Field, "program Counter", "PC");
        NewItem("PCL", vscode.CompletionItemKind.Field, "the low 16 bits part of PC", "PCL");
        NewItem("PCH", vscode.CompletionItemKind.Field, "the high 16 bits part of PC", "PCH");
    }
    else if (CurrentLine.startsWith("R")) {
        NewItem("R1", vscode.CompletionItemKind.Field, "16 bit register", "R1");
        NewItem("R2", vscode.CompletionItemKind.Field, "16 bit register", "R2");
        NewItem("R3", vscode.CompletionItemKind.Field, "16 bit register", "R3");
        NewItem("R4", vscode.CompletionItemKind.Field, "16 bit register", "R4");
    }
    else if (CurrentLine.startsWith("S")) {
        NewItem("S", vscode.CompletionItemKind.Field, "16 bit segment register", "S");
        NewItem("SP", vscode.CompletionItemKind.Field, "stack pointer", "SP");
    }
}

function CodeCompletionInstructions(CurrentLine) {
    for (let index = 0; index < GlobalVariabels.Instructions.length; index++) {
        const element = GlobalVariabels.Instructions[index];
        if (element[0].toUpperCase() === CurrentLine[0].toUpperCase()) {
            NewItem(element, vscode.CompletionItemKind.Keyword, "", element);
        }
    }
}

let Variables = [];
let Lables = [];

function getVariables(document) {
    Variables = [];
    Lables = [];
    for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i).text;
        // $NUMBER_OF_DISKS =      3          ; this is the total number of disks that can be used
        if (line.trim().startsWith('$')) {
            if (Variables.includes(line) === false) {
                Variables.push(line.replace('$', '').split(' ', 2)[0]);
            }
        }
        if (line.trim().endsWith(':')) {
            if (Lables.includes(line.trim()) === false) {
                Lables.push(line.replace(':', '').trimStart());
            }
        }
    }
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
}
