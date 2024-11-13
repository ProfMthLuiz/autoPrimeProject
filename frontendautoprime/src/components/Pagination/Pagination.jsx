import React from 'react'
import './Pagination.css'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 3 // Quantas páginas você quer mostrar

    if (totalPages <= 1) return pageNumbers

    let startPage = Math.max(1, currentPage - 1)
    let endPage = Math.min(totalPages, currentPage + 1)

    // Certifica que sempre temos 3 páginas visíveis quando possível
    if (currentPage === 1) {
      endPage = Math.min(totalPages, startPage + 2)
    } else if (currentPage === totalPages) {
      startPage = Math.max(1, currentPage - 2)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return pageNumbers
  }

  // Não exibe paginação se houver apenas uma página
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="pagination">
      {/* Botão de página anterior */}
      {currentPage > 1 && (
        <button
          className="pagination-btn"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        >
          &lt;
        </button>
      )}

      {/* Números das páginas */}
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* Botão de próxima página */}
      {currentPage < totalPages && (
        <button
          className="pagination-btn"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        >
          &gt;
        </button>
      )}
    </div>
  )
}

export default Pagination
