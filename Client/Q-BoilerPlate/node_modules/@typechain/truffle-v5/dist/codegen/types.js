"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codegenOutputType = exports.codegenInputType = exports.codegenOutputTypes = exports.codegenInputTypes = void 0;
function codegenInputTypes(input) {
    if (input.length === 0) {
        return '';
    }
    return (input.map((input, index) => `${input.name || `arg${index}`}: ${codegenInputType(input.type)}`).join(', ') + ', ');
}
exports.codegenInputTypes = codegenInputTypes;
function codegenOutputTypes(outputs) {
    if (outputs.length === 1) {
        return codegenOutputType(outputs[0].type);
    }
    else {
        // NOTE: using object here, instead of array is intentional as this is what truffle returns in fact. This sometimes makes a difference (example: exploding)
        return `{${outputs.map((param, index) => `${index}: ${codegenOutputType(param.type)}`).join(', ')}}`;
    }
}
exports.codegenOutputTypes = codegenOutputTypes;
function codegenInputType(evmType) {
    switch (evmType.type) {
        case 'integer':
            return 'number | BN | string';
        case 'uinteger':
            return 'number | BN | string';
        case 'address':
            return 'string';
        case 'bytes':
            return 'string';
        case 'dynamic-bytes':
            return 'string';
        case 'array':
            return `(${codegenInputType(evmType.itemType)})[]`;
        case 'boolean':
            return 'boolean';
        case 'string':
            return 'string';
        case 'tuple':
            return codegenTupleType(evmType, codegenInputType);
        case 'unknown':
            return 'any';
    }
}
exports.codegenInputType = codegenInputType;
function codegenOutputType(evmType) {
    switch (evmType.type) {
        case 'integer':
            return 'BN';
        case 'uinteger':
            return 'BN';
        case 'address':
            return 'string';
        case 'void':
            return 'void';
        case 'bytes':
        case 'dynamic-bytes':
            return 'string';
        case 'array':
            return `(${codegenOutputType(evmType.itemType)})[]`;
        case 'boolean':
            return 'boolean';
        case 'string':
            return 'string';
        case 'tuple':
            return codegenTupleType(evmType, codegenOutputType);
        case 'unknown':
            return 'any';
    }
}
exports.codegenOutputType = codegenOutputType;
function codegenTupleType(tuple, generator) {
    return '{' + tuple.components.map((component) => `${component.name}: ${generator(component.type)}`).join(', ') + '}';
}
//# sourceMappingURL=types.js.map