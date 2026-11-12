// Ambiente mínimo dos testes. O Firebase é inicializado por import em
// `services/firebase.js`; os utilitários testados não o usam, mas o módulo
// precisa carregar sem variáveis de ambiente reais.
import '@testing-library/jest-dom/vitest';
