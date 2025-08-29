#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const readline = require("readline");

// ANSI color codes for better output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

// Script categories and their descriptions
const categories = {
  database: {
    description: "Database setup, initialization, and connection scripts",
    scripts: {
      "init-database": "Initialize the main database schema and admin user",
      "setup-dashboard-database": "Setup dashboard database with sample data",
      "test-dashboard-connection": "Test connection to dashboard database",
      "setup-turso-db": "Setup Turso database",
      "drop-turso-db": "Drop Turso database",
      "test-turso-connection": "Test Turso database connection",
    },
  },
  auth: {
    description: "Authentication and 2FA management scripts",
    scripts: {
      "test-auth": "Test authentication system",
      "check-temp-secret": "Check temporary 2FA secret for admin user",
      "clear-temp-secret": "Clear temporary 2FA secret for admin user",
      "manage-2fa": "Manage 2FA settings",
      "test-2fa-verification": "Test 2FA verification process",
    },
  },
  utils: {
    description: "Utility scripts for password hashing and environment testing",
    scripts: {
      "generate-password-hash": "Generate bcrypt password hash",
      "generate-password-hash-sha256": "Generate SHA256 password hash",
      "check-env": "Check environment variables",
      "test-env": "Test environment configuration",
      "test-env-simple": "Simple environment test",
      "test-next-env": "Test Next.js environment",
      "create-env": "Create .env file with all required configuration",
    },
  },
  testing: {
    description: "Testing scripts for various components",
    scripts: {
      "test-dashboard-api": "Test dashboard API endpoints",
    },
  },
};

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

// Helper function to clear screen
function clearScreen() {
  console.clear();
}

// Helper function to ask for user input
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Show main menu with categories
function showMainMenu() {
  clearScreen();
  printHeader("QR Code Admin - Script Manager");

  printColor("\nAvailable Categories:", "bright");
  console.log("");

  const categoryEntries = Object.entries(categories);
  categoryEntries.forEach(([category, info], index) => {
    printColor(`[${index + 1}] ${category}`, "cyan");
    printColor(`    ${info.description}`, "yellow");
    console.log("");
  });

  printColor("[0] Exit", "red");
  console.log("");
}

// Show scripts menu for a specific category
function showScriptsMenu(category) {
  clearScreen();
  printHeader(`${category.toUpperCase()} Scripts`);

  const categoryInfo = categories[category];
  printColor(`\n${categoryInfo.description}`, "yellow");
  console.log("");

  const scriptEntries = Object.entries(categoryInfo.scripts);
  scriptEntries.forEach(([scriptName, description], index) => {
    printColor(`[${index + 1}] ${scriptName}.js`, "cyan");
    printColor(`    ${description}`, "yellow");
    console.log("");
  });

  printColor("[0] Back to Categories", "red");
  console.log("");
}

// Execute a script
function executeScript(category, scriptName, args = []) {
  const scriptPath = path.join(__dirname, category, `${scriptName}.js`);

  // Check if script exists
  if (!fs.existsSync(scriptPath)) {
    printColor(`❌ Script not found: ${scriptPath}`, "red");
    return false;
  }

  clearScreen();
  printHeader(`Running: ${category}/${scriptName}.js`);
  printColor(
    `Description: ${categories[category].scripts[scriptName]}`,
    "yellow"
  );
  console.log("");

  // Execute the script
  const child = spawn("node", [scriptPath, ...args], {
    stdio: "inherit",
    cwd: process.cwd(),
  });

  child.on("error", (error) => {
    printColor(`❌ Error executing script: ${error.message}`, "red");
  });

  child.on("close", (code) => {
    console.log("");
    if (code === 0) {
      printColor(`✅ Script completed successfully!`, "green");
    } else {
      printColor(`❌ Script exited with code ${code}`, "red");
    }

    console.log("");
    printColor("Press Enter to continue...", "cyan");
    rl.question("", () => {
      // Return to scripts menu
      handleScriptsMenu(category);
    });
  });

  return true;
}

