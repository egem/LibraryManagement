import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
    {languageOptions: { globals: globals.browser }},
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            '@typescript-eslint/no-empty-object-type': 'off', // Disable the rule,
            "comma-dangle": ["error", "never"],
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    "argsIgnorePattern": "__*",
                    "caughtErrors": "none"
                }
            ],
            "no-trailing-spaces": "error",
            "no-multiple-empty-lines": ["error", { "max": 1 }]
        },
    },
];
