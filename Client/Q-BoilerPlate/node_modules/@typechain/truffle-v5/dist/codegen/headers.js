"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codegenArtifactHeaders = void 0;
function codegenArtifactHeaders(contracts) {
    return `
  ${contracts.map((c) => `import {${c.name}Contract} from "./${c.name}";`).join('\n')}

  declare global {
    namespace Truffle {
      interface Artifacts {
        ${contracts.map((c) => `require(name: "${c.rawName}"): ${c.name}Contract;`).join('\n')}
      }
    }
  }

  ${contracts.map((c) => `export {${c.name}Contract, ${c.name}Instance} from "./${c.name}";`).join('\n')}
  `;
}
exports.codegenArtifactHeaders = codegenArtifactHeaders;
//# sourceMappingURL=headers.js.map