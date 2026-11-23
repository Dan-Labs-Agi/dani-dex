import type { PartialTranslation } from "../../../message";
import type { messages as source } from "../../en/status/messaging";

export const messages = {
  "status.messaging.working": "Pracuję nad tym…",
  "status.messaging.queued": "Oczekiwanie na zakończenie wcześniejszego żądania. Odpowiedź pojawi się tutaj.",
  "status.messaging.busy": "Czeka zbyt wiele żądań. Spróbuj ponownie później.",
  "status.messaging.failed": "Dani Dex nie mógł dokończyć tego żądania. Szczegóły są na hoście Dani Dex.",
  "status.messaging.noAnswer": "Dani Dex zakończył pracę bez odpowiedzi tekstowej.",
  "status.messaging.noAgent": "Żaden agent nie może tu jeszcze odpowiadać. Dodaj Slack Orchestrator w Dani Dex.",
  "status.messaging.delegated": "Członek zespołu nad tym pracuje. Odpowiedź pojawi się tutaj.",
  "status.messaging.stopped": "Zatrzymano.",
  "status.messaging.stop": "Zatrzymaj",
  "status.messaging.approvalTitle": "Dani Dex prosi o zatwierdzenie, aby kontynuować.",
  "status.messaging.approvalTitleTeammate": "Członek zespołu {agent} prosi o zatwierdzenie, aby kontynuować.",
  "status.messaging.approvalCommand": "Uruchomienie polecenia",
  "status.messaging.approvalFileChange": "Zmiana plików",
  "status.messaging.approvalPermissions": "Dodatkowe uprawnienia",
  "status.messaging.approve": "Zatwierdź",
  "status.messaging.deny": "Odrzuć",
  "status.messaging.approvedBy": "Zatwierdzone przez: {user}.",
  "status.messaging.deniedBy": "Odrzucone przez: {user}.",
  "status.messaging.answeredOnHost": "Odpowiedziano na hoście Dani Dex.",
  "status.messaging.requestInactive": "To żądanie nie jest już aktywne.",
  "status.messaging.onlyRequester": "Tylko {user} może to zrobić. Może też odpowiedzieć host Dani Dex.",
  "status.messaging.hostOnly": "Na to żądanie może odpowiedzieć tylko host Dani Dex.",
  "status.messaging.filesSkipped": "Niektóre pliki nie zostały wysłane: {names}.",
  "status.messaging.orchestratorName": "Slack Orchestrator",
  "status.messaging.orchestratorTitle": "Odpowiada w Slacku i pyta zespół",
  "status.messaging.discordNoAgent":
    "Żaden agent nie może tu jeszcze odpowiadać. Dodaj Discord Orchestrator w Dani Dex.",
  "status.messaging.discordOrchestratorName": "Discord Orchestrator",
  "status.messaging.discordOrchestratorTitle": "Odpowiada na Discordzie i pyta zespół",
  "status.messaging.integrationsSection": "Integracje",
  "status.messaging.signInReceived": "Dani Dex otrzymał instalację Slack. Możesz zamknąć tę kartę.",
  "status.messaging.signInUnknown": "Dani Dex nie rozpoczął tej instalacji Slack. Rozpocznij ją ponownie w Dani Dex.",
  "status.messaging.telegramNoAgent":
    "Żaden agent nie może tu jeszcze odpowiadać. W Dani Dex otwórz Marketplace > Aplikacje > Telegram i kliknij Dodaj agenta.",
  "status.messaging.telegramLinked":
    "Dani Dex jest połączony z tym czatem. Oznacz {bot} lub odpowiedz na wiadomość Dani Dex, aby zapytać agentów.",
  "status.messaging.telegramNotLinked":
    "Dani Dex nie jest połączony z tym czatem. Aby go połączyć, otwórz aplikację Dani Dex, przejdź do Marketplace → Aplikacje → Telegram i wybierz „Dodaj do grupy” lub „Otwórz czat prywatny”.",
  "status.messaging.telegramOrchestratorName": "Telegram Orchestrator",
  "status.messaging.telegramOrchestratorTitle": "Odpowiada w Telegramie i pyta zespół",
  "status.messaging.whatsappNoAgent":
    "Żaden agent nie może tu jeszcze odpowiadać. Dodaj WhatsApp Orchestrator w Dani Dex.",
  "status.messaging.whatsappApprovalMenu": "Odpowiedz 1, aby zatwierdzić, lub 2, aby odrzucić.",
  "status.messaging.whatsappStopMenu": "Odpowiedz „stop”, aby zatrzymać.",
  "status.messaging.whatsappPairingCode":
    "Ten numer odpowiada tylko osobom, którym pozwolił właściciel. Przekaż właścicielowi ten kod: {code}",
  "status.messaging.whatsappPairingApproved": "Możesz teraz wysyłać prośby na ten numer.",
  "status.messaging.whatsappOwnChat": "Wiadomość do siebie",
  "status.messaging.whatsappWelcomeOwn":
    "👋 *Dani Dex jest połączony*\n\nNapisz tutaj, aby poprosić swoich agentów. WhatsApp Orchestrator odpowiada albo przekazuje pracę właściwemu agentowi.\n\nWyślij *stop*, aby zatrzymać prośbę.",
  "status.messaging.whatsappWelcomeDedicated":
    "👋 *Dani Dex jest połączony*\n\nOsoby, na które pozwolisz w Dani Dex, mogą już pisać na ten numer. Nowa osoba dostaje kod: zatwierdź go w Dani Dex w sekcji Prośby.\n\nWyślij *stop*, aby zatrzymać prośbę.",
  "status.messaging.whatsappOtherDani Dex":
    "Z tym numerem WhatsApp jest połączony inny Dani Dex, więc możesz dostać dwie odpowiedzi. Aby to naprawić, otwórz Połączone urządzenia w WhatsAppie na telefonie i wyloguj Dani Dex, którego nie używasz.",
  "status.messaging.whatsappPaused":
    "Dani Dex przestał tu odpowiadać na 10 minut: w krótkim czasie przyszło za dużo wiadomości. Jeśli z tym numerem jest połączony inny Dani Dex, otwórz Połączone urządzenia w WhatsAppie na telefonie i wyloguj Dani Dex, którego nie używasz.",
  "status.messaging.whatsappOrchestratorName": "WhatsApp Orchestrator",
  "status.messaging.whatsappOrchestratorTitle": "Odpowiada w WhatsApp i pyta zespół",
} as const satisfies PartialTranslation<typeof source>;
