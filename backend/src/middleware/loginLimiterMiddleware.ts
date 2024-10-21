import rateLimit from "express-rate-limit";

// Configure the rate limit middleware
export const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
    windowMs: 1 * 60 * 1000, // 1 minute for development
    max: 5, // Limit each IP to 5 login attempts 
    message: "Too many login attempts. Please try again after 15 minutes",
    standardHeaders: true, // Return information about the RateLimit-* headers
    legacyHeaders: false, // Deactivate the X-RateLimit-* headers
});


// configure rate limit middleware for CAPTCHA
export const captchaLimiter = rateLimit({
    windowMs: 2 * 1000, 
    max: 3, // Limit each IP to 3 attempts before running the CAPTCHA
    message: "Too many attempts, CAPTCHA required",
    statusCode: 439,
    standardHeaders: true, // Return information about the RateLimit-* headers
    legacyHeaders: false, // Deactivate the X-RateLimit-* headers
});
