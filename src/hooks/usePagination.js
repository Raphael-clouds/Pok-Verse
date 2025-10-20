import { useRef, useState, useCallback } from "react";

// Hook de paginación con semántica equivalente a la implementación original
// Mantiene un ref (callNumber) para indicar el índice de inicio en la API
// y estados para page (página actual) y limit (tamaño del batch a pedir).
export default function usePagination({ initialPage = 1, pageSize = 12, initialStart = 1 } = {}) {
  // Índice de inicio para la API (1, 13, 25, ...), se comparte con el hook de fetch
  const callNumber = useRef(initialStart);

  // Página visible en la UI
  const [page, setPage] = useState(initialPage);

  // Límite total a pedir a la API (comportamiento original: start + pageSize)
  const [limit, setLimit] = useState(callNumber.current + pageSize);

  // Avanzar una página: aumenta el límite total y la página actual
  const loadMore = useCallback(() => {
    setLimit((l) => l + pageSize);
    setPage((p) => p + 1);
  }, [pageSize]);

  // Retroceder una página: replica la lógica previa de ajustar start y limit
  const loadLess = useCallback(() => {
    setLimit((l) => {
      // Con initialStart=1 y pageSize=12, el primer límite válido es 13
      if (l > initialStart + pageSize) {
        // Reducimos manualmente el inicio 2 páginas hacia atrás, como en el código original
        callNumber.current = callNumber.current - 2 * pageSize;
        setPage((p) => p - 1);
        return l - pageSize;
      }
      return l;
    });
  }, [initialStart, pageSize]);

  // Ir a una página concreta (1-indexada), recalculando start y limit para la API
  const gotoPage = useCallback(
    (targetPage) => {
      if (!Number.isInteger(targetPage) || targetPage < 1) return;
      if (targetPage === page) return;

      const start = (targetPage - 1) * pageSize + initialStart; // 1, 13, 25, ...
      const nextLimit = initialStart + targetPage * pageSize; // 13, 25, 37, ...

      callNumber.current = start;
      setPage(targetPage);
      setLimit(nextLimit);
    },
    [page, pageSize, initialStart]
  );

  return { page, limit, callNumber, loadMore, loadLess, gotoPage };
}
