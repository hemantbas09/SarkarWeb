import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import data from '../data/categories'
import { scoreItem } from '../utils/search'
import { useLanguage, type CategoryKey } from '../i18n'
import CategoryHero from '../components/CategoryHero/CategoryHero'
import CategorySearch from '../components/CategorySearch/CategorySearch'
import RegionFilter from '../components/RegionFilter/RegionFilter'
import SinghaDurbarInset from '../components/SinghaDurbarInset/SinghaDurbarInset'
import PortalCard from '../components/PortalCard/PortalCard'
import Pagination from '../components/Pagination/Pagination'
import CategoryEmptyState from '../components/CategoryEmptyState/CategoryEmptyState'
import TrustNotice from '../components/TrustNotice/TrustNotice'
import './CategoryPage.scss'

const categories = data.categories
const DEFAULT_CATEGORY = 'ministries'

function CategoryPage() {
  const [searchParams] = useSearchParams()
  const { t } = useLanguage()
  const requested = searchParams.get('c') ?? DEFAULT_CATEGORY
  const key =
    requested in categories
      ? (requested as keyof typeof categories)
      : DEFAULT_CATEGORY
  const category = categories[key]
  const dict = t.categoryPage.categories[key as CategoryKey]

  const [query, setQuery] = useState('')
  const [activeProvince, setActiveProvince] = useState('all')
  const [activeDistrict, setActiveDistrict] = useState('all')
  const [page, setPage] = useState(1)

  const regionFilter =
    'regionFilter' in category ? category.regionFilter : null
  const pagination =
    'pagination' in category ? category.pagination : null

  useEffect(() => {
    setQuery('')
    setActiveProvince('all')
    setActiveDistrict('all')
    setPage(1)
    window.scrollTo(0, 0)
  }, [key])

  useEffect(() => {
    setPage(1)
  }, [query, activeProvince, activeDistrict])

  const categoryItems = data.items.filter((item) => item.code === key)

  const provinces = [...new Set(
    categoryItems
      .map((item) => item.province)
      .filter((value): value is string => Boolean(value)),
  )].sort()
  const districtPool =
    activeProvince === 'all'
      ? categoryItems
      : categoryItems.filter((item) => item.province === activeProvince)
  const districts = [...new Set(
    districtPool
      .map((item) => item.district)
      .filter((value): value is string => Boolean(value)),
  )].sort()

  const filtered = categoryItems.filter((item) => {
    const matchesProvince =
      activeProvince === 'all' || item.province === activeProvince
    const matchesDistrict =
      activeDistrict === 'all' || item.district === activeDistrict
    const q = query.trim().toLowerCase()
    const matchesQuery = !q || scoreItem(item, q) >= 0
    return matchesProvince && matchesDistrict && matchesQuery
  })

  const pageSize = pagination?.pageSize ?? filtered.length
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paged = pagination
    ? filtered.slice((safePage - 1) * pageSize, safePage * pageSize)
    : filtered

  const handleReset = () => {
    setQuery('')
    setActiveProvince('all')
    setActiveDistrict('all')
  }

  const handleSelectProvince = (province: string) => {
    setActiveProvince(province)
    setActiveDistrict('all')
  }

  const singhaDurbar =
    'singhaDurbar' in category ? category.singhaDurbar : null

  return (
    <div className="category-page">
      <div className="category-page__band">
        <div className="category-page__container">
          <section className="category-page__toolbar-card">
            <CategoryHero
              hero={category.hero}
              categoryKey={key as CategoryKey}
              totalCount={category.search.totalCount}
            />
            <div
              className={`category-page__toolbar-controls${
                regionFilter ? ' category-page__toolbar-controls--with-region' : ''
              }`}
            >
              <CategorySearch
                categoryKey={key as CategoryKey}
                value={query}
                onChange={setQuery}
              />
              {regionFilter && (
                <RegionFilter
                  config={dict.regionFilter ?? regionFilter}
                  provinces={provinces}
                  districts={districts}
                  activeProvince={activeProvince}
                  activeDistrict={activeDistrict}
                  onSelectProvince={handleSelectProvince}
                  onSelectDistrict={setActiveDistrict}
                />
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="category-page__container category-page__body">
        {singhaDurbar && <SinghaDurbarInset singhaDurbar={singhaDurbar} />}
        <div className="category-page__grid">
          {paged.map((item) => (
            <PortalCard key={item.id} item={item} />
          ))}
        </div>
        {filtered.length === 0 && (
          <CategoryEmptyState
            emptyState={category.emptyState}
            categoryKey={key as CategoryKey}
            onReset={handleReset}
          />
        )}
        {pagination && (
          <Pagination
            pageSize={pagination.pageSize}
            page={safePage}
            totalPages={totalPages}
            totalCount={filtered.length}
            onPageChange={(next) => {
              setPage(next)
              window.scrollTo(0, 0)
            }}
          />
        )}
        <TrustNotice
          trustNotice={category.trustNotice}
          categoryKey={key as CategoryKey}
        />
      </div>
    </div>
  )
}

export default CategoryPage
