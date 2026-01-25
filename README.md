# NYC TAXI Income Optimizer

## Rideshare Optimization & Mapping Platform

An end-to-end analytics and decision-support platform for maximizing NYC taxi and rideshare income using TLC trip data, traffic-aware optimization, and map-based visualization.

Built for web, desktop, tablet (iPad), and mobile-first interfaces, the NYC TAXI Income Optimizer helps drivers and analysts:

- **Increase hourly and daily earnings**
- **Optimize airport, borough, and zone strategies**
- **Analyze real NYC TLC trip data**
- **Visualize demand, routes, and hotspots on open-source maps**
- **Maintain a clean, compact UI across all screen sizes**

Designed with performance, scalability, and data transparency in mind.

---

## 🎨 Recent Updates

### Design System (January 2026)
- **Color Theme**: Migrated to elegant **Red & Burgundy** color palette
  - Deep burgundy backgrounds (`oklch(0.25 0.10 25)`)
  - Rose pink accents (`oklch(0.75 0.15 15)`)
  - Rich burgundy primary colors
  - Maintains WCAG AA accessibility standards
- **Typography**: Space Grotesk + JetBrains Mono from Google Fonts
- **Test Page**: `red-burgundy-test.html` for visual verification

### Development Environment
- **Dotfiles Integration**: Full development environment configuration
  - Oh My Zsh with plugins (autosuggestions, syntax highlighting, completions)
  - Vim/Neovim with vim-plug
  - Tmux with TPM (plugin manager)
  - Git configuration with local overrides
- **Setup Scripts**:
  - `setup-dotfiles.sh` - Clone and install dotfiles from GitHub
  - `configure-all.sh` - Complete automated configuration
  - `setup-git-and-zsh.sh` - Quick Git/Zsh setup helper

### Configuration Files Created
- `~/.zshrc.local` - Local shell customizations
- `~/.gitconfig.local` - Personal Git settings
- `~/.vimrc.local` - Vim preferences
- `~/.tmux.conf.local` - Tmux configuration

---

## 📚 Project Documentation

