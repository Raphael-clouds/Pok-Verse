import PropTypes from "prop-types";

// Iconos SVG organizados en un objeto constante para mejor reutilización
const ICONS = {
  left: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M15 6l-6 6l6 6" />
    </svg>
  ),
  right: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M9 6l6 6l-6 6" />
    </svg>
  ),
};

// Función helper para generar array de páginas con página activa siempre en el centro
const generatePageNumbers = (currentPage) => {
  // Si es la primera página, dejar el primer espacio vacío pero mantener el layout
  if (currentPage === 1) {
    return [null, 1, 2]; // null representa espacio vacío
  }

  // Para las demás páginas: anterior, actual, siguiente
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  return [prevPage, currentPage, nextPage];
};

const ButtonsContainer = ({ onLoadMore, onLoadLess, page, onGotoPage }) => {
  const pages = generatePageNumbers(page);

  // Determinar si los botones deben estar deshabilitados
  const isFirstPage = page === 1;

  return (
    <section className="buttons-container">
      <button
        className="switch-btn"
        onClick={onLoadLess}
        disabled={isFirstPage}
        aria-label="Cargar página anterior"
        title="Página anterior"
      >
        {ICONS.left}
      </button>
      <ul>
        {pages.map((pageNumber, index) => (
          <li
            key={pageNumber || `empty-${index}`}
            className={pageNumber === page ? "page active" : "page"}
            style={{
              visibility: pageNumber === null ? "hidden" : "visible",
              pointerEvents: pageNumber === null ? "none" : "auto",
              cursor: pageNumber && pageNumber !== page ? "pointer" : "default",
            }}
            aria-current={pageNumber === page ? "page" : undefined}
            title={pageNumber ? `Página ${pageNumber}` : undefined}
            onClick={
              pageNumber && pageNumber !== page
                ? () => onGotoPage(pageNumber)
                : undefined
            }
            role={pageNumber ? "button" : undefined}
            tabIndex={pageNumber ? 0 : -1}
          >
            {pageNumber || ""}
          </li>
        ))}
      </ul>
      <button
        className="switch-btn"
        onClick={onLoadMore}
        aria-label="Cargar página siguiente"
        title="Página siguiente"
      >
        {ICONS.right}
      </button>
    </section>
  );
};

// Definición de PropTypes para validación y documentación
ButtonsContainer.propTypes = {
  onLoadMore: PropTypes.func.isRequired,
  onLoadLess: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  onGotoPage: PropTypes.func.isRequired,
};

export default ButtonsContainer;
