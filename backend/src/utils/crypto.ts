import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.ENCRYPTION_KEY || "MyLocalSecretEncryptionKey321234";
const hashedKey = crypto
  .createHash("sha256")
  .update(secretKey)
  .digest("base64")
  .substr(0, 32); // hash key to 32 bytes 
const algorithm = "aes-256-cbc"; // AES with a 256-bit key
const iv = crypto.randomBytes(16); // 16 bytes IV 

export const encryptData = (data: string): string => {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(hashedKey), iv);
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
};

export const decryptData = (encryptedData: string): string => {
  const [ivHex, encrypted] = encryptedData.split(":");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(hashedKey),
    Buffer.from(ivHex, "hex")
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
  return decrypted;
};



export const encryptDataWithIV = (
  data: string,
  iv: string | null = null
): { encryptedEmail: string; iv: string } => {
  if (!iv) {
    iv = crypto.randomBytes(16).toString("hex");
  }
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(hashedKey),
    Buffer.from(iv, "hex")
  );
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Restituisci sia l'email criptata che l'IV come oggetto
  return { encryptedEmail: encrypted, iv };
};