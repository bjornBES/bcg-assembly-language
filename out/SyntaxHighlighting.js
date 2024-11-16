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
exports.ASMSyntaxHighlighting = exports.legend = void 0;
const vscode = __importStar(require("vscode"));
const GlobalVar = __importStar(require("./GlobalVariabels"));
exports.legend = new vscode.SemanticTokensLegend(['string', 'number', 'comment', 'function', 'label', 'directive', 'variable', 'operator', 'property', 'keyword'], ['declaration', 'documentation', 'readonly', 'register', 'address', 'addressPointer']);
class ASMSyntaxHighlighting {
    constructor() {
    }
    provideDocumentSemanticTokens(document, token) {
        const builder = new vscode.SemanticTokensBuilder(exports.legend);
        let DoneInstructions = false;
        for (let line = 0; line < document.lineCount; line++) {
            let LineElement = document.lineAt(line).text;
            let text = document.lineAt(line).text;
            if (text == "") {
                continue;
            }
            //  Highlight "comment"
            if (TestMatch(text, line, /^\;.+/, builder, "comment", [])) {
                continue;
            }
            TestMatch(text, line, /\;.+/, builder, "comment", []);
            //debugger
            // Highlight directives
            TestMatch(text, line, /[\s]*\.\b(byte|word|tbyte|dword|db|dw|dt|dd)/, builder, "variable", []);
            // Highlight res
            TestMatch(text, line, /[\s]*\.\b(res|resb|resw|rest|resd|resq)/, builder, "variable", []);
            // Highlight sections
            if (TestMatch(text, line, /[\s]*\.\b(section)/, builder, "variable", [])) {
                continue;
            }
            // Highlight set cpu
            TestMatch(text, line, /[\s]*\.\b(setcpu)/, builder, "variable", []);
            // Highlight org
            TestMatch(text, line, /[\s]*\.\b(org)/, builder, "variable", []);
            //debugger
            // Highlight global
            TestMatch(text, line, /[\s]*\.\b(global|GLOBAL)/, builder, "variable", []);
            //debugger
            // Highlight declaration Labels
            if (TestMatch(text, line, /^[A-Za-z_][A-Za-z_\d]*\:/, builder, "label", ["declaration"])) {
                continue;
            }
            if (TestMatch(text, line, /\.(.*?)\s.[A-Za-z_][A-Za-z_\d]*\:/, builder, "label", ["declaration"])) {
                continue;
            }
            DoneInstructions = false;
            //debugger
            // Highlight declaration Variables
            text = TestMatchRef(text, line, /[\s]*\$[A-Za-z_][A-Za-z_\d]*/, builder, "variable", ["declaration"]);
            // Highlight number
            text = TestMatchRef(text, line, /\b(0b[0-1][0-1_]*|0x[\dA-Fa-f][\dA-Fa-f_]*|[\d][\d_]*)/, builder, "number", ["readonly"]);
            //debugger
            // Highlight quoted text as a string
            text = TestMatchRef(text, line, /"(.*?)"/, builder, "string", ["readonly"]);
            //debugger
            // Highlight declaration operator
            text = TestMatchRef(text, line, /\b(\=)/, builder, "operator", ["declaration"]);
            //debugger
            // Highlight operator
            text = TestMatchRef(text, line, /\b(\+|\-|\*|\/)/, builder, "operator", []);
            //debugger
            // Highlight Instructions
            if (DoneInstructions == false) {
                let SaveText = text;
                let InstructionsRegExp = /^[\s]*[A-Za-z]+/;
                text = TestMatchRef(text, line, InstructionsRegExp, builder, "keyword", []);
                if (SaveText != text) {
                    DoneInstructions = true;
                }
            }
            let argumentLine = text.replace(/\;.+/, "").replace(/[\s]+\,/g, ",").replace(/\s+/g, " ").trim();
            let arguemnts = argumentLine.trim().split(',');
            for (let arg = 0; arg < arguemnts.length; arg++) {
                let element = arguemnts[arg];
                let index = LineElement.indexOf(element);
                //debugger
                // Highlight numbers
                if (element.includes('@')) {
                    element = TestMatchLineRef(element, line, index, /[\s]*\b(HIGH|LOW)\s/, builder, "property", []);
                    index = LineElement.indexOf(element);
                    element = TestMatchLineRef(element, line, index, /[\s]*\b(near|short|long|far)\s/, builder, "property", []);
                    index = LineElement.indexOf(element);
                    if (TestMatchLine(element, line, index, /[\s]*\@[A-Za-z_][A-Za-z_\d]+/, builder, "property", ["addressPointer"])) {
                        continue;
                    }
                }
                else if (element.includes('[') && element.endsWith(']')) {
                    element = TestMatchLineRef(element, line, index, /[\s]*\b(rel)[\s]*/, builder, "property", []);
                    element = element.replace('[', "").replace("]", "").trim();
                    index = LineElement.indexOf(element);
                    if (TestMatchLine(element, line, index, /[\s]*[A-Za-z_][A-Za-z_\d]*/, builder, "property", ["address"])) {
                        continue;
                    }
                }
                else if (TestMatchLine(element, line, index, /\b(0b[0-1][0-1_]*|0x[\dA-Fa-f][\dA-Fa-f_]*|[\d][\d_]*)/, builder, "number", ["readonly"])) {
                    continue;
                }
                else if (TestMatchLine(element, line, index, /[\s]*[A-Za-z][A-Za-z\d]*[\s]*/, builder, "property", ["register"])) {
                    continue;
                }
            }
        }
        return builder.build();
    }
}
exports.ASMSyntaxHighlighting = ASMSyntaxHighlighting;
function GetRegisterRegex() {
    GlobalVar.GetRegister();
    let RegisterRegExp = /[\\s]*\\b(A|B|C|D|EXAB|EXCD|HL|H|L|DS|CS|SS|S|PC|FA|FB|SPX|BPX|IL|R1|R2|MB|CR0|CR1|F|a|b|c|d|exab|excd|hl|h|l|ds|cs|ss|s|pc|fa|fb|spx|bpx|il|r1|r2|mb|cr0|cr1|f)/;
    if (GlobalVar.Registers.length > 1) {
        let RegisterRegExpStr = "[\\s]*\\b(";
        for (let index = 0; index < GlobalVar.Registers.length; index++) {
            const element = GlobalVar.Registers[index];
            RegisterRegExpStr += `${element}|`;
        }
        RegisterRegExpStr = RegisterRegExpStr.substring(0, RegisterRegExpStr.length - 1);
        RegisterRegExpStr += ")";
        RegisterRegExp = new RegExp(RegisterRegExpStr);
    }
    return RegisterRegExp;
}
function GetInstructionsRegex() {
    GlobalVar.GetInstructions();
    let InstructionsRegExp = /[\\s]*\\b(A|B|C|D|EXAB|EXCD|HL|H|L|DS|CS|SS|S|PC|FA|FB|SPX|BPX|IL|R1|R2|MB|CR0|CR1|F|a|b|c|d|exab|excd|hl|h|l|ds|cs|ss|s|pc|fa|fb|spx|bpx|il|r1|r2|mb|cr0|cr1|f)/;
    if (GlobalVar.Instructions.length > 1) {
        let InstructionsRegExpStr = "[\\s]*\\b(";
        for (let index = 0; index < GlobalVar.Instructions.length; index++) {
            const element = GlobalVar.Instructions[index];
            InstructionsRegExpStr += `${element}|`;
        }
        InstructionsRegExpStr = InstructionsRegExpStr.substring(0, InstructionsRegExpStr.length - 1);
        InstructionsRegExpStr += ")";
        debugger;
        InstructionsRegExp = new RegExp(InstructionsRegExpStr);
    }
    return InstructionsRegExp;
}
function TestMatch(text, line, Keyword, builder, tokenType, tokenModifier) {
    const Index = text.match(Keyword);
    if (Index) {
        const start = Index.index || 0;
        const length = Index[0].length;
        var range = new vscode.Range(line, start, line, start + length);
        if (tokenModifier.length == 0) {
            builder.push(range, tokenType, []);
            return true;
        }
        else {
            builder.push(range, tokenType, tokenModifier);
            return true;
        }
    }
    return false;
}
function TestMatchLine(text, line, indexChar, Keyword, builder, tokenType, tokenModifier) {
    const Index = text.match(Keyword);
    if (Index) {
        const start = Index.index || 0;
        const length = Index[0].length;
        var range = new vscode.Range(line, indexChar, line, indexChar + length);
        if (tokenModifier.length == 0) {
            builder.push(range, tokenType, []);
            return true;
        }
        else {
            builder.push(range, tokenType, tokenModifier);
            return true;
        }
    }
    return false;
}
function TestMatchRef(text, line, Keyword, builder, tokenType, tokenModifier) {
    const Index = text.match(Keyword);
    if (Index) {
        const start = Index.index || 0;
        const length = Index[0].length;
        var range = new vscode.Range(line, start, line, start + length);
        if (tokenModifier.length == 0) {
            builder.push(range, tokenType, []);
            return text.replace(Index[0], "");
        }
        else {
            builder.push(range, tokenType, tokenModifier);
            return text.replace(Index[0], "");
        }
    }
    return text;
}
function TestMatchLineRef(text, line, index, Keyword, builder, tokenType, tokenModifier) {
    const Index = text.match(Keyword);
    if (Index) {
        const length = Index[0].length;
        var range = new vscode.Range(line, index, line, index + length);
        if (tokenModifier.length == 0) {
            builder.push(range, tokenType, []);
            return text.replace(Index[0], "");
        }
        else {
            builder.push(range, tokenType, tokenModifier);
            return text.replace(Index[0], "");
        }
    }
    return text;
}
