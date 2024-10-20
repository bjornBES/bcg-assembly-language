import * as vscode from 'vscode';
import * as fs from 'node:fs';

let basePath = "C:/Users/bjorn/Desktop/VideoProjects/GamingCPU_Project/languages/assembly/bcg-assembly-language"
export let InstructionTooltipFilePath = basePath + "/files/Tooltips.md";
export let RegisterTooltipFilePath = basePath + "/files/TooltipsRegister.md";

export let Variabels: string[] = [];
export let Labels: Label[] = [];
export let GlobalLabels: string[] = [];

export let NewLine = vscode.window.activeTextEditor?.document.eol === vscode.EndOfLine.LF ? "\n" : "\r\n";

export let FilePaths: vscode.TextDocument[] = []
export let URIS: Set<vscode.Uri> = new Set<vscode.Uri>();

export function GetSymbols() {
    Variabels = [];
    Labels = [];
    GlobalLabels = [];
    for (let docIndex = 0; docIndex < FilePaths.length; docIndex++) {
        const doc = FilePaths[docIndex];
        GetSymbolsFrom(doc, false);
    }
}

export function GetSymbolsFrom(document: vscode.TextDocument, emptyOut: boolean) {
    if (emptyOut == true) {
        Variabels = [];
        Labels = [];
        GlobalLabels = [];
    }
    for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i).text.replace(/[\s]*\;.+/, "").replace(/[\s]+/, " ");

        if (line.includes(":")) {
            let element = line.replace(":", "");

            let columnumber = document.lineAt(i).text.indexOf(element);

            Labels.push(new Label(i, columnumber, element, document, document.lineAt(i).text));
        }
    }
}

export function GetSymbol(name: string, document: vscode.TextDocument): vscode.DocumentSymbol | undefined {
    let symbol: any = undefined;

    GetSymbolsFrom(document, false);

    for (let index = 0; index < Labels.length; index++) {
        const element = Labels[index];
        if (element.name == name) {
            symbol = element;
            break;
        }
    }

    if (symbol == null) {
        return undefined;
    }

    let range = new vscode.Range(symbol.linenumber, symbol.columnumber, symbol.linenumber, symbol.columnumber + symbol.name.length)
    let selectionRange = new vscode.Range(symbol.linenumber, symbol.columnumber, symbol.linenumber, symbol.columnumber + symbol.line.length - 1)
    let result = new vscode.DocumentSymbol(name, "", vscode.SymbolKind.Function, range, selectionRange);

    return result;
}

export function GetDocumentSymbol(document: vscode.TextDocument): vscode.SymbolInformation[] {
    let result: vscode.SymbolInformation[] = [];

    GetSymbolsFrom(document, false);

    for (let index = 0; index < Labels.length; index++) {
        const element = Labels[index];

        let range = new vscode.Range(element.linenumber, element.columnumber, element.linenumber, element.columnumber + element.name.length)
        let selectionRange = new vscode.Range(element.linenumber, element.columnumber, element.linenumber, element.columnumber + element.line.length - 1)
        result.push(new vscode.SymbolInformation(element.name, vscode.SymbolKind.Function, range, document.uri));
    }

    return result;
}

export class Label {
    linenumber: number;
    columnumber: number;
    name: string;
    file: vscode.TextDocument;
    line : string;

    constructor(linenum: number, columnum: number, _name: string, _file: vscode.TextDocument, line : string) {
        this.linenumber = linenum;
        this.columnumber = columnum;
        this.file = _file;
        this.name = _name;
        this.line = line;
    }
}

export let Instructions: string[] = [""];

export let Registers: string[] = [""];

export function GetInstructions() {
    fs.readFile(InstructionTooltipFilePath, 'utf-8', (err, data) => {
        vscode.window.showInformationMessage("Inside fs.readFile callback for GetInstructions");
        if (err) {
            vscode.window.showErrorMessage("Error reading file: ", InstructionTooltipFilePath);
            return null;
        }

        Instructions.length = 0; // Clear Instructions array

        const InstructionText = data.split(/\r?\n/);
        for (let i = 0; i < InstructionText.length; i++) {
            const line = InstructionText[i].split(":")[0].trimEnd();
            Instructions.push(line);
        }
    });
}

export function GetRegister() {
    fs.readFile(RegisterTooltipFilePath, 'utf-8', (err, data) => {
        vscode.window.showInformationMessage("Inside fs.readFile callback for GetRegister");
        if (err) {
            vscode.window.showErrorMessage("Error reading file: ", RegisterTooltipFilePath);
            return null;
        }

        Registers.length = 0; // Clear Registers array

        const RegisterText = data.split(/\r?\n/);
        for (let i = 0; i < RegisterText.length; i++) {
            const line = RegisterText[i].split(":")[0].trimEnd();
            Registers.push(line);
        }
    });
}

