#!/bin/bash

# Directory for popups
POPUPS_DIR="./popups"

# List of required HTML files
HTML_FILES=(
  "manage_users.html"
  "user_roles.html"
  "currency_settings.html"
  "measurement_units.html"
  "default_export_format.html"
  "save_location.html"
  "backup_data.html"
  "restore_data.html"
  "company_info.html"
  "contact_support.html"
)

# Function to clear the directory
clear_directory() {
  if [ -d "$POPUPS_DIR" ]; then
    echo "Deleting existing .html files in $POPUPS_DIR..."
    find "$POPUPS_DIR" -type f -name "*.html" -delete
  else
    echo "Creating directory $POPUPS_DIR..."
    mkdir -p "$POPUPS_DIR"
  fi
}

# Function to create the required files
create_html_files() {
  echo "Creating required .html files..."
  for FILE in "${HTML_FILES[@]}"; do
    FILE_PATH="$POPUPS_DIR/$FILE"
    echo "<html><body><h1>${FILE%.html}</h1></body></html>" > "$FILE_PATH"
    echo "Created: $FILE_PATH"
  done
}

# Execute functions
clear_directory
create_html_files

echo "Popups directory setup complete."
