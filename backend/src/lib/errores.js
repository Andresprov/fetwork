// Error de negocio con status HTTP y mensaje apto para mostrar al usuario.
// El errorHandler global responde { error: publicMessage, ...extra }.
class ErrorPeticion extends Error {
  constructor(status, publicMessage, extra = {}) {
    super(publicMessage);
    this.status = status;
    this.publicMessage = publicMessage;
    Object.assign(this, extra);
  }
}

module.exports = { ErrorPeticion };
