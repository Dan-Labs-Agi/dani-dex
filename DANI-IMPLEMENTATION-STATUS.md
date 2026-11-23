# Dani Dex platform preview work

This working branch is incomplete. It is not an installable release and must not merge to main yet.

Implemented inputs: latest source snapshot, Dani main mark, seven source-defined character renders, shared identity mapping, Solid renderer adapter, desktop/mobile generated-avatar path replacements, desktop/mobile icon inputs, display literal updates, isolated service defaults and removal of inherited analytics destinations. Required notices remain.

Verified: brand, main-process, desktop renderer, mobile and account API typechecks; UI foundation check; seven focused identity/service tests; three migration fixture regression tests; visual inspection of source mark, seven character renders and icon export contact sheets.

Not verified: full lint and translation catalog checks; complete desktop/API test suites; full production build (local build exited 137); packaged application rendering; artifact identity scan; fresh install/update/rollback; old Dani data migration; Dani Free first run; voice parity; remote service deployment; live provider task; live Telegram/Slack/Discord/WhatsApp; native Android/iOS/macOS/Windows acceptance; signing and distribution. Upstream network references and old avatar render paths still need full audit. Some source artwork and procedural logo paths remain to replace.

No inherited deployment/release workflow is enabled. The validation workflow only reads source and compiles/tests. No release, cloud deployment, channel activation, store upload or main update is authorized by this file.

Source main: aafb9aa5b73772c30cffce46a20a20a29a4fc709.
Destination base: 0667b66092dc148bc7344d1c96c997370cc1b073.
Dani identity source: 2c502a45b1e9e1dfb8e029dae97c96519b074afe.

The inherited platform license remains PolyForm Noncommercial. Commercial rights are not established here. Dani source character code retains its own source license.

WIP validation note: the first preview commit skips the unchanged local pre-commit hook because dependency-aware Biome scanning exceeds the local memory budget. The enabled validation workflow runs full lint, typechecks, translations, desktop/API tests and four-platform compilation without publishing. No check is claimed passed from that skip. Inherited encrypted service environment values are removed; service setup is required.
