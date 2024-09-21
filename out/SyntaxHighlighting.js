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
exports.ASMSyntaxHighlighting = exports.legend = void 0;
const vscode = __importStar(require("vscode"));
const GlobalVar = __importStar(require("./GlobalVariabels"));
exports.legend = new vscode.SemanticTokensLegend(['string', 'number', 'comment', 'function', 'label', 'directive', 'variable', 'operator', 'property', 'keyword'], ['declaration', 'documentation', 'readonly']);
class ASMSyntaxHighlighting {
    constructor() {
    }
    provideDocumentSemanticTokens(document, token) {
        const builder = new vscode.SemanticTokensBuilder(exports.legend);
        let DoneInstructions = false;
        for (let line = 0; line < document.lineCount; line++) {
            let text = document.lineAt(line).text;
            if (text == "") {
                continue;
            }
            //  Highlight "comment"
            if (TestMatch(text, line, /^\;.*/, builder, "comment", [])) {
                continue;
            }
            TestMatch(text, line, /\;.*/, builder, "comment", []);
            //debugger
            // Highlight directives
            TestMatch(text, line, /[\s]*\.\b(byte|word|tbyte|dword|db|dw|dt|dd)/, builder, "variable", []);
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
            for (let i = 0; i < 3; i++) {
                //debugger
                // Highlight numbers
                text = TestMatchRef(text, line, /\b(0b[0-1][0-1_]*|0x[\dA-Fa-f][\dA-Fa-f_]*|[\d][\d_]*)/, builder, "number", ["readonly"]);
                //debugger
                // Highlight quoted text as a string
                text = TestMatchRef(text, line, /"(.*?)"/, builder, "string", ["readonly"]);
                //debugger
                // Highlight declaration Variables
                text = TestMatchRef(text, line, /[\s]*\$[A-Za-z_][A-Za-z_\d]*/, builder, "variable", ["declaration"]);
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
                //debugger
                // Highlight registers
                let RegisterRegExp = /^[\s]*\b(EXAB|EXCD|SPX|BPX|CR0|CR1|DS|CS|SS|HL|PC|FA|FB|IL|R1|R2|MB|a|b|c|d|h|l|s|f|exab|excd|spx|bpx|cr0|cr1|ds|cs|ss|hl|pc|fa|fb|il|r1|r2|mb|a|b|c|d|h|l|s|f)/;
                text = TestMatchRef(text, line, RegisterRegExp, builder, "property", []);
                //debugger
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
