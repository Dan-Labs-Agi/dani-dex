const { existsSync, readFileSync } = require("node:fs");
const { join } = require("node:path");

// Android notifications come through Firebase Cloud Messaging, which needs the Firebase file of the
// app. The file is optional, so the app builds before the Firebase project exists, and such a build
// gets no notifications on Android. The file has public identifiers only; the account service has the
// key that sends.
const GOOGLE_SERVICES_FILE = "./google-services.json";

// The Android build fails when the file lists no app with the configured package id, so it is
// attached only when it has a matching client.
const hasClientForPackage = (file, packageName) => {
  try {
    const data = JSON.parse(readFileSync(file, "utf8"));
    return (data.client ?? []).some(
      (client) => client.client_info?.android_client_info?.package_name === packageName,
    );
  } catch {
    return false;
  }
};

/** @param {{ config: import('expo/config').ExpoConfig }} context */
module.exports = ({ config }) => {
  const path = join(__dirname, GOOGLE_SERVICES_FILE);
  if (existsSync(path) && hasClientForPackage(path, config.android?.package)) {
    return { ...config, android: { ...config.android, googleServicesFile: GOOGLE_SERVICES_FILE } };
  }
  return config;
};
