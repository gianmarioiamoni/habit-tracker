import validator from "validator";

export const sanitizeEmail = (email: any): string => {
    return validator.normalizeEmail(email, {
      gmail_remove_dots: false, 
      gmail_remove_subaddress: false, // Mantiene i subaddress negli indirizzi Gmail
      gmail_convert_googlemaildotcom: true, // Converte @googlemail.com in @gmail.com
      all_lowercase: true, // Converte in minuscolo (mantenuto per evitare discrepanze)
    }) || "";
}