import * as vscode from 'vscode';
import * as fs from 'node:fs';

let basePath = "C:/Users/bjorn/Desktop/VideoProjects/GamingCPU_Project/languages/assembly/bcg-assembly-language"
export let InstructionTooltipFilePath = basePath + "/files/Tooltips.md";
export let RegisterTooltipFilePath = basePath + "/files/TooltipsRegister.md";

export let Variabels: string[] = [];
export let Labels: string[] = [];
export let GlobalLabels: string[] = [];

export let FilePaths: vscode.TextDocument[] = []
export let URIS: Set<vscode.Uri> = new Set<vscode.Uri>();

export function GetSymbols(document: vscode.TextDocument) {
    Variabels = [];
    Labels = [];
    GlobalLabels = [];
    for (let docIndex = 0; docIndex < FilePaths.length; docIndex++) {
        const doc = FilePaths[docIndex];
        for (let i = 0; i < doc.lineCount; i++) {
            const line = doc.lineAt(i).text.replace(/[\s]*\;\s/, "");
            if (line.trim().startsWith('$') && doc.uri === document.uri) {
                if (Variabels.includes(line) === false) {
                    Variabels.push(line.replace('$', '').split(' ', 2)[0]);
                }
            }
            if (line.trim().endsWith(':') && line.trim().toLowerCase().startsWith(".global")) {
                if (GlobalLabels.includes(line.trim()) === false) {
                    GlobalLabels.push(line.split(' ')[1].replace(":", ""));
                }
            }
            else if (line.trim().endsWith(':') && doc.uri === document.uri) {
                if (Labels.includes(line.trim()) === false) {
                    Labels.push(line.replace(':', '').split(' ')[0].trimStart());
                }
            }
        }
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

