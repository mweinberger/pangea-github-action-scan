const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs/promises');

const context = github.context;


async function searchFilesRecursively(directory, regex) {
  const files = await fs.readdir(directory, { withFileTypes: true });

  for (const file of files) {
    console.log(file);
    const filePath = `${directory}/${file.name}`;
    const locations = []
    if (file.isDirectory()) {
      await searchFilesRecursively(filePath, regex);
    } else {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const matches = fileContent.matchAll(regex)
      for (const match of matches) {
        locations.push(
        {
          "physicalLocation": {
            "artifactLocation": {
              "uri": filePath
            },
            "region": {
              "startLine": 0,
              "endLine": 0,
            }
          }
        }
      )};
    }
  }
  return locations;
}

async function run() {

  const data = core.getInput('text')
  const sarif = {
    "$schema": "https://raw.githubusercontent.com/oasis-open/sarif/master/schema/2.1.0/sarif-schema-2.1.0.json",
    "version": "2.1.0",
    "runs": [
      {
        "tool": {
          "driver": {
            "name": "PangeaScanner",
            "fullName": "Pangea LLM Security Scanner",
            "version": "1.0.0"
          }
        },
        "results": [
          {
            "ruleId": "LLM_SECURITY",
            "message": "LLM code found without security measures.",
            "kind": "warning",
            "level": "warning",
            "locations": []
          }
        ]
      }
    ]
  }
  try {
    core.info('Package to be tested: ' + data);
    const myRe = new RegExp("from '" + data + "'", "g");
    const response = await searchFilesRecursively(".", myRe);
    sarif.runs[0].results[0].locations = response;
    core.info('Response: ' + sarif);
    core.setOutput('results', sarif);
    fs.writeFile('results.sarif', JSON.stringify(sarif));
  } catch (err) {
    core.setFailed(err);
  }
}
run();