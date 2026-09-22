import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * Escuta em tempo real a subcoleção de aportes (ciclos/{id}/aportes) de
 * uma lista de metas. Retorna um mapa { [cicloId]: aportes[] }.
 *
 * O filtro por `uid` não é opcional
 * ---------------------------------
 * A regra de `ciclos/{id}/aportes` libera leitura por documento:
 *
 *     allow read: if request.auth.uid == resource.data.uid
 *
 * Numa LISTA o Firestore não avalia a regra documento a documento — ele
 * exige que a própria consulta garanta, de antemão, que todo resultado vai
 * satisfazer a regra. Uma consulta à subcoleção inteira não garante nada,
 * então era recusada inteira com `permission-denied`, independentemente do
 * que houvesse lá dentro.
 *
 * O efeito era silencioso e grave: o aporte GRAVAVA (a regra de `create`
 * passa), mas nunca voltava pelo listener. A meta seguia mostrando
 * acumulado R$ 0,00 e 0% depois de registrar, como se o botão não
 * funcionasse. O erro só aparecia no console do navegador.
 *
 * Com `where('uid', '==', uid)` a consulta passa a carregar a garantia que
 * a regra pede, e a leitura é aceita. Note que isto NÃO afrouxa nada: o
 * escopo é exatamente o mesmo que a regra já permitia.
 *
 * @param {string[]} metaIds - ids dos ciclos do tipo 'Meta'
 * @param {string} uid - dono dos aportes; sem ele não há consulta
 */
export function useAportesPorMeta(metaIds, uid) {
  const [aportesMap, setAportesMap] = useState({});
  const key = (metaIds || []).slice().sort().join(',');

  useEffect(() => {
    if (!key || !uid) {
      setAportesMap({});
      return;
    }

    const ids = key.split(',');
    const unsubs = ids.map((id) => {
      const consulta = query(
        collection(db, 'ciclos', id, 'aportes'),
        where('uid', '==', uid),
      );
      return onSnapshot(
        consulta,
        (snapshot) => {
          setAportesMap((prev) => ({
            ...prev,
            [id]: snapshot.docs.map((d) => ({ id: d.id, ...d.data() })),
          }));
        },
        (err) => {
          // Sem isto a falha só aparecia como "Uncaught Error in snapshot
          // listener", sem dizer qual meta nem por quê.
          console.error(`[Aportes] Falha ao escutar ciclos/${id}/aportes:`, err?.code || err?.message);
        },
      );
    });

    return () => unsubs.forEach((u) => u());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, uid]);

  return aportesMap;
}
