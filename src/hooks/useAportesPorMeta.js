import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './useAuth';

/**
 * Escuta em tempo real a subcoleção de aportes (ciclos/{id}/aportes) de
 * uma lista de metas. Retorna um mapa { [cicloId]: aportes[] }.
 *
 * Importante: a regra de segurança de ciclos/{id}/aportes exige
 * `resource.data.uid == request.auth.uid`. Regras não funcionam como
 * filtro — o Firestore só permite a leitura de uma coleção inteira se a
 * própria query já tiver um where() que prove estruturalmente a mesma
 * condição, senão nega a leitura inteira com "permission-denied", mesmo
 * que todos os documentos já pertençam ao usuário. Por isso o
 * where('uid', '==', uid) abaixo é obrigatório aqui, no mesmo padrão já
 * usado nas queries de accounts/transactions/ciclos no resto do app.
 *
 * @param {string[]} metaIds - ids dos ciclos do tipo 'Meta'
 */
export function useAportesPorMeta(metaIds) {
  const { currentUser } = useAuth();
  const [aportesMap, setAportesMap] = useState({});
  const key = (metaIds || []).slice().sort().join(',');

  useEffect(() => {
    if (!key || !currentUser) {
      setAportesMap({});
      return;
    }

    const ids = key.split(',');
    const unsubs = ids.map((id) => {
      const ref = query(collection(db, 'ciclos', id, 'aportes'), where('uid', '==', currentUser.uid));
      return onSnapshot(
        ref,
        (snapshot) => {
          setAportesMap((prev) => ({
            ...prev,
            [id]: snapshot.docs.map((d) => ({ id: d.id, ...d.data() })),
          }));
        },
        (error) => {
          console.error(`[useAportesPorMeta] Falha ao ler aportes do ciclo ${id} (uid=${currentUser?.uid}):`, error.code || error.message, error);
        }
      );
    });

    return () => unsubs.forEach((u) => u());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, currentUser]);

  return aportesMap;
}