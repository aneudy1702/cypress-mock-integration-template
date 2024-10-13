const { createFolders, updatePackageJson, installDependencies, createFiles } = require('../utils/fileHelpers');

module.exports = async function initCommand() {
  try {
    console.log('Initializing Cypress Mock Integration Template...');

    // Ensure the current project has a package.json
    await updatePackageJson();

    // Create folder structure
    await createFolders();

    // Create necessary files (config, workflows, etc.)
    await createFiles();

    // Install required dependencies
    await installDependencies();

    console.log('Cypress setup complete.');
  } catch (error) {
    console.error('Error during initialization:', error);
  }
};
