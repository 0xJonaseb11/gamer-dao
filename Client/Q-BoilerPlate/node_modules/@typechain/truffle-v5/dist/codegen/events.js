"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codegenEventsEmitters = exports.codegenAllPossibleEvents = exports.codegenEventsDeclarations = void 0;
const lodash_1 = require("lodash");
const typechain_1 = require("typechain");
const types_1 = require("./types");
function codegenEventsDeclarations(contract) {
    return (0, lodash_1.values)(contract.events)
        .map((e) => {
        if (e.length === 1) {
            return codegenSingleEventsDeclaration(e[0]);
        }
        else {
            return codegenOverloadEventsDeclaration(e);
        }
    })
        .join('\n');
}
exports.codegenEventsDeclarations = codegenEventsDeclarations;
function codegenAllPossibleEvents(contract) {
    const allPossibleEvents = (0, lodash_1.values)(contract.events)
        .map((e) => e[0])
        .filter((e) => !e.isAnonymous)
        .map((e) => e.name);
    if (allPossibleEvents.length === 0) {
        return `type AllEvents = never`;
    }
    return `type AllEvents = ${allPossibleEvents.join(' | ')};`;
}
exports.codegenAllPossibleEvents = codegenAllPossibleEvents;
function codegenEventsEmitters(contract) {
    return (0, lodash_1.values)(contract.events)
        .filter((e) => !e[0].isAnonymous) // ignore anon events
        .map((e) => {
        if (e.length === 1) {
            return codegenSingleEventsEmitter(e[0]);
        }
        else {
            return ''; //todo
        }
    })
        .join('\n');
}
exports.codegenEventsEmitters = codegenEventsEmitters;
function codegenSingleEventsEmitter(e, overloadName, overloadType) {
    return `${overloadName !== null && overloadName !== void 0 ? overloadName : e.name}(cb?: Callback<${overloadType !== null && overloadType !== void 0 ? overloadType : e.name}>): EventEmitter;`;
}
function codegenOverloadEventsDeclaration(e) {
    const eventsDecls = e.map((e) => codegenSingleEventsDeclaration(e, (0, typechain_1.getFullSignatureAsSymbolForEvent)(e)));
    const union = `type ${e[0].name} = ${e.map((e) => (0, typechain_1.getFullSignatureAsSymbolForEvent)(e)).join('|')}`;
    return `
  ${eventsDecls.join('\n')}

  ${union}
  `;
}
function codegenSingleEventsDeclaration(e, overloadName) {
    return `
  export interface ${overloadName !== null && overloadName !== void 0 ? overloadName : e.name} {
    name: "${e.name}"
    args: ${codegenOutputTypesForEvents(e.inputs)}
  }
  `;
}
function codegenOutputTypesForEvents(outputs) {
    return `{
    ${outputs.map((param) => (param.name ? `${param.name} : ${(0, types_1.codegenOutputType)(param.type)}, ` : '')).join('\n')}
    ${outputs.map((param, index) => index.toString() + ':' + (0, types_1.codegenOutputType)(param.type)).join(', ')}
  }`;
}
//# sourceMappingURL=events.js.map