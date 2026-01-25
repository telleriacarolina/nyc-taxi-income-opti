#!/bin/bash
# Quick setup helper - Configure Git and start Zsh

set -e

echo "-----------------------------------"
echo " Git + Shell Quick Setup"
echo "-----------------------------------"
echo ""

# Prompt for Git name
while [[ -z "$git_name" ]]; do
  read -rp "Enter your full name for Git: " telleriacarolina
done

# Prompt for Git email
while [[ -z "$git_email" ]]; do
  read -rp "Enter your email for Git: " telleriac
done

# Prompt for preferred editor (default vim)
read -rp "Preferred editor (vim/nano/code) [vim]: " git_editor
git_editor=${git_editor:-vim}

GIT_LOCAL_CONFIG="$HOME/.gitconfig.local"

# Backup existing config if present
if [[ -f "$GIT_LOCAL_CONFIG" ]]; then
  cp "$GIT_LOCAL_CONFIG" "$GIT_LOCAL_CONFIG.bak.$(date +%s)"
  echo "Existing ~/.gitconfig.local backed up."
fi

# Write new config
cat <<EOF > "$GIT_LOCAL_CONFIG"
[user]
    name = $git_name
    email = $git_email

[core]
    editor = $git_editor

[pull]
    rebase = false

[init]
    defaultBranch = main
EOF

echo ""
echo "✓ Git config written to ~/.gitconfig.local"
echo ""

# Show active Git values
git config --global user.name "$git_name"
git config --global user.email "$git_email"

echo "Current Git user:"
git config --global user.name
git config --global user.email
echo ""

echo "Launching Zsh..."
exec zsh