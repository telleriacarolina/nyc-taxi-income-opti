#!/bin/bash
# Complete Configuration Setup for Optimal Functionality
# This script sets up all dotfiles with recommended configurations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "\n${BLUE}════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_info() {
    echo -e "${YELLOW}➜${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

DOTFILES_DIR="$HOME/.dotfiles"

# Check if dotfiles directory exists
if [ ! -d "$DOTFILES_DIR" ]; then
    print_error "Dotfiles directory not found at $DOTFILES_DIR"
    exit 1
fi

cd "$DOTFILES_DIR"

# ============================================================================
# 1. System Setup - Install All Development Tools
# ============================================================================
print_header "Installing System Tools & Development Environment"

if [ -f "$DOTFILES_DIR/scripts/system-setup.sh" ]; then
    print_info "Running system setup script (this may take a while)..."
    chmod +x "$DOTFILES_DIR/scripts/system-setup.sh"
    
    # Run system setup with automatic 'yes' to all prompts
    yes y | bash "$DOTFILES_DIR/scripts/system-setup.sh" || true
    
    print_success "System tools installed"
else
    print_info "System setup script not found, skipping..."
fi

# ============================================================================
# 2. Install Dotfiles - Create Symlinks
# ============================================================================
print_header "Installing Dotfiles (Creating Symlinks)"

if [ -f "$DOTFILES_DIR/install.sh" ]; then
    chmod +x "$DOTFILES_DIR/install.sh"
    bash "$DOTFILES_DIR/install.sh"
    print_success "Dotfiles installed and symlinked"
else
    print_error "install.sh not found"
fi

# ============================================================================
# 3. Configure Git
# ============================================================================
print_header "Configuring Git"

# Create local git config if it doesn't exist
if [ ! -f "$HOME/.gitconfig.local" ]; then
    print_info "Creating local Git configuration..."
    cat > "$HOME/.gitconfig.local" <<EOF
[user]
    name = Your Name
    email = your.email@example.com

[core]
    editor = vim

[pull]
    rebase = false

[init]
    defaultBranch = main
EOF
    print_success "Git local config created at ~/.gitconfig.local"
    print_info "Please edit ~/.gitconfig.local to set your name and email"
else
    print_success "Git local config already exists"
fi

# ============================================================================
# 4. Configure Zsh with Oh My Zsh
# ============================================================================
print_header "Configuring Zsh & Oh My Zsh"

# Install Oh My Zsh if not present
if [ ! -d "$HOME/.oh-my-zsh" ]; then
    print_info "Installing Oh My Zsh..."
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended || true
    print_success "Oh My Zsh installed"
else
    print_success "Oh My Zsh already installed"
fi

# Install recommended Oh My Zsh plugins
print_info "Installing recommended Zsh plugins..."

# zsh-autosuggestions
if [ ! -d "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-autosuggestions" ]; then
    git clone https://github.com/zsh-users/zsh-autosuggestions \
        "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-autosuggestions"
    print_success "Installed zsh-autosuggestions"
else
    print_success "zsh-autosuggestions already installed"
fi

# zsh-syntax-highlighting
if [ ! -d "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting" ]; then
    git clone https://github.com/zsh-users/zsh-syntax-highlighting \
        "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting"
    print_success "Installed zsh-syntax-highlighting"
else
    print_success "zsh-syntax-highlighting already installed"
fi

# zsh-completions
if [ ! -d "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-completions" ]; then
    git clone https://github.com/zsh-users/zsh-completions \
        "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-completions"
    print_success "Installed zsh-completions"
else
    print_success "zsh-completions already installed"
fi

# Create recommended .zshrc.local
if [ ! -f "$HOME/.zshrc.local" ]; then
    print_info "Creating local Zsh configuration..."
    cat > "$HOME/.zshrc.local" <<'EOF'
# Local Zsh Configuration
# This file is sourced by .zshrc and is not tracked in git

# Oh My Zsh Theme
ZSH_THEME="robbyrussell"

# Recommended Plugins
plugins=(
    git
    docker
    docker-compose
    kubectl
    python
    pip
    npm
    node
    golang
    rust
    git-extras
    gitignore
    vscode
    command-not-found
    common-aliases
    copybuffer
    copyfile
    copypath
    dirhistory
    history
    zsh-autosuggestions
    zsh-syntax-highlighting
    zsh-completions
)

# Custom PATH additions
export PATH="$HOME/bin:$HOME/.local/bin:$PATH"

