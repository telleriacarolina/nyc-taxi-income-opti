# AI-Powered Insights: NYC TLC Database Intelligence

This document outlines how AI and machine learning can leverage NYC TLC data sources to generate actionable insights for rideshare drivers.

## 📊 Data Sources Overview

### Primary Database: FHV Base Aggregate Report

**Source**: [NYC Open Data - FHV Base Aggregate Report](https://data.cityofnewyork.us/b7f2ea51-e357-4f19-90e9-e21657dcd6dd)  
**API Endpoint**: `https://data.cityofnewyork.us/resource/2v9c-2k7f.json`

**Dataset Structure:**

| Field | Type | Description |
|-------|------|-------------|
| `base_number` | String | TLC base license number (e.g., B02764) |
| `base_name` | String | Company name (e.g., "UBER USA, LLC") |
| `dba` | String | Doing Business As name |
| `month` | DateTime | Report month (YYYY-MM-DD) |
| `total_dispatched_trips` | Integer | Total trips dispatched |
| `unique_dispatched_vehicles` | Integer | Unique vehicles that completed trips |
| `unique_dispatched_drivers` | Integer | Unique drivers that completed trips |
| `total_trip_miles` | Float | Aggregate miles traveled |
| `total_trip_time` | Integer | Aggregate trip time (minutes) |
| `wav_dispatched_trips` | Integer | Wheelchair accessible vehicle trips |

**Coverage**: Monthly aggregates from 2015-present for 35+ FHV bases

### Secondary Sources

- **Trip-Level Data**: Individual trip records (Yellow, Green, FHV, HVFHS)
- **Taxi Zone Shapefiles**: Geographic boundaries for 265 NYC zones
- **Weather Data**: Historical weather conditions (external source)
- **Event Calendar**: NYC events, holidays, conventions (external source)

## 🤖 AI Analysis Capabilities

### 1. Market Intelligence

**Platform Performance Analysis**

```python
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

# Fetch base aggregate data
url = "https://data.cityofnewyork.us/resource/2v9c-2k7f.json"
params = {
    "$limit": 10000,
    "$where": "month >= '2023-01-01'",
    "$order": "month DESC"
}
response = requests.get(url, params=params)
df = pd.DataFrame(response.json())

# Platform mapping
platform_bases = {
    'Uber': ['B02764', 'B02617', 'B02598', 'B02682', 'B02765'],
    'Lyft': ['B02510', 'B02844'],
    'Via': ['B03136', 'B02800'],
    'Juno': ['B02914', 'B02907', 'B02835', 'B02864']
}

# Calculate platform metrics
df['platform'] = df['base_number'].apply(
    lambda x: next((k for k, v in platform_bases.items() if x in v), 'Other')
)

# Key performance indicators
platform_metrics = df.groupby(['platform', 'month']).agg({
    'total_dispatched_trips': 'sum',
    'unique_dispatched_drivers': 'sum',
    'unique_dispatched_vehicles': 'sum',
    'total_trip_miles': 'sum',
    'total_trip_time': 'sum'
}).reset_index()

# Calculate derived metrics
platform_metrics['trips_per_driver'] = (
    platform_metrics['total_dispatched_trips'] / 
    platform_metrics['unique_dispatched_drivers']
)
platform_metrics['avg_trip_miles'] = (
    platform_metrics['total_trip_miles'] / 
    platform_metrics['total_dispatched_trips']
)
platform_metrics['avg_trip_duration'] = (
    platform_metrics['total_trip_time'] / 
    platform_metrics['total_dispatched_trips']
)

print(platform_metrics.head())
```

**Insights Generated:**
- Which platform has highest trips per driver
- Average trip length by platform
- Market share trends over time
- Driver capacity utilization rates

### 2. Predictive Analytics

**Earnings Forecast Model**

```python
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import datetime

# Prepare time series features
df['month_dt'] = pd.to_datetime(df['month'])
df['year'] = df['month_dt'].dt.year
df['month_num'] = df['month_dt'].dt.month
df['quarter'] = df['month_dt'].dt.quarter
df['is_holiday_season'] = df['month_num'].isin([11, 12]).astype(int)
df['is_summer'] = df['month_num'].isin([6, 7, 8]).astype(int)

# Calculate trends
df = df.sort_values(['base_number', 'month_dt'])
df['trips_pct_change'] = df.groupby('base_number')['total_dispatched_trips'].pct_change()
df['drivers_pct_change'] = df.groupby('base_number')['unique_dispatched_drivers'].pct_change()

# Lag features (previous month performance)
df['trips_lag1'] = df.groupby('base_number')['total_dispatched_trips'].shift(1)
df['trips_lag3'] = df.groupby('base_number')['total_dispatched_trips'].shift(3)
df['trips_rolling_avg'] = df.groupby('base_number')['total_dispatched_trips'].transform(
    lambda x: x.rolling(window=3, min_periods=1).mean()
)

# Target: trips per driver (proxy for earnings potential)
df['target'] = df['total_dispatched_trips'] / df['unique_dispatched_drivers']

# Features for prediction
features = [
    'year', 'month_num', 'quarter', 'is_holiday_season', 'is_summer',
    'trips_pct_change', 'drivers_pct_change',
    'trips_lag1', 'trips_lag3', 'trips_rolling_avg',
    'unique_dispatched_vehicles', 'total_trip_miles'
]

# Train model
df_clean = df.dropna(subset=features + ['target'])
X = df_clean[features]
y = df_clean['target']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Mean Absolute Error: {mae:.2f} trips per driver")
print(f"R² Score: {r2:.3f}")

# Feature importance
importance_df = pd.DataFrame({
    'feature': features,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("\nTop factors affecting earnings potential:")
print(importance_df.head(10))
```

**Predicted Insights:**
- Expected trips per driver next month
- Best/worst months for earnings
- Impact of driver supply on individual earnings
- Seasonal earnings patterns

### 3. Optimization Recommendations

**Platform Selection AI**

```python
import pandas as pd
from datetime import datetime, timedelta

class PlatformOptimizer:
    def __init__(self, historical_data):
        self.data = historical_data
        self.current_month = datetime.now().replace(day=1)
        
    def calculate_efficiency_score(self, platform, timeframe='recent'):
        """Calculate platform efficiency score (0-100)"""
        if timeframe == 'recent':
            cutoff = self.current_month - timedelta(days=90)
        else:
            cutoff = self.current_month - timedelta(days=365)
            
        platform_data = self.data[
            (self.data['platform'] == platform) & 
            (self.data['month_dt'] >= cutoff)
        ]
        
        # Metrics (higher is better)
        trips_per_driver = (
            platform_data['total_dispatched_trips'].sum() / 
            platform_data['unique_dispatched_drivers'].sum()
        )
        avg_trip_miles = (
            platform_data['total_trip_miles'].sum() / 
            platform_data['total_dispatched_trips'].sum()
        )
        
        # Normalize to 0-100 scale
        # Baseline: 100 trips/driver/month = 50 points
        # Baseline: 5 miles/trip = 50 points
        trips_score = min(100, (trips_per_driver / 100) * 50)
        miles_score = min(100, (avg_trip_miles / 5) * 50)
        
        return {
            'platform': platform,
            'efficiency_score': trips_score + miles_score,
            'trips_per_driver': trips_per_driver,
            'avg_trip_miles': avg_trip_miles,
            'total_trips': platform_data['total_dispatched_trips'].sum(),
            'active_drivers': platform_data['unique_dispatched_drivers'].sum()
        }
    
    def recommend_platform(self, user_preferences=None):
        """Generate personalized platform recommendation"""
        platforms = ['Uber', 'Lyft', 'Via', 'Juno']
        scores = [self.calculate_efficiency_score(p) for p in platforms]
        scores_df = pd.DataFrame(scores).sort_values('efficiency_score', ascending=False)
        
        return scores_df
    
    def multi_platform_strategy(self, max_platforms=2):
        """Recommend optimal multi-platform strategy"""
        recommendations = self.recommend_platform()
        
        strategy = {
            'primary': recommendations.iloc[0]['platform'],
            'secondary': recommendations.iloc[1]['platform'] if max_platforms > 1 else None,
            'rationale': []
        }
        
        # Generate rationale
        primary = recommendations.iloc[0]
        strategy['rationale'].append(
            f"Primary platform {primary['platform']}: "
            f"{primary['trips_per_driver']:.1f} trips/driver/month, "
            f"{primary['avg_trip_miles']:.1f} miles/trip avg"
        )
        
        if max_platforms > 1:
            secondary = recommendations.iloc[1]
            strategy['rationale'].append(
                f"Secondary platform {secondary['platform']} for diversification: "
                f"{secondary['trips_per_driver']:.1f} trips/driver/month"
            )
        
        return strategy

# Usage
optimizer = PlatformOptimizer(platform_metrics)
recommendation = optimizer.multi_platform_strategy(max_platforms=2)

print("📊 Platform Recommendation:")
print(f"Primary: {recommendation['primary']}")
print(f"Secondary: {recommendation['secondary']}")
print("\nRationale:")
for reason in recommendation['rationale']:
    print(f"  • {reason}")
```

**Optimization Output:**
- Best platform for current market conditions
- Multi-platform diversification strategy
- Expected earnings differential
- Risk assessment (driver saturation)

### 4. Anomaly Detection

**Identify Market Shifts**

```python
from sklearn.ensemble import IsolationForest

# Prepare anomaly detection features
anomaly_features = [
    'trips_per_driver',
    'avg_trip_miles',
    'avg_trip_duration',
    'trips_pct_change',
    'drivers_pct_change'
]

# Detect anomalies
clf = IsolationForest(contamination=0.05, random_state=42)
df_clean = df[anomaly_features].dropna()
df_clean['anomaly'] = clf.fit_predict(df_clean)

# Flag unusual patterns
anomalies = df[df_clean['anomaly'] == -1].copy()
anomalies = anomalies.merge(
    df_clean.reset_index(),
    left_index=True,
    right_on='index'
)

print("🚨 Detected Market Anomalies:")
for _, row in anomalies.head(10).iterrows():
    print(f"  {row['month']} - {row['base_name']}")
    print(f"    Trips/driver: {row['trips_per_driver']:.1f}")
    print(f"    Change: {row['trips_pct_change']*100:.1f}%")
    print()
```

**Anomaly Alerts:**
- Sudden platform trip volume changes
- Driver saturation warnings
- Unusual trip patterns (potential data issues)
- Market disruption events

### 5. Demand Forecasting

**Geographic Demand Prediction**

```python
from sklearn.linear_model import Ridge
import geopandas as gpd

# Load taxi zone data
zones = gpd.read_file('taxi_zones.shp')

# Aggregate trips by zone (from trip-level data)
# Note: Requires FHV trip records with pickup/dropoff locations
trip_data = pd.read_parquet('fhv_tripdata_2024-01.parquet')

zone_demand = trip_data.groupby(['PULocationID', pd.Grouper(key='pickup_datetime', freq='H')]).size().reset_index()
zone_demand.columns = ['zone_id', 'hour', 'trip_count']

# Add temporal features
zone_demand['hour_of_day'] = zone_demand['hour'].dt.hour
zone_demand['day_of_week'] = zone_demand['hour'].dt.dayofweek
zone_demand['is_weekend'] = zone_demand['day_of_week'].isin([5, 6]).astype(int)
zone_demand['is_rush_hour'] = zone_demand['hour_of_day'].isin([7, 8, 9, 17, 18, 19]).astype(int)

# Train demand model per zone
def train_zone_model(zone_data):
    features = ['hour_of_day', 'day_of_week', 'is_weekend', 'is_rush_hour']
    X = zone_data[features]
    y = zone_data['trip_count']
    
    model = Ridge(alpha=1.0)
    model.fit(X, y)
    
    return model

zone_models = {}
for zone_id in zone_demand['zone_id'].unique():
    zone_data = zone_demand[zone_demand['zone_id'] == zone_id]
    if len(zone_data) > 100:  # Minimum data threshold
        zone_models[zone_id] = train_zone_model(zone_data)

print(f"Trained demand models for {len(zone_models)} zones")

# Predict next week's demand
def predict_next_week(zone_id, model):
    """Predict hourly demand for next 7 days"""
    future_hours = pd.date_range(
        start=datetime.now().replace(minute=0, second=0, microsecond=0),
        periods=168,  # 7 days * 24 hours
        freq='H'
    )
    
    predictions = pd.DataFrame({
        'hour': future_hours,
        'hour_of_day': future_hours.hour,
        'day_of_week': future_hours.dayofweek,
        'is_weekend': future_hours.dayofweek.isin([5, 6]).astype(int),
        'is_rush_hour': future_hours.hour.isin([7, 8, 9, 17, 18, 19]).astype(int)
    })
    
    predictions['predicted_trips'] = model.predict(
        predictions[['hour_of_day', 'day_of_week', 'is_weekend', 'is_rush_hour']]
    )
    predictions['zone_id'] = zone_id
    
    return predictions

# Generate predictions for top zones
top_zones = zone_demand.groupby('zone_id')['trip_count'].sum().nlargest(10).index
predictions_list = []

for zone_id in top_zones:
    if zone_id in zone_models:
        pred = predict_next_week(zone_id, zone_models[zone_id])
        predictions_list.append(pred)

all_predictions = pd.concat(predictions_list)

# Find peak hours
peak_hours = all_predictions.groupby(['zone_id', 'hour_of_day'])['predicted_trips'].mean().reset_index()
peak_hours = peak_hours.sort_values('predicted_trips', ascending=False)

print("\n📍 Highest Demand Times by Zone:")
print(peak_hours.head(20))
```

**Demand Insights:**
- Predicted busy hours by neighborhood
- Best zones to start shifts
- Real-time demand heatmaps
- Week-ahead demand forecast

## 🎯 AI-Powered Features for App

### Intelligent Shift Recommendations

```python
class ShiftOptimizer:
    """AI-powered shift time recommendations"""
    
    def __init__(self, driver_history, market_data, demand_forecast):
        self.driver_history = driver_history
        self.market_data = market_data
        self.demand_forecast = demand_forecast
    
    def recommend_shift_time(self, target_earnings=200, max_hours=8):
        """Find optimal shift start time"""
        
        # Analyze driver's historical performance by hour
        driver_performance = self.driver_history.groupby('start_hour').agg({
            'earnings': 'mean',
            'trips': 'mean',
            'hours_worked': 'mean'
        })
        
        # Weight by predicted demand
        recommendations = []
        for start_hour in range(24):
            end_hour = (start_hour + max_hours) % 24
            
            # Get demand forecast for this window
            window_demand = self.demand_forecast[
                (self.demand_forecast['hour_of_day'] >= start_hour) &
                (self.demand_forecast['hour_of_day'] < end_hour)
            ]['predicted_trips'].sum()
            
            # Historical earnings in this window
            historical_earnings = driver_performance.loc[start_hour, 'earnings'] if start_hour in driver_performance.index else 0
            
            # Score (combine history and forecast)
            score = (historical_earnings * 0.6) + (window_demand * 0.4)
            
            recommendations.append({
                'start_hour': start_hour,
                'end_hour': end_hour,
                'predicted_earnings': historical_earnings,
                'demand_score': window_demand,
                'overall_score': score
            })
        
        recommendations_df = pd.DataFrame(recommendations).sort_values('overall_score', ascending=False)
        
        return recommendations_df.head(5)

# Usage
optimizer = ShiftOptimizer(driver_trips, market_data, all_predictions)
recommendations = optimizer.recommend_shift_time(target_earnings=250, max_hours=8)

print("⏰ Recommended Shift Times:")
for _, rec in recommendations.iterrows():
    print(f"  {rec['start_hour']:02d}:00 - {rec['end_hour']:02d}:00")
    print(f"    Expected earnings: ${rec['predicted_earnings']:.2f}")
    print(f"    Demand score: {rec['demand_score']:.0f}")
    print()
```

### Real-Time Earnings Comparison

```python
def calculate_percentile_rank(driver_earnings, platform, timeframe='month'):
    """Show driver's earnings percentile vs all drivers on platform"""
    
    # Get platform aggregate data
    platform_data = market_data[
        (market_data['platform'] == platform) &
        (market_data['month_dt'] >= datetime.now() - timedelta(days=30))
    ]
    
    # Calculate average earnings (estimate)
    # Note: TLC data doesn't include earnings, so we estimate
    avg_trips_per_driver = (
        platform_data['total_dispatched_trips'].sum() / 
        platform_data['unique_dispatched_drivers'].sum()
    )
    
    # Assume $15 per trip average (adjust based on actual data)
    estimated_avg_earnings = avg_trips_per_driver * 15
    
    # Calculate percentile
    percentile = (driver_earnings / estimated_avg_earnings) * 50  # Normalized to 0-100
    percentile = min(100, max(0, percentile))
    
    return {
        'driver_earnings': driver_earnings,
        'platform_avg': estimated_avg_earnings,
        'percentile': percentile,
        'performance': 'Top 10%' if percentile >= 90 else 
                      'Above Average' if percentile >= 60 else
                      'Average' if percentile >= 40 else
                      'Below Average'
    }

# Display in app
comparison = calculate_percentile_rank(driver_earnings=3200, platform='Uber')
print(f"Your earnings: ${comparison['driver_earnings']:.2f}")
print(f"Platform average: ${comparison['platform_avg']:.2f}")
print(f"You're in the {comparison['percentile']:.0f}th percentile - {comparison['performance']}")
```

### Churn Risk Prediction

```python
from sklearn.ensemble import GradientBoostingClassifier

def predict_driver_churn_risk(driver_data, market_trends):
    """Predict if driver is at risk of quitting platform"""
    
    features = [
        'months_active',
        'avg_monthly_trips',
        'earnings_trend',  # Positive or negative slope
        'trips_per_hour',
        'platform_market_share_trend',
        'driver_saturation_rate',
        'earning_volatility'  # Standard deviation of monthly earnings
    ]
    
    # Train model (requires historical data with churn labels)
    # X_train, y_train = load_historical_churn_data()
    # model = GradientBoostingClassifier()
    # model.fit(X_train, y_train)
    
    # Predict for current driver
    # churn_probability = model.predict_proba(driver_features)[0][1]
    
    # Placeholder example
    churn_probability = 0.35  # 35% risk
    
    if churn_probability > 0.7:
        recommendation = "High churn risk - Consider platform switch or schedule optimization"
    elif churn_probability > 0.4:
        recommendation = "Moderate risk - Review earnings strategies"
    else:
        recommendation = "Low risk - Continue current approach"
    
    return {
        'churn_risk': churn_probability,
        'recommendation': recommendation
    }
```

## 📈 Advanced Analytics Queries

### API Query Examples

**Get last 12 months for specific base:**

```bash
curl "https://data.cityofnewyork.us/resource/2v9c-2k7f.json?\$where=base_number='B02764'%20AND%20month>='2023-01-01'&\$order=month%20DESC&\$limit=12"
```

**Compare Uber vs Lyft bases:**

```bash
# Uber bases
curl "https://data.cityofnewyork.us/resource/2v9c-2k7f.json?\$where=base_number%20IN('B02764','B02617','B02598')%20AND%20month>='2024-01-01'&\$limit=500"

# Lyft bases
curl "https://data.cityofnewyork.us/resource/2v9c-2k7f.json?\$where=base_number%20IN('B02510','B02844')%20AND%20month>='2024-01-01'&\$limit=500"
```

**Year-over-year comparison:**

```python
import requests

def fetch_yoy_comparison(base_number, year1, year2):
    """Compare same months across two years"""
    
    url = "https://data.cityofnewyork.us/resource/2v9c-2k7f.json"
    
    # Year 1 data
    params1 = {
        "$where": f"base_number='{base_number}' AND month>='{year1}-01-01' AND month<'{year1+1}-01-01'",
        "$order": "month",
        "$limit": 12
    }
    data1 = pd.DataFrame(requests.get(url, params=params1).json())
    
    # Year 2 data
    params2 = {
        "$where": f"base_number='{base_number}' AND month>='{year2}-01-01' AND month<'{year2+1}-01-01'",
        "$order": "month",
        "$limit": 12
    }
    data2 = pd.DataFrame(requests.get(url, params=params2).json())
    
    # Calculate YoY changes
    comparison = pd.DataFrame({
        'month': pd.to_datetime(data1['month']).dt.month_name(),
        f'trips_{year1}': data1['total_dispatched_trips'].astype(int),
        f'trips_{year2}': data2['total_dispatched_trips'].astype(int),
        'yoy_change_%': (
            (data2['total_dispatched_trips'].astype(float) - 
             data1['total_dispatched_trips'].astype(float)) / 
            data1['total_dispatched_trips'].astype(float) * 100
        )
    })
    
    return comparison

# Usage
yoy = fetch_yoy_comparison('B02764', 2023, 2024)
print(yoy)
```

## 🔮 Future AI Enhancements

### Planned Capabilities

1. **Natural Language Queries**
   - "Which platform has been growing fastest this year?"
   - "Should I switch from Uber to Lyft?"
   - "What time should I start my shift tomorrow?"

2. **Computer Vision Integration**
   - Analyze dashboard photos for expense tracking
   - Receipt scanning and categorization
   - Vehicle maintenance alerts from inspection photos

3. **Social Benchmarking**
   - Compare with similar drivers (anonymized)
   - Leaderboards for top earners
   - Achievement badges and milestones

4. **Predictive Maintenance**
   - Optimal vehicle replacement timing
   - Fuel cost optimization
   - Maintenance schedule recommendations

5. **Tax Optimization**
   - Real-time deduction tracking
   - Quarterly tax estimate calculator
   - Mileage categorization (business vs. personal)

## 🔐 Data Privacy & Ethics

### Privacy Safeguards

- **Aggregate Data Only**: FHV Base Aggregate Report contains no personally identifiable information
- **Anonymous Benchmarking**: Driver comparisons use statistical averages, not individual records
- **Local Processing**: Sensitive earnings data processed on-device when possible
- **Opt-In Analytics**: Users control what data is used for insights

### Ethical AI Principles

- **Transparency**: Explain how recommendations are generated
- **Fairness**: Avoid bias in platform recommendations
- **Accuracy**: Clearly label predictions vs. guaranteed outcomes
- **User Control**: Allow manual override of AI suggestions

## 📚 Additional Resources

- **NYC Open Data Portal**: [https://opendata.cityofnewyork.us/](https://opendata.cityofnewyork.us/)
- **TLC Data Dictionary**: [Official PDF Documentation](https://www1.nyc.gov/site/tlc/about/tlc-trip-record-data.page)
- **Socrata API Documentation**: [https://dev.socrata.com/](https://dev.socrata.com/)
- **Machine Learning for Time Series**: [Forecasting Best Practices](https://github.com/microsoft/forecasting)

## 🤝 Contributing

Have ideas for new AI-powered insights? Submit issues or pull requests to enhance the intelligence layer.

---

**Last Updated**: January 2026  
**Data Sources**: NYC TLC Open Data, FHV Base Aggregate Report API
