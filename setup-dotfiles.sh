#!/bin/bash
# Dotfiles Setup Script
# Connects and installs dotfiles from https://github.com/telleriacarolina/Dotfiles.git

set -e

echo "🔧 Setting up dotfiles..."

# Clone dotfiles repository
DOTFILES_DIR="$HOME/.dotfiles"

if [ -d "$DOTFILES_DIR" ]; then
    echo "📁 Dotfiles directory already exists at $DOTFILES_DIR"
    echo "   Updating repository..."
    cd "$DOTFILES_DIR"
    git pull
else
    echo "📥 Cloning dotfiles repository..."
    git clone https://github.com/telleriacarolina/Dotfiles.git "$DOTFILES_DIR"
    cd "$DOTFILES_DIR"
fi

echo ""
echo "✅ Dotfiles repository cloned/updated at: $DOTFILES_DIR"
echo ""

# List contents
echo "📋 Contents of dotfiles repository:"
ls -la "$DOTFILES_DIR"
echo ""

# Check for install script
if [ -f "$DOTFILES_DIR/install.sh" ]; then
    echo "🚀 Found install.sh script. Running it..."
    bash "$DOTFILES_DIR/install.sh"
elif [ -f "$DOTFILES_DIR/.install.sh" ]; then
    echo "🚀 Found .install.sh script. Running it..."
    bash "$DOTFILES_DIR/.install.sh"
elif [ -f "$DOTFILES_DIR/setup.sh" ]; then
    echo "🚀 Found setup.sh script. Running it..."
    bash "$DOTFILES_DIR/setup.sh"
else
    echo "ℹ️  No install script found. You may need to manually symlink your dotfiles."
    echo ""
    echo "Common dotfiles to symlink:"
    echo "  ln -sf $DOTFILES_DIR/.bashrc ~/.bashrc"
    echo "  ln -sf $DOTFILES_DIR/.zshrc ~/.zshrc"
    echo "  ln -sf $DOTFILES_DIR/.gitconfig ~/.gitconfig"
    echo "  ln -sf $DOTFILES_DIR/.vimrc ~/.vimrc"
    echo "  ln -sf $DOTFILES_DIR/.tmux.conf ~/.tmux.conf"
fi

echo ""
echo "✨ Dotfiles setup complete!"
echo "   Location: $DOTFILES_DIR"
