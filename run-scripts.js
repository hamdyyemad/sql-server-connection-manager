#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");

// ANSI color codes for better output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

// Helper function to print colored text
function printColor(text, color = "reset") {
  console.log(`${colors[color]}${text}${colors.reset}`);
}

// Helper function to print header
function printHeader(text) {
  console.log("\n" + "=".repeat(60));
  printColor(text, "bright");
  console.log("=".repeat(60));
}

// Main function
function main() {
  const args = process.argv.slice(2);

  // Show welcome message
  printHeader("QR Code Admin - Interactive Script Manager");
  printColor("🚀 Starting interactive script manager...", "green");
  console.log("");

  // Path to the CLI tool
  const cliPath = path.join(__dirname, "scripts", "index.js");

  // Execute the CLI tool
  const child = spawn("node", [cliPath, ...args], {
    stdio: "inherit",
    cwd: __dirname,
  });

  child.on("error", (error) => {
    printColor(`❌ Error running script manager: ${error.message}`, "red");
    process.exit(1);
  });

  child.on("close", (code) => {
    if (code === 0) {
      printColor("\n🎉 Script manager closed successfully!", "green");
    } else {
      printColor(`\n⚠️  Script manager exited with code ${code}`, "yellow");
      process.exit(code);
    }
  });
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };
