// Envuelve un controller async para que cualquier rechazo de promesa llegue al
// errorHandler global en vez de tumbar el proceso.
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = asyncHandler;
