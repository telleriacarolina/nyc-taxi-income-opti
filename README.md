# ✨ Welcome to Your Spark Template!
You've just launched your brand-new Spark Template Codespace — everything’s fired up and ready for you to explore, build, and create with Spark!

This template is your blank canvas. It comes with a minimal setup to help you get started quickly with Spark development.

🚀 What's Inside?
- A clean, minimal Spark environment
- Pre-configured for local development
- Ready to scale with your ideas
- Three-layer typography system for responsive, elegant text handling
- **uv** - Modern Python package manager pre-installed
  
🧠 What Can You Do?

Right now, this is just a starting point — the perfect place to begin building and testing your Spark applications.

## 🐍 Python Development with uv

This template includes **uv** - an extremely fast Python package manager and project management tool.

### What is uv?

uv is a modern Python toolchain written in Rust that provides:
- ⚡ **10-100x faster** than pip for package installation
- 🔧 Complete Python version management
- 📦 Project and dependency management
- 🛠️ Tool execution without installation
- 🔄 Drop-in replacement for pip, pip-tools, virtualenv, and more

### Installation

uv is pre-installed in this dev container. To install on your local system:

**macOS and Linux:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Windows:**
```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**Alternative methods:**
- Homebrew: `brew install uv`
- pip: `pipx install uv` or `pip install uv`
- WinGet: `winget install --id=astral-sh.uv -e`

### Quick Start

**Python Version Management:**
```bash
uv python install              # Install latest Python
uv python install 3.12         # Install specific version
uv python list                 # View available versions
uv python install --default    # Install with python/python3 commands
```

**Running Scripts:**
```bash
uv run script.py               # Run a Python script
uv add --script requests       # Add dependency to a script
uvx ruff check .               # Run a tool without installing
```

**Project Management:**
```bash
uv init myproject              # Create new project
uv add requests                # Add dependency
uv sync                        # Sync dependencies
uv lock                        # Create lockfile
uv build                       # Build distribution
```

**Virtual Environments:**
```bash
uv venv                        # Create virtual environment
uv pip install package         # Install packages (pip-compatible)
uv pip freeze                  # List installed packages
```

**Tools:**
```bash
uvx black .                    # Run black formatter
uvx ruff check .               # Run ruff linter
uv tool install pytest         # Install tool globally
uv tool list                   # List installed tools
```

### Key Features

#### 🐍 Python Versions
- `uv python install` - Install Python versions
- `uv python list` - View available Python versions
- `uv python find` - Find an installed Python version
- `uv python pin` - Pin project to specific Python version
- `uv python uninstall` - Uninstall a Python version

#### 📜 Scripts
- `uv run` - Run standalone Python scripts
- `uv add --script` - Add script dependencies
- `uv remove --script` - Remove script dependencies

#### 📦 Projects

**Creating a New Project:**

```bash
uv init hello-world            # Create new project in new directory
cd hello-world

# Or initialize in current directory
mkdir hello-world && cd hello-world
uv init
```

**Project Structure:**

uv creates and manages the following structure:

```
.
├── .venv/                    # Virtual environment (created on first run)
│   ├── bin/
│   ├── lib/
│   └── pyvenv.cfg
├── .python-version           # Default Python version for project
├── .gitignore               # Git ignore patterns
├── README.md                # Project documentation
├── main.py                  # Entry point (Hello World example)
├── pyproject.toml           # Project metadata and dependencies
└── uv.lock                  # Cross-platform lockfile (auto-generated)
```

**Key Files:**
- **`pyproject.toml`** - Project metadata, dependencies, and configuration
- **`.python-version`** - Python version to use for the project
- **`uv.lock`** - Exact dependency versions (version controlled, auto-managed)
- **`.venv/`** - Isolated virtual environment for project dependencies

**Managing Dependencies:**

```bash
# Add dependencies
uv add requests               # Add latest version
uv add 'requests==2.31.0'     # Add specific version
uv add 'requests>=2.30.0'     # Add with constraint
uv add git+https://github.com/psf/requests  # Add from git
uv add -r requirements.txt    # Add from requirements.txt
uv add -r requirements.txt -c constraints.txt  # With constraints

# Remove dependencies
uv remove requests

# Upgrade packages
uv lock --upgrade-package requests      # Upgrade specific package
uv lock --upgrade                       # Upgrade all packages

