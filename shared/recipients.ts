export function getRecipientIdByURL(url: string): string | null {
  const recipientId = url.replace(/.*recipient\/([a-f0-9-]+)(?:\/.*)?$/, "$1");
  return recipientId === url ? null : recipientId;
}
