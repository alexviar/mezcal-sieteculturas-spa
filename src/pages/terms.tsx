import Layout from "@/components/layout";
import Terms from "@/components/terms";
import Head from "next/head";
import { appName } from "@/configs/app";

export default function TermsView() {
  return (
    <>
      <Head>
        <title>Terminos y condiciones</title>
        <meta name="title" content={`Terminos y condiciones | ${appName} ®`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta
          name="description"
          content={`En ${appName} ® &#8211;, cada botella es una celebración de la tradición, el trabajo duro y el amor por lo autentico. Conócenos, más que una bebida, somos una experiencia`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${appName} ® &#8211;`} />
        <meta
          property="og:description"
          content={`En ${appName} ® &#8211;, cada botella es una celebración de la tradición, el trabajo duro y el amor por lo autentico. Conócenos, más que una bebida, somos una experiencia!`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:image" content="/src/assets/logo-seo.png" />
        <meta
          name="keywords"
          content="Mezcal, 
          Tequila, 
          mezcal en México, 
          comprar mezcal en Estados Unidos, mezcal en línea México, tienda de mezcal online, 
          bebidas alcohólicas mexicanas, bebidas artesanales de México,
          mezcal para cócteles, comprar mezcal en CDMX,
          tiendas de mezcal en Oaxaca,
          mezcal a domicilio en Los Ángeles
          mezcal en Nueva York,
          comprar mezcal en Texas,
          mezcal online California,
          mezcal a domicilio Estados Unidos,
          dónde comprar mezcal artesanal de Oaxaca
          mejores marcas de mezcal en México
          envío de mezcal premium a USA
          mezcal 100% natural hecho en México
          botellas de mezcal con envío a Estados Unidos
          precio de mezcal orgánico en línea
          mezcal barato con envío internacional"
        />
        <meta property="og:url" content="permalink" />
        <meta name="robots" content="index" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Terms />
      </Layout>
    </>
  );
}
