module.exports = {
  team: 'BANCAVIRTUAL',
  branch: 'QA',
  repository: 'bbog-pb-frontend-authentication-app',
  framework: 'REACT',
  crawlFrom: './src',
  url: 'https://3mt8atlcre.execute-api.us-east-1.amazonaws.com/v1/v1/utilities/web-components/use-report',
  processors: [['count-components', { outputTo: './sherpa-report-angular.json' }]]
};
