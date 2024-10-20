import * as vscode from 'vscode';
import * as GlobalVar from './GlobalVariabels';

export const legend = new vscode.SemanticTokensLegend(
    ['string', 'number', 'comment', 'function', 'label', 'directive', 'variable', 'operator', 'property', 'keyword'],
    ['declaration', 'documentation', 'readonly', 'register', 'address', 'addressPointer']
);


export class ASMSyntaxHighlighting implements vscode.DocumentSemanticTokensProvider {

    constructor() {

    }

    provideDocumentSemanticTokens(
        document: vscode.TextDocument, token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.SemanticTokens> {
        const builder = new vscode.SemanticTokensBuilder(legend);

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
            TestMatch(text, line, /\;.+/, builder, "comment", [])

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
            TestMatch(text, line, /[\s]*\.\b(setcpu)/, builder, "variable", [])

            // Highlight org
            TestMatch(text, line, /[\s]*\.\b(org)/, builder, "variable", [])

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
                let InstructionsRegExp: RegExp = /^[\s]*[A-Za-z]+/;
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
                    element = TestMatchLineRef(element, line, index, /[\s]*\b(HIGH|LOW)\s/, builder, "property", [])
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

function GetRegisterRegex(): RegExp {
    GlobalVar.GetRegister();
    let RegisterRegExp: RegExp = /[\\s]*\\b(A|B|C|D|EXAB|EXCD|HL|H|L|DS|CS|SS|S|PC|FA|FB|SPX|BPX|IL|R1|R2|MB|CR0|CR1|F|a|b|c|d|exab|excd|hl|h|l|ds|cs|ss|s|pc|fa|fb|spx|bpx|il|r1|r2|mb|cr0|cr1|f)/;
    if (GlobalVar.Registers.length > 1) {
        let RegisterRegExpStr: string = "[\\s]*\\b(";
        for (let index = 0; index < GlobalVar.Registers.length; index++) {
            const element = GlobalVar.Registers[index];
            RegisterRegExpStr += `${element}|`
        }
        RegisterRegExpStr = RegisterRegExpStr.substring(0, RegisterRegExpStr.length - 1);
        RegisterRegExpStr += ")";

        RegisterRegExp = new RegExp(RegisterRegExpStr);
    }

    return RegisterRegExp;
}
function GetInstructionsRegex(): RegExp {
    GlobalVar.GetInstructions();
    let InstructionsRegExp: RegExp = /[\\s]*\\b(A|B|C|D|EXAB|EXCD|HL|H|L|DS|CS|SS|S|PC|FA|FB|SPX|BPX|IL|R1|R2|MB|CR0|CR1|F|a|b|c|d|exab|excd|hl|h|l|ds|cs|ss|s|pc|fa|fb|spx|bpx|il|r1|r2|mb|cr0|cr1|f)/;
    if (GlobalVar.Instructions.length > 1) {
        let InstructionsRegExpStr: string = "[\\s]*\\b(";
        for (let index = 0; index < GlobalVar.Instructions.length; index++) {
            const element = GlobalVar.Instructions[index];
            InstructionsRegExpStr += `${element}|`
        }
        InstructionsRegExpStr = InstructionsRegExpStr.substring(0, InstructionsRegExpStr.length - 1);
        InstructionsRegExpStr += ")";
        debugger;
        InstructionsRegExp = new RegExp(InstructionsRegExpStr);
    }

    return InstructionsRegExp;
}

function TestMatch(
    text: string,
    line: number,
    Keyword: RegExp,
    builder: vscode.SemanticTokensBuilder,
    tokenType: string,
    tokenModifier: string[]): boolean {
    const Index = text.match(Keyword);
    if (Index) {
        const start = Index.index || 0;
        const length = Index[0].length;
        var range: vscode.Range = new vscode.Range(line, start, line, start + length);

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

function TestMatchLine(
    text: string,
    line: number,
    indexChar: number,
    Keyword: RegExp,
    builder: vscode.SemanticTokensBuilder,
    tokenType: string,
    tokenModifier: string[]): boolean {
    const Index = text.match(Keyword);
    if (Index) {
        const start = Index.index || 0;
        const length = Index[0].length;
        var range: vscode.Range = new vscode.Range(line, indexChar, line, indexChar + length);

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

function TestMatchRef(
    text: string,
    line: number,
    Keyword: RegExp,
    builder: vscode.SemanticTokensBuilder,
    tokenType: string,
    tokenModifier: string[]): string {
    const Index = text.match(Keyword);
    if (Index) {
        const start = Index.index || 0;
        const length = Index[0].length;
        var range: vscode.Range = new vscode.Range(line, start, line, start + length);

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

function TestMatchLineRef(
    text: string,
    line: number,
    index: number,
    Keyword: RegExp,
    builder: vscode.SemanticTokensBuilder,
    tokenType: string,
    tokenModifier: string[]): string {
    const Index = text.match(Keyword);
    if (Index) {
        const length = Index[0].length;
        var range: vscode.Range = new vscode.Range(line, index, line, index + length);

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
