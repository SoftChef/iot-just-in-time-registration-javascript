const { TypeScriptAppProject } = require('projen');
const project = new TypeScriptAppProject({
  defaultReleaseBranch: 'main',
  name: 'iot-device-simulator',
});
project.synth();