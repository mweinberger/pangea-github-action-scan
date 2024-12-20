const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs/promises');

const context = github.context;


async function searchFilesRecursively(directory, regex, locations) {
  const files = await fs.readdir(directory, { withFileTypes: true });
  for (const file of files) {
    const filePath = `${directory}/${file.name}`;
    if (file.isDirectory()) {
      await searchFilesRecursively(filePath, regex, locations);
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
        "results": []
      }
    ]
  };

  const data = core.getInput('text').split(',');
  core.info('Data: ' + data);
  for (llm of data) {
    
    try {
      core.info('Package to be tested: ' + llm);
      const myRe = new RegExp("from '" + llm + "'", "g");
      const locations = [];
      const response = await searchFilesRecursively(".", myRe, locations);
      sarif.runs[0].results.push({
        "ruleId": "LLM_SECURITY",
        "message": "LLM code found without security measures. Detection was: " + llm,
        "kind": "warning",
        "level": "warning",
        "locations": response
      });
    } catch (err) {
      core.setFailed(err);
    }
  }
  core.info('Response: ' + JSON.stringify(sarif));
  fs.writeFile('results.sarif', JSON.stringify(sarif));
  core.setOutput('results', JSON.stringify(sarif));
}
run();