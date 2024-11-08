const { compilerOptions } = require("./tsconfig")

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    testEnvironment: "jsdom",
    setupFiles: ["jest-webextension-mock"],
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    moduleNameMapper: {
        "@src/(.*)": "<rootDir>/src/$1",
    },
    moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx"],
    transform: {
        "^.+.tsx?$": [
            "ts-jest",
            {
                tsconfig: {
                    ...compilerOptions,
                    types: [
                        "@types/jest",
                        "node",
                        "@types/firefox-webext-browser",
                    ],
                },
                diagnostics: {
                    ignoreCodes: [151001],
                },
            },
        ],
    },
}
