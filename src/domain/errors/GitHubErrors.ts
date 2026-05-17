export class RateLimitError extends Error {
  constructor() {
    super('Limite de requisições da API do GitHub excedido. Tente novamente em alguns minutos.');
    this.name = 'RateLimitError';
  }
}

export class NetworkError extends Error {
  constructor() {
    super('Sem conexão com a internet. Verifique sua rede e tente novamente.');
    this.name = 'NetworkError';
  }
}

export class NotFoundError extends Error {
  constructor() {
    super('Nenhum resultado encontrado para esta busca.');
    this.name = 'NotFoundError';
  }
}

export class UnknownApiError extends Error {
  constructor(statusCode?: number) {
    super(
      `Erro inesperado na API do GitHub${statusCode ? ` (${statusCode})` : ''}. Tente novamente.`,
    );
    this.name = 'UnknownApiError';
  }
}