# View dependency tree
uv tree
```

**Viewing Project Version:**

```bash
uv version                    # Show package name and version
uv version --short            # Version number only
uv version --output-format json  # JSON format
```

**Running Commands:**

uv automatically syncs dependencies before running commands:

```bash
# Run Python scripts
uv run main.py                # Run project script
uv run example.py             # Auto-syncs dependencies first

# Run commands
uv run -- flask run -p 3000   # Run with arguments
uv run pytest                 # Run test suite
uv run python -c "import requests; print(requests.__version__)"

# Manual sync and activate (alternative)
uv sync                       # Sync environment manually
source .venv/bin/activate     # Activate environment (macOS/Linux)
# .venv\Scripts\activate      # Activate environment (Windows)
flask run -p 3000             # Run without uv run
```

**Building Distributions:**

```bash
uv build                      # Build wheel and source distribution
# Creates:
# - dist/hello-world-0.1.0-py3-none-any.whl
# - dist/hello-world-0.1.0.tar.gz

uv build --wheel              # Build wheel only
uv build --sdist              # Build source distribution only
```

**Exporting Lockfiles:**

Export your `uv.lock` to different formats for integration with other tools:

```bash
# Export to requirements.txt (pip-compatible)
uv export --format requirements.txt
uv export --format requirements.txt --output-file requirements.txt

# Export to pylock.toml (PEP 751 standard format)
uv export --format pylock.toml
uv export --format pylock.toml --output-file pylock.toml

# Export to CycloneDX SBOM (Software Bill of Materials)
uv export --format cyclonedx1.5
uv export --format cyclonedx1.5 --output-file sbom.json
```

**Export Formats:**

- **`requirements.txt`** - Traditional pip-compatible format, widely supported
  - Use with `uv pip install` or standard `pip`
  - Good for legacy workflows and tool compatibility
  
- **`pylock.toml`** - PEP 751 standardized Python lockfile format
  - TOML-based, machine-readable
  - Modern standard for Python lockfiles
  
- **`cyclonedx1.5`** - Industry-standard SBOM format (preview)
  - JSON-encoded CycloneDX v1.5 specification
  - Comprehensive software component inventory
  - Useful for security auditing, compliance, and supply chain transparency
  - Supported by security scanning tools and SCA platforms
  - Includes custom properties: `uv:package:marker` and `uv:workspace:path`

**Note:** The `uv.lock` format is more powerful than `requirements.txt` and includes features that cannot be expressed in the traditional format. Consider using `uv.lock` directly when possible.

**Important Notes:**
- `uv run` automatically keeps lockfile and environment in sync
- Lockfile (`uv.lock`) should be committed to version control
- Virtual environment (`.venv/`) is project-specific and isolated
- Edit `pyproject.toml` manually or use `uv add`/`uv remove`
- Use `uv run` for project commands; `uvx` for isolated tools

#### 🛠️ Tools

**Running Tools (Temporary):**

Use `uvx` (alias for `uv tool run`) to run tools without installing:

```bash
uvx ruff                       # Run ruff in temporary environment
uvx pycowsay hello             # Run with arguments
uvx --from httpie http         # Run command from different package name
uvx ruff@0.3.0 check           # Run specific version
uvx ruff@latest check          # Run latest version
uvx --from 'ruff>0.2.0,<0.3.0' ruff check  # Version constraints
```

**Advanced Tool Usage:**

```bash
# With extras
uvx --from 'mypy[faster-cache,reports]' mypy --xml-report mypy_report

# From git
uvx --from git+https://github.com/httpie/cli httpie
uvx --from git+https://github.com/httpie/cli@master httpie  # Branch
uvx --from git+https://github.com/httpie/cli@3.2.4 httpie   # Tag
uvx --from git+https://github.com/httpie/cli@2843b87 httpie # Commit

# With Git LFS
uvx --lfs --from git+https://github.com/astral-sh/lfs-cowsay lfs-cowsay

# With additional dependencies
uvx --with mkdocs-material mkdocs --help

# Specify Python version
uvx --python 3.10 ruff
```

**Installing Tools (Persistent):**

For frequently used tools, install them globally:

```bash
uv tool install ruff           # Install ruff
uv tool install httpie         # Installs http, https, httpie executables
uv tool install 'httpie>0.1.0' # With version constraint
uv tool install git+https://github.com/httpie/cli  # From git
uv tool install --lfs git+https://github.com/astral-sh/lfs-cowsay  # Git LFS

# With additional packages
uv tool install mkdocs --with mkdocs-material

# Install multiple related executables
uv tool install --with-executables-from ansible-core,ansible-lint ansible

