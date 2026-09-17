import React from 'react';

/**
 * Avatar do usuário, com a ordem de prioridade num único lugar:
 *
 *   1. usuarios.fotoPerfil  — a foto que a pessoa escolheu aqui
 *   2. currentUser.photoURL — a foto da conta Google, quando existir
 *   3. iniciais do nome
 *
 * A foto do Google nunca é copiada para `fotoPerfil`: ela é só um fallback,
 * então continua refletindo a conta Google enquanto a pessoa não escolher
 * uma própria.
 */
export default function Avatar({ fotoPerfil, photoURL, nome, className = '', textoClassName = '' }) {
  const src = fotoPerfil || photoURL || null;
  const inicial = (nome || 'Usuário').trim().charAt(0).toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={`Foto de ${nome || 'perfil'}`}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center justify-center uppercase ${className} ${textoClassName}`}>
      {inicial}
    </div>
  );
}
