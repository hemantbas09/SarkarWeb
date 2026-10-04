import data from '../../data/categories'
import { useLanguage, type CategoryKey } from '../../i18n'
import './CategoryHero.scss'

type Category = (typeof data.categories)[keyof typeof data.categories]

function CategoryHero({
  hero,
  categoryKey,
  totalCount,
}: {
  hero: Category['hero']
  categoryKey: CategoryKey
  totalCount: number
}) {
  const { t } = useLanguage()
  const dict = t.categoryPage.categories[categoryKey]

  return (
    <div className="category-hero">
      <span className="material-symbols-outlined category-hero__icon" aria-hidden="true">
        {hero.badge.icon}
      </span>
      <div className="category-hero__content">
        <div className="category-hero__title-row">
          <h1 className="category-hero__title">{dict.heroTitle}</h1>
        </div>
        <p className="category-hero__description">{dict.description}</p>
      </div>
      <span className="category-hero__count">
        {totalCount.toLocaleString()}{' '}
        {dict.breadcrumbCurrent.toLowerCase().split(' ')[0]}
      </span>
    </div>
  )
}

export default CategoryHero
