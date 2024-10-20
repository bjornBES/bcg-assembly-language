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
exports.GetRegister = exports.GetInstructions = exports.Registers = exports.Instructions = exports.Label = exports.GetDocumentSymbol = exports.GetSymbol = exports.GetSymbolsFrom = exports.GetSymbols = exports.URIS = exports.FilePaths = exports.NewLine = exports.GlobalLabels = exports.Labels = exports.Variabels = exports.RegisterTooltipFilePath = exports.InstructionTooltipFilePath = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("node:fs"));
let basePath = "C:/Users/bjorn/Desktop/VideoProjects/GamingCPU_Project/languages/assembly/bcg-assembly-language";
exports.InstructionTooltipFilePath = basePath + "/files/Tooltips.md";
exports.RegisterTooltipFilePath = basePath + "/files/TooltipsRegister.md";
exports.Variabels = [];
exports.Labels = [];
exports.GlobalLabels = [];
exports.NewLine = vscode.window.activeTextEditor?.document.eol === vscode.EndOfLine.LF ? "\n" : "\r\n";
exports.FilePaths = [];
exports.URIS = new Set();
function GetSymbols() {
    exports.Variabels = [];
    exports.Labels = [];
    exports.GlobalLabels = [];
    for (let docIndex = 0; docIndex < exports.FilePaths.length; docIndex++) {
        const doc = exports.FilePaths[docIndex];
        GetSymbolsFrom(doc, false);
    }
}
exports.GetSymbols = GetSymbols;
function GetSymbolsFrom(document, emptyOut) {
    if (emptyOut == true) {
        exports.Variabels = [];
        exports.Labels = [];
        exports.GlobalLabels = [];
    }
    for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i).text.replace(/[\s]*\;.+/, "").replace(/[\s]+/, " ");
        if (line.includes(":")) {
            let element = line.replace(":", "");
            let columnumber = document.lineAt(i).text.indexOf(element);
            exports.Labels.push(new Label(i, columnumber, element, document, document.lineAt(i).text));
        }
    }
}
exports.GetSymbolsFrom = GetSymbolsFrom;
function GetSymbol(name, document) {
    let symbol = undefined;
    GetSymbolsFrom(document, false);
    for (let index = 0; index < exports.Labels.length; index++) {
        const element = exports.Labels[index];
        if (element.name == name) {
            symbol = element;
            break;
        }
    }
    if (symbol == null) {
        return undefined;
    }
    let range = new vscode.Range(symbol.linenumber, symbol.columnumber, symbol.linenumber, symbol.columnumber + symbol.name.length);
    let selectionRange = new vscode.Range(symbol.linenumber, symbol.columnumber, symbol.linenumber, symbol.columnumber + symbol.line.length - 1);
    let result = new vscode.DocumentSymbol(name, "", vscode.SymbolKind.Function, range, selectionRange);
    return result;
}
exports.GetSymbol = GetSymbol;
function GetDocumentSymbol(document) {
    let result = [];
    GetSymbolsFrom(document, false);
    for (let index = 0; index < exports.Labels.length; index++) {
        const element = exports.Labels[index];
        let range = new vscode.Range(element.linenumber, element.columnumber, element.linenumber, element.columnumber + element.name.length);
        let selectionRange = new vscode.Range(element.linenumber, element.columnumber, element.linenumber, element.columnumber + element.line.length - 1);
        result.push(new vscode.SymbolInformation(element.name, vscode.SymbolKind.Function, range, document.uri));
    }
    return result;
}
exports.GetDocumentSymbol = GetDocumentSymbol;
class Label {
    constructor(linenum, columnum, _name, _file, line) {
        this.linenumber = linenum;
        this.columnumber = columnum;
        this.file = _file;
        this.name = _name;
        this.line = line;
    }
}
exports.Label = Label;
exports.Instructions = [""];
exports.Registers = [""];
function GetInstructions() {
    fs.readFile(exports.InstructionTooltipFilePath, 'utf-8', (err, data) => {
        vscode.window.showInformationMessage("Inside fs.readFile callback for GetInstructions");
        if (err) {
            vscode.window.showErrorMessage("Error reading file: ", exports.InstructionTooltipFilePath);
            return null;
        }
        exports.Instructions.length = 0; // Clear Instructions array
        const InstructionText = data.split(/\r?\n/);
        for (let i = 0; i < InstructionText.length; i++) {
            const line = InstructionText[i].split(":")[0].trimEnd();
            exports.Instructions.push(line);
        }
    });
}
exports.GetInstructions = GetInstructions;
function GetRegister() {
    fs.readFile(exports.RegisterTooltipFilePath, 'utf-8', (err, data) => {
        vscode.window.showInformationMessage("Inside fs.readFile callback for GetRegister");
        if (err) {
            vscode.window.showErrorMessage("Error reading file: ", exports.RegisterTooltipFilePath);
            return null;
        }
        exports.Registers.length = 0; // Clear Registers array
        const RegisterText = data.split(/\r?\n/);
        for (let i = 0; i < RegisterText.length; i++) {
            const line = RegisterText[i].split(":")[0].trimEnd();
            exports.Registers.push(line);
        }
    });
}
exports.GetRegister = GetRegister;
