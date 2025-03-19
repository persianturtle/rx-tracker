export function getCaregiverIdByAPIKey(
  apiKey: string | undefined
): string | null {
  switch (apiKey) {
    case "zAVMbyhsmj9dAJ9USwijrIdsfng9HWQ7yXYpWfb0":
      return "Caregiver 1";
    case "Ld6nYabJTJ13Qil6nwJBk8qrA2hUVaN52OboRJgZ":
      return "Caregiver 2";
    default:
      return null;
  }
}

export function getCaregiverAPIKeyById(caregiverId?: string): string {
  switch (caregiverId) {
    case "1":
      return "zAVMbyhsmj9dAJ9USwijrIdsfng9HWQ7yXYpWfb0";
    case "2":
      return "Ld6nYabJTJ13Qil6nwJBk8qrA2hUVaN52OboRJgZ";
    default:
      return "zAVMbyhsmj9dAJ9USwijrIdsfng9HWQ7yXYpWfb0";
  }
}

export function getCaregiverIdByURL(url: string): number {
  const caregiverId = Number(url.replace(/.*caregiver\/(\d+).*/, "$1"));
  return Number.isNaN(caregiverId) ? 1 : caregiverId;
}
