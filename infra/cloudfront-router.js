function handler(event) {
  var request = event.request;
  var host = request.headers.host.value;
  var uri = request.uri;

  // Lista de domínios permitidos por ambiente
  var developDomains = [
    /*{{DEVELOP_DOMAINS}}*/
  ];
  var mainDomains = [
    /*{{MAIN_DOMAINS}}*/
  ];

  // Prefixos de versão com subdiretórios S3 (preenchidos pelo GitHub Actions)
  // Formato: /evento/develop/develop-latest ou /evento/main/main-latest
  var DEVELOP_PREFIX = 'DEVELOP_PLACEHOLDER';
  var MAIN_PREFIX = 'MAIN_PLACEHOLDER';
  var DEFAULT_PREFIX = 'DEFAULT_PLACEHOLDER';

  // Validação de segurança
  var allAllowed = developDomains.concat(mainDomains);
  if (allAllowed.indexOf(host) === -1) {
    return {
      statusCode: 403,
      statusDescription: 'Forbidden',
    };
  }

  // Seleção de versão baseada no domínio
  var versionPrefix = DEFAULT_PREFIX;

  if (developDomains.indexOf(host) !== -1) {
    versionPrefix = DEVELOP_PREFIX;
  } else if (mainDomains.indexOf(host) !== -1) {
    versionPrefix = MAIN_PREFIX;
  }

  // Roteamento SPA: arquivos vs rotas
  if (uri.indexOf('.') !== -1) {
    // Arquivo estático (tem extensão)
    request.uri = versionPrefix + uri;
  } else {
    // Rota SPA (sem extensão) - serve index.html
    request.uri = versionPrefix + '/index.html';
  }

  return request;
}
