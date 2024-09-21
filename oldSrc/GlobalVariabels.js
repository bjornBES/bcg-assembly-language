
let basePath = "C:/Users/bjorn/Desktop/VideoProjects/GamingCPU_Project/languages/assembly/bcg-assembly-language"
let InstructionTooltipFilePath = basePath + "/files/Tooltips.md";

let Instructions = [
    "MOV",
    "CMP",
    "PUSH",
    "POP",
    "CALL",
    "RET",
    "SEZ",
    "TEST",

    "JMP",
    "JZ",
    "JNZ",
    "JS",
    "JNS",
    "JE",
    "JNE",
    "JL",
    "JG",
    "JLE",
    "JGE",

    "SPIIN",
    "SPIOUT",
    "IN",
    "OUT",

    "SEF",
    "CLF",

    "ADD",
    "SUB",
    "MUL",
    "DIV",
    "AND",
    "OR",
    "NOR",
    "XOR",
    "NOT",
    "SHL",
    "SHR",
    "ROL",
    "ROR",
    "INC",
    "DEC",
    "NEG",
    "AVG",
    "EXP",
    "SQRT",
    "RNG",
    "SEB",
    "CLB",
    "TOB",
    "MOD",

    "FADD",
    "FSUB",
    "FMUL",
    "FDIV",
    "FAND",
    "FOR",
    "FNOR",
    "FXOR",
    "FNOT",

    "MOVW",
    "MOVD",
    "MOVT",
    "MOVS",
    "MOVF",
    "CMPSTR",

    "DATE",
    "DELAY",
    "TIME",

    "CTA",
    "CTH",

    "SSF",
    "SMBR",
    "RTI",
    "NOP",
    "RISERR",
    "PUSHR",
    "POPR",
    "INT",
    "BRK",
    "HALT",
];

module.exports = {
    InstructionTooltipFilePath,
    Instructions
}