
import * as vscode from 'vscode';
import * as GlobalVar from './GlobalVariabels';

import * as fs from 'node:fs';

const hoverRegex = /(0x[\da-fA-F][_\da-fA-F]*)|(0b[01][_01]*)|(\d[_\d]*(\.\d+)?)|(\.?[A-Za-z_]\w*(\\@|:*))/g;
const InstructionRegex = /^[\\s]*[A-Z][A-Z]*/

export class ASMHoverProvider implements vscode.HoverProvider {

  constructor() {

  }

  provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
    let WordRange = document.getWordRangeAtPosition(position, undefined);
    fs.readFile(GlobalVar.InstructionTooltipFilePath, 'utf-8', (err, data) => {
      if (err) {
        console.error("Error reading file: ", GlobalVar.InstructionTooltipFilePath);
        return null;
      }

      let tooltipContent = new vscode.MarkdownString("");
      const InstructionText = data.split(GlobalVar.NewLine);
      const word = document.getText(WordRange);

      for (let i = 0; i < InstructionText.length; i++) {
        const line = InstructionText[i].split(":")[0].trimEnd();
        if (line === word.toUpperCase()) {
          tooltipContent.value = InstructionText[i].trimStart();
          tooltipContent.supportHtml = true;
          break;
        }
      }

      return new vscode.Hover(tooltipContent);
    });
    return null;
  }
}
