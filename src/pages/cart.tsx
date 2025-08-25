import Cart from "@/components/cart";
import Layout from "@/components/layout";
import { appName } from "@/configs/app";
import Head from "next/head";

export default function CartView() {
  return (
    <>
      <Head>
        <title>Finaliza tu compra</title>
        <meta
          name="title"
          content={`Mezcal Artesanal ${appName} ® &#8211; ${appName}`}
        />
        <meta
          name="description"
          content={`En ${appName} ® &#8211;, cada botella es una celebración de la tradición, el trabajo duro y el amor por lo autentico. Conócenos, más que una bebida, somos una experiencia`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex" />
      </Head>
      <Layout title={appName} hideBrandLogo>
        <Cart />
      </Layout>
    </>
  );
}
