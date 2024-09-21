MOV:      `destination source`                  Moves the value from the **source** into the **destination**<br>
MOVW:     `destination source`                  moves a word from the specified **source** to the **destination**<br>
MOVT:     `destination source`                  moves a tbyte from the specified **source** to the **destination**<br>
MOVD:     `destination source`                  moves a dword from the specified **source** to the **destination**<br>
CMP:      `operand1 operand2`                   Compares **operand1** and **operand2** and sets the flags in the flags register<br>
PUSH:     `source`                              Pushes the **source** onto the stack and increments the Stack Pointer<br>
POP:      `register`                            Decrements the SP and pops the current value into the **register**<br>
POPW:     `register`                            Decrements the SP and pops the current word into the **register**<br>
POPT:     `register`                            Decrements the SP and pops the current 24 bit into the **register**<br>
POPD:     `register`                            Decrements the SP and pops the current dword into the **register**<br>
CALL:     `address`                             pushes the PC register and jumps to the function specified by the **address**<br>
RET:      `operand1`                            pops the PC register and subtracts the SP by **operand1**<br>
SEZ:      `destination`                         Sets the **destination** to zero<br>
TEST:     `register`                            Tests the **register** and sets the flag<br>
JMP:      `address`                             Jumps to the specified **address**<br>
JZ:       `address`                             Jumps to the specified **address** if the zero flag is set<br>
JNZ:      `address`                             Jumps to the specified **address** if the zero flag is cleared<br>
JS:       `address`                             Jumps to the specified **address** if the signed flag is set<br>
JNS:      `address`                             Jumps to the specified **address** if the signed flag is cleared<br>
JE:       `address`                             Jumps to the specified **address** if the equal flag is set<br>
JNE:      `address`                             Jumps to the specified **address** if the equal flag is cleared<br>
JL:       `address`                             Jumps to the specified **address** if the less flag is set<br>
JG:       `address`                             Jumps to the specified **address** if the less flag is cleared<br>
JLE:      `address`                             Jumps to the specified **address** if the equal flag or the less flag is set<br>
JGE:      `address`                             Jumps to the specified **address** if the equal flag is set or the less flag is cleared<br>
CALLNG:   `long_address`                        pushes the PC register and long jumps to the function specified by the **long_address**<br>
JTZ:                                            Jumps to address 0x0000_0000
JBA:      `address bank`                        Jumps to the specified **address** and specified **bank**
IN:       `port source`                         WIP<br>
OUT:      `port destination`                    WIP<br>
SEF:      `flag`                                Sets a **flag** specified by the **flag** operand<br>
CLF:      `flag`                                Clears a **flag** specified by the **flag** operand<br>
ADD:      `destination source`                  Adds the values of the **source** and the **destination** and stores the value in **destination**.
SUB:      `destination source`                  Subtracts the values of the **source** and the **destination** and stores the value in **destination**.
MUL:      `destination source`                  Multiplies the values of the **source** and the **destination** and stores the value in **destination**.
DIV:      `destination source`                  Divides the values of the **source** and the **destination** and stores the value in **destination**.
AND:      `destination source`                  Performs a bitwise AND operation between the **destination** and **source** and stores the value in **destination**.
OR:       `destination source`                  Performs a bitwise OR operation between the **destination** and **source** and stores the value in **destination**.
NOR:      `destination source`                  Performs a bitwise NOR operation between the **destination** and **source** and stores the value in **destination**.
XOR:      `destination source`                  Performs a bitwise XOR operation between the **destination** and **source** and stores the value in **destination**.
NOT:      `destination`                         Performs a bitwise NOT operation on the **destination** and stores the value in **destination**.
SHL:      `destination operand1`                Shifts all the bits left in the **destination** by specified by **operand1**. The {SHIFT_FLAG} is the overflowing bit, and the next bit is zero.
SHR:      `destination operand1`                Shifts all the bits rigth in the **destination** by specified by **operand1**. The {SHIFT_FLAG} is the overflowing bit, and the next bit is zero.
ROL:      `destination operand1`                Rotates all the bits left in the **destination** by specified by **operand1**. The {SHIFT_FLAG} is used as the next bit, and the overflowing bit.
ROR:      `destination operand1`                Rotates all the bits right in the **destination** by specified by **operand1**. The {SHIFT_FLAG} is used as the next bit, and the overflowing bit.
INC:      `destination`                         Increments the value at the **destination** by 1.
DEC:      `destination`                         Decrements the value at the **destination** by 1.
NEG:      `destination`                         Sets/clears the signed bit of the **destination**.
AVG:      `destination operand1`                Calculates the average of the values in the **destination** and **operand1** and puts the value in the **destination**.
EXP:      `destination operand1`                Raises the value at the **destination** to the power of the value specified by **operand1**.
SQRT:     `destination`                         Calculates the square root of the **destination**.
RNG:      `destination`                         Generates a random number and puts the value into the **destination**
SEB:      `source operand1`                     Sets a bit in the **source** specified by the **operand1**
CLB:      `source operand1`                     Clears a bit in the **source** specified by the **operand1**
TOB:      `source operand1`                     Toggles a bit in the **source** specified by the **operand1**
MOD:      `destination source`                  WIP
FADD:     `destination source`                  Adds the values of the **source** and the **destination** and stores the value in **destination**.<br>
FSUB:     `destination source`                  Subtracts the values of the **source** and the **destination** and stores the value in **destination**.<br>
FMUL:     `destination source`                  Multiplies the values of the **source** and the **destination** and stores the value in **destination**.<br>
FDIV:     `destination source`                  Divides the values of the **source** and the **destination** and stores the value in **destination**.<br>
FAND:     `destination source`                  Performs a bitwise AND operation between the **destination** and **source** and stores the value in **destination**.<br>
FOR:      `destination source`                  Performs a bitwise OR operation between the **destination** and **source** and stores the value in **destination**.<br>
FNOR:     `destination source`                  Performs a bitwise NOR operation between the **destination** and **source** and stores the value in **destination**.<br>
FXOR:     `destination source`                  Performs a bitwise XOR operation between the **destination** and **source** and stores the value in **destination**.<br>
FNOT:     `destination`                         Performs a bitwise NOT operation on the **destination** and stores the value in **destination**.<br>
MOVS:     `destination source`                  moves a null terminated string from the specified **source** to the **destination**<br>
CMPSTR:   `address1 address2`                   Compares to null terminated strings specified by string1 **address1** string2 **address2** and outputs the result in the {equal} flag<br>
MOVF:     `destination F_immediate`             moves a float from the specified **F_immediate** to the destination specified by the **destination**<br>
DATE:     `destination`                         Gets the date and puts it in the **destination** (more in the DATE AND TIME)
DELAY:    `operand1`                            Sets a delay specified by the **operand1** in milliseconds
TIME:     `destination`                         Gets the time and puts it in the **destination** (more in the DATE AND TIME)
RTI:                                            returns from an intercept routine
NOP:                                            No operation
RISERR:   `error_source`                        Raises the error flag and sets the A register with the value from **error_source**
PUSHR:                                          Pushes (AX BX CX DX H L) on to the stack
POPR:                                           Pops (AX BX CX DX H L) off the stack
INT:      `INTERRUPT_ROUTINE`                   Generates an interrupt routine
BRK:      `INDEX`                               Generates a software interrupt and the **INDEX** will be moved into the X register
HALT:                                           Stops the CPU
