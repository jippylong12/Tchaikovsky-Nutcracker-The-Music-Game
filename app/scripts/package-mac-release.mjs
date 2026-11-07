// Builds the Mac .dmg for sharing: signed with the JippylongTwelve LLC Developer ID certificate, hardened
// runtime on, notarized by Apple, and stapled, so it opens with a plain double-click on any Mac.
//
// One-time setup (stores the notarization login in the macOS keychain under the profile name below):
//   xcrun notarytool store-credentials nutcracker-notary --apple-id <apple id> --team-id B959VQL59F
// Then from app/: npm run package:mac:release
//
// Override with APPLE_SIGNING_IDENTITY, NUTCRACKER_RELEASE_TEAM, or NOTARY_PROFILE.
import console from "node:console";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(readFileSync(path.join(appRoot, "src-tauri/tauri.conf.json"), "utf8"));
const team = process.env.NUTCRACKER_RELEASE_TEAM ?? "B959VQL59F";
const identity = process.env.APPLE_SIGNING_IDENTITY ?? `Developer ID Application: JippylongTwelve LLC (${team})`;
const profile = process.env.NOTARY_PROFILE ?? "nutcracker-notary";
const env = { ...process.env, APPLE_SIGNING_IDENTITY: identity, NUTCRACKER_RELEASE_TEAM: team, CI: "true" };

function run(command, args, options = {}) {
  console.log(`\n$ ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, { cwd: appRoot, env, stdio: "inherit", ...options });
  if (result.status !== 0) {
    console.error(`\npackage-mac-release: ${command} failed (exit ${result.status ?? result.signal})`);
    process.exit(result.status ?? 1);
  }
}

const identities = spawnSync("security", ["find-identity", "-v", "-p", "codesigning"], { encoding: "utf8" }).stdout;
if (!identities.includes(`"${identity}"`)) {
  console.error(`package-mac-release: signing identity not found in the keychain: ${identity}`);
  process.exit(1);
}
const credentials = spawnSync("xcrun", ["notarytool", "history", "--keychain-profile", profile], { encoding: "utf8" });
if (credentials.status !== 0) {
  console.error(
    `package-mac-release: no notarization login saved as "${profile}". Run once:\n` +
      `  xcrun notarytool store-credentials ${profile} --apple-id <apple id> --team-id ${team}`,
  );
  process.exit(1);
}

run("npm", ["run", "verify:release"]);
// Notarization requires the hardened runtime; the ad-hoc local build leaves it off.
run("npx", ["tauri", "build", "--bundles", "app,dmg", "--config", JSON.stringify({ bundle: { macOS: { hardenedRuntime: true } } })]);

const dmgDirectory = path.join(appRoot, "src-tauri/target/release/bundle/dmg");
const dmgName = readdirSync(dmgDirectory).find((name) => name.startsWith(`${config.productName}_${config.version}_`) && name.endsWith(".dmg"));
if (!dmgName) {
  console.error("package-mac-release: the build produced no .dmg");
  process.exit(1);
}
const dmg = path.join(dmgDirectory, dmgName);

run("codesign", ["--force", "--sign", identity, "--timestamp", dmg]);
run("npm", ["run", "verify:package:mac"]);
run("xcrun", ["notarytool", "submit", dmg, "--keychain-profile", profile, "--wait"]);
run("xcrun", ["stapler", "staple", dmg]);
run("xcrun", ["stapler", "validate", dmg]);
run("spctl", ["--assess", "--type", "open", "--context", "context:primary-signature", "--verbose=2", dmg]);
console.log(`\npackage-mac-release: notarized and stapled ${dmg}`);
