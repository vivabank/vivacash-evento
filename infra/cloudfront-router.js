function handler(event) {
  var request = event.request;
  var host = request.headers.host ? request.headers.host.value : '';

  // Lista de domínios injetados pelo Github Actions
  var devDomains = [
    /*{{DEVELOP_DOMAINS}}*/
  ];
  var mainDomains = [
    /*{{MAIN_DOMAINS}}*/
  ];

  // Prefixos de diretórios no S3 injetados pelo Github Actions
  var devPrefix = 'DEVELOP_PLACEHOLDER';
  var mainPrefix = 'MAIN_PLACEHOLDER';

  var targetPrefix = 'DEFAULT_PLACEHOLDER';

  // 1. Identificar qual o ambiente com base no Hostname
  if (devDomains.indexOf(host) !== -1) {
    targetPrefix = devPrefix;
  } else if (mainDomains.indexOf(host) !== -1) {
    targetPrefix = mainPrefix;
  }

  // 2. Forçar a reescrita do caminho (URI) mantendo o roteamento interno do SPA (React/Vue/Vite)
  // Se a URI não começar com o prefixo do S3, nós injetamos ele na frente
  if (!request.uri.startsWith(targetPrefix)) {
    // Trata arquivos estáticos comuns (ex: .js, .css, .png)
    if (request.uri.includes('.')) {
      request.uri = targetPrefix + request.uri;
    } else {
      // Se for uma rota interna do app (ex: /login, /dashboard), joga para o index.html daquela pasta
      request.uri = targetPrefix + '/index.html';
    }
  }

  return request;
}
