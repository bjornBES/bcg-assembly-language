MOV:        `destination, source`               Moves the value from the source into the destination <br>
MOVW:       `destination, source`               Moves a word from the specified source to the destination <br>
MOVT:       `destination, source`               Moves a tbyte from the specified source to the destination <br>
MOVD:       `destination, source`               Moves a dword from the specified source to the destination <br>
CMP:        `operand1 operand2`                 Compares operand1 and operand2 and sets the flags in the flags register <br>
CMPZ:       `operand1`                          Compares operand1 and 0 and sets the flags in the flags register <br>
PUSH:       `regisger`                          Pushes the regisger onto the stack and increments the SP <br>
POP:        `register`                          Decrements the SP and pops the current byte into the register <br>
CALL:       `address`                           Pushes the PC register and jumps to the function specified by the address <br>
RET:        `operand1`                          Pops the PC register and subtracts the SP by operand1 <br>
RETL:                                           Pops the CS:PC registers off the stack <br>
RETZ:                                           Pops the PC register off the stack <br>
SEZ:        `register`                          Sets a register to zero <br>
TEST:       `register`                          Compares the destination with itself and sets the flag <br>
SWAP:       `register, register`                Swaps the contents of register1 with register2 <br>
OUT:        `port source`                       <br>
OUTW:       `port source`                       <br>
INP:        `port destination`                  <br>
INPW:       `port destination`                  <br>
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
ADD:    `destination, source`                   Adds the values of the source and the destination. <br>
ADC:    `destination, source`                   Adds the values of the source and the destination + carry. <br>
SUB:    `destination, source`                   Subtracts the values of the source and the destination. <br>
SBB:    `destination, source`                   Subtracts the values of the source and the destination + carry. <br>
MUL:    `destination, source`                   Multiplies the values of the source and the destination. <br>
DIV:    `destination, source`                   Divides the values of the source and the destination. <br>
AND:    `destination, source`                   Performs a bitwise AND operation between the destination. <br>
OR:     `destination, source`                   Performs a bitwise OR operation between the destination. <br>
NOR:    `destination, source`                   Performs a bitwise NOR operation between the destination. <br>
XOR:    `destination, source`                   Performs a bitwise XOR operation between the destination. <br>
NOT:    `destination`                           Performs a bitwise NOT operation on the destination. <br>
SHL:    `destination, operand1`                 Shifts all the bits left in the destination by specified operand1. The shift flag is the overflowing bit, and the next bit is zero. <br>
SHR:    `destination, operand1`                 Shifts all the bits rigth in the destination by specified by operand1. The shift flag is the overflowing bit, and the next bit is zero. <br>
ROL:    `destination, operand1`                 Rotates all the bits left in the destination by specified by operand1. The shift flag is used as the next bit, and the overflowing bit. <br>
ROR:    `destination, operand1`                 Rotates all the bits right in the destination by specified by operand1. The shift flag is used as the next bit, and the overflowing bit. <br>
INC:    `register`                              Increments the value at the register by 1. <br>
DEC:    `register`                              Decrements the value at the register by 1. <br>
NEG:    `destination`                           Sets/clears the signed bit of the destination. <br>
EXP:    `destination, operand1`                 Raises the value at the destination to the power of the value specified by operand1. <br>
SQRT:   `destination`                           Calculates the square root of the destination. <br>
RNG:    `destination`                           Generates a random byte and puts the value into the destination <br>
SEB:    `source, operand1`                      Sets a bit in the source specified by the operand1 <br>
CLB:    `source, operand1`                      Clears a bit in the source specified by the operand1 <br>
MOD:    `destination, source`                   Perform the modulo operation where the destination is set to the remainder of the division of source by destination. <br>
ADDF:   `destination, source`                   Adds the values of the source and the destination and stores the result in the destination. <br>
SUBF:   `destination, source`                   Subtracts the source from the destination and stores the result in the destination. <br>
MULF:   `destination, source`                   Multiplies the source and the destination and stores the result in the destination. <br>
DIVF:   `destination, source`                   Divides the destination by the source and stores the result in the destination. <br>
CMPF:   `destination, source`                   Compares the source and destination values, setting flags accordingly. <br>
SQRTF:  `destination`                           Computes the square root of the value in the destination and stores the result in the destination. <br>
MODF:   `destination, source`                   Computes the modulus of the destination by the source and stores the result in the destination. <br>
JMP:    `address`                               Jumps to the specified address <br>
JZ:     `address`                               Jumps to the specified address if the zero flag is set <br>
JNZ:    `address`                               Jumps to the specified address if the zero flag is cleared <br>
JS:     `address`                               Jumps to the specified address if the signed flag is set <br>
JNS:    `address`                               Jumps to the specified address if the signed flag is cleared <br>
JE:     `address`                               Jumps to the specified address if the equal flag is set <br>
JNE:    `address`                               Jumps to the specified address if the equal flag is cleared <br>
JC:     `address`                               Jumps to the specified address if the carry flag is set <br>
JNC:    `address`                               Jumps to the specified address if the carry flag is cleared <br>
JL:     `address`                               Jumps to the specified address if the less flag is set <br>
JG:     `address`                               Jumps to the specified address if the less flag is cleared <br>
JLE:    `address`                               Jumps to the specified address if the equal flag or the less flag is set <br>
JGE:    `address`                               Jumps to the specified address if the equal flag is set or the less flag is cleared <br>
JNV:    `address`                               Jumps to the specified address if the overflow flag is cleared <br>
CBTA:   `register, address`                     Convertes the register into an ASCII string and puts the result into memory using the address <br>
CMPL:                                           Compares the memory address value in HL and DS:B for C times and updates the flags register <br>
MOVF:   `destination, immediate`                moves a float from the specified immediate to the float register(destination) <br>
RETI:                                           returns from an interrupt routine <br>
NOP:                                            No operation <br>
PUSHR:                                          Pushes (A B C D H L) on to the stack <br>
POPR:                                           Pops (A B C D H L) off the stack <br>
INT:    `INTERRUPT_ROUTINE`                     Generates an interrupt routine (more in the INTERRUPTS) <br>
BRK:                                            Generates a software interrupt (more in the INTERRUPTS) <br>
ENTER:                                          Creates a stack frame <br>
LEAVE:                                          Leaves the current stack frame <br>
HALT:                                           Stops the CPU <br>
