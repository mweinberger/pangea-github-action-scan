const core = require('@actions/core');
const github = require('@actions/github');

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
    const aiMatch = await myRe.test("This is example text to see if our search for from 'langchain' is working");
    core.info('Response: '+aiMatch);
    core.setOutput('results', aiMatch);
  } catch (err) {   
      core.setFailed(err);
    }
}
run();