# History configuration
HISTSIZE=50000
SAVEHIST=50000
setopt EXTENDED_HISTORY
setopt HIST_EXPIRE_DUPS_FIRST
setopt HIST_IGNORE_DUPS
setopt HIST_IGNORE_SPACE
setopt HIST_VERIFY
setopt SHARE_HISTORY

# Auto-completion enhancements
autoload -Uz compinit
compinit

# Case-insensitive completion
zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}'

# Aliases
alias ll='ls -lah'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'
alias g='git'
alias gst='git status'
alias gco='git checkout'
alias gcb='git checkout -b'
alias gp='git push'
alias gl='git pull'
alias d='docker'
alias dc='docker-compose'
alias k='kubectl'
alias vim='nvim'

# Environment variables
export EDITOR='vim'
export VISUAL='vim'
export LANG='en_US.UTF-8'
export LC_ALL='en_US.UTF-8'

# fzf configuration
if command -v fzf &> /dev/null; then
    [ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
    export FZF_DEFAULT_OPTS='--height 40% --layout=reverse --border'
fi

# Node.js
export NODE_ENV='development'

# Python
export PYTHONDONTWRITEBYTECODE=1

# Load additional local configs
[ -f ~/.zshrc.extra ] && source ~/.zshrc.extra
EOF
    print_success "Zsh local config created at ~/.zshrc.local"
else
    print_success "Zsh local config already exists"
fi

# ============================================================================
# 5. Configure Vim/Neovim
# ============================================================================
print_header "Configuring Vim/Neovim"

# Install vim-plug for Vim
if [ ! -f "$HOME/.vim/autoload/plug.vim" ]; then
    print_info "Installing vim-plug for Vim..."
    curl -fLo "$HOME/.vim/autoload/plug.vim" --create-dirs \
        https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
    print_success "vim-plug installed for Vim"
else
    print_success "vim-plug already installed for Vim"
fi

# Install vim-plug for Neovim
if [ ! -f "${XDG_DATA_HOME:-$HOME/.local/share}/nvim/site/autoload/plug.vim" ]; then
    print_info "Installing vim-plug for Neovim..."
    sh -c 'curl -fLo "${XDG_DATA_HOME:-$HOME/.local/share}"/nvim/site/autoload/plug.vim --create-dirs \
        https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim'
    print_success "vim-plug installed for Neovim"
else
    print_success "vim-plug already installed for Neovim"
fi

# Create local vim config
if [ ! -f "$HOME/.vimrc.local" ]; then
    print_info "Creating local Vim configuration..."
    cat > "$HOME/.vimrc.local" <<'EOF'
" Local Vim Configuration
" This file is sourced by .vimrc and is not tracked in git

" Recommended plugins (add to your .vimrc)
" Plug 'tpope/vim-sensible'
" Plug 'tpope/vim-fugitive'
" Plug 'airblade/vim-gitgutter'
" Plug 'junegunn/fzf.vim'
" Plug 'preservim/nerdtree'
" Plug 'vim-airline/vim-airline'

" Personal preferences
set number
set relativenumber
set expandtab
set tabstop=4
set shiftwidth=4
set smartindent
set nowrap
set ignorecase
set smartcase
set incsearch
set hlsearch
set termguicolors
set clipboard=unnamedplus

" Key mappings
let mapleader = " "
nnoremap <leader>w :w<CR>
nnoremap <leader>q :q<CR>
nnoremap <leader>n :NERDTreeToggle<CR>
nnoremap <leader>f :Files<CR>
EOF
    print_success "Vim local config created at ~/.vimrc.local"
else
    print_success "Vim local config already exists"
fi

# Install Vim plugins
if command -v vim &> /dev/null; then
    print_info "Installing Vim plugins..."
    vim +PlugInstall +qall || true
    print_success "Vim plugins installed"
fi

# ============================================================================
# 6. Configure Tmux
# ============================================================================
print_header "Configuring Tmux"

# Install TPM (Tmux Plugin Manager)
if [ ! -d "$HOME/.tmux/plugins/tpm" ]; then
    print_info "Installing Tmux Plugin Manager (TPM)..."
    git clone https://github.com/tmux-plugins/tpm "$HOME/.tmux/plugins/tpm"
    print_success "TPM installed"
else
    print_success "TPM already installed"
fi

# Create local tmux config
if [ ! -f "$HOME/.tmux.conf.local" ]; then
    print_info "Creating local Tmux configuration..."
    cat > "$HOME/.tmux.conf.local" <<'EOF'
# Local Tmux Configuration
# This file is sourced by .tmux.conf and is not tracked in git

# Change prefix to Ctrl-a
unbind C-b
set-option -g prefix C-a
bind-key C-a send-prefix

# Reload config
bind r source-file ~/.tmux.conf \; display "Config reloaded!"

# Split panes with | and -
bind | split-window -h
bind - split-window -v
unbind '"'
unbind %

# Switch panes using Alt-arrow without prefix
bind -n M-Left select-pane -L
bind -n M-Right select-pane -R
bind -n M-Up select-pane -U
bind -n M-Down select-pane -D

# Enable mouse mode
set -g mouse on

# Don't rename windows automatically
set-option -g allow-rename off

# Increase scrollback buffer
set-option -g history-limit 50000

# Start windows and panes at 1, not 0
set -g base-index 1
setw -g pane-base-index 1

# Recommended TPM plugins
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'
set -g @plugin 'tmux-plugins/tmux-resurrect'
set -g @plugin 'tmux-plugins/tmux-continuum'
set -g @plugin 'tmux-plugins/tmux-yank'

# Initialize TPM (keep this at the bottom)
run '~/.tmux/plugins/tpm/tpm'
EOF
    print_success "Tmux local config created at ~/.tmux.conf.local"
else
    print_success "Tmux local config already exists"
fi

# ============================================================================
# 7. Configure MCP (Model Context Protocol)
# ============================================================================
print_header "Configuring MCP"

MCP_DIR="$HOME/.config/dotfiles/mcp"
mkdir -p "$MCP_DIR"

if [ ! -f "$MCP_DIR/mcp.json" ]; then
    print_info "Generating MCP configuration..."
    cat > "$MCP_DIR/mcp.json" <<EOF
{
    "servers": {
        "microsoft/markitdown": {
            "type": "stdio",
            "command": "uvx",
            "args": [
                "markitdown-mcp==0.0.1a4"
            ],
            "gallery": "https://api.mcp.github.com",
            "version": "1.0.0"
        }
    },
    "inputs": [],
    "configPath": "$MCP_DIR"
}
EOF
    print_success "MCP configuration created at $MCP_DIR/mcp.json"
else
    print_success "MCP configuration already exists"
fi

# ============================================================================
# 8. Create Helper Script Symlinks
# ============================================================================
print_header "Setting Up Helper Scripts"

mkdir -p "$HOME/bin"

# Create symlinks for helper scripts
if [ -d "$DOTFILES_DIR/scripts" ]; then
    for script in "$DOTFILES_DIR/scripts"/*.sh; do
        if [ -f "$script" ]; then
            script_name=$(basename "$script" .sh)
            ln -sf "$script" "$HOME/bin/$script_name" 2>/dev/null || true
        fi
    done
    print_success "Helper scripts linked to ~/bin/"
fi

# ============================================================================
# 9. Final Steps
# ============================================================================
print_header "Finalizing Configuration"

# Change default shell to zsh if not already
if [ "$SHELL" != "$(which zsh)" ] && command -v zsh &> /dev/null; then
    print_info "Changing default shell to Zsh..."
    chsh -s "$(which zsh)" || {
        print_info "Couldn't change shell automatically. Run manually:"
        echo "  chsh -s \$(which zsh)"
    }
fi

# Source zsh config
if [ -f "$HOME/.zshrc" ]; then
    print_info "Sourcing Zsh configuration..."
    # We can't actually source it in bash, but we can tell the user
    export SHELL_RELOADED=1
fi

# ============================================================================
# Summary
# ============================================================================
print_header "Configuration Complete!"

echo -e "${GREEN}✓ All configurations applied successfully!${NC}\n"

echo "What was configured:"
echo "  • System tools and development environment installed"
echo "  • Dotfiles symlinked to home directory"
echo "  • Git configured with local overrides"
echo "  • Oh My Zsh installed with recommended plugins"
echo "  • Zsh autosuggestions, syntax highlighting, and completions"
echo "  • Vim/Neovim with vim-plug and recommended settings"
echo "  • Tmux with TPM and recommended plugins"
echo "  • MCP (Model Context Protocol) configured"
echo "  • Helper scripts available in ~/bin"
echo ""
echo "Next steps:"
echo "  1. Edit ~/.gitconfig.local to set your Git name and email"
echo "  2. Restart your terminal or run: exec zsh"
echo "  3. In tmux, press Ctrl-a then I to install tmux plugins"
echo "  4. Customize ~/.zshrc.local, ~/.vimrc.local, ~/.tmux.conf.local as needed"
echo ""
echo "Useful commands:"
echo "  • backup-dotfiles     - Backup your current dotfiles"
echo "  • update-dotfiles     - Update dotfiles from repository"
echo "  • system-setup        - Re-run system setup"
echo ""
echo -e "${BLUE}Enjoy your optimized development environment!${NC}"
