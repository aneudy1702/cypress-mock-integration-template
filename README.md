# Cypress Mock Integration Template

[![Cypress Tests](https://github.com/aneudy1702/cypress-mock-integration-template/actions/workflows/cypress.yml/badge.svg)](https://github.com/aneudy1702/cypress-mock-integration-template/actions)

## Overview
Welcome to the **Cypress Mock Integration Template** repository! This project is designed to help frontend developers simulate backend responses while writing Cypress tests. You can either integrate the template manually into your project or use the CLI tool for a one-command setup.

## Features
- **Mock Backend Responses**: Easily mock different backend scenarios such as successful responses, errors, and timeouts using `cy.intercept()`.
- **Automated Testing Setup**: Quickly set up Cypress with a GitHub Actions workflow, reporting, and folder structure.
- **Manual or CLI Installation**: Choose between copying the configurations manually or running a single CLI command to get everything set up in seconds.

## Getting Started

### Option 1: Use the CLI Tool

Let’s say you’re in a hurry, and you don’t want to manually move files around. You can simply let the CLI do the heavy lifting for you.

1. First, install the CLI using `npx`:

   ```bash
   npx cypress-mock-integration-template init
   ```

   The CLI will handle:
   - Creating the Cypress folder structure.
   - Adding Cypress configurations, test files, and GitHub Actions workflow.
   - Updating your `package.json` with Cypress and reporting scripts.

   **You’ll be ready to run tests in seconds!**

2. Run your Cypress tests:

   Open the Cypress test runner:
   ```bash
   npm run cypress:open
   ```

   Or run the tests in headless mode:
   ```bash
   npm run cypress:run
   ```

3. Generate reports:

   After your tests have run, generate the HTML report:
   ```bash
   npm run report:generate
   ```

### Option 2: Manual Installation

If you prefer to integrate the template manually, no problem! Just follow these steps to copy the necessary files and configurations into your project.

1. **Create the Cypress folder structure**:

   ```bash
   mkdir -p cypress/{fixtures,e2e,reports,videos,screenshots,plugins,support}
   mkdir -p .github/workflows
   ```

2. **Copy the configuration files**:

   - **`cypress.config.js`**:

     ```javascript
     const { defineConfig } = require('cypress');

     module.exports = defineConfig({
       e2e: {
         setupNodeEvents(on, config) {
           // implement node event listeners here
         },
         baseUrl: 'http://localhost:3000',
         specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
         supportFile: 'cypress/support/index.js',
         video: true,
         screenshotOnRunFailure: true,
         reporter: 'mochawesome',
         reporterOptions: {
           reportDir: 'cypress/reports',
           overwrite: false,
           html: false,
           json: true,
         },
       },
     });
     ```

   - **GitHub Actions Workflow (`.github/workflows/cypress.yml`)**:

     ```yaml
     name: Cypress Tests

     on:
       push:
         branches:
           - main
           - develop
       pull_request:
         branches:
           - main
           - develop

     jobs:
       cypress-run:
         runs-on: ubuntu-latest

         steps:
           - name: Checkout code
             uses: actions/checkout@v4

           - name: Cache Node modules
             uses: actions/cache@v4
             with:
               path: ~/.npm
               key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
               restore-keys: |
                 ${{ runner.os }}-node-

           - name: Set up Node.js environment
             uses: actions/setup-node@v4
             with:
               node-version: "20"

           - name: Install dependencies
             run: npm install

           - name: Create placeholder directories for screenshots and videos
             run: |
               mkdir -p cypress/screenshots
               mkdir -p cypress/videos

           - name: Start application server
             run: npm run start &
             env:
               CI: true

           - name: Run Cypress tests
             run: npm run cypress:run

           - name: Generate HTML report
             run: npm run report:generate

           - name: Upload Cypress Report
             uses: actions/upload-artifact@v4
             with:
               name: cypress-report
               path: cypress/reports/report.html
     ```

3. **Add the necessary scripts to `package.json`**:

   ```json
   {
     "scripts": {
       "cypress:open": "cypress open",
       "cypress:run": "cypress run",
       "report:merge-json": "npx mochawesome-merge cypress/reports/*.json > cypress/reports/report.json",
       "report:generate-html": "npx mochawesome-report-generator cypress/reports/report.json --reportDir cypress/reports --inline",
       "report:generate": "npm run report:merge-json && npm run report:generate-html"
     }
   }
   ```

4. **Install Cypress and report generator**:

   ```bash
   npm install cypress mochawesome mochawesome-merge mochawesome-report-generator
   ```

Once you've copied all the necessary files, you’re good to go! You can now run the same commands to open Cypress, run tests, and generate reports.

## Contributing
We welcome contributions! Feel free to open an issue or submit a pull request if you want to improve this template.

---

This approach gives developers full flexibility to either use the CLI for speed or manually copy configurations for more control. Let me know if you need further adjustments!
