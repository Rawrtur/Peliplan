export default {
    testEnvironment: "node",
    transform: {},

    testMatch: [
        "**/tests/**/authRoutes.test.js"
    ],

    setupFiles: [
        "<rootDir>/tests/setup.js"
    ],
    testTimeout: 10000
};