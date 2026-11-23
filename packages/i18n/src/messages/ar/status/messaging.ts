import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/status/messaging";

export const messages = {
  "status.messaging.working": "جارٍ العمل على ذلك…",
  "status.messaging.queued": "في الانتظار حتى ينتهي طلب سابق. ستصل الإجابة هنا.",
  "status.messaging.busy": "هناك طلبات كثيرة جدًا في الانتظار. أعد المحاولة لاحقًا.",
  "status.messaging.failed": "تعذّر على Dani Dex إنهاء هذا الطلب. التفاصيل لدى مضيف Dani Dex.",
  "status.messaging.noAnswer": "انتهى Dani Dex دون إجابة مكتوبة.",
  "status.messaging.noAgent": "لا يوجد وكيل يستطيع الإجابة هنا بعد. أضف Slack Orchestrator في Dani Dex.",
  "status.messaging.delegated": "يعمل زميل على ذلك. ستصل الإجابة هنا.",
  "status.messaging.stopped": "تم الإيقاف.",
  "status.messaging.stop": "إيقاف",
  "status.messaging.approvalTitle": "يطلب Dani Dex الموافقة للمتابعة.",
  "status.messaging.approvalTitleTeammate": "يطلب الزميل {agent} الموافقة للمتابعة.",
  "status.messaging.approvalCommand": "تشغيل أمر",
  "status.messaging.approvalFileChange": "تغيير الملفات",
  "status.messaging.approvalPermissions": "الحصول على أذونات إضافية",
  "status.messaging.approve": "موافقة",
  "status.messaging.deny": "رفض",
  "status.messaging.approvedBy": "وافق عليه {user}.",
  "status.messaging.deniedBy": "رفضه {user}.",
  "status.messaging.answeredOnHost": "تمت الإجابة على مضيف Dani Dex.",
  "status.messaging.requestInactive": "لم يعد هذا الطلب نشطًا.",
  "status.messaging.onlyRequester": "لا يستطيع فعل ذلك إلا {user}. يستطيع مضيف Dani Dex أيضًا الإجابة.",
  "status.messaging.hostOnly": "لا يستطيع الإجابة على هذا الطلب إلا مضيف Dani Dex.",
  "status.messaging.filesSkipped": "لم تُرسَل بعض الملفات: {names}.",
  "status.messaging.orchestratorName": "Slack Orchestrator",
  "status.messaging.orchestratorTitle": "يجيب في Slack ويسأل الفريق",
  "status.messaging.discordNoAgent": "لا يوجد وكيل يستطيع الإجابة هنا بعد. أضف Discord Orchestrator في Dani Dex.",
  "status.messaging.discordOrchestratorName": "Discord Orchestrator",
  "status.messaging.discordOrchestratorTitle": "يجيب في Discord ويسأل الفريق",
  "status.messaging.integrationsSection": "التكاملات",
  "status.messaging.signInReceived": "استلم Dani Dex تثبيت Slack. يمكنك إغلاق علامة التبويب هذه.",
  "status.messaging.signInUnknown": "لم يبدأ Dani Dex تثبيت Slack هذا. ابدأه مرة أخرى في Dani Dex.",
  "status.messaging.telegramNoAgent":
    "لا يوجد وكيل يستطيع الإجابة هنا بعد. في Dani Dex، افتح المتجر > التطبيقات > Telegram وانقر على إضافة وكيل.",
  "status.messaging.telegramLinked":
    "Dani Dex متصل بهذه الدردشة. اذكر {bot} أو ردّ على رسالة من Dani Dex لسؤال الوكلاء.",
  "status.messaging.telegramNotLinked":
    "Dani Dex غير متصل بهذه الدردشة. لربطه، افتح تطبيق Dani Dex وانتقل إلى المتجر ← التطبيقات ← Telegram، ثم اختر «إضافة إلى مجموعة» أو «فتح دردشة مباشرة».",
  "status.messaging.telegramOrchestratorName": "Telegram Orchestrator",
  "status.messaging.telegramOrchestratorTitle": "يجيب في Telegram ويسأل الفريق",
  "status.messaging.whatsappNoAgent": "لا يوجد وكيل يستطيع الإجابة هنا بعد. أضف WhatsApp Orchestrator في Dani Dex.",
  "status.messaging.whatsappApprovalMenu": "أرسل 1 للموافقة أو 2 للرفض.",
  "status.messaging.whatsappStopMenu": "أرسل stop للإيقاف.",
  "status.messaging.whatsappPairingCode":
    "يجيب هذا الرقم عن الأشخاص الذين سمح لهم مالكه فقط. أعطِ المالك هذا الرمز: {code}",
  "status.messaging.whatsappPairingApproved": "يمكنك الآن إرسال الطلبات إلى هذا الرقم.",
  "status.messaging.whatsappOwnChat": "مراسلة نفسك",
  "status.messaging.whatsappWelcomeOwn":
    "👋 *Dani Dex متصل*\n\nاكتب هنا لتسأل وكلاءك. يجيب WhatsApp Orchestrator، أو يسند العمل إلى الوكيل المناسب.\n\nأرسل *stop* لإيقاف طلب.",
  "status.messaging.whatsappWelcomeDedicated":
    "👋 *Dani Dex متصل*\n\nيستطيع الأشخاص الذين تسمح لهم في Dani Dex الكتابة الآن إلى هذا الرقم. يحصل الشخص الجديد على رمز: وافق عليه في Dani Dex ضمن الطلبات.\n\nأرسل *stop* لإيقاف طلب.",
  "status.messaging.whatsappOtherDani Dex":
    "يوجد Dani Dex آخر مرتبط برقم واتساب هذا، لذلك قد تصلك إجابتان. لإصلاح ذلك، افتح الأجهزة المرتبطة في واتساب على هاتفك وسجّل الخروج من Dani Dex الذي لا تستخدمه.",
  "status.messaging.whatsappPaused":
    "توقّف Dani Dex عن الرد هنا لمدة 10 دقائق: وصلت رسائل كثيرة جدًا في وقت قصير. إذا كان Dani Dex آخر مرتبطًا بهذا الرقم، فافتح الأجهزة المرتبطة في واتساب على هاتفك وسجّل الخروج من Dani Dex الذي لا تستخدمه.",
  "status.messaging.whatsappOrchestratorName": "WhatsApp Orchestrator",
  "status.messaging.whatsappOrchestratorTitle": "يجيب في WhatsApp ويسأل الفريق",
} as const satisfies PartialTranslation<typeof source>;
