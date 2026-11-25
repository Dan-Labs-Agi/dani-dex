import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "Dani Dex n’a pas pu démarrer",
  "startup.failedBody":
    "{message}\n\nVos données locales n’ont pas été réinitialisées ni écrasées. Consultez le guide de dépannage pour savoir comment récupérer la situation.",
  "startup.archiveChangedTitle": "Des fichiers d’Dani Dex ont été modifiés",
  "startup.archiveChangedBody":
    "Un autre programme a modifié le fichier app.asar d’Dani Dex. Dani Dex fonctionne maintenant, mais il ne s’ouvrira plus après sa fermeture.\n\nPour le réparer, réinstallez Dani Dex. Vos données locales sont conservées.",
  "startup.archiveChangedDownload": "Télécharger Dani Dex",
  "startup.filesDamagedBody":
    "Certains fichiers d’Dani Dex sont endommagés ou manquants.\n\nPour le réparer, réinstallez Dani Dex. Vos données locales sont conservées.",
  "startup.newerDataUpdatingTitle": "Mise à jour d’Dani Dex",
  "startup.newerDataUpdatingBody":
    "Une version plus récente d’Dani Dex a enregistré vos données. Dani Dex installe la dernière version, puis se rouvre.\n\nVos données locales n’ont pas été réinitialisées ni écrasées.",
  "startup.newerDataTitle": "Installez la dernière version d’Dani Dex",
  "startup.newerDataBody":
    "Une version plus récente d’Dani Dex a enregistré vos données, et cette version ({version}) ne peut pas les ouvrir. Installez la dernière version pour ouvrir vos données.\n\nVos données locales n’ont pas été réinitialisées ni écrasées.",
  "startup.newerDataDownload": "Télécharger Dani Dex",
  "startup.newerDataGuide": "Ouvrir le guide",
  "startup.newerDataQuit": "Quitter",
  "startup.newerDataLoopTitle": "La dernière version d’Dani Dex ne s’est pas ouverte",
  "startup.newerDataLoopBody":
    "Une version plus récente d’Dani Dex a enregistré vos données, et cette version ({version}) ne peut pas les ouvrir. Dani Dex {loopVersion} s’est arrêté avant de s’ouvrir plusieurs fois de suite : il n’est donc pas réinstallé.\n\nInstallez une version plus récente que {loopVersion} dès qu’elle est disponible. Pour obtenir de l’aide, ouvrez le guide.\n\nVos données locales n’ont pas été réinitialisées ni écrasées.",
  "startup.newerDataReleases": "Voir les versions",
  "startup.recoveryWindowTitle": "Récupération d’Dani Dex",
  "startup.recoveryTitle": "Dani Dex ne s’est pas ouvert",
  "startup.recoveryBody": {
    one: "Dani Dex {version} s’est arrêté avant de s’ouvrir, {count} fois de suite. Vos données locales n’ont pas été réinitialisées ni écrasées.",
    other:
      "Dani Dex {version} s’est arrêté avant de s’ouvrir, {count} fois de suite. Vos données locales n’ont pas été réinitialisées ni écrasées.",
  },
  "startup.recoveryHint":
    "Réessayez, ou installez la dernière version qui s’est ouverte. Pour obtenir de l’aide, exportez le diagnostic et envoyez le fichier avec votre rapport.",
  "startup.recoveryHintLatest":
    "Dani Dex n’a trouvé aucune version antérieure capable d’ouvrir vos données. Réessayez, ou installez la dernière version. Pour obtenir de l’aide, exportez le diagnostic et envoyez le fichier avec votre rapport.",
  "startup.recoveryRetry": "Réessayer",
  "startup.recoveryPreviousVersion": "Télécharger la version précédente",
  "startup.recoveryLatestVersion": "Télécharger la dernière version",
  "startup.recoveryExportDiagnostics": "Exporter le diagnostic",
  "startup.recoveryOpenDataFolder": "Ouvrir le dossier des données",
  "startup.recoveryQuit": "Quitter",
  "startup.recoveryDiagnosticsSaved": "Le fichier de diagnostic est enregistré.",
  "startup.recoveryActionFailed": "Dani Dex n’a pas pu effectuer cette action.",
} as const satisfies PartialTranslation<typeof source>;
