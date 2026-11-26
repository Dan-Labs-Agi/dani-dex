import changelogSource from "../../../../docs/CHANGELOG.md?raw";
import { type ChangelogPlatform, type ChangelogRelease, parseChangelog } from "./changelog";

export const CHANGELOG_RELEASES: Readonly<Record<ChangelogPlatform, readonly ChangelogRelease[]>> = {
  desktop: parseChangelog(changelogSource),
  // The mobile app moved to its own repository and took its changelog with it. Mobile-anchored
  // entries in the desktop changelog still parse, so the endpoint keeps its shape until the
  // extracted app's own changelog feed is wired up.
  mobile: parseChangelog(changelogSource, { anchorPrefix: "mobile-", stores: true }),
};

export const CHANGELOG_UPDATED_AT = CHANGELOG_RELEASES.desktop.find((release) => release.date)?.date ?? "";
