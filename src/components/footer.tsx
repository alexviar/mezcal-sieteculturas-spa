import { Facebook, Instagram, Location, Mail, WhatsApp } from "@/assets/icons";
import { appName, companyAddress, companyEmail, companyFacebook, companyInstagram, companyWhatsapp } from "@/configs/app";

export default function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="contact-content">
          <ul className="contact-list">
            <li className="contact-item">
              <Location />
              <span>
                {companyAddress}
              </span>
            </li>
            <li className="contact-item">
              <Mail />
              <span>{companyEmail}</span>
            </li>
            <li className="contact-item">
              <WhatsApp />
              <span>+{companyWhatsapp}</span>
            </li>
          </ul>
        </div>
        <div className="social-media-content">
          <ul>
            <li>
              <a
                href={`https://www.instagram.com/${companyInstagram}`}
                rel="noreferrer noopener"
                target="_blank"
              >
                <Instagram />
              </a>
            </li>
            <li>
              <a
                href={`https://www.facebook.com/${companyFacebook}`}
                rel="noreferrer noopener"
                target="_blank"
              >
                <Facebook />
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${companyWhatsapp}`}
                rel="noreferrer noopener"
                target="_blank"
              >
                <WhatsApp />
              </a>
            </li>
          </ul>

          <div>© {appName} Todos los derechos reservados</div>
        </div>
      </div>
    </footer>
  );
}
