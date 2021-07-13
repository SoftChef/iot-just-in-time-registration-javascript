const { TypeScriptAppProject, NpmAccess, ProjectType } = require('projen');

const project = new TypeScriptAppProject({
  author: 'softchef-iot-lab',
  authorName: 'MinChe Tsai',
  authorEmail: 'poke@softchef.com',
  npmAccess: NpmAccess.PUBLIC,
  projectType: ProjectType.LIB,
  projenVersion: '0.27.0',
  defaultReleaseBranch: 'main',
  name: '@softchef/iot-device-simulator',
  repositoryUrl: 'https://github.com/SoftChef/iot-device-simulator-javascript.git',
  release: true,
  releaseToNpm: true,
  package: true,
  entrypoint: 'lib/index.js',
  deps: [
    '@types/node@16.3.1',
    '@types/node-forge',
    'node-forge',
  ],
  devDeps: [
    'aws-iot-device-sdk',
  ],
  tsconfig: {
    compilerOptions: {
    },
  },
});
project.synth();