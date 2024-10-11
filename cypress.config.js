const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000', // Your local server URL
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', // Pattern for test files
    supportFile: 'cypress/support/index.js', // Support file location
  },
});
