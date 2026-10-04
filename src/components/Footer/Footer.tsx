import { useLanguage } from '../../i18n'
import './Footer.scss'

function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__bottom">
          <span className="footer__copyright">{t.footer.copyright}</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
