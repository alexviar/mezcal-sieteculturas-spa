import { appName } from "@/configs/app";

/* eslint-disable react/no-unescaped-entities */
export default function Privacy() {
  return (
    <div className="privacy-container p-3">
      <h1 className="text-accent">AVISO DE PRIVACIDAD INTEGRAL</h1>
      <p>{appName} es el responsable del uso y protección de sus datos personales, y al respecto le informamos lo siguiente:</p>
      <h2 className="text-accent">¿Para qué fines utilizaremos sus datos personales?</h2>
      <p>Los datos personales que recabamos de usted, los utilizaremos para las siguientes finalidades que son necesarias para el servicio que solicita:</p>
      <ul>
        <li>Respuesta a mensajes del formulario de contacto</li>
        <li>Prestación de cualquier servicio solicitado</li>
        <li>Facturación y cobro</li>
        <li>Envío y entrega de productos</li>
      </ul>
      <h2 className="text-accent">¿Qué datos personales utilizaremos para estos fines?</h2>
      <p>Para llevar a cabo las finalidades descritas en el presente aviso de privacidad, utilizaremos los siguientes datos personales:</p>
      <ul>
        <li>Datos de identificación y contacto</li>
        <li>Datos laborales</li>
        <li>Datos académicos</li>
        <li>Datos facturación</li>
      </ul>
      <h2 className="text-accent">¿Con quién compartimos su información personal y para qué fines?</h2>
      <p>Le informamos que sus datos personales son compartidos fuera del país con las siguientes personas, empresas, organizaciones o autoridades distintas a nosotros, para los siguientes fines:</p>
      <ul>
        <li>Fuera del país</li>
        <li>Personas externas a la empresa.</li>
      </ul>
      <h2 className="text-accent">¿Cómo puede acceder, rectificar o cancelar sus datos personales, u oponerse a su uso o ejercer la revocación de consentimiento?</h2>
      <p>Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información personal en caso de que esté desactualizada, sea inexacta o incompleta (Rectificación); que la eliminemos de nuestros registros o bases de datos cuando considere que la misma no está siendo utilizada adecuadamente (Cancelación); así como oponerse al uso de sus datos personales para fines específicos (Oposición). Estos derechos se conocen como derechos ARCO.</p>
      <p>Para el ejercicio de cualquiera de los derechos ARCO, debe enviar una petición vía correo electrónico y deberá contener:</p>
      <ul>
        <li>Nombre completo del titular.</li>
        <li>Domicilio.</li>
        <li>Teléfono.</li>
        <li>Correo electrónico usado en esta aplicación.</li>
        <li>Copia de una identificación oficial adjunta.</li>
        <li>Asunto «Derechos ARCO»</li>
      </ul>
      <p>Descripción el objeto del escrito, los cuales pueden ser de manera enunciativa más no limitativa los siguientes: Revocación del consentimiento para tratar sus datos personales; y/o Notificación del uso indebido del tratamiento de sus datos personales; y/o Ejercitar sus Derechos ARCO, con una descripción clara y precisa de los datos a Acceder, Rectificar, Cancelar o bien, Oponerse. En caso de Rectificación de datos personales, deberá indicar la modificación exacta y anexar la documentación soporte; es importante en caso de revocación del consentimiento, que tenga en cuenta que no en todos los casos podremos atender su solicitud o concluir el uso de forma inmediata, ya que es posible que por alguna obligación legal requiramos seguir tratando sus datos personales. Asimismo, usted deberá considerar que para ciertos fines, la revocación de su consentimiento implicará que no le podamos seguir prestando el servicio que nos solicitó, o la conclusión de su relación con nosotros.</p>
      <h2 className="text-accent">¿En cuántos días le daremos respuesta a su solicitud?</h2>
      <p>10 días</p>
      <h2 className="text-accent">¿Por qué medio le comunicaremos la respuesta a su solicitud?</h2>
      <p>Al mismo correo electrónico de donde se envió la petición.</p>
      <h2 className="text-accent">El uso de tecnologías de rastreo en nuestra aplicación</h2>
      <p>Le informamos que en nuestra aplicación utilizamos cookies, web beacons u otras tecnologías, a través de las cuales es posible monitorear su comportamiento como usuario, así como brindarle un mejor servicio y experiencia al navegar en nuestra aplicación. Los datos personales que obtenemos de estas tecnologías de rastreo son los siguientes:</p>
    </div>
  );
}
