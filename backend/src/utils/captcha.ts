import axios from "axios";

// Function to validate CAPTCHA
export const validateCaptcha = async (captchaToken: string): Promise<boolean> => {
  const secretKey = process.env.HCAPTCHA_SECRET_KEY;
    const verificationUrl = `https://hcaptcha.com/siteverify`;

  try {
    const response = await axios.post(verificationUrl, null, {
      params: {
        secret: secretKey,
        response: captchaToken,
      },
    });
      console.log("validateCaptcha - response.data:", response.data);

    return response.data.success;
  } catch (error) {
    console.error("CAPTCHA verification failed:", error);
    return false;
  }
};
