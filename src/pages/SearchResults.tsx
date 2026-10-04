import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import data from '../data/searchResults.json'
import categoryData from '../data/categories'
import { useLanguage } from '../i18n'
import { searchItems } from '../utils/search'
import SearchInput from '../components/SearchInput/SearchInput'
import ResultsSummary from '../components/ResultsSummary/ResultsSummary'
import PortalCard from '../components/PortalCard/PortalCard'
import Pagination from '../components/Pagination/Pagination'
import './SearchResults.scss'

const items = categoryData.items

function SearchResults() {
  const [searchParams] = useSearchParams()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const urlQuery = searchParams.get('q') ?? data.search.query
  const [query, setQuery] = useState(urlQuery)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setQuery(urlQuery)
  }, [urlQuery])

  useEffect(() => {
    setPage(1)
  }, [query])

  const filtered = searchItems(items, query)
  const isEmpty = query.trim().length === 0

  const pageSize = data.pagination.pageSize
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  useEffect(() => {
    const q = query.trim()
    if (!q) return
    const timer = setTimeout(() => {
      navigate(`/search?q=${encodeURIComponent(q)}`, { replace: true })
    }, 400)
    return () => clearTimeout(timer)
  }, [query, navigate])

  return (
    <div className="search-results">
      <div className="search-results__container">
        <div className="search-results__toolbar">
          <SearchInput
            value={query}
            onChange={setQuery}
            onClear={() => setQuery('')}
          />
        </div>

        {isEmpty ? (
          <div className="search-results__empty">
            <span className="material-symbols-outlined search-results__empty-icon">
              {data.emptySearch.icon}
            </span>
            <h2 className="search-results__empty-title">
              {t.search.emptySearch.title}
            </h2>
            <p className="search-results__empty-text">
              {t.search.emptySearch.text}
            </p>
            <div className="search-results__empty-chips">
              {t.search.emptySearch.suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="search-results__empty-chip"
                  onClick={() => setQuery(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <ResultsSummary query={query} count={filtered.length} />

            <div className="search-results__layout">
              <div className="search-results__results">
                {filtered.length === 0 ? (
                  <div className="search-results__empty">
                    <span className="material-symbols-outlined search-results__empty-icon">
                      {data.noResults.icon}
                    </span>
                    <h2 className="search-results__empty-title">
                      {t.search.noResults.title(query.trim())}
                    </h2>
                    <p className="search-results__empty-text">
                      {t.search.noResults.text}
                    </p>
                    <div className="search-results__empty-chips">
                      {t.search.noResults.suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          className="search-results__empty-chip"
                          onClick={() => setQuery(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  paged.map((item) => (
                    <PortalCard key={item.id} item={item} compact />
                  ))
                )}
              </div>
            </div>

            <Pagination
              pageSize={data.pagination.pageSize}
              page={safePage}
              totalPages={totalPages}
              totalCount={filtered.length}
              onPageChange={(next) => {
                setPage(next)
                window.scrollTo(0, 0)
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default SearchResults
