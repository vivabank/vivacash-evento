function handler(event) {
  var request = event.request;
  var host = request.headers.host ? request.headers.host.value : '';

  var targetPrefix = '';

  // Mapeamento de Domínio -> Pasta no S3
  if (host === 'www.meuvivacash.com' || host === 'meuvivacash.com') {
    targetPrefix = '/frontend/main/main-latest';
  } else if (host === 'dev.meuvivacash.com') {
    targetPrefix = '/frontend/develop/develop-latest';
  } else if (host === 'evento.meuvivacash.com') {
    targetPrefix = '/evento/main/main-latest';
  } else if (host === 'dev-evento.meuvivacash.com') {
    targetPrefix = '/evento/develop/develop-latest';
  } else if (host === 'qrcode.meuvivacash.com') {
    targetPrefix = '/qrcode/main/main-latest';
  } else {
    // Fallback padrão seguro (ex: frontend principal)
    targetPrefix = '/frontend/main/main-latest';
  }

  // Forçar a reescrita do caminho (URI) mantendo o roteamento interno do SPA
  if (!request.uri.startsWith(targetPrefix)) {
    if (request.uri.includes('.')) {
      request.uri = targetPrefix + request.uri;
    } else {
      request.uri = targetPrefix + '/index.html';
    }
  }

  return request;
}
