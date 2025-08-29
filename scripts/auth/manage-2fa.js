#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Function to read .env.local file
function readEnvFile() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    console.log("❌ .env.local file not found. Creating one...");
    return {};
  }

  const content = fs.readFileSync(envPath, "utf8");
  const env = {};

  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      if (key && valueParts.length > 0) {
        env[key] = valueParts.join("=");
      }
    }
  });

  return env;
}

// Function to write .env.local file
function writeEnvFile(env) {
  const envPath = path.join(process.cwd(), ".env.local");
  let content = "# 2FA Configuration\n";
  content += "NEXT_PUBLIC_APP_NAME=YourApp\n";
  content += "NEXT_PUBLIC_APP_ISSUER=YourApp\n\n";

  // Add 2FA secrets
  content += "# User 2FA Secrets\n";
  Object.keys(env).forEach((key) => {
    if (key.endsWith("_2FA_SECRET")) {
      content += `${key}=${env[key]}\n`;
    }
  });

  // Add enabled users
  content += "\n# 2FA Enabled Users\n";
  content += `ENABLED_2FA_USERS=${env.ENABLED_2FA_USERS || ""}\n`;

  // Add setup dates
  content += "\n# 2FA Setup Dates\n";
  Object.keys(env).forEach((key) => {
    if (key.endsWith("_2FA_SETUP_DATE")) {
      content += `${key}=${env[key]}\n`;
    }
  });

  // Add existing credentials
  content += "\n# Existing login credentials\n";
  if (env.NEXT_ADMIN_USERNAME)
    content += `NEXT_ADMIN_USERNAME=${env.NEXT_ADMIN_USERNAME}\n`;
  if (env.NEXT_ADMIN_PASSWORD_HASH)
    content += `NEXT_ADMIN_PASSWORD_HASH=${env.NEXT_ADMIN_PASSWORD_HASH}\n`;

  fs.writeFileSync(envPath, content);
  console.log("✅ .env.local file updated successfully!");
}

// Function to generate a new 2FA secret
function generateSecret() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let secret = "";
  for (let i = 0; i < 16; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
}

// Function to add a new user
function addUser(username) {
  const env = readEnvFile();
  const secretKey = `${username.toUpperCase()}_2FA_SECRET`;
  const setupDateKey = `${username.toUpperCase()}_2FA_SETUP_DATE`;

  if (env[secretKey]) {
    console.log(`❌ User ${username} already has a 2FA secret`);
    return;
  }

  const secret = generateSecret();
  env[secretKey] = secret;
  env[setupDateKey] = new Date().toISOString().split("T")[0];

  writeEnvFile(env);
  console.log(`✅ Added user ${username} with secret: ${secret}`);
  console.log(`📱 Use this secret to generate QR code for ${username}`);
}

// Function to enable 2FA for a user
function enableUser(username) {
  const env = readEnvFile();
  const enabledUsers = env.ENABLED_2FA_USERS || "";
  const userList = enabledUsers
    .split(",")
    .map((u) => u.trim())
    .filter((u) => u);

  if (userList.includes(username)) {
    console.log(`❌ User ${username} is already enabled for 2FA`);
    return;
  }

  userList.push(username);
  env.ENABLED_2FA_USERS = userList.join(",");

  writeEnvFile(env);
  console.log(`✅ Enabled 2FA for user ${username}`);
}

// Function to disable 2FA for a user
function disableUser(username) {
  const env = readEnvFile();
  const enabledUsers = env.ENABLED_2FA_USERS || "";
  const userList = enabledUsers
    .split(",")
    .map((u) => u.trim())
    .filter((u) => u !== username);

  env.ENABLED_2FA_USERS = userList.join(",");

  writeEnvFile(env);
  console.log(`✅ Disabled 2FA for user ${username}`);
}

// Function to list all users
function listUsers() {
  const env = readEnvFile();
  const enabledUsers = env.ENABLED_2FA_USERS || "";
  const userList = enabledUsers
    .split(",")
    .map((u) => u.trim())
    .filter((u) => u);

  console.log("\n📋 2FA Users Status:");
  console.log("==================");

  Object.keys(env).forEach((key) => {
    if (key.endsWith("_2FA_SECRET")) {
      const username = key.replace("_2FA_SECRET", "").toLowerCase();
      const isEnabled = userList.includes(username);
      const setupDate =
        env[`${username.toUpperCase()}_2FA_SETUP_DATE`] || "Not set";

      console.log(
        `${username}: ${
          isEnabled ? "✅ Enabled" : "❌ Disabled"
        } (Setup: ${setupDate})`
      );
    }
  });

  if (
    Object.keys(env).filter((key) => key.endsWith("_2FA_SECRET")).length === 0
  ) {
    console.log('No users found. Use "add <username>" to add a user.');
  }
}

// Main command handling
const command = process.argv[2];
const username = process.argv[3];

switch (command) {
  case "add":
    if (!username) {
      console.log("❌ Usage: node manage-2fa.js add <username>");
      process.exit(1);
    }
    addUser(username);
    break;

  case "enable":
    if (!username) {
      console.log("❌ Usage: node manage-2fa.js enable <username>");
      process.exit(1);
    }
    enableUser(username);
    break;

  case "disable":
    if (!username) {
      console.log("❌ Usage: node manage-2fa.js disable <username>");
      process.exit(1);
    }
    disableUser(username);
    break;

  case "list":
    listUsers();
    break;

  case "init":
    writeEnvFile({});
    console.log("✅ Initialized .env.local file with 2FA configuration");
    break;

  default:
    console.log(`
🔐 2FA Management Script

Usage:
  node manage-2fa.js <command> [username]

Commands:
  init                    Initialize .env.local file
  add <username>          Add a new user with 2FA secret
  enable <username>       Enable 2FA for a user
  disable <username>      Disable 2FA for a user
  list                    List all users and their 2FA status

Examples:
  node manage-2fa.js init
  node manage-2fa.js add admin
  node manage-2fa.js enable admin
  node manage-2fa.js list
    `);
}