### Development & Setup
- 🎨 [Design System Test](red-burgundy-test.html) - Visual color palette and typography reference
- 🔧 [Feature Priorities](docs/FEATURE_PRIORITIES.md) - 5-phase development roadmap
- 📋 [Phase 1 Tickets](docs/PHASE_1_TICKETS.md) - MVP implementation tickets (22 detailed tasks)
- 🗂️ [GitHub Project Board Guide](docs/GITHUB_PROJECT_BOARD.md) - Project management setup
- 📝 [Ticket #001 Complete](docs/TICKET_001_COMPLETE.md) - Design system implementation summary
- 📖 [README Summary](docs/README_SUMMARY.md) - Quick reference for current progress

### Docker & Containers
- 🐳 [Docker Quick Start](docs/docker/DOCKER_QUICKSTART.md) - Get started with Docker fast
- 🐳 [Docker Guide](docs/docker/DOCKER.md) - Complete Docker setup and usage
- 🐳 [Dev Container Guide](docs/docker/DOCKER_DEVCONTAINER_GUIDE.md) - Run Docker from dev containers
- 🐳 [Rebuild Checklist](docs/docker/REBUILD_REQUIRED.md) - Steps after enabling Docker-in-Docker

### Integration & Configuration
- 📖 [OpenFreeMap Integration](.github/OPENFREEMAP.md) - Git remote setup, workflows, and troubleshooting
- 📋 [Product Requirements Document (PRD)](PRD.md) - Full feature specifications and roadmap
- 🐍 [Python Setup Guide](docs/PYTHON_SETUP.md) - uv toolchain and data processing
- 🔒 [Security Guide](docs/SECURITY.md) - Security best practices and guidelines
- 🤖 [AI Insights Database](docs/AI_INSIGHTS_DATABASE.md) - AI-powered insights and analytics
- 📍 [Location Permissions](docs/LOCATION_PERMISSIONS.md) - Location tracking configuration
- 🗺️ [Map Integration](#️-map-integration-with-openfreemap) - Jump to interactive mapping documentation

---

## ✨ Core Features

- 🚕 **Multi-Platform Rideshare Optimization**
  - Uber, Lyft, Via, Juno tuning
  - Airport-specific strategies (JFK, LGA, EWR)
  - Borough-specific optimization (Manhattan, Brooklyn, Queens, Bronx, Staten Island)

- 📊 **NYC TLC Data Compatibility**
  - Yellow Taxi, Green Taxi, FHV, HVFHS
  - CSV & Parquet ingestion
  - Zone-aware analytics (263 TLC zones)

- 🗺️ **Interactive Mapping**
  - OpenFreeMap + MapLibre
  - Route visualization
  - Pickup/dropoff markers
  - Zone-based clustering

- 📐 **Responsive Typography & UI**
  - Mobile → Desktop → iPad optimized
  - Automatic text fitting for compact UI
  - Sleek, minimal, readable design

- 🐍 **Python + uv Toolchain**
  - Fast dependency management
  - Data processing & ETL pipelines
  - Notebook-friendly analytics

---

## 🐍 Python Development with uv

This project uses **uv**, a modern Rust-based Python toolchain.

### Why uv?

- ⚡ **10–100× faster** than pip
- 📦 Dependency & project management
- 🐍 Python version pinning
- 🛠️ Tool execution without installation
- 🔄 Drop-in replacement for pip, pip-tools, venv

### Install uv

**macOS / Linux:**

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Windows:**

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### Python Quick Start

```bash
# Install recommended Python
uv python install 3.13
uv python pin 3.13

# Initialize project
uv init
uv sync

# Run the app
uv run main.py
```

**📖 Full Documentation**: See [docs/PYTHON_SETUP.md](docs/PYTHON_SETUP.md) for complete Python setup, data processing, and NYC TLC integration.

---

## 🐛 Debugging

### VS Code Debug Configurations

This project includes pre-configured debug launch configurations in `.vscode/launch.json`:

#### Launch Chrome (Vite)

- Automatically starts the Vite dev server
- Launches Chrome with debugging enabled
- Sets breakpoints in TypeScript/React code
- Press **F5** to start

#### Debug in Firefox (Vite)

- Same as Chrome but uses Firefox
- Requires Firefox Developer Edition or Firefox with remote debugging enabled

#### Python Debugger

- Debug Python scripts in the integrated terminal
- Set breakpoints in `.py` files
- Full variable inspection and call stack

### Debugging Quick Start

1. Open a file you want to debug
2. Set breakpoints by clicking left of line numbers
3. Press **F5** or go to **Run and Debug** panel
4. Select **Launch Chrome (Vite)**
5. Browser opens with debugger attached

### Manual Dev Server

To run the dev server without debugging:

```bash
npm run dev
```

Then use **Attach to Chrome** configuration to attach the debugger to the running instance.

---

## 📐 Typography & UI System

A three-layer text system ensures clean layouts across small and large screens.

### Layer 1 — Line Clamp (Recommended)

```tsx
<p className="text-sm leading-snug line-clamp-2">
  Truncated text with ellipsis
</p>
```

### Layer 2 — Fluid Typography

```tsx
<p className="text-[clamp(0.75rem,2.5vw,0.95rem)] leading-tight">
  Responsive text
</p>
```

### Layer 3 — Auto-Fit Text (Fixed Containers)

```tsx
<AutoFitText>Long Button Label</AutoFitText>
```

### UI Presets

```tsx
<h3 className="font-semibold text-[clamp(0.9rem,2.8vw,1.1rem)] line-clamp-1">
  Card Title
</h3>
```

---

## 📊 NYC TLC Trip Data Integration

### Supported Fleets

- Yellow Taxi
- Green Taxi
- FHV / HVFHS (Uber, Lyft, Via, Juno)

### Data Sources

- [NYC TLC Official Trip Records](https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page)
- [NYC Open Data Portal](https://opendata.cityofnewyork.us/)
- CSV & Parquet formats

### Supported Fields

- Pickup / Dropoff time
- Zone IDs (1–263)
- Distance & duration
- Fare, tips, tolls, congestion fees
- Shared ride indicators

### App Ride Interface

```typescript
interface Ride {
  platform: string
  date: string
  time: string
  pickupLocation: string
  dropoffLocation: string
  distance: number
  duration: number
  grossPay: number
  fees: number
  netPay: number
  tips: number
  vehicleType: string
}
```

### Data Processing (CSV & Parquet)

**Install Data Tools:**

```bash
uv pip install pandas pyarrow
```

**Read Parquet (Recommended):**

```python
import pandas as pd
trips = pd.read_parquet("fhv_tripdata.parquet")
```

**Export for App Import:**

```python
rides.to_csv("app_format.csv", index=False)
rides.to_parquet("app_format.parquet", index=False)
```

**📖 Full Data Pipeline**: See [docs/PYTHON_SETUP.md](docs/PYTHON_SETUP.md) for complete examples.

---

## 🗺️ Map Integration with OpenFreeMap

### Why Use OpenFreeMap?

- 🆓 Free & open-source
- 🔒 Privacy-first
- 🚀 Fast CDN
- 🗺️ MapLibre-native
- 🎨 Multiple styles

### Styles

| Style | URL |
| ------- | ----- |
| **Liberty** | `https://tiles.openfreemap.org/styles/liberty` |
| **Bright** | `https://tiles.openfreemap.org/styles/bright` |
| **Positron** | `https://tiles.openfreemap.org/styles/positron` |

### MapLibre Example

```typescript
const map = new maplibregl.Map({
  container: 'map',
  style: 'https://tiles.openfreemap.org/styles/liberty',
  center: [-73.9712, 40.7831],
  zoom: 12
})
```

**📖 Complete Map Documentation**: See [.github/OPENFREEMAP.md](.github/OPENFREEMAP.md)

---

## 📦 Docker & Production

- uv-based Docker images
- Multi-stage builds
- Cached dependency layers
- Python 3.13 recommended

**Example Dockerfile:**

```dockerfile
FROM python:3.13-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv
WORKDIR /app
COPY . .
RUN uv sync --frozen
CMD ["uv", "run", "main.py"]
```

---

## 🤖 Recommended AI Components

This app benefits strongly from:

- 📈 Demand forecasting (time + location)
- 🧠 Driver behavior modeling
- 🗺️ Zone heatmap prediction
- 🚦 Traffic-aware routing
- 💰 Earnings optimization ML
- 📊 Anomaly detection (bad fares, dead zones)

---

## 📄 License

MIT License  
© GitHub, Inc. & Contributors
You've just launched your brand-new Spark Template Codespace — everything’s fired up and ready for you to explore, build, and create with Spark!

This template is your blank canvas. It comes with a minimal setup to help you get started quickly with Spark development.

🚀 What's Inside?

- A clean, minimal Spark environment
- Pre-configured for local development
- Ready to scale with your ideas
- Three-layer typography system for responsive, elegant text handling
- **uv** - Modern Python package manager pre-installed
- **OpenFreeMap integration** - Free, open-source mapping with git remote configured ([see integration guide](.github/OPENFREEMAP.md))
  
🧠 What Can You Do?

Right now, this is just a starting point — the perfect place to begin building and testing your Spark applications.

## 📚 Template Quick Links

- 📖 [OpenFreeMap Integration Guide](.github/OPENFREEMAP.md) - Git remote setup, workflows, and troubleshooting
- 📋 [Product Requirements](PRD.md) - Full feature specifications
- 🗺️ [Map Integration Documentation](#️-map-integration-with-openfreemap) - Jump to mapping section below

## 🐍 Python with uv - Quick Reference

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

### uv Quick Start

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

**Managing Multiple Python Versions:**

```bash
# List all Python versions
uv python list

# Install specific versions
uv python install 3.13        # Install Python 3.13 (recommended for compatibility)
uv python install 3.12        # Install Python 3.12
uv python install 3.11        # Install Python 3.11

# Pin project to specific version
uv python pin 3.13            # Creates/updates .python-version file

# Use specific Python for a command
uv run --python 3.13 script.py
uvx --python 3.13 tool-name
```

**Python 3.14 Compatibility Note:**

This dev container has **Python 3.14.2** pre-installed. While Python 3.14 is cutting-edge, some packages may not yet have pre-built wheels:

**Common Issue:**

```text
onnxruntime>=1.17.0 has no wheels with a matching Python ABI tag (e.g., cp314)
You require CPython 3.14 (cp314), but we only found wheels for: cp310, cp311, cp312, cp313
```

**Solutions:**

1. **Use Python 3.13 (Recommended):**

   ```bash
   # Install Python 3.13
   uv python install 3.13
   
   # Pin to Python 3.13 for compatibility
   uv python pin 3.13
   
   # Verify
   uv run python --version  # Should show Python 3.13.x
   ```

2. **Enable Pre-releases:**

   ```bash
   # Allow pre-release versions
   uv pip install --prerelease=allow package-name
   uv tool install --prerelease=allow tool-name
   ```

3. **Install Specific Tool with Python 3.13:**

   ```bash
   uvx --python 3.13 markitdown-mcp
   uv tool install --python 3.13 package-name
   ```

4. **Project-level Python Version:**

   ```bash
   # Create pyproject.toml with specific Python requirement
   uv init
   uv python pin 3.13
   
   # This pins the project to Python 3.13
   # All uv run/sync commands will use 3.13
   ```

**Why This Happens:**

- Python 3.14 was released in October 2024
- Many packages need time to build and release wheels for new Python versions
- Packages with C extensions (like `onnxruntime`, `numpy`, `pandas`) require compilation
- Pre-built wheels improve installation speed and avoid build requirements

**Best Practice:**
For production use and maximum package compatibility, use **Python 3.12 or 3.13** until the ecosystem catches up with Python 3.14.

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

```script
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

**Recommended:** Install Python 3.13 for maximum package compatibility:

```bash
uv python install 3.13
uv python pin 3.13  # Set as default for projects
```

### Troubleshooting

#### Package Installation Fails with "No wheels for cpXXX"

**Error Example:**

```text
× No solution found when resolving dependencies:
  ╰─▶ onnxruntime>=1.17.0 has no wheels with a matching Python ABI tag (e.g., cp314)
      You require CPython 3.14 (cp314), but we only found wheels for: cp310, cp311, cp312, cp313
```

**Cause:** You're using a Python version that's too new. Many packages don't have pre-built wheels for Python 3.14 yet.

**Solutions:**

1. **Switch to Python 3.13 (Recommended):**

   ```bash
   uv python install 3.13
   uv python pin 3.13
   uv run python --version  # Verify
   ```

2. **Use older Python for specific tool:**

   ```bash
   uvx --python 3.13 tool-name
   uv tool install --python 3.13 tool-name
   ```

3. **Enable pre-releases (advanced):**

   ```bash
   uv pip install --prerelease=allow package-name
   ```

#### Dependency Resolution Issues

**Error:** "No solution found when resolving dependencies"

**Solutions:**

- Check if packages support your Python version
- Try `--prerelease=allow` for experimental versions
- Use constraints: `uv pip install 'package>=1.0,<2.0'`
- Clear cache: `uv cache clean`

#### Tool Not Found After Installation

**Error:** `command not found: tool-name`

**Solution:**

```bash
uv tool update-shell  # Add tools to PATH
# Or use full path: $(uv tool dir)/tool-name/bin/tool-name
```

#### Import Errors After Installation

**Error:** `ModuleNotFoundError: No module named 'package'`

**Solutions:**

- Tool installations: Use `uvx tool-name` (tools aren't importable)
- Project packages: Use `uv pip install package` in active venv
- Missing activation: Run `source .venv/bin/activate` first

### Using uv with Docker

uv provides official Docker images for containerized Python development. See the [uv-docker-example](https://github.com/astral-sh/uv-docker-example) project for best practices.

#### Available Images

**Distroless images** (uv binaries only):

- `ghcr.io/astral-sh/uv:latest`
- `ghcr.io/astral-sh/uv:0.9.26` (version-pinned, recommended)
- `ghcr.io/astral-sh/uv:0.9` (latest patch)

**Derived images** (with OS + uv pre-installed):

- Alpine: `ghcr.io/astral-sh/uv:alpine`, `ghcr.io/astral-sh/uv:alpine3.22`
- Debian Slim: `ghcr.io/astral-sh/uv:debian-slim`, `ghcr.io/astral-sh/uv:bookworm-slim`
- Debian Full: `ghcr.io/astral-sh/uv:debian`, `ghcr.io/astral-sh/uv:bookworm`
- Python-Alpine: `ghcr.io/astral-sh/uv:python3.13-alpine`, `ghcr.io/astral-sh/uv:python3.12-alpine`
- Python-Debian: `ghcr.io/astral-sh/uv:python3.13-bookworm-slim`, `ghcr.io/astral-sh/uv:python3.12-bookworm`

**Run uv in a container:**

```bash
docker run --rm -it ghcr.io/astral-sh/uv:debian uv --help
```

#### Installing uv in Dockerfile

**Method 1: Copy from distroless image (recommended):**

```dockerfile
FROM python:3.13-slim-bookworm
COPY --from=ghcr.io/astral-sh/uv:0.9.26 /uv /uvx /bin/
```

**Method 2: Use installer script:**

```dockerfile
FROM python:3.13-slim-bookworm

# Install curl for the installer
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates

# Download and run installer
ADD https://astral.sh/uv/0.9.26/install.sh /uv-installer.sh
RUN sh /uv-installer.sh && rm /uv-installer.sh

# Add to PATH
ENV PATH="/root/.local/bin/:$PATH"
```

**Best Practice: Pin specific SHA256 for reproducible builds:**

```dockerfile
COPY --from=ghcr.io/astral-sh/uv@sha256:2381d6aa60c326b71fd40023f921a0a3b8f91b14d5db6b90402e65a635053709 /uv /uvx /bin/
```

#### Building a Project in Docker

**Basic Dockerfile:**

```dockerfile
# Install uv
FROM python:3.13-slim-bookworm
COPY --from=ghcr.io/astral-sh/uv:0.9.26 /uv /uvx /bin/

# Copy project files
WORKDIR /app
COPY . /app

# Disable development dependencies
ENV UV_NO_DEV=1

# Sync dependencies and install project
RUN uv sync --locked

# Run application
CMD ["uv", "run", "my_app"]
```

**Important:** Add `.venv` to `.dockerignore` to prevent local virtual environments from being copied into the image.

#### Optimized Multi-Stage Build

Use intermediate layers to cache dependencies separately from application code:

```dockerfile
# Install uv
FROM python:3.13-slim-bookworm
COPY --from=ghcr.io/astral-sh/uv:0.9.26 /uv /uvx /bin/

WORKDIR /app

# Install dependencies (cached separately)
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --locked --no-install-project

# Copy application code
COPY . /app

# Install project
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked

# Activate virtual environment
ENV PATH="/app/.venv/bin:$PATH"

CMD ["python", "-m", "my_app"]
```

**Key optimizations:**

- `--mount=type=cache` preserves uv cache across builds
- `--no-install-project` separates dependency installation from app code
- Dependencies layer rebuilds only when `uv.lock` or `pyproject.toml` change
- App code changes don't invalidate dependency cache

#### Docker Compose with Watch Mode

Enable live reload during development:

```yaml
# compose.yaml
services:
  app:
    build: .
    develop:
      watch:
        # Sync code changes to container
        - action: sync
          path: .
          target: /app
          ignore:
            - .venv/
        
        # Rebuild on dependency changes
        - action: rebuild
          path: ./pyproject.toml
```

Run with:

```bash
docker compose watch
```

#### Additional Optimizations

**Compile bytecode for faster startup:**

```dockerfile
ENV UV_COMPILE_BYTECODE=1
RUN uv sync --locked
```

**Use system Python (skip venv creation):**

```dockerfile
ENV UV_SYSTEM_PYTHON=1
RUN uv pip install -r requirements.txt
```

**Non-editable install (copy venv without source):**

```dockerfile
# Builder stage
FROM python:3.13-slim-bookworm AS builder
COPY --from=ghcr.io/astral-sh/uv:0.9.26 /uv /uvx /bin/

WORKDIR /app
COPY . /app

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-editable

# Runtime stage
FROM python:3.13-slim-bookworm
COPY --from=builder /app/.venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"
CMD ["python", "-m", "my_app"]
```

#### Verifying Image Provenance

Docker images are signed with GitHub attestations for security verification:

```bash
# Verify with GitHub CLI
gh attestation verify --owner astral-sh oci://ghcr.io/astral-sh/uv:0.9.26

# Verify with cosign
REPO=astral-sh/uv
gh attestation download --repo $REPO oci://ghcr.io/${REPO}:0.9.26
docker buildx imagetools inspect ghcr.io/${REPO}:0.9.26 --format "{{json .Manifest}}" > manifest.json
cosign verify-blob-attestation \
    --new-bundle-format \
    --bundle "$(jq -r .digest manifest.json).jsonl" \
    --certificate-oidc-issuer="https://token.actions.githubusercontent.com" \
    --certificate-identity-regexp="^https://github\.com/${REPO}/.*" \
    <(jq -j '.|del(.digest,.size)' manifest.json)
```

**Best Practice:** Verify attestations for production images to ensure they're from official sources.

### Learn More

- [uv Documentation](https://docs.astral.sh/uv/)
- [uv Docker Example Project](https://github.com/astral-sh/uv-docker-example)
- [Installing Python Guide](https://docs.astral.sh/uv/guides/install-python/)
- [Projects Guide](https://docs.astral.sh/uv/guides/projects/)
- [Running Scripts Guide](https://docs.astral.sh/uv/guides/scripts/)
- [Tools Guide](https://docs.astral.sh/uv/guides/tools/)
- [Docker Guide](https://docs.astral.sh/uv/guides/integration/docker/)

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

## 🚕 NYC TLC Trip Data Integration

This Spark template includes ride tracking and earnings optimization features designed to align with NYC Taxi & Limousine Commission (TLC) trip data formats.

### About NYC TLC Data

The NYC TLC collects comprehensive trip records for all licensed vehicles including:

- **Yellow Taxis** - Traditional street-hail medallion taxis (all 5 boroughs)
- **Green Taxis** - Boro taxis (above W 110 St/E 96th St in Manhattan and boroughs)
- **FHV (For-Hire Vehicles)** - App-based services: Uber, Lyft, Via, Juno

### Data Availability

**Official Sources:**

- **TLC Website**: [https://www1.nyc.gov/site/tlc/about/tlc-trip-record-data.page](https://www1.nyc.gov/site/tlc/about/tlc-trip-record-data.page)
  - CSV format, organized by year/month/type
  - Updated every 6 months (Jan-Jun by end of Aug, Jul-Dec by end of Feb)
  
- **NYC Open Data Portal**: [https://opendata.cityofnewyork.us/](https://opendata.cityofnewyork.us/)
  - Multiple formats: CSV, JSON, RDF, XML, SHP
  - Filterable before download
  - API access available

**Timeline:**

- 2009: TLC begins collecting taxi trip data
- 2013: Green taxis added to fleet
- 2015: FHV trip data collection begins (including app bases)
- 2017: Drop-off location data added for FHV
- 2019: High Volume For-Hire Services (HVFHS) license created for 10k+ trips/day

### TLC Data Fields

TLC trip records include comprehensive fields that align with this app's tracking features. Below are the complete field definitions:

#### Yellow Taxi Data Dictionary

| Field | Description | Values/Notes |
| ------- | ------------- | -------------- |
| `VendorID` | TPEP provider | 1=Creative Mobile Tech |
| `tpep_pickup_datetime` | Meter engaged date/time | Maps to `date` + `time` |
| `tpep_dropoff_datetime` | Meter disengaged date/time | Calculate `duration` |
| `passenger_count` | Number of passengers | Optional tracking |
| `trip_distance` | Trip distance in miles | Maps to `distance` |
| `RatecodeID` | Final rate code | 1=Standard, 2=JFK, 3=Newark, 4=Nassau/Westchester, 5=Negotiated, 6=Group, 99=Null |
| `store_and_fwd_flag` | Held in vehicle memory | Y/N - connectivity indicator |
| `PULocationID` | Pickup zone (1-263) | Maps to `pickupLocation` |
| `DOLocationID` | Dropoff zone (1-263) | Maps to `dropoffLocation` |
| `payment_type` | Payment method | 0=FlexFare, 1=Credit, 2=Cash, 3=NoCharge, 4=Dispute, 5=Unknown, 6=Voided |
| `fare_amount` | Metered fare | Base component of `grossPay` |
| `extra` | Extras and surcharges | Add to `grossPay` |
| `mta_tax` | MTA tax | Add to `grossPay` |
| `tip_amount` | Tip (credit cards only) | Maps to `tips` |
| `tolls_amount` | Total tolls | Add to `fees` |
| `improvement_surcharge` | Improvement surcharge | Add to `grossPay` |
| `total_amount` | Total charged | Base for `grossPay` |
| `congestion_surcharge` | NYS congestion surcharge | Add to `fees` |
| `airport_fee` | LGA/JFK pickup fee | Add to `fees` |
| `cbd_congestion_fee` | MTA Congestion Zone fee | Add to `fees` (since Jan 5, 2025) |

#### Green Taxi (LPEP) Data Dictionary

| Field | Description | Values/Notes |
| ------- | ------------- | -------------- |
| `VendorID` | LPEP provider | 1=Creative Mobile Tech, 2=Curb, 6=Myle |
| `lpep_pickup_datetime` | Meter engaged date/time | Maps to `date` + `time` |
| `lpep_dropoff_datetime` | Meter disengaged date/time | Calculate `duration` |
| `store_and_fwd_flag` | Held in vehicle memory | Y/N |
| `RatecodeID` | Final rate code | Same as Yellow |
| `PULocationID` | Pickup zone (1-263) | Maps to `pickupLocation` |
| `DOLocationID` | Dropoff zone (1-263) | Maps to `dropoffLocation` |
| `passenger_count` | Number of passengers | Optional tracking |
| `trip_distance` | Trip distance in miles | Maps to `distance` |
| `fare_amount` | Metered fare | Base component of `grossPay` |
| `extra` | Extras and surcharges | Add to `grossPay` |
| `mta_tax` | MTA tax | Add to `grossPay` |
| `tip_amount` | Tip (credit cards only) | Maps to `tips` |
| `tolls_amount` | Total tolls | Add to `fees` |
| `improvement_surcharge` | Improvement surcharge | Add to `grossPay` |
| `total_amount` | Total charged | Base for `grossPay` |
| `payment_type` | Payment method | Same as Yellow |
| `trip_type` | Street-hail or dispatch | 1=Street-hail, 2=Dispatch |
| `congestion_surcharge` | NYS congestion surcharge | Add to `fees` |
| `cbd_congestion_fee` | MTA Congestion Zone fee | Add to `fees` (since Jan 5, 2025) |

#### FHV (For-Hire Vehicle) Data Dictionary

| Field | Description | Values/Notes |
| ------- | ------------- | -------------- |
| `dispatching_base_num` | Base license number | Map to platform (Uber/Lyft/Via/Juno) |
| `pickup_datetime` | Trip pickup date/time | Maps to `date` + `time` |
| `dropOff_datetime` | Trip dropoff date/time | Calculate `duration` |
| `PUlocationID` | Pickup zone (1-263) | Maps to `pickupLocation` |
| `DOlocationID` | Dropoff zone (1-263) | Maps to `dropoffLocation` |
| `SR_Flag` | Shared ride indicator | 1=Shared (Pool/Line), null=Not shared |
| `Affiliated_base_number` | Affiliated base | Base vehicle is affiliated with |

**Note**: FHV data lacks financial details (fare, tips, fees) - these must be tracked separately in the app.

#### HVFHS (High Volume FHV) Additional Fields

For Uber, Lyft, Via, Juno (post-2019 data includes):

- Trip miles, trip time
- Base passenger fare
- Tolls, sales tax, congestion surcharge
- Tips (for credit card payments)
- Driver pay, shared ride information

### NYC Taxi Zone Lookup

**Complete 265-zone lookup table** (LocationID → Zone Name → Borough):

- **1-263**: NYC Taxi Zones (neighborhoods)
- **264**: Unknown/N/A
- **265**: Outside of NYC

**Key Zones:**

- **1**: Newark Airport (EWR)
- **132**: JFK Airport
- **138**: LaGuardia Airport
- **43**: Central Park
- **230**: Times Square/Theatre District
- **161**: Midtown Center
- **87-88**: Financial District
- **113-114**: Greenwich Village

**Download Full Lookup:**

- CSV: [https://s3.amazonaws.com/nyc-tlc/misc/taxi+_zone_lookup.csv](https://s3.amazonaws.com/nyc-tlc/misc/taxi+_zone_lookup.csv)
- Shapefile: [https://s3.amazonaws.com/nyc-tlc/misc/taxi_zones.zip](https://s3.amazonaws.com/nyc-tlc/misc/taxi_zones.zip)

**Service Zones:**

- **Yellow Zone**: Manhattan below 96th St/110th St (Yellow taxi exclusive areas)
- **Boro Zone**: Outer boroughs and upper Manhattan (Green taxi areas)
- **Airports**: JFK, LaGuardia, Newark

### Field Mapping Examples

**Yellow/Green Taxi → App Format:**

```python
# Map Yellow Taxi fields to app format
app_ride = {
    'platform': 'curb',  # Yellow taxi via app
    'date': pd.to_datetime(row['tpep_pickup_datetime']).date(),
    'time': pd.to_datetime(row['tpep_pickup_datetime']).time(),
    'pickupLocation': zone_lookup[row['PULocationID']],  # Zone ID → Name
    'dropoffLocation': zone_lookup[row['DOLocationID']],
    'distance': row['trip_distance'],
    'duration': (row['tpep_dropoff_datetime'] - row['tpep_pickup_datetime']).seconds / 60,
    'grossPay': row['total_amount'],
    'fees': row['tolls_amount'] + row['congestion_surcharge'] + row['cbd_congestion_fee'],
    'netPay': row['total_amount'] - row['tolls_amount'] - commission,  # Calculate commission
    'tips': row['tip_amount'],
    'vehicleType': 'gas',  # or 'hybrid' based on fleet data
}
```

**FHV → App Format:**

```python
# Map FHV fields to app format
base_to_platform = {
    'B02764': 'uber', 'B02510': 'lyft', 'B03136': 'via', 'B02914': 'juno'
}

app_ride = {
    'platform': base_to_platform.get(row['dispatching_base_num'], 'other'),
    'date': pd.to_datetime(row['pickup_datetime']).date(),
    'time': pd.to_datetime(row['pickup_datetime']).time(),
    'pickupLocation': zone_lookup[row['PUlocationID']],
    'dropoffLocation': zone_lookup[row['DOlocationID']],
    'distance': row.get('trip_miles', 0),  # HVFHS only
    'duration': (row['dropOff_datetime'] - row['pickup_datetime']).seconds / 60,
    'shared': row['SR_Flag'] == 1,
    # Financial data must come from driver records
}
```

### Platform Base Number Mapping

The app supports tracking for major rideshare platforms. TLC data uses base license numbers to identify companies:

**Uber (HV0003)** - 27 Base Licenses:

- B02877, B02866, B02882, B02869, B02617, B02876, B02865, B02512, B02888, B02864, B02883, B02875, B02682, B02880, B02870, B02404, B02598, B02765, B02879, B02867, B02878, B02887, B02872, B02836, B02884, B02835, B02764, B02889, B02871, B02395

**Lyft (HV0005)** - 2 Base Licenses:

- B02510 (TRI-CITY, LLC)
- B02844 (ENDOR CAR & DRIVER, LLC)

**Via (HV0004)** - 2 Base Licenses:

- B03136 (GREENPOINT TRANSIT LLC)
- B02800 (FLATIRON TRANSIT LLC)

**Juno (HV0002)** - 4 Base Licenses:

- B02914 (VULCAN CARS LLC)
- B02907 (SABO ONE LLC)
- B02908 (SABO TWO LLC)
- B03035 (OMAHA LLC)

### NYC Taxi Zones

TLC uses 263 numbered zones to represent pickup/dropoff locations:

- Based on NYC Department of City Planning's Neighborhood Tabulation Areas (NTAs)
- Approximate neighborhood boundaries
- **Download Lookup Table**: [https://s3.amazonaws.com/nyc-tlc/misc/taxi+_zone_lookup.csv](https://s3.amazonaws.com/nyc-tlc/misc/taxi+_zone_lookup.csv)
- **Download Shapefile**: [https://s3.amazonaws.com/nyc-tlc/misc/taxi_zones.zip](https://s3.amazonaws.com/nyc-tlc/misc/taxi_zones.zip)

### Shared Rides (Uber Pool / Lyft Line)

The TLC data includes a `SR_Flag` field to identify shared ride trips:

- **Value = 1**: Shared ride (pool/line service)
- **Value = null**: Non-shared ride

**Important Notes:**

- Most companies flag only successfully matched shared rides
- Lyft also flags requested-but-unmatched shared rides (potential overcount)
- Juno does not offer shared rides

### Data Import Capabilities

The app's data structure is designed to be compatible with TLC CSV exports:

**Ride Tracking Alignment:**

```typescript
// App's Ride interface aligns with TLC fields
interface Ride {
  platform: string        // Maps to dispatching base
  date: string           // Pickup date
  time: string           // Pickup time
  pickupLocation: string // TLC PULocationID (zone)
  dropoffLocation: string // TLC DOLocationID (zone)
  distance: number       // Trip distance (miles)
  duration: number       // Trip duration (minutes)
  grossPay: number       // Total fare amount
  fees: number           // TLC fees + commission
  netPay: number         // Driver take-home
  tips: number           // Tip amount
  vehicleType: string    // gas/hybrid/electric
  rating: number         // Driver rating
  fuelCost: number       // Operating cost
}
```

**Import Workflow:**

1. **Download TLC Data**
   - Get Parquet or CSV files from TLC website or Open Data Portal
   - Filter by date range, platform, or location if needed
   - **Note**: TLC is transitioning to Parquet format for reduced file sizes and faster processing

2. **Data Transformation**
   - Map base license numbers to platform names (Uber, Lyft, Via, Juno)
   - Convert TLC zone IDs to location names using lookup table
   - Calculate net pay: `total_amount - fees - (company_commission)`
   - Extract date/time from pickup_datetime
   - Map trip_distance → distance, trip_duration → duration

3. **CSV Export from App**
   - App supports CSV export of tracked rides
   - Compatible with spreadsheet analysis and TLC format comparison
   - Export function: `lib/csv-export.ts`

### Working with Parquet Format

**Why Parquet?**

TLC is switching from CSV to Parquet format for storing raw trip data. Parquet is the industry standard for big data with significant benefits:

- **Smaller file sizes** - Columnar compression reduces storage by 50-90%
- **Faster processing** - Columnar format enables efficient querying
- **Better performance** - Industry standard for large-scale data analysis

**Python Data Processing with uv:**

Install the required tools for working with both CSV and Parquet formats:

```bash
# Install data processing packages
uvx --from pandas,pyarrow python -c "print('Ready for data processing')"

# Or install in a virtual environment
uv venv
source .venv/bin/activate  # macOS/Linux
# .venv\Scripts\activate   # Windows
uv pip install pandas pyarrow

# For interactive analysis
uv tool install jupyter
uvx jupyter notebook
```

**Reading Parquet Files in Python:**

```python
# Method 1: Using PyArrow directly
import pyarrow.parquet as pq

# Read Parquet file
trips = pq.read_table('trips.parquet')
trips = trips.to_pandas()

# Method 2: Using Pandas (recommended for most use cases)
import pandas as pd

# Pandas can read Parquet directly
trips = pd.read_parquet('fhv_tripdata_2024-01.parquet')

# Display basic info
print(f"Total trips: {len(trips)}")
print(trips.head())
```

**Reading Parquet Files in R:**

```r
# Install arrow package (if not already installed)
install.packages("arrow")

# Load library
library(arrow)

# Read Parquet file
trips <- read_parquet('trips.parquet')

# View data
head(trips)
```

**Example Processing Script (Parquet):**

```python
# process_tlc_parquet.py
import pandas as pd
import pyarrow.parquet as pq

# Read TLC Parquet data (much faster than CSV)
print("Reading Parquet file...")
trips = pd.read_parquet('fhv_tripdata_2024-01.parquet')

# Map base numbers to platforms
platform_map = {
    'B02764': 'uber', 'B02877': 'uber', 'B02617': 'uber',
    'B02510': 'lyft', 'B02844': 'lyft',
    'B03136': 'via', 'B02800': 'via',
    'B02914': 'juno', 'B02907': 'juno'
}

# Transform to app format
rides = pd.DataFrame({
    'platform': trips['dispatching_base_num'].map(platform_map),
    'date': pd.to_datetime(trips['pickup_datetime']).dt.date,
    'time': pd.to_datetime(trips['pickup_datetime']).dt.time,
    'pickupLocation': trips['PULocationID'],
    'dropoffLocation': trips['DOLocationID'],
    'distance': trips['trip_miles'],
    'duration': trips['trip_time'] / 60,  # Convert seconds to minutes
    'grossPay': trips['base_passenger_fare'],
    'fees': trips['tolls'] + trips['sales_tax'],
    'tips': trips['tips'],
    'shared': trips['shared_ride_flag'] == 1
})

# Save as CSV for app import
rides.to_csv('app_format.csv', index=False)

# Or save as Parquet (smaller, faster)
rides.to_parquet('app_format.parquet', index=False)

print(f"Processed {len(rides)} trips")
print(f"Platforms: {rides['platform'].value_counts().to_dict()}")
```

**Run the Processing Script:**

```bash
# Make sure pyarrow and pandas are installed
uv pip install pandas pyarrow

# Run the script
uv run process_tlc_parquet.py --input fhv_tripdata_2024-01.parquet

# Or with uvx (one-off execution)
uvx --from pandas,pyarrow python process_tlc_parquet.py
```

**Parquet vs CSV Performance:**

| Format  | File Size | Read Speed   | Use Case                                  |
|---------|-----------|--------------|-------------------------------------------|
| CSV     | 100%      | Baseline     | Legacy compatibility, spreadsheets        |
| Parquet | 10-50%    | 5-10x faster | Big data, analytics, production pipelines |

**Python Data Processing with uv:**

Use Python to process TLC data for import:

```bash
# Install data processing tools
uv pip install pandas pyarrow
uv tool install jupyter

# Process Parquet files (recommended)
uv run process_tlc_parquet.py --input trips.parquet --output app_format.csv

# For interactive analysis
uvx jupyter notebook
```

**Additional Resources:**

- **PyArrow Documentation**: [https://arrow.apache.org/docs/python/parquet.html](https://arrow.apache.org/docs/python/parquet.html)
- **Arrow R Package**: [https://arrow.apache.org/docs/r/reference/read_parquet.html](https://arrow.apache.org/docs/r/reference/read_parquet.html)
- **Pandas Parquet I/O**: [https://pandas.pydata.org/docs/reference/api/pandas.read_parquet.html](https://pandas.pydata.org/docs/reference/api/pandas.read_parquet.html)

**Legacy CSV Processing:**

For older TLC data still in CSV format:

```python
# process_tlc_csv.py (legacy)
# process_tlc_data.py
import pandas as pd

# Read TLC data
tlc = pd.read_csv('fhv_tripdata_2024-01.csv')

# Map base numbers to platforms
platform_map = {
    'B02764': 'uber', 'B02877': 'uber', 'B02617': 'uber',
    'B02510': 'lyft', 'B02844': 'lyft',
    'B03136': 'via', 'B02800': 'via',
    'B02914': 'juno', 'B02907': 'juno'
}

# Transform to app format
rides = pd.DataFrame({
    'platform': tlc['dispatching_base_num'].map(platform_map),
    'date': pd.to_datetime(tlc['pickup_datetime']).dt.date,
    'time': pd.to_datetime(tlc['pickup_datetime']).dt.time,
    'pickupLocation': tlc['PULocationID'],
    'dropoffLocation': tlc['DOLocationID'],
    'distance': tlc['trip_miles'],
    'duration': tlc['trip_time'] / 60,  # Convert seconds to minutes
    'grossPay': tlc['base_passenger_fare'],
    'fees': tlc['tolls'] + tlc['sales_tax'],
    'tips': tlc['tips'],
    'shared': tlc['shared_ride_flag'] == 1
})

rides.to_csv('app_format.csv', index=False)
```

### Data Dictionary Resources

**Official TLC Documentation:**

- [Yellow Taxi Data Dictionary (PDF)](https://www1.nyc.gov/assets/tlc/downloads/pdf/data_dictionary_trip_records_yellow.pdf)
- [Green Taxi Data Dictionary (PDF)](https://www1.nyc.gov/assets/tlc/downloads/pdf/data_dictionary_trip_records_green.pdf)
- [FHV Data Dictionary (PDF)](https://www1.nyc.gov/assets/tlc/downloads/pdf/data_dictionary_trip_records_fhv.pdf)
- [HVFHS Data Dictionary (PDF)](https://www1.nyc.gov/assets/tlc/downloads/pdf/data_dictionary_trip_records_hvfhs.pdf)

**NYC Open Data - FHV Base Aggregate Reports:**

For AI-powered insights and aggregate market analysis, access the **FHV Base Aggregate Report** dataset:

- **Dataset**: [FHV Base Aggregate Report](https://data.cityofnewyork.us/b7f2ea51-e357-4f19-90e9-e21657dcd6dd)
- **What it contains**: Monthly aggregated statistics by TLC base license
- **Key metrics**: Total trips, unique vehicles, unique drivers, total distance, total time
- **Time range**: Monthly reports from 2015-present
- **Use cases**:
  - Compare performance across different FHV bases (Uber, Lyft, Via, Juno)
  - Track market share trends over time
  - Benchmark your earnings against platform averages
  - Identify seasonal patterns and demand cycles
  - Forecast future earnings based on historical trends

**Example Analysis with Python:**

```python
import pandas as pd
import requests

# Load FHV Base Aggregate data from NYC Open Data
url = "https://data.cityofnewyork.us/resource/2v9c-2k7f.json"
params = {
    "$limit": 5000,
    "$where": "month >= '2024-01-01'",
    "$order": "month DESC"
}
response = requests.get(url, params=params)
base_stats = pd.DataFrame(response.json())

# Filter for major app platforms
uber_bases = ['B02764', 'B02617', 'B02598']  # Sample Uber bases
lyft_bases = ['B02510', 'B02844']

base_stats['platform'] = base_stats['base_number'].apply(
    lambda x: 'Uber' if x in uber_bases else 
              'Lyft' if x in lyft_bases else 
              'Other'
)

# Calculate average trips per driver
base_stats['avg_trips_per_driver'] = (
    base_stats['total_trips'].astype(float) / 
    base_stats['unique_drivers'].astype(float)
)

# Analyze by platform
platform_summary = base_stats.groupby('platform').agg({
    'total_trips': 'sum',
    'unique_drivers': 'sum',
    'unique_vehicles': 'sum',
    'avg_trips_per_driver': 'mean'
})

print(platform_summary)
```

**API Access:**

```bash
# Query specific base and time period
curl "https://data.cityofnewyork.us/resource/2v9c-2k7f.json?\$where=base_number='B02764'%20AND%20month>='2024-01-01'&\$limit=12"

# Get latest month for all bases
curl "https://data.cityofnewyork.us/resource/2v9c-2k7f.json?\$order=month%20DESC&\$limit=100"
```

**Insights You Can Generate:**

- **Market positioning**: See how your chosen platform(s) compare in trip volume
- **Driver efficiency**: Calculate trips per driver vs platform averages
- **Capacity utilization**: Analyze vehicle-to-driver ratios
- **Growth trends**: Track YoY changes in platform activity
- **Seasonal planning**: Identify peak months for maximizing earnings

### Contact & Resources

**Questions about TLC Data:**

- Email: <research@tlc.nyc.gov>
- TLC Blog: [https://medium.com/@NYCTLC](https://medium.com/@NYCTLC)
- Open Data Portal: Submit feedback on specific datasets

**App Data Questions:**

- This template's data structure is designed for driver earnings tracking
- Compatible with TLC public data formats for analysis and import
- Use Python (via uv) for data transformation and ETL workflows

## 🗺️ Detailed Map Integration Guide

This template can display ride locations on interactive maps using free, open-source map tiles from [OpenFreeMap](https://openfreemap.org/).

### Development & Git Integration

This project includes the OpenFreeMap repository as a git remote for development and customization purposes.

**Quick Verification:**

```bash
# Verify OpenFreeMap remote configuration
chmod +x verify-openfreemap.sh
./verify-openfreemap.sh
```

**Git Remote Setup:**

```bash
# Remote is already configured as 'openfreemap'
git remote -v

# Fetch latest OpenFreeMap updates
git fetch openfreemap

# View OpenFreeMap branches
git branch -r | grep openfreemap

# Cherry-pick specific features or compare implementations
git log openfreemap/main --oneline
```

**OpenFreeMap Repository:**

- **URL**: <https://github.com/telleriacarolina/openfreemap.git>
- **Purpose**: MapLibre-based open-source mapping solution
- **Usage**: Reference implementation for tile serving and map styles
- **Documentation**: See [.github/OPENFREEMAP.md](.github/OPENFREEMAP.md) for complete guide

### Why OpenFreeMap?

- **Free & Open Source** - No API keys, rate limits, or costs
- **Fast CDN** - Global tile delivery with Cloudflare
- **Privacy-Focused** - No tracking or data collection
- **Multiple Styles** - Liberty (colorful), Bright (clean), Positron (minimal)
- **Self-Hosting Option** - Full planet Btrfs images available
- **MapLibre Native** - Built on MapLibre GL for modern, performant mapping

### Using MapLibre GL JS (Recommended)

MapLibre GL JS is the modern, open-source alternative to Mapbox GL JS.

**Installation via npm:**

```bash
npm install maplibre-gl
# or
uv run npm install maplibre-gl
```

**Or include via CDN:**

```html
<head>
  <script src="https://unpkg.com/maplibre-gl/dist/maplibre-gl.js"></script>
  <link href="https://unpkg.com/maplibre-gl/dist/maplibre-gl.css" rel="stylesheet" />
</head>
```

**Basic Usage:**

```javascript
const map = new maplibregl.Map({
  style: 'https://tiles.openfreemap.org/styles/liberty',
  center: [13.388, 52.517], // [longitude, latitude]
  zoom: 9.5,
  container: 'map',
})
```

**For NYC (Centered on Manhattan):**

```javascript
const map = new maplibregl.Map({
  style: 'https://tiles.openfreemap.org/styles/liberty',
  center: [-73.9712, 40.7831], // Times Square coordinates
  zoom: 12,
  container: 'map',
})
```

**Display Pickup/Dropoff Locations:**

```javascript
// Add markers for ride locations
const pickupMarker = new maplibregl.Marker({ color: '#22c55e' }) // Green
  .setLngLat([-73.9851, 40.7589]) // Pickup coordinates
  .setPopup(new maplibregl.Popup().setHTML('<b>Pickup:</b> Times Square'))
  .addTo(map)

const dropoffMarker = new maplibregl.Marker({ color: '#ef4444' }) // Red
  .setLngLat([-73.9712, 40.7831]) // Dropoff coordinates
  .setPopup(new maplibregl.Popup().setHTML('<b>Dropoff:</b> Central Park'))
  .addTo(map)

// Draw route line
map.on('load', () => {
  map.addSource('route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [-73.9851, 40.7589], // Pickup
          [-73.9712, 40.7831]  // Dropoff
        ]
      }
    }
  })
  
  map.addLayer({
    id: 'route',
    type: 'line',
    source: 'route',
    paint: {
      'line-color': '#3b82f6',
      'line-width': 4
    }
  })
})
```

### Available Styles

OpenFreeMap provides three style options:

| Style | URL | Best For |
| ----- | --- | -------- |
| **Liberty** | `https://tiles.openfreemap.org/styles/liberty` | Colorful, detailed, general use |
| **Bright** | `https://tiles.openfreemap.org/styles/bright` | Clean, minimal, professional |
| **Positron** | `https://tiles.openfreemap.org/styles/positron` | Light, minimal, data overlays |

