import * as argon2 from 'argon2';

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, { type: argon2.argon2id });
}

export async function comparePassword(
  plainText: string,
  hashed: string,
): Promise<boolean> {
  return argon2.verify(hashed, plainText);
}
