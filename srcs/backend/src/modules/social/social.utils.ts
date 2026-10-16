export type Relationship = {
  isFriend: boolean;
  requestSent: boolean;
  requestReceived: boolean;
  blockedByMe: boolean;
  blockedMe: boolean;
};

export function normalizePair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}
