export default function SettingsContainer() {
  return (
    <div>
      <form className="form-setings" action="">
        <h2>Configura tu tienda</h2>
        <div className="form-item-group">
          <label htmlFor="">Iva sobre productos</label>
          <input type="text" placeholder="añade el iva" />
        </div>
        <div className="form-item-group">
          <label htmlFor="">Stripe secret key</label>
          <input type="text" placeholder="añade tu secret key" />
        </div>
        <div className="form-item-group">
          <label htmlFor="">Stripe public key</label>
          <input type="text" placeholder="añade tu public key" />
        </div>
      </form>
    </div>
  );
}
