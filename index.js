const core = require('@actions/core');
const github = require('@actions/github');
import { readdir } from 'node:fs/promises';

const context = github.context;

// most @actions toolkit packages have async methods
async function run() {
  const data = {
    action: context.action,
    actor: context.actor,
    target: context.eventName,
    message: core.getInput('text'),
    source: "GitHub Workflow Job: "+context.workflow +"/"+context.job,
  };

  try{
    core.info('Package to be tested: '+data.message);
    const myRe = new RegExp("from '"+data.message+"'", "g");
    const files = readdir("./");
    const response = false
    for (const file in files) {
      console.log(file);
      const aiMatch = myRe.test(file);
      if (aiMatch){
        response = true;
      }
    }
    core.info('Response: '+response);
    core.setOutput('results', response);
  } catch (err) {   
      core.setFailed(err);
    }
}
run();
