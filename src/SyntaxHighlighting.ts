import * as vscode from 'vscode';
import * as GlobalVar from './GlobalVariabels';

export const legend = new vscode.SemanticTokensLegend(
    ['string', 'number', 'comment', 'function', 'label', 'directive', 'variable', 'operator', 'property', 'keyword'],
    ['declaration', 'documentation', 'readonly']
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
            let text = document.lineAt(line).text;

            if (text == "") {
                continue;
            }

            //  Highlight "comment"
            if (TestMatch(text, line, /^\;.*/, builder, "comment", [])) {
                continue;
            }
            TestMatch(text, line, /\;.*/, builder, "comment", [])

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
                    let InstructionsRegExp: RegExp = /^[\s]*[A-Za-z]+/;
                    text = TestMatchRef(text, line, InstructionsRegExp, builder, "keyword", []);

                    if (SaveText != text) {
                        DoneInstructions = true;
                    }
                }

                //debugger
                // Highlight registers
                let RegisterRegExp: RegExp = /^[\s]*\b(EXAB|EXCD|SPX|BPX|CR0|CR1|DS|CS|SS|HL|PC|FA|FB|IL|R1|R2|MB|a|b|c|d|h|l|s|f|exab|excd|spx|bpx|cr0|cr1|ds|cs|ss|hl|pc|fa|fb|il|r1|r2|mb|a|b|c|d|h|l|s|f)/;
                text = TestMatchRef(text, line, RegisterRegExp, builder, "property", []);

                //debugger
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
