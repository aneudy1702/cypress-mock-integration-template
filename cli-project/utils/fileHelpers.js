const fs = require('fs-extra');
const path = require('path');
const childProcess = require('child_process');

const FOLDER_STRUCTURE = [
  'cypress/fixtures',
  'cypress/e2e',
  'cypress/reports',
  'cypress/videos',
  'cypress/screenshots',
  'cypress/plugins',
  'cypress/support',
  '.github/workflows'
];

// Ensure package.json exists
async function updatePackageJson() {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error('No package.json found. Please run this in a valid Node.js project.');
  }

  const packageJson = fs.readJsonSync(packageJsonPath);
  packageJson.scripts = {
    ...packageJson.scripts,
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "report:merge-json": "npx mochawesome-merge cypress/reports/*.json > cypress/reports/report.json",
    "report:generate-html": "npx mochawesome-report-generator cypress/reports/report.json --reportDir cypress/reports --inline",
    "report:generate": "npm run report:merge-json && npm run report:generate-html"
  };

  fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
  console.log('Scripts added to package.json.');
}

// Create folder structure
async function createFolders() {
  FOLDER_STRUCTURE.forEach(folder => {
    fs.ensureDirSync(path.resolve(process.cwd(), folder));
  });
  console.log('Cypress folder structure created.');
}

// Install required dependencies
async function installDependencies() {
  console.log('Installing dependencies...');
  childProcess.execSync('npm install cypress mochawesome mochawesome-merge mochawesome-report-generator', {
    cwd: process.cwd(),
    stdio: 'inherit'
  });
}

// Create necessary files (config, workflow, etc.)
async function createFiles() {
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

          - name: Run Cypress tests
            run: npm run cypress:run

          - name: Generate HTML report
            run: npm run report:generate

          - name: Upload Cypress Report
            uses: actions/upload-artifact@v4
            with:
              name: cypress-report
              path: cypress/reports/report.html
  `;
  fs.writeFileSync(path.resolve(process.cwd(), '.github/workflows/cypress.yml'), workflowContent);
  console.log('GitHub Actions workflow created.');
}

module.exports = {
  createFolders,
  updatePackageJson,
  installDependencies,
  createFiles
};
