#!/bin/bash

# Create the main Cypress directories
mkdir -p cypress/{fixtures,integration,plugins,support}

# Create a basic structure with a sample test file and fixture
echo "Creating Cypress directories and files..."

# Create a sample test file
cat <<EOT >cypress/integration/sampleTest.spec.js
describe('Sample Test', () => {
  it('should visit the homepage', () => {
    cy.visit('/');
    cy.contains('Welcome to Cypress Testing').should('be.visible');
  });
});
EOT

# Create a sample fixture file
cat <<EOT >cypress/fixtures/sampleData.json
{
  "username": "testuser",
  "password": "password123"
}
EOT

# Create a sample plugin file
cat <<EOT >cypress/plugins/index.js
/// <reference types="cypress" />

// This example plugins/index.js can be used to load plugins

module.exports = (on, config) => {
  // Modify config values or implement event listeners here
  return config;
};
EOT

# Create a support command file
cat <<EOT >cypress/support/commands.js
// Add custom Cypress commands here
Cypress.Commands.add('login', (username, password) => {
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});
EOT

# Create a support index file
cat <<EOT >cypress/support/index.js
// Import custom commands
import './commands';
EOT

# Create the cypress configuration file
cat <<EOT >cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000', // Set your base URL here
    supportFile: 'cypress/support/index.js',
  },
});
EOT

# Create the GitHub Actions workflow directory and file
mkdir -p .github/workflows
cat <<EOT >.github/workflows/cypress.yml
name: Cypress Tests

on: [push, pull_request]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'

      - name: Install dependencies
        run: npm install

      - name: Run Cypress tests
        run: npx cypress run
EOT

# Confirmation message
echo "Cypress template repository structure created successfully!"
