const vscode = require('vscode');
const GlobalVariabels = require('./GlobalVariabels.js');
const fs = require("fs");
const path = require("node:path");

/**
 * @param {vscode.TextDocument} document
 * @param {vscode.Position} position
 * @param {vscode.CancellationToken} token
 */
function OnHover(document, position, token) {

    let WordRange = document.getWordRangeAtPosition(position, undefined);


    return new Promise((resolve, reject) => {

        fs.readFile(GlobalVariabels.InstructionTooltipFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error("Error reading file: ", GlobalVariabels.InstructionTooltipFilePath);
                reject(err);
                return;
            }

            let tooltipContent = new vscode.MarkdownString("");
            const InstructionText = data.split(/\r?\n/);
            const word = document.getText(WordRange);

            for (let i = 0; i < InstructionText.length; i++) {
                const line = InstructionText[i].split(":")[0].trimEnd();
                if (line === word.toUpperCase()) {
                    tooltipContent.value = InstructionText[i].trimStart();
                    tooltipContent.supportHtml = true;
                    break;
                }
            }

            resolve(new vscode.Hover(tooltipContent, WordRange));
        });
    })
}

module.exports = {
    OnHover
}