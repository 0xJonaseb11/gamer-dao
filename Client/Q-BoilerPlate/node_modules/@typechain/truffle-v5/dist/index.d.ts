import { Config, FileDescription, TypeChainTarget } from 'typechain';
export interface ITruffleCfg {
    outDir?: string;
}
export default class Truffle extends TypeChainTarget {
    name: string;
    private readonly outDirAbs;
    private contracts;
    constructor(config: Config);
    transformFile(file: FileDescription): FileDescription | void;
    afterRun(): FileDescription[];
}
