import * as crypto from 'crypto';

/**
 *
 * @param str 要加密解密的字符
 * @returns
 */
export function md5(str: string): string {
  if (!str) return '';
  const hash = crypto.createHash('md5');
  return hash.update(str).digest('hex');
}
