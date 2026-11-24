import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/status/host";

export const messages = {
  "status.host.registered": "ה-dani-dex הזה נרשם לגישת WebRTC.",
  "status.host.keyRotated": "מפתח השרת השתנה. המכשירים המותאמים נשארים מותאמים.",
  "status.host.identityUpdated": "זהות השרת עודכנה.",
  "status.host.starting": "מפעיל את מארח ה-WebRTC…",
  "status.host.ready": "ה-dani-dex הזה מוכן לחיבורי WebRTC.",
  "status.host.signalLost": "מכשירים אחרים לא יכולים להגיע ל-dani-dex הזה כרגע. הוא מתחבר שוב.",
  "status.host.stopping": "הופך את ה-dani-dex הזה לפרטי…",
  "status.host.private": "ה-dani-dex הזה פרטי.",
  "status.host.removed": "ה-dani-dex הזה הוסר מהחשבון שלך. יש לפרסם אותו שוב כדי לשתף אותו.",
} as const satisfies PartialTranslation<typeof source>;
