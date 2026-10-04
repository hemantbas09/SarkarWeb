import { useLanguage, type CategoryKey } from '../../i18n'
import './CategorySearch.scss'

function CategorySearch({
  categoryKey,
  value,
  onChange,
  activeSector,
  onSelectSector,
}: {
  categoryKey: CategoryKey
  value: string
  onChange: (value: string) => void
  activeSector: string
  onSelectSector: (sector: string) => void
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

      <div className="category-search__chips">
        {dict.chips.map((chip) => (
          <button
            key={chip.filter}
            type="button"
            className={`category-search__chip${
              activeSector === chip.filter ? ' category-search__chip--active' : ''
            }`}
            onClick={() => onSelectSector(chip.filter)}
          >
            {chip.label}
          </button>
        ))}
      </div>

    </div>
  )
}

export default CategorySearch
