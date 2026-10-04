import { useLanguage } from '../../i18n'
import SearchBar from '../SearchBar/SearchBar'
import './Hero.scss'

function Hero() {
  const { t } = useLanguage()

  return (
    <section className="hero">
      <div className="hero__content">
        <h1 className="hero__heading">{t.hero.heading}</h1>
        <p className="hero__subheading">{t.hero.subheading}</p>
        <SearchBar />
      </div>
    </section>
  )
}

export default Hero
