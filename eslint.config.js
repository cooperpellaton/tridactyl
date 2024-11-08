import eslint from "@eslint/js"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import jsdoc from "eslint-plugin-jsdoc"
import sonarjs from "eslint-plugin-sonarjs"
import tseslint from "typescript-eslint"
import eslintConfigPrettier from "eslint-config-prettier"

export default [
    {
        ignores: [
            "**/dist/*",
            "**/node_modules/*",
            "build",
            "coverage",
            "**/*.test.ts",
            "test_utils.ts",
            "e2e_tests/",
            "compiler/",
            "generated/",
            "**/.*.generated.ts",
            "src/static/typedoc/**/*.js",
        ],
    },
    eslint.configs.recommended,
    eslintConfigPrettier,
    ...tseslint.configs.recommendedTypeChecked,
    {
        rules: {
            // General ESLint rules
            "arrow-parens": "off",
            "comma-dangle": "off",
            complexity: "off",
            "constructor-super": "error",
            curly: "off",
            eqeqeq: "off",
            "guard-for-in": "error",
            "id-denylist": "off",
            "id-match": "off",
            "new-parens": "error",
            "no-bitwise": "error",
            "no-caller": "error",
            "no-case-declarations": "off",
            "no-cond-assign": "error",
            "no-console": "off",
            "no-debugger": "error",
            "no-empty": ["error", { allowEmptyCatch: true }],
            "no-empty-pattern": "error",
            "no-eval": "off",
            "no-fallthrough": "off",
            "no-invalid-this": "off",
            "no-new-wrappers": "error",
            "no-shadow": [
                "off",
                {
                    hoist: "all",
                },
            ],
            "no-throw-literal": "off",
            "no-trailing-spaces": "error",
            "no-undef-init": "error",
            "no-underscore-dangle": "off",
            "no-unsafe-finally": "off",
            "no-unused-labels": "error",
            "no-unused-vars": "off",
            "no-var": "error",
            "object-shorthand": "error",
            "one-var": ["error", "never"],
            "prefer-const": ["error", { destructuring: "all" }],
            "quote-props": "off",
            radix: "error",
            semi: "off",
            "use-isnan": "error",
            "valid-typeof": "off",
            "spaced-comment": [
                "error",
                "always",
                {
                    markers: ["/"],
                },
            ],
        },
    },
    {
        // files: ["**/*.{ts,tsx}", ".tmp/**/*.ts"],
        plugins: {
            tsPlugin,
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                projectService: true,
                sourceType: "module",
                ecmaVersion: 2020,
                // tsConfigRootDir: __dirname,
            },
        },
        rules: {
            // TypeScript specific rules
            "@typescript-eslint/adjacent-overload-signatures": "error",
            "@typescript-eslint/array-type": "off",
            "@typescript-eslint/await-thenable": "error",
            "@typescript-eslint/no-restricted-types": [
                "error",
                {
                    types: {
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
            "@typescript-eslint/dot-notation": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-member-accessibility": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/indent": "off",
            "@typescript-eslint/member-delimiter-style": "off",
            "@typescript-eslint/naming-convention": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-empty-interface": "error",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-extra-semi": "off",
            "@typescript-eslint/no-for-in-array": "error",
            "@typescript-eslint/no-floating-promises": "off", //"error", // We should turn this on eventually but it will take a while to fix
            "@typescript-eslint/no-misused-new": "error",
            "@typescript-eslint/no-misused-promises": [
                "error",
                {
                    checksVoidReturn: false,
                },
            ],
            "@typescript-eslint/no-namespace": "error",
            "@typescript-eslint/no-parameter-properties": "off",
            "@typescript-eslint/no-shadow": "off",
            "@typescript-eslint/no-unnecessary-type-assertion": "error",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-assignment": "off", //"error",
            "@typescript-eslint/no-unsafe-call": "off", //"error",
            "@typescript-eslint/no-unsafe-member-access": "off", //"error", // We've done this a lot, but it would be a good idea to fix it
            "@typescript-eslint/no-unsafe-return": "off", //"error", // We've done this a lot, but it would be a good idea to fix it
            "@typescript-eslint/no-unused-expressions": [
                "error",
                {
                    allowShortCircuit: true,
                    allowTernary: true,
                },
            ],
            "@typescript-eslint/no-use-before-define": "off",
            "@typescript-eslint/no-var-requires": "error",
            "@typescript-eslint/prefer-for-of": "error",
            "@typescript-eslint/prefer-function-type": "error",
            "@typescript-eslint/prefer-namespace-keyword": "error",
            "@typescript-eslint/require-array-sort-compare": [
                "error",
                { ignoreStringArrays: true },
            ],
            "@typescript-eslint/semi": "off",
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
            jsdoc,
        },
        rules: {
            "jsdoc/check-alignment": "off",
            "jsdoc/check-indentation": "off",
            "jsdoc/newline-after-description": "off",
        },
    },
    {
        files: ["src/completions/*.ts", "src/excmds.ts"],
        rules: {
            // We have methods that must be async in some classes but not in others
            // In src/excmds anything that crosses between content<->background must be async even if it looks like it isn't
            "@typescript-eslint/require-await": "off",
        },
    },
    {
        files: ["src/lib/editor_utils.ts"],
        rules: {
            // The regexes use the /g flag which match handles differently to exec
            "@typescript-eslint/prefer-regexp-exec": "off",
        },
    },
]
