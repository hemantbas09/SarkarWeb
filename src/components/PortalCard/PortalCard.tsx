import data from '../../data/homepage.json'
import { type CategoryItem } from '../../data/categories'
import { itemDescription, useLanguage } from '../../i18n'
import './PortalCard.scss'

type EssentialPortal = (typeof data.essentialSection.portals)[number]
type PortalCardItem = EssentialPortal | CategoryItem

function PortalCard({
  item,
}: {
  item: PortalCardItem
}) {
  const { lang, t } = useLanguage()
  const isCategoryItem = 'sectorLabel' in item
  const description = isCategoryItem
    ? itemDescription(t, item, lang)
    : t.essential.portalDescriptions[item.domain] ?? item.description
  const title = lang === 'np' ? item.nepali : item.name

  return (
    <a
      className="portal-card"
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      lang={lang === 'np' ? 'ne' : 'en'}
    >
      <span className="portal-card__logo" aria-hidden="true">
        <span className="portal-card__logo-fallback">
          {Array.from(title.trim())[0]?.toLocaleUpperCase()}
        </span>
        <img
          className="portal-card__logo-image"
          src={`https://${item.domain}/favicon.ico`}
          alt=""
          loading="lazy"
          onError={(event) => {
            event.currentTarget.hidden = true
          }}
        />
      </span>
      <span className="material-symbols-outlined portal-card__arrow" aria-hidden="true">
        north_east
      </span>
      <h3 className="portal-card__title">{title}</h3>
      <p className="portal-card__description">{description}</p>
    </a>
  )
}

export default PortalCard
