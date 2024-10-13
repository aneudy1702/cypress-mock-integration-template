const { createFolders, updatePackageJson } = require('../utils/fileHelpers');
const fs = require('fs-extra');
const path = require('path');

jest.mock('fs-extra');
jest.mock('path');

describe('CLI Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create Cypress folder structure', async () => {
    await createFolders();
    expect(fs.ensureDirSync).toHaveBeenCalled();
  });

  test('should update package.json with Cypress scripts', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readJsonSync.mockReturnValue({ scripts: {} });

    await updatePackageJson();

    expect(fs.writeJsonSync).toHaveBeenCalled();
  });

  test('should throw error when package.json does not exist', async () => {
    fs.existsSync.mockReturnValue(false);

    await expect(updatePackageJson()).rejects.toThrow('No package.json found');
  });
});
