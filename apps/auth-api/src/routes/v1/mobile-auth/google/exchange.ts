import { isReferralCode } from "@openbot/contracts/referral";
import { isString } from "@openbot/contracts/runtime-values";
import { createFileRoute } from "@tanstack/solid-router";
import { Effect } from "effect";
import { runApiResponse } from "../../../../server/effect-runtime";
import { GoogleIdTokenError, verifyGoogleIdToken } from "../../../../server/google-id-token";
import { readJsonObject } from "../../../../server/json-body";
import { apiError, authErrorResponse, json, requestAuthService, requestGoogleMobileClientIds } from "../../../../server/request-auth";
import { requestSourceIp } from "../../../../server/source-ip";

export const Route = createFileRoute("/v1/mobile-auth/google/exchange")({
  server: {
    handlers: {
      POST: ({ request }) =>
        runApiResponse(
          Effect.gen(function* () {
            const body = yield* readJsonObject(request);
            if (!isString(body.idToken)) {
              return apiError(400, "invalid_google_token", "The Google sign-in did not finish. Try again.");
            }
            if (
              !isString(body.deviceId) ||
              !isString(body.deviceName) ||
              (body.platform !== "ios" && body.platform !== "android" && body.platform !== "unknown")
            ) {
              return apiError(400, "invalid_mobile_device", "The mobile device is invalid.");
            }
            const clientIds = requestGoogleMobileClientIds();
            if (clientIds.length === 0) {
              return apiError(503, "google_sign_in_unavailable", "Google sign-in is not available.");
            }
            const email = yield* Effect.tryPromise({
              try: () => verifyGoogleIdToken(body.idToken, clientIds),
              catch: (error) => error,
            }).pipe(
              Effect.mapError((error) =>
                error instanceof GoogleIdTokenError && error.code === "google_email_unverified"
                  ? error
                  : new GoogleIdTokenError("invalid_google_token"),
              ),
            );
            return json(
              yield* requestAuthService().exchangeMobileGoogleLogin({
                email,
                sourceIp: requestSourceIp(request),
                device: { id: body.deviceId, name: body.deviceName, platform: body.platform },
                referralCode: isReferralCode(body.referralCode) ? body.referralCode : null,
              }),
            );
          }),
          (error) => {
            if (error instanceof SyntaxError) {
              return apiError(400, "invalid_json", "The request body is invalid.");
            }
            if (error instanceof GoogleIdTokenError) {
              if (error.code === "google_email_unverified") {
                return apiError(400, "google_email_unverified", "The Google account email is not verified.");
              }
              return apiError(401, "invalid_google_token", "The Google sign-in could not be verified. Try again.");
            }
            return authErrorResponse(error);
          },
        ),
    },
  },
});
