import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="es">
      <Head />
      <body data-bs-theme="dark" style={{
        backgroundImage: 'url(/background.png)',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
      }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