# With specific Python version
uv tool install --python 3.10 ruff
```

**Managing Installed Tools:**

```bash
uv tool list                   # List installed tools
uv tool upgrade ruff           # Upgrade specific tool
uv tool upgrade --all          # Upgrade all tools
uv tool upgrade --python 3.10 ruff  # Upgrade with Python version
uv tool uninstall ruff         # Uninstall tool
uv tool update-shell           # Add tool bin directory to PATH
```

**Important Notes:**
- Tools installed via `uvx` run in temporary, isolated environments
- Tools installed via `uv tool install` are persistent and added to PATH
- Use `uv run` (not `uvx`) for project tools that need access to your project (e.g., pytest, mypy)
- Tool modules are not importable in Python (isolation prevents conflicts)
- Multiple executables from a package are installed together

#### 🔄 pip Interface
- `uv venv` - Create virtual environments
- `uv pip install` / `uninstall` / `list` / `freeze` - Package management
- `uv pip compile` / `sync` - Lock dependencies
- `uv pip tree` - View dependency tree

#### 🧹 Utilities
- `uv cache clean` / `prune` / `dir` - Manage cache
- `uv python dir` / `uv tool dir` - Show directories
- `uv self update` - Update uv itself

### Installed Python

This dev container has **Python 3.14.2** pre-installed via uv with the following executables:
- `python` - Generic Python executable
- `python3` - Python 3 executable
- `python3.14` - Versioned executable

### Learn More

- [uv Documentation](https://docs.astral.sh/uv/)
- [Installing Python Guide](https://docs.astral.sh/uv/guides/install-python/)
- [Projects Guide](https://docs.astral.sh/uv/guides/projects/)
- [Running Scripts Guide](https://docs.astral.sh/uv/guides/scripts/)
- [Tools Guide](https://docs.astral.sh/uv/guides/tools/)









## 📐 Typography System

This template includes a three-layer text handling system for responsive, elegant typography across all screen sizes:

### Layer 1 — Line Clamp (Core, Recommended)
Truncate text to a specific number of lines with ellipsis using Tailwind's line-clamp plugin.

**Setup** (in [tailwind.config.js](tailwind.config.js)):
```js
module.exports = {
  plugins: [require("@tailwindcss/line-clamp")],
};
```

**Usage:**
```jsx
<p className="text-sm leading-snug line-clamp-2">
  This text will be truncated cleanly to two lines with an ellipsis.
</p>
```

### Layer 2 — Responsive Font Scaling (Sleek Look)
Use fluid typography that adapts smoothly to screen size using CSS clamp.

**Example:**
```jsx
<p className="text-[clamp(0.75rem,2.5vw,0.95rem)] leading-tight">
  Responsive text that shrinks on small screens and grows on desktop.
</p>
```

**Common Presets:**
- **Labels**: `text-[clamp(0.65rem,2vw,0.75rem)]`
- **Body**: `text-[clamp(0.75rem,2.5vw,0.95rem)]`
- **Titles**: `text-[clamp(1rem,3vw,1.25rem)]`

### Layer 3 — Auto-Fit Text (Hard Constraint Boxes)
For tight UI elements (buttons, badges, pills) where text must fit within fixed dimensions.

**Component** ([src/components/AutoFitText.tsx](src/components/AutoFitText.tsx)):
```jsx
<div className="w-32 h-10 border flex items-center px-2">
  <AutoFitText>Very long button text</AutoFitText>
</div>
```

### Sleek Presets (Drop-In)

**Card Title:**
```jsx
<h3 className="font-semibold text-[clamp(0.9rem,2.8vw,1.1rem)] line-clamp-1">
  Card Title That Might Be Long
</h3>
```

**Card Description:**
```jsx
<p className="text-muted-foreground text-[clamp(0.75rem,2.4vw,0.9rem)] line-clamp-2">
  Description text that stays compact across all devices.
</p>
```

**Button:**
```jsx
<button className="h-9 px-3 text-[clamp(0.7rem,2vw,0.85rem)] truncate">
  Join Lounge
</button>
```

**Platform-Specific:**
```jsx
<p className="text-xs sm:text-sm md:text-[0.9rem] leading-tight line-clamp-2">
  Platform-aware typography
</p>
```

🧹 Just Exploring?
No problem! If you were just checking things out and don’t need to keep this code:

- Simply delete your Spark.
- Everything will be cleaned up — no traces left behind.

📄 License For Spark Template Resources 

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
