import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/error/update";

export const messages = {
  "error.update.unsupported": "עדכונים זמינים בגרסאות שולחן עבודה מותקנות.",
  "error.update.notReady": "עדכון אינו מוכן להתקנה.",
  "error.update.restartFailed": "Dani Dex לא הצליח להפעיל את עצמו מחדש כדי להתקין את העדכון.",
  "error.update.downloadStalled": "הורדת העדכון הפסיקה להגיב. יש לנסות שוב.",
  "error.update.installFailed": "לא ניתן להתקין את העדכון. יש לצאת מ-dani-dex, לפתוח אותו מחדש ולנסות שוב.",
  "error.update.notInstalled": "ההפעלה מחדש האחרונה לא התקינה את העדכון. יש להפעיל מחדש כדי לנסות שוב.",
  "error.update.downloadFailed": "לא ניתן להוריד את העדכון. יש לנסות שוב.",
  "error.update.signatureNotConfirmed":
    "Dani Dex לא הצליח לאמת את העדכון. יש לנסות שוב. אם השגיאה נמשכת, יש להוריד את Dani Dex מ-openbot.run/download.",
  "error.update.checkFailed": "לא ניתן לבדוק אם יש עדכונים. יש לנסות שוב.",
  "error.update.checkStalled": "בדיקת העדכונים הפסיקה להגיב. יש לנסות שוב.",
  "error.update.checkOffline": "לא ניתן להתחבר לשירות העדכונים. יש לבדוק את חיבור האינטרנט ולנסות שוב.",
  "error.update.checkUnavailable": "שירות העדכונים לא הגיב. Dani Dex ינסה שוב מעצמו בעוד כמה דקות.",
  "error.update.checkNoRelease": "לא נמצא עדכון שפורסם עבור הפלטפורמה הזו. Dani Dex ינסה שוב מעצמו בעוד כמה דקות.",
  "error.update.managedByNix": "Nix מתקין עדכונים עבור העותק הזה של Dani Dex. יש לעדכן אותו באמצעות Nix.",
  "error.update.managedByHost": "עדכונים ב-Mac הזה מותקנים על ידי המארח. העדכון נשאר מוכן עד להרצת התחזוקה של המארח.",
  "error.update.siblingSession":
    "סשן אחר של Dani Dex עדיין פועל מהאפליקציה הזו. יש לעצור את Dani Dex בכל חשבון משתמש אחר ב-macOS ואז להתקין את העדכון שוב.",
  "error.update.siblingSessionSameAccount":
    "תהליך אחר של Dani Dex עדיין פועל בחשבון המשתמש הזה. יש לסגור אותו ואז להתקין את העדכון שוב.",
  "error.update.siblingCheckFailed": "לא ניתן לאמת סשנים אחרים של Dani Dex. יש לנסות שוב לפני ההתקנה.",
  "error.update.readOnlyLocation":
    "Dani Dex לא יכול להתקין עדכונים מהמיקום הזה. צא מ-dani-dex. ב-Finder, גרור את Dani Dex לתיקייה 'יישומים' (אם הוא כבר שם, גרור אותו החוצה ובחזרה פנימה). לאחר מכן פתח את Dani Dex והתקן את העדכון שוב.",
  "error.update.appImageMissing":
    "Dani Dex לא יכול להתקין את העדכון כי קובץ ה-AppImage שלו הועבר, שונה שמו או הוחלף. יש לצאת מ-dani-dex ואז לפתוח שוב את קובץ ה-AppImage.",
  "error.update.appImageReadOnly":
    "Dani Dex לא יכול להתקין עדכונים בתיקייה של קובץ ה-AppImage שלו. יש לצאת מ-dani-dex, להעביר את קובץ ה-AppImage לתיקייה בתוך תיקיית הבית, ואז לפתוח אותו ולהתקין שוב את העדכון.",
  "error.update.remoteDisabled": "עדכונים ממנהלי שרת כבויים במחשב הזה.",
  "error.update.restartStarted": "Dani Dex כבר מופעל מחדש כדי להתקין את העדכון.",
  "error.update.alreadyRestarting": "Dani Dex כבר מופעל מחדש.",
} as const satisfies PartialTranslation<typeof source>;
