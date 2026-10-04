import { useLanguage } from '../../i18n'
import './TrustBanner.scss'

function TrustBanner() {
  const { lang, t } = useLanguage()

  return (
    <section className="trust">
      <div className="trust__card" lang={lang === 'np' ? 'ne' : 'en'}>
        <div className="trust__intro">
          <div className="trust__icon-wrap">
            <span className="material-symbols-outlined trust__icon">
              lock
            </span>
          </div>
          <div className="trust__text">
            <h3 className="trust__title">{t.trust.title}</h3>
            <p className="trust__description">{t.trust.description}</p>
          </div>
        </div>
        <div className="trust__tips">
          {t.trust.tips.map((tip, index) => (
            <div key={tip.title} className="trust__tip">
              <span className="trust__number">
                {new Intl.NumberFormat(lang === 'np' ? 'ne-NP' : 'en').format(
                  index + 1,
                )}
              </span>
              <h4 className="trust__tip-title">{tip.title}</h4>
              <p className="trust__tip-description">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustBanner
