/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Tipos válidos de commit
    'type-enum': [
      2,
      'always',
      [
        'feat',     // nova funcionalidade
        'fix',      // correção de bug
        'docs',     // apenas documentação
        'style',    // formatação, ponto-e-vírgula, etc. (sem mudança de lógica)
        'refactor', // refatoração sem nova feature ou bugfix
        'perf',     // melhoria de performance
        'test',     // adição ou correção de testes
        'build',    // mudanças no sistema de build ou dependências externas
        'ci',       // mudanças nos arquivos de configuração de CI
        'chore',    // outras mudanças que não afetam src/ ou test/
        'revert',   // reverte um commit anterior
      ],
    ],
    // Permite subject em qualquer capitalização (útil para PT-BR)
    'subject-case': [0],
    // Subject não pode terminar com ponto
    'subject-full-stop': [2, 'never', '.'],
    // Subject não pode ser vazio
    'subject-empty': [2, 'never'],
    // Type não pode ser vazio
    'type-empty': [2, 'never'],
    // Tamanho máximo do header (type + scope + subject)
    'header-max-length': [2, 'always', 100],
  },
};
