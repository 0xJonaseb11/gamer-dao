"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOverloadedFunctions = exports.codegenContract = void 0;
const lodash_1 = require("lodash");
const typechain_1 = require("typechain");
const events_1 = require("./events");
const types_1 = require("./types");
function codegenContract(contract) {
    return `
import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract"

${codegenContractInterface(contract)}

${(0, events_1.codegenEventsDeclarations)(contract)}
${(0, events_1.codegenAllPossibleEvents)(contract)}

${codegenContractInstanceInterface(contract)}
  `;
}
exports.codegenContract = codegenContract;
function codegenContractInterface(c) {
    return `
export interface ${c.name}Contract extends Truffle.Contract<${c.name}Instance> {
  ${c.constructor[0]
        ? `"new"(${(0, types_1.codegenInputTypes)(c.constructor[0].inputs)} meta?: Truffle.TransactionDetails): Promise<${c.name}Instance>;`
        : `"new"(meta?: Truffle.TransactionDetails): Promise<${c.name}Instance>;`}
}
`;
}
function codegenContractInstanceInterface(c) {
    const functionsCode = (0, lodash_1.values)(c.functions)
        .filter((v) => v.length === 1) // no overloaded functions
        .map((v) => v[0])
        .map((fn) => generateFunction(fn))
        .join('\n');
    return `
export interface ${c.name}Instance extends Truffle.ContractInstance {
  ${functionsCode}

  methods: {
    ${functionsCode}
    ${(0, lodash_1.values)(c.functions)
        .filter((v) => v.length > 1) // has overloaded functions
        .map(generateOverloadedFunctions)
        .join('\n')}
  }

  getPastEvents(event: string): Promise<EventData[]>;
  getPastEvents(
      event: string,
      options: PastEventOptions,
      callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
  getPastEvents(event: string, options: PastEventOptions): Promise<EventData[]>;
  getPastEvents(
      event: string,
      callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
}
  `;
}
function generateFunction(fn, overloadedName) {
    if ((0, typechain_1.isConstant)(fn) || (0, typechain_1.isConstantFn)(fn)) {
        return generateConstantFunction(fn, overloadedName);
    }
    return `
  ${generateFunctionDocumentation(fn.documentation)}
  ${overloadedName !== null && overloadedName !== void 0 ? overloadedName : fn.name}: {
    (${(0, types_1.codegenInputTypes)(fn.inputs)} txDetails?: Truffle.TransactionDetails): Promise<Truffle.TransactionResponse<AllEvents>>;
  call(${(0, types_1.codegenInputTypes)(fn.inputs)} txDetails?: Truffle.TransactionDetails): Promise<${(0, types_1.codegenOutputTypes)(fn.outputs)}>;
  sendTransaction(${(0, types_1.codegenInputTypes)(fn.inputs)} txDetails?: Truffle.TransactionDetails): Promise<string>;
  estimateGas(${(0, types_1.codegenInputTypes)(fn.inputs)} txDetails?: Truffle.TransactionDetails): Promise<number>;
  }
`;
}
function generateConstantFunction(fn, overloadedName) {
    return `
  ${generateFunctionDocumentation(fn.documentation)}
  ${overloadedName !== null && overloadedName !== void 0 ? overloadedName : fn.name}(${(0, types_1.codegenInputTypes)(fn.inputs)} txDetails?: Truffle.TransactionDetails): Promise<${(0, types_1.codegenOutputTypes)(fn.outputs)}>;
`;
}
function generateFunctionDocumentation(doc) {
    if (!doc)
        return '';
    let docString = '/**';
    if (doc.details)
        docString += `\n * ${doc.details}`;
    if (doc.notice)
        docString += `\n * ${doc.notice}`;
    const params = Object.entries(doc.params || {});
    if (params.length) {
        params.forEach(([key, value]) => {
            docString += `\n * @param ${key} ${value}`;
        });
    }
    if (doc.return)
        docString += `\n * @returns ${doc.return}`;
    docString += '\n */';
    return docString;
}
function generateOverloadedFunctions(fns) {
    return fns.map((fn) => generateFunction(fn, `"${(0, typechain_1.getSignatureForFn)(fn)}"`)).join('\n');
}
exports.generateOverloadedFunctions = generateOverloadedFunctions;
//# sourceMappingURL=contracts.js.map