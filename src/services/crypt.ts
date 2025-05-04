// utils/crypto.ts

// Importação dinâmica para evitar problemas no SSR
let CryptoJS: any = null;

// Função para garantir que CryptoJS seja carregado apenas no cliente
const loadCryptoJS = async () => {
  if (typeof window !== "undefined" && !CryptoJS) {
    CryptoJS = await import("crypto-js");
  }
  return CryptoJS;
};

const secretKeyCrypt = process.env.NEXT_PUBLIC_CRYPT_SECRET ?? "Manga123";

export const crypt = async (value: string) => {
  const crypto = await loadCryptoJS();

  if (!crypto) return value; // Fallback para ambiente server

  return crypto.AES.encrypt(value, secretKeyCrypt).toString();
};

export const decrypt = async (cvalue: string) => {
  if (!cvalue) return null;

  try {
    const crypto = await loadCryptoJS();
    if (!crypto) return cvalue; // Fallback para ambiente server

    const bytes = crypto.AES.decrypt(cvalue, secretKeyCrypt);
    const decrypted = bytes.toString(crypto.enc.Utf8);

    if (!decrypted) {
      console.warn("Decrypt falhou: string vazia ou inválida.");
      return null;
    }

    return decrypted;
  } catch (error) {
    console.error("Erro ao decriptar valor:", error);
    return null;
  }
};

export { secretKeyCrypt };
