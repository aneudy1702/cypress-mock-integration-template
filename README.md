# Cypress Mock Integration Template

[![Cypress Tests](https://github.com/aneudy1702/cypress-mock-integration-template/actions/workflows/cypress.yml/badge.svg)](https://github.com/aneudy1702/cypress-mock-integration-template/actions)

## Overview
This repository provides a Cypress testing template designed to mock backend services using `cy.intercept()`, allowing for reliable and isolated frontend integration testing. This template is perfect for frontend teams who want to validate user flows and behavior without depending on complex backend services.

## Features
- **Mock Backend Responses**: Use `cy.intercept()` to simulate different backend scenarios (e.g., successful responses, errors, timeouts).
- **Visual Testing Integration**: Configure visual testing tools to compare snapshots and identify UI regressions.
- **GitHub Actions CI/CD**: Automated testing pipeline set up using GitHub Actions to run tests on every push/pull request.
- **Custom Reporting**: Generate detailed test reports and set up Slack notifications for real-time updates.

## Test Reports

Test reports and artifacts (screenshots and videos) are generated for each test run. You can view the latest reports and artifacts in the [GitHub Actions](https://github.com/aneudy1702/cypress-mock-integration-template/actions) tab by selecting the latest workflow run and downloading the artifacts listed under "cypress-report".

## Getting Started

### Prerequisites
- **Node.js** (v14 or later)
- **npm** (v6 or later)
- **Cypress** (v10 or later)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cypress-mock-integration-template.git
   ```
2. Navigate into the project directory:
   ```bash
   cd cypress-mock-integration-template
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running Tests
To run the Cypress tests locally:
   ```bash
   npx cypress open
   ```
   - This will open the Cypress Test Runner where you can run tests interactively.

To run tests in headless mode:
   ```bash
   npx cypress run
   ```

## Project Structure
```
cypress-mock-integration-template/
│
├── cypress/
│   ├── fixtures/           # Static mock data used in tests
│   ├── integration/        # Cypress test files
│   ├── plugins/            # Plugins for Cypress configuration
│   └── support/            # Custom commands and utilities
│
├── .github/
│   └── workflows/
│       └── cypress.yml     # GitHub Actions workflow for CI/CD
│
├── cypress.config.js       # Cypress configuration file
├── package.json            # Node.js dependencies and scripts
└── README.md               # Project documentation
```

## Using `cy.intercept()`
We use `cy.intercept()` to control and mock backend responses. This approach allows you to:
- Simulate success, failure, and edge cases.
- Validate frontend behavior in isolation from backend dependencies.
  
For detailed usage examples, check out the [Wiki](https://github.com/your-username/cypress-mock-integration-template/wiki/Part-One:-cy.intercept()-Best-Practices) where we provide in-depth guides and test cases.

## Setting Up CI/CD with GitHub Actions
This template includes a GitHub Actions workflow (`cypress.yml`) that:
- Runs tests on every push and pull request.
- Caches dependencies for faster execution.
- Provides test reports and failure logs.

To enable GitHub Actions, ensure you have the appropriate permissions and GitHub Secrets set up for any environment variables required.

## Visual Testing and Reporting
For advanced visual testing, we recommend integrating tools like **Percy** or **Applitools**. The template includes placeholders and configurations for these tools. Detailed setup instructions and reporting features will be covered in the Wiki.

## Contributing
We welcome contributions! If you find a bug or have a feature request, please open an issue or submit a pull request.

### Steps for Contribution
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push the branch (`git push origin feature/new-feature`).
5. Open a pull request.

## License
This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

![image](https://github.com/user-attachments/assets/f8be25cf-1ec2-4848-aae0-8f2a16a043d8)

