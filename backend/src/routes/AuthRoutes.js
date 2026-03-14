import express from "express";
import AuthController from "../controllers/AuthController.js";
import { authJwt } from "../middlewares/authJwt.js";

const router = express.Router();

router.post("/auth/login", AuthController.login);
router.get("/auth/me", authJwt, AuthController.me);
router.post("/auth/logout", AuthController.logout);

export default router;
