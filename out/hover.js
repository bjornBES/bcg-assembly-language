"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.ASMHoverProvider = void 0;
const vscode = __importStar(require("vscode"));
const GlobalVar = __importStar(require("./GlobalVariabels"));
const fs = __importStar(require("node:fs"));
const hoverRegex = /(0x[\da-fA-F][_\da-fA-F]*)|(0b[01][_01]*)|(\d[_\d]*(\.\d+)?)|(\.?[A-Za-z_]\w*(\\@|:*))/g;
const InstructionRegex = /^[\\s]*[A-Z][A-Z]*/;
class ASMHoverProvider {
    constructor() {
    }
    provideHover(document, position, token) {
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
exports.ASMHoverProvider = ASMHoverProvider;
