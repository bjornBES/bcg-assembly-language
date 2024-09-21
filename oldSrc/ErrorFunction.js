const vscode = require('vscode');
const GlobalVariabels = require('./GlobalVariabels.js');
const fs = require("fs");
const path = require("node:path");

/**
 * @param {vscode.TextDocument} document
 */
function ErrorDetection(document) {
    let Diagnostic = [];


    for (let i = 0; i < document.lineCount; i++) {
        const element = document.lineAt(i);
        if (element.isEmptyOrWhitespace) continue;
        const line = element.text.trimStart().split(/[\s]*;/)[0].replace(/[\s]*/, ' ');
        let range = new vscode.Range(element.range.start, element.range.end);

        if (line == "") continue;

        if (line.startsWith(".db \"") || line.startsWith(".dw \"") || line.startsWith(".dd \"")) {
            Diagnostic.push(new vscode.Diagnostic(range, "using .string for strings", vscode.DiagnosticSeverity.Warning));
        }

        //Diagnostic.push(new vscode.Diagnostic(range, line, vscode.DiagnosticSeverity.Warning));
    }


    return Diagnostic;
}

module.exports = {
    ErrorDetection
}