import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "dani-dex לא הצליח להיפתח",
  "startup.failedBody":
    "{message}\n\nהנתונים המקומיים שלך לא אופסו ולא נדרסו. בצעדי השחזור שבמדריך לפתרון בעיות אפשר לקרוא איך להמשיך.",
  "startup.archiveChangedTitle": "קובצי dani-dex שונו",
  "startup.archiveChangedBody":
    "תוכנה אחרת שינתה את קובץ dani-dex app.asar. dani-dex פועל כעת, אך לא ייפתח לאחר היציאה ממנו.\n\nכדי לתקן את dani-dex, יש להתקין אותו מחדש. הנתונים המקומיים נשמרים.",
  "startup.archiveChangedDownload": "הורדת dani-dex",
  "startup.filesDamagedBody":
    "חלק מקובצי dani-dex פגומים או חסרים.\n\nכדי לתקן את dani-dex, יש להתקין אותו מחדש. הנתונים המקומיים נשמרים.",
  "startup.newerDataUpdatingTitle": "dani-dex מתעדכן",
  "startup.newerDataUpdatingBody":
    "גרסה חדשה יותר של dani-dex שמרה את הנתונים שלך. dani-dex מתקין את הגרסה האחרונה ואז נפתח מחדש.\n\nהנתונים המקומיים שלך לא אופסו ולא נדרסו.",
  "startup.newerDataTitle": "התקנת dani-dex העדכני ביותר",
  "startup.newerDataBody":
    "גרסה חדשה יותר של dani-dex שמרה את הנתונים שלך, והגרסה הזו ({version}) אינה יכולה לפתוח אותם. יש להתקין את הגרסה האחרונה כדי לפתוח את הנתונים.\n\nהנתונים המקומיים שלך לא אופסו ולא נדרסו.",
  "startup.newerDataDownload": "הורדת dani-dex",
  "startup.newerDataGuide": "פתיחת המדריך",
  "startup.newerDataQuit": "יציאה",
  "startup.newerDataLoopTitle": "הגרסה האחרונה של dani-dex לא נפתחה",
  "startup.newerDataLoopBody":
    "גרסה חדשה יותר של dani-dex שמרה את הנתונים שלך, והגרסה הזו ({version}) אינה יכולה לפתוח אותם. dani-dex {loopVersion} נעצר לפני שנפתח כמה פעמים ברצף, ולכן הוא לא יותקן שוב.\n\nיש להתקין גרסה חדשה יותר מ-{loopVersion} כשתהיה זמינה. לקבלת עזרה, יש לפתוח את המדריך.\n\nהנתונים המקומיים שלך לא אופסו ולא נדרסו.",
  "startup.newerDataReleases": "הצגת הגרסאות",
  "startup.recoveryWindowTitle": "שחזור dani-dex",
  "startup.recoveryTitle": "dani-dex לא נפתח",
  "startup.recoveryBody": {
    one: "dani-dex {version} נעצר לפני שנפתח, פעם אחת ({count}). הנתונים המקומיים שלך לא אופסו ולא נדרסו.",
    two: "dani-dex {version} נעצר לפני שנפתח, פעמיים ברצף ({count}). הנתונים המקומיים שלך לא אופסו ולא נדרסו.",
    other: "dani-dex {version} נעצר לפני שנפתח, {count} פעמים ברצף. הנתונים המקומיים שלך לא אופסו ולא נדרסו.",
  },
  "startup.recoveryHint":
    "נסה שוב, או התקן את הגרסה האחרונה שנפתחה. לקבלת עזרה, ייצא את נתוני האבחון ושלח את הקובץ עם הדיווח שלך.",
  "startup.recoveryHintLatest":
    "dani-dex לא מצא גרסה קודמת שיכולה לפתוח את הנתונים שלך. נסה שוב, או התקן את הגרסה האחרונה. לקבלת עזרה, ייצא את נתוני האבחון ושלח את הקובץ עם הדיווח שלך.",
  "startup.recoveryRetry": "נסה שוב",
  "startup.recoveryPreviousVersion": "הורדת הגרסה הקודמת",
  "startup.recoveryLatestVersion": "הורדת הגרסה האחרונה",
  "startup.recoveryExportDiagnostics": "ייצוא אבחון",
  "startup.recoveryOpenDataFolder": "פתיחת תיקיית הנתונים",
  "startup.recoveryQuit": "יציאה",
  "startup.recoveryDiagnosticsSaved": "קובץ האבחון נשמר.",
  "startup.recoveryActionFailed": "dani-dex לא הצליח לבצע את הפעולה הזו.",
} as const satisfies PartialTranslation<typeof source>;
