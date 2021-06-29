import { existsSync, readFileSync, writeFileSync } from "fs";
import sodium from "sodium-native";
import { redBright, yellow } from "chalk";

export const getSecret = (path: string) => {

  if (!existsSync(path)) {
    console.log(yellow("Cookie secret doesn't exist, generating one.."));

    try {
      const buf = Buffer.allocUnsafe(sodium.crypto_secretbox_KEYBYTES);
      sodium.randombytes_buf(buf);
      writeFileSync(path, buf);
    } catch (error) {
      console.error(
        redBright(`Failed to save a new cookie secret, error: ${error.message}`)
      );
      console.error(error);
    }
  }

  return readFileSync(path);
};
