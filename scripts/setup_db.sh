#!/bin/bash

# Check if the database name is passed as an argument
DB_NAME=$1

# Ensure the SQL script is in the correct directory relative to this script
SCRIPT_DIR="$(dirname "$0")"
SQL_FILE="$SCRIPT_DIR/files/setup.sql"

# Check if the SQL file exists before executing it
if [[ ! -f "$SQL_FILE" ]]; then
    echo "Error: SQL file not found at $SQL_FILE"
    exit 1
fi

# Execute the SQL script with psql
psql -d "$DB_NAME" -f "$SQL_FILE"
