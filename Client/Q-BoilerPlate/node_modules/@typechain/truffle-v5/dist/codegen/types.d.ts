import { AbiOutputParameter, AbiParameter, EvmOutputType, EvmType } from 'typechain';
export declare function codegenInputTypes(input: Array<AbiParameter>): string;
export declare function codegenOutputTypes(outputs: Array<AbiOutputParameter>): string;
export declare function codegenInputType(evmType: EvmType): string;
export declare function codegenOutputType(evmType: EvmOutputType): string;
