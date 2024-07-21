const globals = require("globals")
const pluginJs = require("@eslint/js")
const tseslint = require("typescript-eslint")
const sonarjs = require("eslint-plugin-sonarjs")
const jsdoc = require("eslint-plugin-jsdoc")
const parser = require("@typescript-eslint/parser")
const eslintConfigPrettier = require("eslint-config-prettier")
const stylistic = require("@stylistic/eslint-plugin")
const importOrder = require("eslint-plugin-import")
const preferArrow = require("eslint-plugin-prefer-arrow")
// const tslint = require("@typescript-eslint/eslint-plugin-tslint")

module.exports = [
    { files: ["**/*.{js,mjs,cjs,ts}"] },
    { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
    { languageOptions: { globals: globals.browser, parser: parser } },
    {
        rules: {
            complexity: "off",
            "constructor-super": "error",
            "default-case-last": "error",
            "dot-notation": "off",
            eqeqeq: ["off", "always"],
            "guard-for-in": "error",
            "id-denylist": "off",
            "id-match": "off",
            "max-classes-per-file": "off",
            "max-lines-per-function": [
                "off",
                {
                    max: 200,
                },
            ],
            "max-params": [
                "error",
                {
                    max: 7,
                },
            ],
            "no-bitwise": "error",
            "no-caller": "error",
            "no-cond-assign": "error",
            "no-console": "off",
            "no-debugger": "error",
            "no-empty": [
                "error",
                {
                    allowEmptyCatch: true,
                },
            ],
            "no-empty-pattern": "error",
            "no-eval": "off",
            "no-fallthrough": "off",
            "no-invalid-this": "off",
            "no-multi-str": "error",
            "no-new-wrappers": "error",
            "no-self-assign": "error",
            "no-shadow": "off",
            "no-throw-literal": "off",
            "no-undef-init": "error",
            "no-underscore-dangle": "off",
            "no-unsafe-finally": "off",
            "no-unused-expressions": "off",
            "no-unused-labels": "error",
            "no-use-before-define": "off",
            "no-var": "error",
            "object-shorthand": "error",
            "one-var": ["error", "never"],
            "prefer-const": [
                "error",
                {
                    destructuring: "all",
                },
            ],
            radix: "error",
            "use-isnan": "error",
            "valid-typeof": "off",
        },
    },
    {
        ignores: [
            "node_modules/",
            "build/",
            "coverage/",
            "*.test.ts",
            "test_utils.ts",
            "e2e_tests/",
            "compiler/",
            "**/.*.generated.ts"
        ],
    },
    {
        plugins: {
            sonarjs,
        },
        rules: {
            "sonarjs/cognitive-complexity": "off",
            "sonarjs/max-switch-cases": "error",
            "sonarjs/no-all-duplicated-branches": "error",
            "sonarjs/no-collapsible-if": "error",
            "sonarjs/no-collection-size-mischeck": "error",
            "sonarjs/no-duplicate-string": "off",
            "sonarjs/no-duplicated-branches": "error",
            "sonarjs/no-element-overwrite": "error",
            "sonarjs/no-identical-conditions": "error",
            "sonarjs/no-identical-expressions": "error",
            "sonarjs/no-identical-functions": "error",
            "sonarjs/no-inverted-boolean-check": "error",
            "sonarjs/no-one-iteration-loop": "error",
            "sonarjs/no-redundant-boolean": "error",
            "sonarjs/no-redundant-jump": "error",
            "sonarjs/no-same-line-conditional": "error",
            "sonarjs/no-small-switch": "error",
            "sonarjs/no-unused-collection": "error",
            "sonarjs/no-use-of-empty-return-value": "error",
            "sonarjs/no-useless-catch": "error",
            "sonarjs/prefer-immediate-return": "error",
        },
    },
    {
        plugins: {
            tseslint,
        },
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            "@typescript-eslint/adjacent-overload-signatures": "error",
            "@typescript-eslint/array-type": [
                "error",
                {
                    default: "array",
                },
            ],
            "@typescript-eslint/await-thenable": "error",
            "@typescript-eslint/ban-types": [
                "error",
                {
                    types: {
                        Object: {
                            message:
                                "Avoid using the `Object` type. Did you mean `object`?",
                        },
                        Function: {
                            message:
                                "Avoid using the `Function` type. Prefer a specific function type, like `() => void`.",
                        },
                        Boolean: {
                            message: "Use boolean instead",
                            fixWith: "boolean",
                        },
                        Number: {
                            message: "Use number instead",
                            fixWith: "number",
                        },
                        String: {
                            message: "Use string instead",
                            fixWith: "string",
                        },
                        Symbol: {
                            message:
                                "Avoid using the `Symbol` type. Did you mean `symbol`?",
                        },
                    },
                },
            ],
            "@typescript-eslint/consistent-type-assertions": "error",
            "@typescript-eslint/dot-notation": "error",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-member-accessibility": [
                "off",
                {
                    accessibility: "explicit",
                },
            ],
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/indent": "off",
            "@typescript-eslint/member-delimiter-style": [
                "off",
                {
                    multiline: {
                        delimiter: "none",
                        requireLast: true,
                    },
                    singleline: {
                        delimiter: "semi",
                        requireLast: false,
                    },
                },
            ],
            "@typescript-eslint/naming-convention": [
                "off",
                {
                    selector: "variable",
                    format: ["camelCase", "UPPER_CASE"],
                    leadingUnderscore: "forbid",
                    trailingUnderscore: "forbid",
                },
            ],
            "@typescript-eslint/no-empty-interface": "error",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-extra-semi": "off",
            "@typescript-eslint/no-for-in-array": "error",
            "@typescript-eslint/no-misused-new": "error",
            "@typescript-eslint/no-namespace": "error",
            "@typescript-eslint/no-parameter-properties": "off",
            "@typescript-eslint/no-shadow": [
                "off",
                {
                    hoist: "all",
                },
            ],
            "@typescript-eslint/no-unnecessary-type-assertion": "error",
            "@typescript-eslint/no-unused-expressions": "error",
            "@typescript-eslint/no-use-before-define": "off",
            "@typescript-eslint/no-var-requires": "error",
            "@typescript-eslint/prefer-for-of": "error",
            "@typescript-eslint/prefer-function-type": "error",
            "@typescript-eslint/prefer-namespace-keyword": "error",
            "@typescript-eslint/require-array-sort-compare": [
                "error",
                {
                    ignoreStringArrays: true,
                },
            ],
            "@typescript-eslint/semi": ["off", null],
            "@typescript-eslint/triple-slash-reference": [
                "error",
                {
                    path: "always",
                    types: "prefer-import",
                    lib: "always",
                },
            ],
            "@typescript-eslint/typedef": "off",
            "@typescript-eslint/unified-signatures": "error",
        },
    },
    {
        plugins: {
            jsdoc,
        },
        rules: {
            "jsdoc/check-alignment": "off",
            "jsdoc/check-indentation": "off",
            "jsdoc/newline-after-description": "off",
        },
    },
    {
        plugins: { stylistic },
        rules: {
            "stylistic/arrow-parens": ["off", "always"],
            "stylistic/comma-dangle": "off",

            "stylistic/indent": "off",
            "stylistic/max-len": "off",
            "stylistic/new-parens": "error",
            "stylistic/no-extra-parens": "error",
            "stylistic/no-extra-semi": "off",
            "stylistic/no-trailing-spaces": "error",
            "prefer-arrow/prefer-arrow-functions": ["off", {}],
            "stylistic/quote-props": "off",
            "stylistic/semi": "off",
            "stylistic/spaced-comment": [
                "error",
                "always",
                {
                    markers: ["/"],
                },
            ],
        },
    },
    {
        plugins: { importOrder },
        rules: {
            "importOrder/order": [
                "off",
                {
                    alphabetize: {
                        caseInsensitive: true,
                        order: "asc",
                    },
                    "newlines-between": "ignore",
                    groups: [
                        [
                            "builtin",
                            "external",
                            "internal",
                            "unknown",
                            "object",
                            "type",
                        ],
                        "parent",
                        ["sibling", "index"],
                    ],
                    distinctGroup: false,
                    pathGroupsExcludedImportTypes: [],
                    pathGroups: [
                        {
                            pattern: "./",
                            patternOptions: {
                                nocomment: true,
                                dot: true,
                            },
                            group: "sibling",
                            position: "before",
                        },
                        {
                            pattern: ".",
                            patternOptions: {
                                nocomment: true,
                                dot: true,
                            },
                            group: "sibling",
                            position: "before",
                        },
                        {
                            pattern: "..",
                            patternOptions: {
                                nocomment: true,
                                dot: true,
                            },
                            group: "parent",
                            position: "before",
                        },
                        {
                            pattern: "../",
                            patternOptions: {
                                nocomment: true,
                                dot: true,
                            },
                            group: "parent",
                            position: "before",
                        },
                    ],
                },
            ],
        },
    },
    {
        plugins: { preferArrow },
        rules: {
            "preferArrow/prefer-arrow-functions": ["off", {}],
        },
    },
    // {
    //     plugins: {tslint},
    //     parserOptions: {
    //         project: "tsconfig.json",
    //     },
    //     rules: {
    //         "tslint/config": [
    //             "error",
    //             {
    //                 rules: {
    //                     "arguments-order": true,
    //                     "bool-param-default": true,
    //                     "no-accessor-field-mismatch": true,
    //                     "no-case-with-or": true,
    //                     "no-dead-store": true,
    //                     "no-duplicate-in-composite": true,
    //                     "no-empty-array": true,
    //                     "no-gratuitous-expressions": true,
    //                     "no-hardcoded-credentials": true,
    //                     "no-ignored-initial-value": true,
    //                     "no-ignored-return": true,
    //                     "no-invariant-return": true,
    //                     "no-misleading-array-reverse": true,
    //                     "no-misspelled-operator": true,
    //                     "no-nested-switch": true,
    //                     "no-nested-template-literals": true,
    //                     "no-return-type-any": true,
    //                     "no-statements-same-line": true,
    //                     "no-try-promise": true,
    //                     "no-undefined-argument": true,
    //                     "no-unenclosed-multiline-block": true,
    //                     "no-unthrown-error": true,
    //                     "no-unused-declaration": true,
    //                     "no-useless-increment": true,
    //                     "no-useless-intersection": true,
    //                     "prefer-optional": true,
    //                     "prefer-promise-shorthand": true,
    //                     "prefer-type-guard": true,
    //                     "use-type-alias": true,
    //                 },
    //             },
    //         ],
    //     },
    // },
    eslintConfigPrettier,
    ...tseslint.configs.recommendedTypeChecked,
];