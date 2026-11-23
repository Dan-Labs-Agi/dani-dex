import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/menu";

export const messages = {
  "menu.stopAllAgents": "Parar todos os agentes",
  "menu.checkForUpdates": "Buscar atualizações…",
  "menu.preferences": "Configurações…",
  "menu.actualSize": "Tamanho real",
  "menu.zoomIn": "Ampliar",
  "menu.zoomOut": "Reduzir",
  "menu.closeDeveloperTools": "Fechar ferramentas de desenvolvedor",
  "menu.copyLink": "Copiar link",
  "menu.copyImage": "Copiar imagem",
  "menu.quit": "Sair do Dani Dex",
  "menu.quitConfirmTitle": "Sair do Dani Dex?",
  "menu.quitConfirmBody": "Os agentes e as rotinas param até você abrir o Dani Dex de novo.",
  "menu.quitConfirm": "Sair",
  "menu.quitHint": "Mantenha ⌘Q pressionado ou pressione duas vezes para sair",
  "menu.closeWorkingTitle": {
    one: "{count} agente ainda está trabalhando",
    other: "{count} agentes ainda estão trabalhando",
  },
  "menu.closeWorkingBody":
    "Se você sair do Dani Dex, os agentes param. Mantenha-o aberto para que terminem. Para mostrar a janela de novo, abra o Dani Dex.",
  "menu.closeKeepRunning": "Continuar",
  "menu.trayOpen": "Abrir o Dani Dex",
  "menu.trayQuit": "Sair do Dani Dex",
  "menu.trayTooltip": "Dani Dex",
  "menu.hideDynamicIsland": "Ocultar Dynamic Island",
  "menu.undo": "Desfazer",
  "menu.redo": "Refazer",
  "menu.cut": "Recortar",
  "menu.copy": "Copiar",
  "menu.paste": "Colar",
  "menu.pasteAndMatchStyle": "Colar e manter estilo",
  "menu.delete": "Excluir",
  "menu.selectAll": "Selecionar tudo",
} as const satisfies PartialTranslation<typeof source>;
