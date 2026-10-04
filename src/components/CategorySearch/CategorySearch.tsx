import { useLanguage, type CategoryKey } from '../../i18n'
import './CategorySearch.scss'

function CategorySearch({
  categoryKey,
  value,
  onChange,
}: {
  categoryKey: CategoryKey
  value: string
  onChange: (value: string) => void
}) {
  const { t } = useLanguage()
  const dict = t.categoryPage.categories[categoryKey]

  return (
    <div className="category-search">
      <div className="category-search__top">
        <div className="category-search__input-wrap">
          <span className="material-symbols-outlined category-search__icon">
            search
          </span>
          <input
            className="category-search__input"
            type="search"
            placeholder={dict.searchPlaceholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>

    </div>
  )
}

export default CategorySearch
