import express from "express";

import { login, signup, logout, checkAuthStatus, googleLogin } from "../controllers/authControllers";

import {loginLimiter, captchaLimiter} from "../middleware/loginLimiterMiddleware";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", loginLimiter, login);

router.post("/logout", logout);

router.get("/status", checkAuthStatus);

router.post("/google-login", googleLogin)

export default router;
