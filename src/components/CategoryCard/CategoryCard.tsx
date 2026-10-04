import { Link } from 'react-router-dom'
import data from '../../data/homepage.json'
import categoryData from '../../data/categories'
import { useLanguage, type CategoryKey } from '../../i18n'
import './CategoryCard.scss'

const categoryKeys = Object.keys(categoryData.categories)

function CategoryCard({
  category,
}: {
  category: (typeof data.categoriesSection.categories)[number]
}) {
  const { lang, t } = useLanguage()
  const card = t.categoriesSection.cards[category.path as CategoryKey]
  const count = categoryData.items.filter(
    (item) => item.code === category.path,
  ).length
  const formattedCount = new Intl.NumberFormat(
    lang === 'np' ? 'ne-NP' : 'en',
  ).format(count)
  const to = categoryKeys.includes(category.path)
    ? `/category?c=${category.path}`
    : null
  const inner = (
    <>
      <div className="category-card__header">
        <span className="category-card__icon" aria-hidden="true">
          <span className="material-symbols-outlined category-card__icon-symbol">
            {category.icon}
          </span>
        </span>
        <span className="category-card__count">{formattedCount}</span>
      </div>
      <h3 className="category-card__title">{card.title}</h3>
      <p className="category-card__description">{card.description}</p>
    </>
  )
  return to ? (
    <Link className="category-card" to={to}>
      {inner}
    </Link>
  ) : (
    <a className="category-card" href={`#${category.path}`}>
      {inner}
    </a>
  )
}

export default CategoryCard
