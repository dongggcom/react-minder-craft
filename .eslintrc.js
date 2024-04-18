module.exports = {
    parser: "@babel/eslint-parser",
    extends: [
        require.resolve('@reskript/config-lint/config/eslint'),
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
    ],
    rules: {
        "react/prop-types": 0,
        "react/jsx-no-bind": 0
    },
};
