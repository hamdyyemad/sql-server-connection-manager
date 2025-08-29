#!/bin/bash

# QR Code Admin - Script Runner (Unix/Linux/macOS Shell Script)
# Usage: ./run-scripts.sh [category] [script] [options]

echo ""
echo "============================================================"
echo "QR Code Admin - Script Runner"
echo "============================================================"

if [ $# -eq 0 ]; then
    echo "Usage: ./run-scripts.sh [category] [script] [options]"
    echo ""
    echo "Examples:"
    echo "  ./run-scripts.sh help"
    echo "  ./run-scripts.sh list"
    echo "  ./run-scripts.sh database init-database"
    echo "  ./run-scripts.sh auth test-auth"
    echo "  ./run-scripts.sh utils generate-password-hash mypassword"
    echo ""
    exit 0
fi

node run-scripts.js "$@"

if [ $? -ne 0 ]; then
    echo ""
    echo "Script execution failed with error code $?"
    exit $?
fi
