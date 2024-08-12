import globals from "globals"
import stylistic from "@stylistic/eslint-plugin"

export default [
    {
        plugins: {
            stylistic,
        },
        languageOptions: {
            sourceType: "commonjs",
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            "padding-line-between-statements": [
                "error",
                { blankLine: "always", prev: "function", next: "function" },
                {
                    blankLine: "always",
                    prev: "function",
                    next: "multiline-block-like",
                },
                {
                    blankLine: "always",
                    prev: "multiline-block-like",
                    next: "block",
                },
                {
                    blankLine: "always",
                    prev: "block",
                    next: "multiline-block-like",
                },
                { blankLine: "always", prev: "block", next: "block" },
                { blankLine: "never", prev: "import", next: "import" },
            ],
        },
        files: ["./widget/*.js"],
    },
]
