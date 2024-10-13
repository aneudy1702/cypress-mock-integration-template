#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs-extra');
const path = require('path');
const childProcess = require('child_process');

// Initialize Commander program
const program = new Command();

program.version('1.0.0');

program
  .command('init')
  .description('Initialize Cypress mock integration template')
  .action(async () => {
    try {
      console.log('Current working directory:', process.cwd());

      // Ensure the current directory contains a package.json
      const packageJsonPath = path.resolve(process.cwd(), 'package.json');
      console.log('Looking for package.json at:', packageJsonPath);

      if (!fs.existsSync(packageJsonPath)) {
        console.error('Error: No package.json found in this directory. Please run this command in a valid Node.js project.');
        return;
      }

      console.log('Initializing Cypress Mock Integration Template...');

      // Read the existing package.json
      const packageJson = fs.readJsonSync(packageJsonPath);

      // Add Cypress and report generation scripts
      packageJson.scripts = {
        ...packageJson.scripts,
        "cypress:open": "cypress open",
        "cypress:run": "cypress run",
        "report:merge-json": "npx mochawesome-merge cypress/reports/*.json > cypress/reports/report.json",
        "report:generate-html": "npx mochawesome-report-generator cypress/reports/report.json --reportDir cypress/reports --inline",
        "report:generate": "npm run report:merge-json && npm run report:generate-html"
      };

      // Write back the updated package.json
      fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
      console.log('Scripts added to package.json.');

      // Define the folder structure
      const cypressFolder = [
        'cypress/fixtures',
        'cypress/e2e',
        'cypress/reports',
        'cypress/videos',
        'cypress/screenshots',
        'cypress/plugins',
        'cypress/support',
        '.github/workflows'
      ];

      cypressFolder.forEach(folder => {
        fs.ensureDirSync(path.resolve(process.cwd(), folder));
      });

      console.log('Cypress folder structure created.');

      // Write the latest cypress.config.js file
      const cypressConfigContent = `
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
      `;
      fs.writeFileSync(path.resolve(process.cwd(), 'cypress.config.js'), cypressConfigContent);
      console.log('Cypress config file created.');

      // Write the latest GitHub Actions workflow file
      const workflowContent = `
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
                  key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}
                  restore-keys: |
                    \${{ runner.os }}-node-

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

              - name: Wait for server to be ready
                run: |
                  for i in \$(seq 1 60); do
                    curl --silent http://localhost:3000 && break
                    echo "Waiting for server..."
                    sleep 1
                  done

              - name: Run Cypress tests
                run: npm run cypress:run

              - name: List screenshot files
                run: ls -l cypress/screenshots

              - name: Generate HTML report
                run: npm run report:generate

              - name: List report files after generation
                run: ls -l cypress/reports

              - name: Upload Cypress screenshots as an artifact
                if: always()
                uses: actions/upload-artifact@v4
                with:
                  name: cypress-screenshots
                  path: cypress/screenshots
                  if-no-files-found: warn

              - name: Upload Cypress videos as an artifact
                if: always()
                uses: actions/upload-artifact@v4
                with:
                  name: cypress-videos
                  path: cypress/videos
                  if-no-files-found: warn

              - name: Upload Cypress Report
                uses: actions/upload-artifact@v4
                with:
                  name: cypress-report
                  path: cypress/reports/report.html
      `;
      fs.writeFileSync(path.resolve(process.cwd(), '.github/workflows/cypress.yml'), workflowContent);
      console.log('GitHub Actions workflow created.');

      // Create a demo test file
      const demoTestContent = `
        describe('Demo Test', () => {
          it('Visits the Cypress Docs', () => {
            cy.visit('https://docs.cypress.io');
          });
        });
      `;
      fs.writeFileSync(path.resolve(process.cwd(), 'cypress/e2e/demo.cy.js'), demoTestContent);
      console.log('Demo test file created.');

      // Install Cypress and other dependencies in the correct directory
      console.log('Installing dependencies...');
      childProcess.execSync('npm install cypress mochawesome mochawesome-merge mochawesome-report-generator', {
        cwd: process.cwd(),
        stdio: 'inherit'
      });

      // Add Cypress badge to README
      const readmePath = path.resolve(process.cwd(), 'README.md');
      if (fs.existsSync(readmePath)) {
        const badgeMarkdown = `[![Cypress Tests](https://github.com/YOUR_REPO/actions/workflows/cypress.yml/badge.svg)](https://github.com/YOUR_REPO/actions)\n\n`;
        fs.appendFileSync(readmePath, badgeMarkdown);
        console.log('Cypress badge added to README.');
      } else {
        fs.writeFileSync(readmePath, `[![Cypress Tests](https://github.com/YOUR_REPO/actions/workflows/cypress.yml/badge.svg)](https://github.com/YOUR_REPO/actions)\n\n# Project\n`);
        console.log('README file created and Cypress badge added.');
      }

      console.log('Cypress setup complete.');
    } catch (err) {
      console.error('Error during initialization:', err);
    }
  });

program.parse(process.argv);
