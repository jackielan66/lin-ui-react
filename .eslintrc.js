module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'plugin:react/recommended',
        'airbnb',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: [
        'react',
        'import',
        '@typescript-eslint',
    ],
    rules: {
        semi: ['error', 'always'],
        quotes: ['error', 'single'],
        indent: ['error', 4],
        'react/jsx-indent': ['error', 4, {
            checkAttributes: true, indentLogicalExpressions: true,
        }],
        'import/order': ['error', {
            pathGroups: [
                {
                    pattern: '@app/**',
                    group: 'external',
                    position: 'after',
                },
            ],
            pathGroupsExcludedImportTypes: ['builtin'],
        }],
        // 'sort-imports': ['error', {
        //     ignoreCase: false,
        //     ignoreDeclarationSort: false,
        //     ignoreMemberSort: false,
        //     memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        //     allowSeparatedGroups: true,
        // }],
        // 'simple-import-sort/imports': 'error',
        // 'simple-import-sort/exports': 'error',
    },
};
