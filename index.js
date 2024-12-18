const core = require('@actions/core');
const github = require('@actions/github');
import { readdir } from 'node:fs/promises';

const context = github.context;


async function searchFilesRecursively(directory, regex) {
  const files = await readdir(directory, { withFileTypes: true });

  for (const file of files) {
    const filePath = `${directory}/${file.name}`;

    if (file.isDirectory()) {
      await searchFilesRecursively(filePath, regex);
    } else {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      if (regex.test(fileContent)) {
        return true;
      }
    }
  }

  return false;
}


// most @actions toolkit packages have async methods
async function run() {

  try {
    core.info('Package to be tested: ' + data.message);
    const myRe = new RegExp("from '" + data.message + "'", "g");

    const response = await searchFilesRecursively(".", myRe);

    core.info('Response: ' + response);
    core.setOutput('results', response);
  } catch (err) {
    core.setFailed(err);
  }
}
run();