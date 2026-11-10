export default {
    testEnvironment: "node",
    transform: {},

    testMatch: [
        "**/tests/**/userRoutes.test.js"
    ],

    setupFiles: [
        "<rootDir>/tests/setup.js"
    ],
    testTimeout: 10000
};