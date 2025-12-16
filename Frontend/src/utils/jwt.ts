export type JwtPayload = {
  companyId?: string;
  companyName?: string;
  role?: string | string[];
  exp?: number;
  [key: string]: any;
};

export function decodeJwt(token: string): JwtPayload {
  const parts = token.split('.');
  if (parts.length < 2) {
    throw new Error('Invalid JWT');
  }

  const payload = parts[1];
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');

  const binary = atob(padded);

  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  const json = typeof TextDecoder !== 'undefined'
    ? new TextDecoder('utf-8').decode(bytes)
    : binary;

  return JSON.parse(json);
}

export function getJwtRole(payload: JwtPayload): string {
  const direct = payload.role;
  if (typeof direct === 'string' && direct.trim()) return direct;
  if (Array.isArray(direct) && typeof direct[0] === 'string' && direct[0].trim()) return direct[0];

  const dotnet = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  if (typeof dotnet === 'string' && dotnet.trim()) return dotnet;
  if (Array.isArray(dotnet) && typeof dotnet[0] === 'string' && dotnet[0].trim()) return dotnet[0];

  return '';
}