// Handle main menu selection
async function handleMainMenu() {
  showMainMenu();

  const answer = await askQuestion("Select a category (0-4): ");
  const choice = parseInt(answer);

  if (choice === 0) {
    printColor("\n👋 Goodbye!", "green");
    rl.close();
    return;
  }

  const categoryEntries = Object.entries(categories);
  if (choice >= 1 && choice <= categoryEntries.length) {
    const [category] = categoryEntries[choice - 1];
    handleScriptsMenu(category);
  } else {
    printColor("\n❌ Invalid choice. Please try again.", "red");
    console.log("");
    await askQuestion("Press Enter to continue...");
    handleMainMenu();
  }
}

// Handle scripts menu selection
async function handleScriptsMenu(category) {
  showScriptsMenu(category);

  const answer = await askQuestion("Select a script (0-6): ");
  const choice = parseInt(answer);

  if (choice === 0) {
    // Go back to main menu
    handleMainMenu();
    return;
  }

  const scriptEntries = Object.entries(categories[category].scripts);
  if (choice >= 1 && choice <= scriptEntries.length) {
    const [scriptName] = scriptEntries[choice - 1];

    // Ask for additional arguments if needed
    printColor(`\nExecuting: ${scriptName}.js`, "green");
    const args = await askQuestion(
      "Enter additional arguments (optional, press Enter to skip): "
    );

    const scriptArgs = args ? args.split(" ").filter((arg) => arg.trim()) : [];
    executeScript(category, scriptName, scriptArgs);
  } else {
    printColor("\n❌ Invalid choice. Please try again.", "red");
    console.log("");
    await askQuestion("Press Enter to continue...");
    handleScriptsMenu(category);
  }
}

// Show help information
function showHelp() {
  clearScreen();
  printHeader("QR Code Admin - Script Manager - Help");

  printColor("\nHow to use:", "bright");
  printColor("1. Select a category from the main menu", "green");
  printColor("2. Choose a script from the category menu", "green");
  printColor("3. Optionally provide additional arguments", "green");
  printColor("4. Press Enter to continue after script execution", "green");

  console.log("\nNavigation:");
  printColor("- Use numbers to select options", "yellow");
  printColor("- Press 0 to go back or exit", "yellow");
  printColor("- Press Enter to continue", "yellow");

  console.log("\nScript Categories:");
  Object.entries(categories).forEach(([category, info]) => {
    printColor(`\n${category.toUpperCase()}:`, "bright");
    printColor(`  ${info.description}`, "yellow");
  });

  console.log("");
  printColor("Press Enter to return to main menu...", "cyan");
  rl.question("", () => {
    handleMainMenu();
  });
}

// Main function
async function main() {
  const args = process.argv.slice(2);

  // Check for help argument
  if (
    args.length > 0 &&
    (args[0] === "help" || args[0] === "--help" || args[0] === "-h")
  ) {
    showHelp();
    return;
  }

  // Check for direct execution (for backward compatibility)
  if (args.length >= 2) {
    const category = args[0];
    const scriptName = args[1];
    const scriptArgs = args.slice(2);

    if (categories[category] && categories[category].scripts[scriptName]) {
      executeScript(category, scriptName, scriptArgs);
      return;
    } else {
      printColor("❌ Invalid category or script name", "red");
      printColor(
        'Use "node scripts/index.js help" for usage information',
        "yellow"
      );
      rl.close();
      return;
    }
  }

  // Start interactive menu
  try {
    await handleMainMenu();
  } catch (error) {
    printColor(`❌ Error: ${error.message}`, "red");
    rl.close();
  }
}

// Handle process termination
process.on("SIGINT", () => {
  printColor("\n\n👋 Goodbye!", "green");
  rl.close();
  process.exit(0);
});

// Run the CLI
if (require.main === module) {
  main();
}

module.exports = {
  categories,
  executeScript,
  showHelp,
};

// Security Testing
console.log("\n🔒 Security Testing:");
console.log("  node security/security-tester.js login");
console.log("  node security/security-tester.js setup-2fa");
console.log("  node security/security-tester.js verify-2fa");
console.log("  node security/security-tester.js check-2fa-status");
console.log("  node security/security-tester.js all");
console.log("  node security/security-tester.js help");
