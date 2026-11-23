import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "تعذّر بدء تشغيل Dani Dex",
  "startup.failedBody":
    "{message}\n\nلم تُعَد تعيين بياناتك المحلية ولم يُكتب فوقها. راجع دليل استكشاف الأخطاء وإصلاحها لمعرفة خطوات الاسترداد.",
  "startup.archiveChangedTitle": "تم تغيير ملفات Dani Dex",
  "startup.archiveChangedBody":
    "غيّر برنامج آخر ملف Dani Dex المسمى app.asar. يعمل Dani Dex الآن، لكنه لن يفتح بعد إنهائه.\n\nلإصلاح Dani Dex، ثبّته من جديد. تبقى بياناتك المحلية.",
  "startup.archiveChangedDownload": "تنزيل Dani Dex",
  "startup.filesDamagedBody":
    "بعض ملفات Dani Dex تالفة أو مفقودة.\n\nلإصلاح Dani Dex، ثبّته من جديد. تبقى بياناتك المحلية.",
  "startup.newerDataUpdatingTitle": "جارٍ تحديث Dani Dex",
  "startup.newerDataUpdatingBody":
    "حفظ إصدار أحدث من Dani Dex بياناتك. يثبّت Dani Dex أحدث إصدار ثم يفتح مرة أخرى.\n\nلم تتم إعادة تعيين بياناتك المحلية أو الكتابة فوقها.",
  "startup.newerDataTitle": "ثبّت أحدث إصدار من Dani Dex",
  "startup.newerDataBody":
    "حفظ إصدار أحدث من Dani Dex بياناتك، ولا يستطيع هذا الإصدار ({version}) فتحها. ثبّت أحدث إصدار لفتح بياناتك.\n\nلم تتم إعادة تعيين بياناتك المحلية أو الكتابة فوقها.",
  "startup.newerDataDownload": "تنزيل Dani Dex",
  "startup.newerDataGuide": "فتح الدليل",
  "startup.newerDataQuit": "إنهاء",
  "startup.newerDataLoopTitle": "لم يُفتح أحدث إصدار من Dani Dex",
  "startup.newerDataLoopBody":
    "حفظ إصدار أحدث من Dani Dex بياناتك، ولا يستطيع هذا الإصدار ({version}) فتحها. توقف Dani Dex {loopVersion} قبل أن يُفتح عدة مرات متتالية، لذلك لن يُثبَّت مرة أخرى.\n\nثبّت إصدارًا أحدث من {loopVersion} عندما يتوفر. للحصول على المساعدة، افتح الدليل.\n\nلم تتم إعادة تعيين بياناتك المحلية أو الكتابة فوقها.",
  "startup.newerDataReleases": "عرض الإصدارات",
  "startup.recoveryWindowTitle": "استرداد Dani Dex",
  "startup.recoveryTitle": "لم يُفتح Dani Dex",
  "startup.recoveryBody": {
    zero: "توقف Dani Dex {version} قبل أن يُفتح {count} مرة متتالية. لم تتم إعادة تعيين بياناتك المحلية أو الكتابة فوقها.",
    one: "توقف Dani Dex {version} قبل أن يُفتح مرة واحدة ({count}). لم تتم إعادة تعيين بياناتك المحلية أو الكتابة فوقها.",
    two: "توقف Dani Dex {version} قبل أن يُفتح مرتين متتاليتين ({count}). لم تتم إعادة تعيين بياناتك المحلية أو الكتابة فوقها.",
    few: "توقف Dani Dex {version} قبل أن يُفتح {count} مرات متتالية. لم تتم إعادة تعيين بياناتك المحلية أو الكتابة فوقها.",
    many: "توقف Dani Dex {version} قبل أن يُفتح {count} مرة متتالية. لم تتم إعادة تعيين بياناتك المحلية أو الكتابة فوقها.",
    other:
      "توقف Dani Dex {version} قبل أن يُفتح {count} مرة متتالية. لم تتم إعادة تعيين بياناتك المحلية أو الكتابة فوقها.",
  },
  "startup.recoveryHint":
    "أعد المحاولة، أو ثبّت آخر إصدار فُتح. للحصول على المساعدة، صدّر بيانات التشخيص وأرسل الملف مع بلاغك.",
  "startup.recoveryHintLatest":
    "لم يجد Dani Dex إصدارًا سابقًا يستطيع فتح بياناتك. أعد المحاولة، أو ثبّت أحدث إصدار. للحصول على المساعدة، صدّر بيانات التشخيص وأرسل الملف مع بلاغك.",
  "startup.recoveryRetry": "إعادة المحاولة",
  "startup.recoveryPreviousVersion": "تنزيل الإصدار السابق",
  "startup.recoveryLatestVersion": "تنزيل أحدث إصدار",
  "startup.recoveryExportDiagnostics": "تصدير التشخيص",
  "startup.recoveryOpenDataFolder": "فتح مجلد البيانات",
  "startup.recoveryQuit": "إنهاء",
  "startup.recoveryDiagnosticsSaved": "تم حفظ ملف التشخيص.",
  "startup.recoveryActionFailed": "تعذّر على Dani Dex تنفيذ هذا الإجراء.",
} as const satisfies PartialTranslation<typeof source>;
