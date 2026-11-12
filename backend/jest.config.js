export default {
    testEnvironment: "node",
    transform: {},

    testMatch: [
        "**/tests/**/templateRoutes.test.js"
    ],

    setupFiles: [
        "<rootDir>/tests/setup.js"
    ],
    testTimeout: 10000
};