**Customize with Maputnik:**

- [Customize Liberty](https://maputnik.github.io/editor/#https://tiles.openfreemap.org/styles/liberty)
- [Customize Bright](https://maputnik.github.io/editor/#https://tiles.openfreemap.org/styles/bright)
- [Customize Positron](https://maputnik.github.io/editor/#https://tiles.openfreemap.org/styles/positron)

### Using with Leaflet

If you prefer Leaflet, use [MapLibre GL Leaflet](https://github.com/maplibre/maplibre-gl-leaflet):

```html
<!-- Leaflet -->
<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>

<!-- Maplibre GL -->
<link href="https://unpkg.com/maplibre-gl/dist/maplibre-gl.css" rel="stylesheet" />
<script src="https://unpkg.com/maplibre-gl/dist/maplibre-gl.js"></script>

<!-- Maplibre GL Leaflet  -->
<script src="https://unpkg.com/@maplibre/maplibre-gl-leaflet/leaflet-maplibre-gl.js"></script>

<div id="map" style="width: 100%; height: 500px"></div>
<script>
  const map = L.map('map').setView([40.7831, -73.9712], 12) // NYC

  L.maplibreGL({
    style: 'https://tiles.openfreemap.org/styles/liberty',
  }).addTo(map)
</script>
```

### Using with OpenLayers

For OpenLayers, use [ol-mapbox-style](https://github.com/openlayers/ol-mapbox-style):

```html
<!-- OpenLayers -->
<script src="https://unpkg.com/ol/dist/ol.js"></script>
<link rel="stylesheet" href="https://unpkg.com/ol/ol.css" />

<!-- ol-mapbox-style -->
<script src="https://unpkg.com/ol-mapbox-style/dist/olms.js"></script>

<div id="map" style="width: 100%; height: 500px"></div>
<script>
  const openfreemap = new ol.layer.Group()
  const map = new ol.Map({
    layers: [openfreemap],
    view: new ol.View({ 
      center: ol.proj.fromLonLat([-73.9712, 40.7831]), // NYC
      zoom: 12 
    }),
    target: 'map',
  })
  olms.apply(openfreemap, 'https://tiles.openfreemap.org/styles/liberty')
</script>
```

### React Integration Example

**Install dependencies:**

```bash
npm install maplibre-gl
npm install --save-dev @types/maplibre-gl
```

**Create Map Component:**

```typescript
// src/components/RideMap.tsx
import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

interface RideMapProps {
  pickup: { lng: number; lat: number }
  dropoff: { lng: number; lat: number }
}

export function RideMap({ pickup, dropoff }: RideMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return
    if (map.current) return // Initialize map only once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [pickup.lng, pickup.lat],
      zoom: 12
    })

    // Add pickup marker (green)
    new maplibregl.Marker({ color: '#22c55e' })
      .setLngLat([pickup.lng, pickup.lat])
      .setPopup(new maplibregl.Popup().setHTML('<b>Pickup</b>'))
      .addTo(map.current)

    // Add dropoff marker (red)
    new maplibregl.Marker({ color: '#ef4444' })
      .setLngLat([dropoff.lng, dropoff.lat])
      .setPopup(new maplibregl.Popup().setHTML('<b>Dropoff</b>'))
      .addTo(map.current)

    // Fit map to show both points
    const bounds = new maplibregl.LngLatBounds()
    bounds.extend([pickup.lng, pickup.lat])
    bounds.extend([dropoff.lng, dropoff.lat])
    map.current.fitBounds(bounds, { padding: 50 })

    return () => {
      map.current?.remove()
    }
  }, [pickup, dropoff])

  return <div ref={mapContainer} style={{ width: '100%', height: '400px' }} />
}
```

**Usage:**

```tsx
<RideMap 
  pickup={{ lng: -73.9851, lat: 40.7589 }}  // Times Square
  dropoff={{ lng: -73.9712, lat: 40.7831 }} // Central Park
/>
```

### Converting TLC Zone IDs to Coordinates

TLC data uses zone IDs (1-263). To display on a map, convert zone IDs to coordinates:

**Download zone shapefile:**

```bash
curl -O https://s3.amazonaws.com/nyc-tlc/misc/taxi_zones.zip
unzip taxi_zones.zip
```

**Process with Python:**

```python
import geopandas as gpd
import pandas as pd

# Read taxi zones shapefile
zones = gpd.read_file('taxi_zones.shp')

# Calculate zone centroids
zones['longitude'] = zones.geometry.centroid.x
zones['latitude'] = zones.geometry.centroid.y

# Create lookup dictionary
zone_coords = zones.set_index('LocationID')[['longitude', 'latitude']].to_dict('index')

# Map ride data
ride_pickup_coords = zone_coords[ride['PULocationID']]
ride_dropoff_coords = zone_coords[ride['DOLocationID']]

print(f"Pickup: {ride_pickup_coords}")
print(f"Dropoff: {ride_dropoff_coords}")
```

### Mobile Apps

For React Native or mobile apps, use [MapLibre Native](https://github.com/maplibre/maplibre-native) with the same OpenFreeMap styles.

### Self-Hosting

For production with high traffic, consider self-hosting:

- Download [OpenFreeMap Btrfs images](https://github.com/hyperknot/openfreemap)
- Host tiles on your infrastructure
- Full control and no external dependencies

### Resources

- **OpenFreeMap Website**: [https://openfreemap.org/](https://openfreemap.org/)
- **OpenFreeMap Repository**: [https://github.com/telleriacarolina/openfreemap](https://github.com/telleriacarolina/openfreemap) (configured as git remote)
- **MapLibre GL JS Documentation**: [https://maplibre.org/maplibre-gl-js/docs/](https://maplibre.org/maplibre-gl-js/docs/)
- **Maputnik Style Editor**: [https://maputnik.github.io/editor/](https://maputnik.github.io/editor/)
- **NYC Taxi Zones Shapefile**: [https://s3.amazonaws.com/nyc-tlc/misc/taxi_zones.zip](https://s3.amazonaws.com/nyc-tlc/misc/taxi_zones.zip)

**Working with the OpenFreeMap Remote:**

```bash
# Compare local map implementation with OpenFreeMap upstream
git diff main openfreemap/main -- path/to/map/files

# View OpenFreeMap commit history for tile server updates
git log openfreemap/main --since="1 month ago" --pretty=format:"%h %s"

# Merge specific OpenFreeMap features (use with caution)
git cherry-pick <commit-hash>
```

**Sponsor OpenFreeMap:**
If this helps save on map hosting costs, consider [sponsoring on GitHub](https://github.com/sponsors/hyperknot).

🧹 Just Exploring?
No problem! If you were just checking things out and don’t need to keep this code:

- Simply delete your Spark.
- Everything will be cleaned up — no traces left behind.

📄 License For Spark Template Resources

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
