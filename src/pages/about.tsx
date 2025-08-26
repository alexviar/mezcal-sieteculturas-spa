import logo from "@/assets/logo.png";
import { CustomSchemeLink } from "@/components/CustomSchemeLink";
import Layout from "@/components/layout";
import { aboutUs, appName, companyAddress, companyEmail, companyFacebook, companyInstagram, companyWhatsapp, isWebView } from "@/configs/app";
import styles from "@/styles/About.module.css";
import Head from "next/head";
import Image from "next/image";
import { Card, Col, Container, Row } from "react-bootstrap";
import { FaWhatsapp } from "react-icons/fa";
import { LuFacebook, LuInstagram, LuMail, LuMapPin, LuPhone } from "react-icons/lu";

export default function About() {
  return (
    <>
      <Head>
        <title>Contacto | {appName}</title>
        <meta name="description" content={`Información de contacto y detalles sobre ${appName}, productores artesanales de mezcal en Oaxaca`} />
      </Head>
      <Layout title={appName} hideBrandLogo>
        <Container className="p-3">
          {/* Company Info */}
          <Card className="mb-4">
            <Card.Header className="bg-transparent border-0 pt-3 pb-0">
              <Card.Title className="d-flex align-items-center gap-2 mb-0">
                <Image
                  src={logo}
                  width={40}
                  height={40}
                  alt="Logo"
                  className="rounded-circle"
                />
                {appName}
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <p className="text-muted mb-0">
                {aboutUs}
              </p>
            </Card.Body>
          </Card>

          {/* Contact Information */}
          <Card className="mb-4">
            <Card.Header className="bg-transparent border-0 pt-3 pb-0">
              <Card.Title className="mb-0">Información de contacto</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-start gap-3 mb-3">
                <LuMapPin size={20} className="mt-1 text-primary flex-shrink-0" />
                <div>
                  <p className="fw-medium mb-1">Dirección</p>
                  <p className="text-body-secondary mb-0 text-wrap">{companyAddress}</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-3">
                <LuPhone size={20} className="mt-1 text-primary flex-shrink-0" />
                <div>
                  <p className="fw-medium mb-1">Teléfono</p>
                  <p className="text-muted mb-0">{companyWhatsapp}</p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-3">
                <LuMail size={20} className="mt-1 text-primary flex-shrink-0" />
                <div>
                  <p className="fw-medium mb-1">Email</p>
                  <p className="text-muted mb-0">{companyEmail}</p>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Social Media */}
          <Card className="mb-4">
            <Card.Header className="bg-transparent border-0 pt-3 pb-0">
              <Card.Title className="mb-0">Síguenos en redes sociales</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row className="g-2">
                <Col xs={6}>
                  <CustomSchemeLink
                    onOpenFail={() => window.open(`https://www.instagram.com/${companyInstagram}`)}
                    href={isWebView ? `instagram://user?username=${companyInstagram}` : `https://www.instagram.com/${companyInstagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles['social-btn']}
                  >
                    <LuInstagram size={20} />
                    Instagram
                  </CustomSchemeLink>
                </Col>
                <Col xs={6}>
                  <CustomSchemeLink
                    onOpenFail={() => window.open(`https://www.facebook.com/${companyFacebook}`)}
                    href={isWebView ? `fb://page/${companyFacebook}` : `https://www.facebook.com/${companyFacebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles['social-btn']}
                  >
                    <LuFacebook size={20} />
                    Facebook
                  </CustomSchemeLink>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Quick Contact */}
          <Card>
            <Card.Header className="bg-transparent border-0 pt-3 pb-0">
              <Card.Title className="mb-0">¿Necesitas ayuda?</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <a
                  href={`tel:${companyWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['social-btn']}>
                  <LuPhone size={20} className="me-2" />
                  Llamar ahora
                </a>
                <a
                  href={`https://wa.me/${companyWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['social-btn']}>
                  <FaWhatsapp size={20} className="me-2" />
                  Contactar por Whatsapp
                </a>
                <a
                  href={`mailto:${companyEmail}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['social-btn']}>
                  <LuMail size={20} className="me-2" />
                  Enviar email
                </a>
              </div>
            </Card.Body>
          </Card>

          <div className="text-center small text-body-secondary">
            <div className="mt-4">© {appName} Todos los derechos reservados</div>
            <div className="mt-1">Desarrollado por <a href="https://wa.me/5215564828212" rel="noreferrer noopener" target="_blank" className="link-body-emphasis fw-bold">Internow Corp.</a></div>
          </div>
        </Container>
      </Layout>
    </>
  )
}