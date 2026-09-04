import { useEffect, useState } from 'react';

/**
 * Placeholder "máquina de escrever": digita uma frase, segura, apaga com
 * efeito de backspace e passa para a próxima, em loop infinito.
 *
 * Usado pela barra do Capital Advisor (home) e pela frase de apoio da
 * tela de Login.
 *
 * @param {string[]} phrases  Lista de frases — precisa ser uma constante
 *                            estável (fora do componente), senão o efeito
 *                            reinicia a cada render.
 * @param {boolean}  enabled  Pausa o loop quando falso (ex.: campo em uso
 *                            ou prefers-reduced-motion ativo).
 * @param {object}   options  Ritmo em milissegundos.
 */
export default function useTypewriter(phrases, enabled = true, options = {}) {
  const {
    typeSpeed = 55,
    deleteSpeed = 26,
    holdAfterType = 1900,
    holdAfterDelete = 450,
    startDelay = 600,
  } = options;

  const [text, setText] = useState('');

  useEffect(() => {
    if (!enabled) return;

    let phrase = 0;
    let char = 0;
    let deleting = false;
    let timer;

    const step = () => {
      const current = phrases[phrase];
      char += deleting ? -1 : 1;
      setText(current.slice(0, char));

      let delay = deleting ? deleteSpeed : typeSpeed;

      if (!deleting && char === current.length) {
        deleting = true;
        delay = holdAfterType;
      } else if (deleting && char === 0) {
        deleting = false;
        phrase = (phrase + 1) % phrases.length;
        delay = holdAfterDelete;
      }

      timer = setTimeout(step, delay);
    };

    timer = setTimeout(step, startDelay);
    return () => clearTimeout(timer);
  }, [phrases, enabled, typeSpeed, deleteSpeed, holdAfterType, holdAfterDelete, startDelay]);

  return text;
}
