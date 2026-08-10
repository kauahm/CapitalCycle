import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * Escuta em tempo real a subcoleção de aportes (ciclos/{id}/aportes) de
 * uma lista de metas. Retorna um mapa { [cicloId]: aportes[] }.
 *
 * @param {string[]} metaIds - ids dos ciclos do tipo 'Meta'
 */
export function useAportesPorMeta(metaIds) {
  const [aportesMap, setAportesMap] = useState({});
  const key = (metaIds || []).slice().sort().join(',');

  useEffect(() => {
    if (!key) {
      setAportesMap({});
      return;
    }

    const ids = key.split(',');
    const unsubs = ids.map((id) => {
      const ref = collection(db, 'ciclos', id, 'aportes');
      return onSnapshot(ref, (snapshot) => {
        setAportesMap((prev) => ({
          ...prev,
          [id]: snapshot.docs.map((d) => ({ id: d.id, ...d.data() })),
        }));
      });
    });

    return () => unsubs.forEach((u) => u());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return aportesMap;
}
