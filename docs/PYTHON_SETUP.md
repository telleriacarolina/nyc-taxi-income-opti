# 🐍 Python Development with uv

This project uses **uv**, a modern Rust-based Python toolchain for fast, reliable package management.

## What is uv?

uv provides:
- ⚡ **10–100× faster** than pip
- 📦 Dependency & project management
- 🐍 Python version pinning
- 🛠️ Tool execution without installation
- 🔄 Drop-in replacement for pip, pip-tools, venv

## Installation

**macOS / Linux:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Windows:**
```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**Alternative Methods:**
```bash
brew install uv              # Homebrew
pip install uv               # pip
winget install astral-sh.uv  # WinGet (Windows)
```

## Quick Start

### Python Version Management

```bash
# Install recommended Python
uv python install 3.13
uv python pin 3.13

# List available versions
uv python list

# Install multiple versions
uv python install 3.12
uv python install 3.11
```

### Project Setup

```bash
# Initialize project
uv init
uv sync

# Add dependencies
uv add pandas pyarrow requests

# Run scripts
uv run main.py
uv run script.py
```

### Virtual Environments

```bash
# Create virtual environment
uv venv

# Install packages
uv pip install pandas
uv pip install -r requirements.txt

# List installed packages
uv pip freeze
```

## Data Processing Setup

### Install Data Science Tools

```bash
uv add pandas pyarrow numpy polars
```

### Reading TLC Data

**Parquet (Recommended):**
```python
import pandas as pd

# Read NYC TLC trip data
trips = pd.read_parquet("fhv_tripdata_2024-01.parquet")

# Filter and process
manhattan_trips = trips[trips['PULocationID'].between(1, 263)]
```

**CSV:**
```python
import pandas as pd

trips = pd.read_csv("yellow_tripdata_2024-01.csv")
```

### Export for App

```python
# Export to CSV
rides.to_csv("app_format.csv", index=False)

# Export to Parquet (faster, smaller)
rides.to_parquet("app_format.parquet", index=False)
```

## Python Version Compatibility

### Recommended: Python 3.13

```bash
uv python install 3.13
uv python pin 3.13
```

### Python 3.14 Note

Some packages may not have wheels for Python 3.14 yet. If you encounter compatibility issues:

```bash
# Switch to Python 3.13
uv python pin 3.13

# Or allow pre-releases
uv pip install --prerelease=allow package-name

# Or use specific Python version for tools
uvx --python 3.13 tool-name
```

## Common Commands

### Running Scripts

```bash
uv run script.py              # Run Python script
uv run --python 3.13 script.py  # Use specific Python version
```

### Managing Dependencies

```bash
uv add requests               # Add dependency
uv remove requests            # Remove dependency
uv sync                       # Sync dependencies
uv lock                       # Update lockfile
```

### Tools

```bash
uvx ruff check .              # Run linter
uvx black .                   # Run formatter
uvx pytest                    # Run tests
uv tool install jupyter       # Install tool globally
```

### Virtual Environments

```bash
uv venv                       # Create venv
uv venv --python 3.13         # Create with specific Python
source .venv/bin/activate     # Activate (Linux/Mac)
.venv\Scripts\activate        # Activate (Windows)
```

## Data Processing Examples

### NYC TLC Data Pipeline

```python
import pandas as pd
from datetime import datetime

# Read parquet file
df = pd.read_parquet("fhv_tripdata.parquet")

# Transform for app
rides = pd.DataFrame({
    'platform': 'Uber',  # or extract from dispatching_base_num
    'date': df['pickup_datetime'].dt.date,
    'time': df['pickup_datetime'].dt.time,
    'pickupLocation': df['PULocationID'],
    'dropoffLocation': df['DOLocationID'],
    'distance': df['trip_miles'],
    'duration': (df['dropOff_datetime'] - df['pickup_datetime']).dt.total_seconds() / 60,
    'grossPay': df['base_passenger_fare'],
    'fees': df['tolls'] + df['bcf'] + df['sales_tax'],
    'netPay': df['base_passenger_fare'] - (df['tolls'] + df['bcf'] + df['sales_tax']),
    'tips': df['tips'],
    'vehicleType': df['hvfhs_license_num']
})

# Export
rides.to_csv("rides_import.csv", index=False)
```

### Zone Mapping

```python
import geopandas as gpd

# Read NYC taxi zones
zones = gpd.read_file("taxi_zones.shp")

# Lookup zone name
def get_zone_name(location_id):
    zone = zones[zones['LocationID'] == location_id]
    return zone['zone'].iloc[0] if not zone.empty else "Unknown"

# Add zone names to rides
rides['pickupZone'] = rides['pickupLocation'].apply(get_zone_name)
rides['dropoffZone'] = rides['dropoffLocation'].apply(get_zone_name)
```

## Jupyter Notebooks

```bash
# Install Jupyter
uv tool install jupyter

# Start notebook server
uvx jupyter notebook

# Or use JupyterLab
uv tool install jupyterlab
uvx jupyter lab
```

## Docker Integration

**Dockerfile with uv:**
```dockerfile
FROM python:3.13-slim

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Copy project files
WORKDIR /app
COPY . .

# Install dependencies
RUN uv sync --frozen

# Run app
CMD ["uv", "run", "main.py"]
```

## Troubleshooting

### Package Not Found

```bash
# Clear cache
uv cache clean

# Reinstall
uv sync --reinstall
```

### Python Version Issues

```bash
# Check current Python
uv python find

# List installed versions
uv python list

# Install and pin specific version
uv python install 3.13
uv python pin 3.13
```

### Virtual Environment Issues

```bash
# Remove and recreate venv
rm -rf .venv
uv venv
uv sync
```

## Resources

- **uv Documentation**: https://docs.astral.sh/uv/
- **NYC TLC Data**: https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page
- **Pandas Documentation**: https://pandas.pydata.org/docs/
- **PyArrow Documentation**: https://arrow.apache.org/docs/python/

---

**Last Updated**: January 2026
