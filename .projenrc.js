const { DependenciesUpgradeMechanism, NpmAccess, ProjectType, TypeScriptAppProject } = require('projen');

const AUTOMATION_TOKEN = 'PROJEN_GITHUB_TOKEN';

const project = new TypeScriptAppProject({
  author: 'softchef-iot-lab',
  authorName: 'MinChe Tsai',
  authorEmail: 'poke@softchef.com',
  npmAccess: NpmAccess.PUBLIC,
  projectType: ProjectType.LIB,
  projenVersion: '0.27.0',
  defaultReleaseBranch: 'main',
  name: '@softchef/iot-just-in-time-registration',
  repositoryUrl: 'https://github.com/SoftChef/iot-just-in-time-registration-javascript.git',
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
  depsUpgrade: DependenciesUpgradeMechanism.githubWorkflow({
    ignoreProjen: false,
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      secret: AUTOMATION_TOKEN,
    },
  }),
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['MinCheTsai'],
  },
  tsconfig: {
    compilerOptions: {
    },
  },
});
project.synth();