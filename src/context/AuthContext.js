import { createContext } from 'react';

// Contexto separado do provedor e do hook para que cada arquivo exporte
// uma única coisa: o Fast Refresh do Vite só preserva estado em módulos que
// exportam apenas componentes.
export const AuthContext = createContext(null);
