const { AwsCdkConstructLibrary } = require('projen');
const { Automation } = require('projen-automate-it');
const { Mergify } = require('projen/lib/github');

const AUTOMATION_TOKEN = 'PROJEN_GITHUB_TOKEN';

const project = new AwsCdkConstructLibrary({
  author: 'Pahud Hsieh',
  authorAddress: 'pahudnet@gmail.com',
  description: 'CDK construct library for CloudFront Extensions',
  cdkVersion: '1.73.0',
  defaultReleaseBranch: 'main',
  jsiiFqn: 'projen.AwsCdkConstructLibrary',
  name: 'cdk-cloudfront-plus',
  repositoryUrl: 'https://github.com/pahudnet/cdk-cloudfront-plus.git',
  cdkDependencies: [
    '@aws-cdk/core',
    '@aws-cdk/aws-apigatewayv2',
    '@aws-cdk/aws-apigatewayv2-integrations',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-cloudfront',
    '@aws-cdk/aws-cloudfront-origins',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-kinesisfirehose',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-lambda-nodejs',
    '@aws-cdk/aws-sam',
    '@aws-cdk/aws-s3',
    '@aws-cdk/aws-s3-deployment',
  ],
  devDeps: [
    '@types/node',
    'aws-sdk',
    'esbuild',
    'projen-automate-it',
    'axios',
  ],
  bundledDeps: [
    'dotenv',
  ],
  publishToPypi: {
    distName: 'cdk-cloudfront-plus',
    module: 'cdk_cloudfront_plus',
  },
  dependabot: false,
  keywords: [
    'cdk',
    'cloudfront',
    'cdn',
    'extension',
  ],
  cdkTestDependencies: [
    '@aws-cdk/aws-s3',
    '@aws-cdk/aws-s3-deployment',
  ],
  testdir: 'src/__tests__',
  mergify: false,
});

const mergifyRules = [
  {
    name: 'Automatic merge on approval and successful build',
    actions: {
      merge: {
        method: 'squash',
        commit_message: 'title+body',
        strict: 'smart',
        strict_method: 'merge',
      },
      delete_head_branch: {},
    },
    conditions: [
      '#approved-reviews-by>=1',
      'status-success=build',
      '-title~=(WIP|wip)',
      '-label~=(blocked|do-not-merge)',
    ],
  },
  {
    name: 'Automatic merge PRs with auto-merge label upon successful build',
    actions: {
      merge: {
        method: 'squash',
        commit_message: 'title+body',
        strict: 'smart',
        strict_method: 'merge',
      },
      delete_head_branch: {},
    },
    conditions: [
      'label=auto-merge',
      'status-success=build',
      '-title~=(WIP|wip)',
      '-label~=(blocked|do-not-merge)',
    ],
  },
];

new Mergify(project.github, {
  rules: mergifyRules,
});

const automation = new Automation(project, {
  automationToken: AUTOMATION_TOKEN,
});

automation.projenYarnUpgrade();

const common_exclude = [
  'cdk.out',
  'cdk.context.json',
  'images',
  'yarn-error.log',
  'dependabot.yml',
  'demo-assets',
  '.env',
];
project.npmignore.exclude(...common_exclude);
project.gitignore.exclude(...common_exclude);

project.synth();
