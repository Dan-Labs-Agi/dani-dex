const { existsSync } = require("node:fs");
const { join } = require("node:path");

// Android notifications come through Firebase Cloud Messaging, which needs the Firebase file of the
// app. The file is optional, so the app builds before the Firebase project exists, and such a build
// gets no notifications on Android. The file has public identifiers only; the account service has the
// key that sends.
const GOOGLE_SERVICES_FILE = "./google-services.json";

/** @param {{ config: import('expo/config').ExpoConfig }} context */
module.exports = ({ config }) => {
  const withFirebase = existsSync(join(__dirname, GOOGLE_SERVICES_FILE))
    ? { ...config, android: { ...config.android, googleServicesFile: GOOGLE_SERVICES_FILE } }
    : config;

  // The free EAS worker (4 vCPU, ~15.6 GB) OOM-kills the Gradle daemon where R8 full-mode shrinking
  // runs beside Metro and the Kotlin daemons, and EAS pins GRADLE_OPTS so the heap cannot be capped
  // from gradle.properties. Ship the direct-download APK unminified so the build fits the worker.
  if (process.env.EAS_BUILD_PROFILE === "apk-direct") {
    return {
      ...withFirebase,
      plugins: (withFirebase.plugins ?? []).map((plugin) =>
        Array.isArray(plugin) && plugin[0] === "expo-build-properties"
          ? [
              plugin[0],
              {
                ...plugin[1],
                android: {
                  ...plugin[1].android,
                  enableMinifyInReleaseBuilds: false,
                  enableShrinkResourcesInReleaseBuilds: false,
                },
              },
            ]
          : plugin,
      ),
    };
  }

  return withFirebase;
};
