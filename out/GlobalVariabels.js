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
exports.GetRegister = exports.GetInstructions = exports.Registers = exports.Instructions = exports.Label = exports.GetDocumentSymbol = exports.GetSymbol = exports.GetSymbolsFrom = exports.GetSymbols = exports.URIS = exports.FilePaths = exports.NewLine = exports.GlobalLabels = exports.Labels = exports.Variabels = exports.RegisterTooltipFilePath = exports.InstructionTooltipFilePath = void 0;
const vscode = __importStar(require("vscode"));
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
const TooltipsRegistersFile = `
AX:     32 bit general purpose Register         The \`AX\` are 32 bit general purposed register builded from to 16 bit register \`A\`
BX:     32 bit general purpose Register         The \`BX\` are 32 bit general purposed register builded from to 16 bit register \`B\`
CX:     32 bit general purpose Register         The \`CX\` are 32 bit general purposed register builded from to 16 bit register \`C\`
DX:     32 bit general purpose Register         The \`DX\` are 32 bit general purposed register builded from to 16 bit register \`D\`
EX:     32 bit general purpose Register         The \`EX\` are 32 bit general purposed register
FX:     32 bit general purpose Register         The \`FX\` are 32 bit general purposed register
GX:     32 bit general purpose Register         The \`GX\` are 32 bit general purposed register
HX:     32 bit general purpose Register         The \`HX\` are 32 bit general purposed register
A:      16 bit general purpose Register         The \`A\` are 16 bit general purposed register builded from to 8 bit registers (\`AH\` + \`AL\`)
B:      16 bit general purpose Register         The \`B\` are 16 bit general purposed register builded from to 8 bit registers (\`BH\` + \`BL\`)
C:      16 bit general purpose Register         The \`C\` are 16 bit general purposed register builded from to 8 bit registers (\`CH\` + \`CL\`)
D:      16 bit general purpose Register         The \`D\` are 16 bit general purposed register builded from to 8 bit registers (\`DH\` + \`DL\`)
AL:     8 bit general purpose Register          The \`AL\` are 8 bit general purposed register builded from the 16 bit registers \`A\`
BL:     8 bit general purpose Register          The \`BL\` are 8 bit general purposed register builded from the 16 bit registers \`B\`
CL:     8 bit general purpose Register          The \`CL\` are 8 bit general purposed register builded from the 16 bit registers \`C\`
DL:     8 bit general purpose Register          The \`DL\` are 8 bit general purposed register builded from the 16 bit registers \`D\`
AH:     8 bit general purpose Register          The \`AH\` are 8 bit general purposed register builded from the 16 bit registers \`A\`
BH:     8 bit general purpose Register          The \`BH\` are 8 bit general purposed register builded from the 16 bit registers \`B\`
CH:     8 bit general purpose Register          The \`CH\` are 8 bit general purposed register builded from the 16 bit registers \`C\`
DH:     8 bit general purpose Register          The \`DH\` are 8 bit general purposed register builded from the 16 bit registers \`D\`
HL:     32 bit Address Register                 The \`HL\` is a 32 bit Address Register
H:      16 bit Address Register                 The \`H\` is a 16 bit Address Register
L:      16 bit Address Register                 The \`L\` is a 16 bit Address Register
DS:     32 bit Segment Register                 The \`DS\` is a 32 bit Segment Register
CS:     32 bit Segment Register                 The \`CS\` is a 32 bit Segment Register
SS:     32 bit Segment Register                 The \`SS\` is a 32 bit Segment Register
S:      32 bit Segment Register                 The \`S\` is a 32 bit Segment Register
PC:     32 bit Program Counter                  The \`PC\` is a 32 bit Program Counter
FA:     32 bit Float Register                   The \`FA\` is a 32 bit Float Register
FB:     32 bit Float Register                   The \`FB\` is a 32 bit Float Register
CB:     32 bit Float Register                   The \`CB\` is a 32 bit Float Register
DB:     32 bit Float Register                   The \`DB\` is a 32 bit Float Register
SP:     16 bit Stack Register                   The \`SP\` is a 16 bit Stack Register
BP:     16 bit Stack Register                   The \`BP\` is a 16 bit Stack Register
R1:     16 bit temp Register                    The \`R1\` is a 16 bit temp Register
R2:     16 bit temp Register                    The \`R2\` is a 16 bit temp Register
R3:     16 bit temp Register                    The \`R3\` is a 16 bit temp Register
R4:     16 bit temp Register                    The \`R4\` is a 16 bit temp Register
R5:     16 bit temp Register                    The \`R5\` is a 16 bit temp Register
R6:     16 bit temp Register                    The \`R6\` is a 16 bit temp Register
R7:     16 bit temp Register                    The \`R7\` is a 16 bit temp Register
R8:     16 bit temp Register                    The \`R8\` is a 16 bit temp Register
R9:     16 bit temp Register                    The \`R9\` is a 16 bit temp Register
R10:    16 bit temp Register                    The \`R10\` is a 16 bit temp Register
R11:    16 bit temp Register                    The \`R11\` is a 16 bit temp Register
R12:    16 bit temp Register                    The \`R12\` is a 16 bit temp Register
R13:    16 bit temp Register                    The \`R13\` is a 16 bit temp Register
R14:    16 bit temp Register                    The \`R14\` is a 16 bit temp Register
R15:    16 bit temp Register                    The \`R15\` is a 16 bit temp Register
R16:    16 bit temp Register                    The \`R16\` is a 16 bit temp Register
CR0:    8 bit control Register                  The \`CR0\` is a 8 bit control Register
F:      16 bit Register                         The \`F\` is a 16 bit Register
`;
const TooltipsFile = `
MOV:        \`destination, source\`               Moves the value from the source into the destination <br>
MOVW:       \`destination, source\`               Moves a word from the specified source to the destination <br>
MOVT:       \`destination, source\`               Moves a tbyte from the specified source to the destination <br>
MOVD:       \`destination, source\`               Moves a dword from the specified source to the destination <br>
CMP:        \`operand1 operand2\`                 Compares operand1 and operand2 and sets the flags in the flags register <br>
CMPZ:       \`operand1\`                          Compares operand1 and 0 and sets the flags in the flags register <br>
PUSH:       \`regisger\`                          Pushes the regisger onto the stack and increments the SP <br>
POP:        \`register\`                          Decrements the SP and pops the current byte into the register <br>
CALL:       \`address\`                           Pushes the PC register and jumps to the function specified by the address <br>
RET:        \`operand1\`                          Pops the PC register and subtracts the SP by operand1 <br>
RETL:                                           Pops the CS:PC registers off the stack <br>
RETZ:                                           Pops the PC register off the stack <br>
SEZ:        \`register\`                          Sets a register to zero <br>
TEST:       \`register\`                          Compares the destination with itself and sets the flag <br>
SWAP:       \`register, register\`                Swaps the contents of register1 with register2 <br>
OUT:        \`port source\`                       <br>
OUTW:       \`port source\`                       <br>
INP:        \`port destination\`                  <br>
INPW:       \`port destination\`                  <br>
SZE:                                            Sets the zero flag <br>
SEE:                                            Sets the equals flag <br>
SES:                                            Sets the signed flag <br>
SEC:                                            Sets the carry flag <br>
SEL:                                            Sets the less flag <br>
SEI:                                            Sets the interrupt enable flag <br>
SEH:                                            Sets the halt flag <br>
CZE:                                            Clears the zero flag <br>
CLE:                                            Clears the equals flag <br>
CLS:                                            Clears the signed flag <br>
CLC:                                            Clears the carry flag <br>
CLL:                                            Clears the less flag <br>
CLI:                                            Clears the interrupt enable flag <br>
CLH:                                            Clears the halt flag <br>
ADD:    \`destination, source\`                   Adds the values of the source and the destination. <br>
ADC:    \`destination, source\`                   Adds the values of the source and the destination + carry. <br>
SUB:    \`destination, source\`                   Subtracts the values of the source and the destination. <br>
SBB:    \`destination, source\`                   Subtracts the values of the source and the destination + carry. <br>
MUL:    \`destination, source\`                   Multiplies the values of the source and the destination. <br>
DIV:    \`destination, source\`                   Divides the values of the source and the destination. <br>
AND:    \`destination, source\`                   Performs a bitwise AND operation between the destination. <br>
OR:     \`destination, source\`                   Performs a bitwise OR operation between the destination. <br>
NOR:    \`destination, source\`                   Performs a bitwise NOR operation between the destination. <br>
XOR:    \`destination, source\`                   Performs a bitwise XOR operation between the destination. <br>
NOT:    \`destination\`                           Performs a bitwise NOT operation on the destination. <br>
SHL:    \`destination, operand1\`                 Shifts all the bits left in the destination by specified operand1. The shift flag is the overflowing bit, and the next bit is zero. <br>
SHR:    \`destination, operand1\`                 Shifts all the bits rigth in the destination by specified by operand1. The shift flag is the overflowing bit, and the next bit is zero. <br>
ROL:    \`destination, operand1\`                 Rotates all the bits left in the destination by specified by operand1. The shift flag is used as the next bit, and the overflowing bit. <br>
ROR:    \`destination, operand1\`                 Rotates all the bits right in the destination by specified by operand1. The shift flag is used as the next bit, and the overflowing bit. <br>
INC:    \`register\`                              Increments the value at the register by 1. <br>
DEC:    \`register\`                              Decrements the value at the register by 1. <br>
NEG:    \`destination\`                           Sets/clears the signed bit of the destination. <br>
EXP:    \`destination, operand1\`                 Raises the value at the destination to the power of the value specified by operand1. <br>
SQRT:   \`destination\`                           Calculates the square root of the destination. <br>
RNG:    \`destination\`                           Generates a random byte and puts the value into the destination <br>
SEB:    \`source, operand1\`                      Sets a bit in the source specified by the operand1 <br>
CLB:    \`source, operand1\`                      Clears a bit in the source specified by the operand1 <br>
MOD:    \`destination, source\`                   Perform the modulo operation where the destination is set to the remainder of the division of source by destination. <br>
ADDF:   \`destination, source\`                   Adds the values of the source and the destination and stores the result in the destination. <br>
SUBF:   \`destination, source\`                   Subtracts the source from the destination and stores the result in the destination. <br>
MULF:   \`destination, source\`                   Multiplies the source and the destination and stores the result in the destination. <br>
DIVF:   \`destination, source\`                   Divides the destination by the source and stores the result in the destination. <br>
CMPF:   \`destination, source\`                   Compares the source and destination values, setting flags accordingly. <br>
SQRTF:  \`destination\`                           Computes the square root of the value in the destination and stores the result in the destination. <br>
MODF:   \`destination, source\`                   Computes the modulus of the destination by the source and stores the result in the destination. <br>
JMP:    \`address\`                               Jumps to the specified address <br>
JZ:     \`address\`                               Jumps to the specified address if the zero flag is set <br>
JNZ:    \`address\`                               Jumps to the specified address if the zero flag is cleared <br>
JS:     \`address\`                               Jumps to the specified address if the signed flag is set <br>
JNS:    \`address\`                               Jumps to the specified address if the signed flag is cleared <br>
JE:     \`address\`                               Jumps to the specified address if the equal flag is set <br>
JNE:    \`address\`                               Jumps to the specified address if the equal flag is cleared <br>
JC:     \`address\`                               Jumps to the specified address if the carry flag is set <br>
JNC:    \`address\`                               Jumps to the specified address if the carry flag is cleared <br>
JL:     \`address\`                               Jumps to the specified address if the less flag is set <br>
JG:     \`address\`                               Jumps to the specified address if the less flag is cleared <br>
JLE:    \`address\`                               Jumps to the specified address if the equal flag or the less flag is set <br>
JGE:    \`address\`                               Jumps to the specified address if the equal flag is set or the less flag is cleared <br>
JNV:    \`address\`                               Jumps to the specified address if the overflow flag is cleared <br>
CBTA:   \`register, address\`                     Convertes the register into an ASCII string and puts the result into memory using the address <br>
CMPL:                                           Compares the memory address value in HL and DS:B for C times and updates the flags register <br>
MOVF:   \`destination, immediate\`                moves a float from the specified immediate to the float register(destination) <br>
RETI:                                           returns from an interrupt routine <br>
NOP:                                            No operation <br>
PUSHR:                                          Pushes (A B C D H L) on to the stack <br>
POPR:                                           Pops (A B C D H L) off the stack <br>
INT:    \`INTERRUPT_ROUTINE\`                     Generates an interrupt routine (more in the INTERRUPTS) <br>
BRK:                                            Generates a software interrupt (more in the INTERRUPTS) <br>
ENTER:                                          Creates a stack frame <br>
LEAVE:                                          Leaves the current stack frame <br>
HALT:                                           Stops the CPU <br>
`;
function GetInstructions() {
    exports.Instructions.length = 0; // Clear Instructions array
    const InstructionText = TooltipsFile.split(/\r?\n/);
    for (let i = 0; i < InstructionText.length; i++) {
        const line = InstructionText[i].split(":")[0].trimEnd();
        exports.Instructions.push(line);
    }
}
exports.GetInstructions = GetInstructions;
function GetRegister() {
    exports.Registers.length = 0; // Clear Registers array
    const RegisterText = TooltipsRegistersFile.split(/\r?\n/);
    for (let i = 0; i < RegisterText.length; i++) {
        const line = RegisterText[i].split(":")[0].trimEnd();
        exports.Registers.push(line);
    }
}
exports.GetRegister = GetRegister;
