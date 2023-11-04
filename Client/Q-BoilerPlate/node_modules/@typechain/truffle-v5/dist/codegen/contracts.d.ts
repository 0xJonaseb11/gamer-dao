import { Contract, FunctionDeclaration } from 'typechain';
export declare function codegenContract(contract: Contract): string;
export declare function generateOverloadedFunctions(fns: FunctionDeclaration[]): string;
