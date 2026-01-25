#!/bin/bash
# Ultimate Git + SSH + Shell Quick Setup
# Fully sets up Git, SSH keys, SSH agent, GitHub test, clipboard, and launches Zsh
set -e

echo "-----------------------------------"
echo " Git + SSH + Shell Quick Setup"
echo "-----------------------------------"
echo ""

# --- Git Setup ---
while [[ -z "$git_name" ]]; do
  read -rp "Enter your full name for Git: " git_name
done

while [[ -z "$git_email" ]]; do
  read -rp "Enter your email for Git: " git_email
done

read -rp "Preferred editor (vim/nano/code) [vim]: " git_editor
git_editor=${git_editor:-vim}

GIT_LOCAL_CONFIG="$HOME/.gitconfig.local"

if [[ -f "$GIT_LOCAL_CONFIG" ]]; then
  cp "$GIT_LOCAL_CONFIG" "$GIT_LOCAL_CONFIG.bak.$(date +%s)"
  echo "Existing ~/.gitconfig.local backed up."
fi

cat <<EOF > "$GIT_LOCAL_CONFIG"
[user]
    name = "$git_name"
    email = "$git_email"

[core]
    editor = "$git_editor"

[pull]
    rebase = false

[init]
    defaultBranch = main
EOF

git config --global user.name "$git_name"
git config --global user.email "$git_email"

echo ""
echo "✓ Git configured successfully"
echo "Current Git user:"
git config --global user.name
git config --global user.email
echo ""

# --- SSH Key Setup ---
SSH_KEY="$HOME/.ssh/id_rsa.pub"

if [[ -f "$SSH_KEY" ]]; then
  echo "✓ SSH key already exists at $SSH_KEY"
else
  echo "No SSH key found. Let's create one for GitHub/GitLab."
  read -rp "Enter a comment for your SSH key (e.g., email or laptop name): " ssh_comment
  ssh_comment=${ssh_comment:-"$git_email"}

  ssh-keygen -t rsa -b 4096 -C "$ssh_comment" -f "$HOME/.ssh/id_rsa" -N ""
  echo "✓ SSH key generated at $SSH_KEY"
fi

# Start ssh-agent if not running
if ! pgrep -u "$USER" ssh-agent > /dev/null; then
  echo "Starting ssh-agent..."
  eval "$(ssh-agent -s)"
else
  echo "ssh-agent already running."
fi

# Add key to ssh-agent
ssh-add -l &>/dev/null || ssh-add "$HOME/.ssh/id_rsa" > /dev/null
echo "✓ SSH key added to ssh-agent"

# --- Clipboard Copy ---
echo ""
echo "Copying SSH key to clipboard..."
if command -v pbcopy &>/dev/null; then
  pbcopy < "$SSH_KEY"
  echo "✓ SSH key copied to clipboard (macOS)"
elif command -v xclip &>/dev/null; then
  xclip -sel clip < "$SSH_KEY"
  echo "✓ SSH key copied to clipboard (Linux xclip)"
elif command -v xsel &>/dev/null; then
  xsel --clipboard --input < "$SSH_KEY"
  echo "✓ SSH key copied to clipboard (Linux xsel)"
else
  echo "⚠️ Clipboard tool not found."
  if [[ "$(uname)" == "Linux" ]]; then
    read -rp "Install xclip now? [y/N]: " install_clip
    if [[ "$install_clip" =~ ^[Yy]$ ]]; then
      if command -v apt-get &>/dev/null; then
        sudo apt-get update && sudo apt-get install -y xclip
        xclip -sel clip < "$SSH_KEY"
        echo "✓ xclip installed and SSH key copied!"
      else
        echo "Please install xclip or xsel manually for clipboard support."
      fi
    fi
  else
    echo "Please copy the key manually from $SSH_KEY"
  fi
fi

echo ""
echo "SSH public key content:"
echo "--------------------------------------------------"
cat "$SSH_KEY"
echo "--------------------------------------------------"
echo "Add this key to GitHub/GitLab if not done already."

# --- Test SSH Connection ---
echo ""
echo "Testing SSH connection to GitHub..."
if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
  echo "✓ SSH connection to GitHub works!"
else
  echo "⚠️ SSH test failed. Make sure your public key is added to GitHub:"
  echo "https://github.com/settings/keys"
fi

# Optional GitLab test
# ssh -T git@gitlab.com

# --- Launch Zsh ---
echo ""
echo "Launching Zsh..."
exec zsh