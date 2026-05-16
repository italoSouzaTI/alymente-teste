// @ts-check
import { createRequire } from 'module';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

// eslint-config-expo é CJS; usamos createRequire para compatibilidade com ESM
const require = createRequire(import.meta.url);
const expo = require('eslint-config-expo/flat.js');

// ─── Mensagens de erro didáticas (em PT-BR) ────────────────────────────────
const MSG = {
  domain_react:
    '❌ [domain/] Não importe "react" ou "react-native" aqui. O domínio precisa rodar em Node puro, sem UI. Se precisa de um contrato, defina uma interface em src/domain/. Implementações concretas ficam em src/infrastructure/.',

  domain_expo:
    '❌ [domain/] Não importe pacotes "expo-*" aqui. O domínio não pode depender do runtime do Expo. Mova esta dependência para src/infrastructure/ e exponha-a via interface.',

  domain_http:
    '❌ [domain/] Não importe "axios" ou qualquer cliente HTTP aqui. O domínio define contratos (interfaces de repositório), não implementações de rede. Crie o cliente em src/infrastructure/http/ e use a interface em src/domain/repositories/.',

  domain_query:
    '❌ [domain/] Não importe "@tanstack/react-query" aqui. Cache e data-fetching pertencem à camada presentation/hooks e infrastructure. O domínio não conhece bibliotecas de UI ou cache.',

  domain_storage:
    '❌ [domain/] Não importe AsyncStorage aqui. Persistência é um detalhe de infraestrutura. Defina uma interface de repositório em src/domain/ e implemente-a em src/infrastructure/.',

  domain_cross:
    '❌ [domain/] Não importe de src/application/, src/presentation/ ou src/infrastructure/. O domínio é a camada mais interna e não depende de nenhuma outra. Se precisar de algo, defina uma interface aqui e injete a implementação concreta via parâmetro nos use cases.',

  application_react:
    '❌ [application/] Não importe "react-native" nem pacotes "expo-*" aqui. A camada application/ orquestra use cases — sem UI, sem framework. Se precisar de algo do runtime, exponha via interface de repositório e injete em src/infrastructure/di/.',

  application_http:
    '❌ [application/] Não importe "axios" aqui. Use cases recebem repositórios via parâmetro (interface do domínio). O cliente HTTP fica em src/infrastructure/http/ e não deve ser chamado diretamente por use cases.',

  application_query:
    '❌ [application/] Não importe "@tanstack/react-query" aqui. Os hooks de data-fetching ficam em src/presentation/hooks/ e chamam os use cases — não o contrário.',

  application_cross:
    '❌ [application/] Não importe de src/presentation/ nem de src/infrastructure/repositories|http. A camada application/ depende apenas de src/domain/. Se precisar de uma implementação concreta, receba-a via injeção de dependência (src/infrastructure/di/).',

  presentation_axios:
    '❌ [presentation/] Telas e componentes não fazem chamadas HTTP diretas. Crie um hook em src/presentation/hooks/ que chame um use case de src/application/use-cases/. O use case delega ao repositório via src/infrastructure/di/.',

  presentation_storage:
    '❌ [presentation/] Telas e componentes não acessam storage diretamente. Encapsule o acesso em um repositório (src/infrastructure/) e exponha via use case → hook.',

  presentation_infra:
    '❌ [presentation/] Não importe implementações concretas de src/infrastructure/repositories/ ou src/infrastructure/http/ nas telas. Use o hook correspondente (src/presentation/hooks/) que injeta as dependências via src/infrastructure/di/.',

  screens_rn_text:
    '❌ [screens/] Não use <Text> do react-native diretamente nas telas. Use o componente <Text> do Design System (src/presentation/components/). Ele aplica os tokens de tipografia e o tema automaticamente.',

  screens_rn_view:
    '❌ [screens/] Evite usar <View> do react-native com style inline nas telas. Prefira <Surface> ou <Card> do Design System e use tokens de spacing (src/infrastructure/theme/tokens.ts) em vez de estilos inline.',
};

// ─── Config exportada (flat config array) ─────────────────────────────────
export default [
  // Base Expo SDK 55 (TypeScript + React + React Native + import rules)
  ...expo,

  // Prettier: desativa regras ESLint que conflitam com Prettier, depois ativa como erro
  prettierConfig,
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    },
  },

  // ─── Regras globais (todo o src/) ───────────────────────────────────────
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // ─── domain/: zero dependências externas e zero cross-layer ─────────────
  {
    files: ['src/domain/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', message: MSG.domain_react },
            { name: 'react-native', message: MSG.domain_react },
            { name: 'axios', message: MSG.domain_http },
            { name: '@tanstack/react-query', message: MSG.domain_query },
            {
              name: '@react-native-async-storage/async-storage',
              message: MSG.domain_storage,
            },
          ],
          patterns: [
            { group: ['expo-*'], message: MSG.domain_expo },
            {
              group: ['**/application/**', '**/application'],
              message: MSG.domain_cross,
            },
            {
              group: ['**/presentation/**', '**/presentation'],
              message: MSG.domain_cross,
            },
            {
              group: ['**/infrastructure/**', '**/infrastructure'],
              message: MSG.domain_cross,
            },
          ],
        },
      ],
    },
  },

  // ─── application/: sem UI, sem infra direta ─────────────────────────────
  {
    files: ['src/application/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react-native', message: MSG.application_react },
            { name: 'axios', message: MSG.application_http },
            { name: '@tanstack/react-query', message: MSG.application_query },
            {
              name: '@react-native-async-storage/async-storage',
              message: MSG.application_react,
            },
          ],
          patterns: [
            { group: ['expo-*'], message: MSG.application_react },
            {
              group: ['**/presentation/**', '**/presentation'],
              message: MSG.application_cross,
            },
            {
              group: ['**/infrastructure/repositories/**'],
              message: MSG.application_cross,
            },
            {
              group: ['**/infrastructure/http/**'],
              message: MSG.application_cross,
            },
            {
              group: ['**/infrastructure/mappers/**'],
              message: MSG.application_cross,
            },
          ],
        },
      ],
    },
  },

  // ─── presentation/: sem chamadas diretas de infra ───────────────────────
  {
    files: ['src/presentation/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'axios', message: MSG.presentation_axios },
            {
              name: '@react-native-async-storage/async-storage',
              message: MSG.presentation_storage,
            },
          ],
          patterns: [
            {
              group: ['**/infrastructure/repositories/**'],
              message: MSG.presentation_infra,
            },
            {
              group: ['**/infrastructure/http/**'],
              message: MSG.presentation_infra,
            },
          ],
        },
      ],
    },
  },

  // ─── screens/: apenas Design System (aviso para imports do RN) ──────────
  {
    files: ['src/presentation/screens/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'warn',
        {
          selector:
            "ImportDeclaration[source.value='react-native'] > ImportSpecifier[imported.name='Text']",
          message: MSG.screens_rn_text,
        },
        {
          selector:
            "ImportDeclaration[source.value='react-native'] > ImportSpecifier[imported.name='View']",
          message: MSG.screens_rn_view,
        },
      ],
    },
  },

  // ─── Testes: relaxar restrições de cross-layer (fakes, factories) ────────
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // ─── Ignora arquivos gerados e configs ───────────────────────────────────
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      'dist/**',
      'web-build/**',
      'coverage/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      'babel.config.js',
    ],
  },
];
