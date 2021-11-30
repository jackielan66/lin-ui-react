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
        'react/jsx-indent-props': [2, 4],
        'linebreak-style': [0],
        'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
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
        'max-len': ['error', { code: 120 }],
        'react/jsx-props-no-spreading': [0],
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
