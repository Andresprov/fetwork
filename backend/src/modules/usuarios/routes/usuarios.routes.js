const { Router } = require("express");
const asyncHandler = require("../../../middleware/asyncHandler");
const controller = require("../controller/usuarios.controller");

const router = Router();

// Simulan el selector de cuentas y el callback de Q10 (CU-01, CU-20, CU-23, CU-26)
// mientras no exista integracion SSO real.
router.get("/q10/roster", asyncHandler(controller.getRosterQ10));
router.post("/q10/login", asyncHandler(controller.postLoginQ10));

module.exports = router;
