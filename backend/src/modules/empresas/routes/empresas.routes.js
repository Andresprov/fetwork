const { Router } = require("express");
const asyncHandler = require("../../../middleware/asyncHandler");
const controller = require("../controller/empresas.controller");

const router = Router();

router.post("/registro", asyncHandler(controller.postRegistro)); // CU-11
router.post("/login", asyncHandler(controller.postLogin)); // CU-12
router.post("/recuperar-contrasena", asyncHandler(controller.postRecuperarContrasena)); // CU-13
router.post("/resetear-contrasena", asyncHandler(controller.postResetearContrasena)); // CU-13

module.exports = router;
