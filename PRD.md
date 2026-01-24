# Planning Guide

A comprehensive driver management hub for NYC TLC (Taxi and Limousine Commission) drivers to track their license renewals, required documents, compliance deadlines, and optimize their earnings through data-driven insights.

**Experience Qualities**:

1. **Professional** - Clean, organized interface that inspires confidence and trust for managing critical licensing and earnings information
2. **Empowering** - Data-driven insights that help drivers maximize earnings and stay compliant with their licensing requirements
3. **Actionable** - Clear visual indicators and recommendations that guide drivers to make better decisions about when and where to drive

**Complexity Level**: Complex Application (advanced functionality with multiple views)
This is a multi-view application with document tracking, deadline management, shift logging, earnings analytics, pattern recognition, and personalized insights requiring sophisticated state management and data analysis.

## Essential Features

### NYC TLC Official Hub

- **Functionality**: Centralized access portal to all official NYC TLC systems, resources, and compliance tools with three main sections: Resource Directory (searchable catalog of official TLC links organized by category), Appointments Tracker (manage licensing, inspection, drug test, and compliance appointments with confirmation tracking and recurring reminders), and Reminders System (automated alerts for license expirations, vehicle registrations, and compliance deadlines with configurable notification intervals)
- **Purpose**: Simplify TLC compliance by providing one-stop access to LARS (licensing portal), license status checks, driver education, vehicle inspections, drug testing, appointments, forms, violations, hearings, and payments, while helping drivers stay organized with appointment tracking and automated deadline reminders to avoid penalties and maintain uninterrupted earning time
- **Trigger**: Navigate to NYC TLC tab in main navigation
- **Progression**: Open NYC TLC tab → View hub dashboard showing upcoming appointments count, active reminders count, and quick stats → Switch between three sections via tabs → Resource Directory: Browse 12+ official TLC resources organized by 11 categories (Licensing, Renewals, Inspections, Drug Testing, Appointments, Hearings, Violations, Payments, Education, Support), search by keyword or tag, view featured quick-access links (LARS, License Status, Appointments, Renewals), click any resource to open official TLC page in new tab → Appointments: Add TLC appointments by selecting type (License Renewal, Vehicle Inspection, Drug Test, Hearing, Education, DMV, Base Registration, Other), enter title, date, time, location, confirmation number, related TLC link, and notes, mark as recurring (annual/biannual/monthly), view upcoming appointments with countdown badges and status colors, edit or delete appointments, see past appointment history → Reminders: Create compliance reminders by selecting type (License Expiration, Vehicle Registration, Drug Test, Appointment, Custom), set target date, choose multiple reminder intervals (1/3/7/14/30/60/90 days before), configure notification methods (in-app, SMS coming soon, push coming soon), toggle reminders on/off, view next alert dates, see active vs inactive reminders, edit or delete reminders → All data persists using KV storage for reliability
- **Success criteria**: Driver can instantly access any official TLC system with one click from categorized resource directory, finds needed TLC services through search or category filtering, creates and tracks all TLC compliance appointments in one place with confirmation numbers and locations, sets up automated reminders for critical deadlines with multiple advance notice intervals, receives timely alerts before expirations to avoid penalties, manages appointment and reminder schedules efficiently without external tools, reduces missed deadlines and compliance violations through proactive notifications, maintains continuous earning eligibility by staying compliant with TLC requirements, and has confidence that all TLC-related tasks and deadlines are centrally organized and monitored

### AI Driver Assistant (Database-Powered)

- **Functionality**: Floating AI chat assistant that provides personalized advice powered by REAL-TIME NYC TLC Open Data APIs - fetches up to 3,000 recent HVFH trip records and 300+ base aggregate records to calculate live market statistics (average driver pay, tips, platform trips-per-driver) then uses this intelligence to answer driver questions with actual database numbers
- **Purpose**: Give drivers instant access to intelligent insights based on their actual data PLUS live NYC TLC database intelligence (current market averages, platform performance, top earning zones) - every response references real numbers from database queries (e.g., "Based on 3,000 recent trips, market average is $28.50/trip and Uber shows 145 trips/driver vs Lyft's 132")
- **Trigger**: Click floating AI button in bottom-right corner
- **Progression**: Click AI button → Chat window opens → User types question or selects suggested question ("How do my earnings compare to market averages?", "Which platform has best trips per driver?", "What are top earning pickup zones?", "Should I switch platforms based on TLC data?") → System fetches latest HVFH trip data (driver_pay, tips, zones) and Base Aggregate data (platform stats) from NYC TLC APIs → AI analyzes driver's data AND live database intelligence → Returns personalized answer citing ACTUAL NUMBERS from database ("Your $25/trip is below market avg of $28.50 based on 3,000 trips analyzed. Uber drivers averaging 145 trips/month vs your platform's 132.") → Conversation continues with context
- **Success criteria**: Driver receives data-driven answers within 5 seconds that reference REAL TLC database statistics with specific numbers, understands how their performance compares to live market benchmarks, gets platform recommendations based on actual trips-per-driver data, learns which zones perform best based on aggregated driver_pay from recent trips, and makes informed decisions using live market intelligence from NYC's official TLC databases

### AI-Powered Earnings Insights (Database-Powered)

- **Functionality**: Automatically generated insights analyzing driver's shift patterns while fetching REAL-TIME data from NYC TLC Open Data APIs (HVFH Trip Records API at data.cityofnewyork.us/resource/8wbx-tsch.json showing actual driver_pay, tips, and pickup zones, plus FHV Base Aggregate API at data.cityofnewyork.us/resource/2v9c-2k7f.json showing platform trips-per-driver statistics) to provide data-driven recommendations using live market intelligence
- **Purpose**: Surface actionable intelligence powered by REAL NYC TLC DATABASE DATA - fetching up to 5,000 recent trip records to calculate current market averages for driver pay per trip, average tips, top earning pickup zones by aggregated driver_pay, and platform performance metrics (trips per driver by platform) - then comparing driver's actual performance against these live market benchmarks to identify opportunities
- **Trigger**: Automatically generated when driver has 3+ shifts logged, refreshable on demand to fetch latest database stats
- **Progression**: System fetches last 3 months of HVFH trip data from TLC API → Calculates real market averages (avg driver_pay/trip, avg tips/trip, top zones by total driver_pay) → Fetches FHV Base Aggregate data to calculate trips-per-driver for each platform (Uber, Lyft, Via, Juno) → Analyzes driver's shift patterns (earnings, platform choice, start locations, timing) → Compares driver performance to database benchmarks → AI generates one specific recommendation referencing ACTUAL NUMBERS from database (e.g., "Market avg is $28.50/trip based on 5,000 trips analyzed - your $25/trip suggests relocating to Zone 161 where data shows $45+ pickups") → Displays in gradient card with refresh button → Updates with new database query on refresh
- **Success criteria**: Driver receives data-driven insight powered by REAL TLC database statistics with specific numbers cited (market averages, platform comparisons, zone performance), understands how their performance compares to live market benchmarks, gets actionable recommendations based on actual trip-level data showing which zones/platforms/times perform best in current market conditions, and can refresh to get latest database intelligence anytime

### Multi-Range Trend Analyzer

- **Functionality**: Advanced heatmap comparison tool allowing drivers to overlay multiple date ranges simultaneously on a single visualization to compare earnings patterns across different time periods, with color-coded bars for each date range showing location-based earnings side-by-side for direct trend analysis
- **Purpose**: Enable sophisticated temporal trend analysis by allowing drivers to visually compare how earnings at specific locations changed over different time periods (e.g., December vs January, Summer vs Winter, Pre-regulation vs Post-regulation), helping identify seasonal patterns, growth trends, declining locations, and optimal times to work different neighborhoods
- **Trigger**: Displayed below the Location Earnings Heatmap on Earnings Optimizer tab, becomes interactive when shifts with location data exist
- **Progression**: Driver clicks "Add Range" button → Overlay manager panel opens → Driver enters descriptive name for date range (e.g., "December 2024", "Summer Peak", "Post-Congestion Pricing") → Selects start and end dates from calendar picker → Chooses color from 8 preset options (blue, green, purple, orange, pink, teal, red, yellow) → Clicks "Add Overlay" → System filters shifts to date range, processes location earnings data → New colored bar appears in visualization for each location showing earnings during that period → Driver can add multiple overlays (unlimited) to compare many periods simultaneously → Each overlay shows as a stacked horizontal bar at each location with its chosen color → Legend at top shows all active overlays with their names and colors → Driver can toggle visibility of any overlay with eye icon (compare subsets without deleting) → Delete button removes overlay completely → Export button generates CSV with columns for each date range showing earnings by location for spreadsheet analysis → Empty state prompts driver to add first range, visual displays side-by-side bars when overlays active
- **Success criteria**: Driver can create and manage multiple date range overlays with custom names and colors, see all overlays simultaneously on a single chart for direct visual comparison, quickly identify which locations had higher or lower earnings in different time periods, toggle specific overlays on/off to focus comparisons without losing data, understand seasonal patterns and trends by comparing summer vs winter or month-over-month, identify locations that are growing or declining in profitability over time, export complete multi-range comparison data to CSV with each date range as a separate column for advanced analysis, make strategic decisions about where to work based on historical trends showing which areas are improving or deteriorating, and preserve all overlay configurations using persistent storage for future reference

### Location Earnings Heatmap

- **Functionality**: Interactive visual heatmap displaying earnings by start location with dual view modes - a bar chart view with color-coded bars showing earnings intensity, and an interactive map view using OpenFreeMap tiles showing pickup locations on a real NYC map with earnings markers, plus comprehensive export capabilities for both data analysis and presentation purposes
- **Purpose**: Provide immediate visual insight into geographic earnings patterns through both statistical (chart) and spatial (map) visualizations, helping drivers identify their most profitable starting locations at a glance with real geographic context, and enable detailed offline analysis through export functionality
- **Trigger**: Automatically displayed on Earnings Optimizer tab when 1+ shifts have start location data
- **Progression**: System aggregates all shifts by start location → Calculates total earnings, trips, hours, and hourly rate per location → Chart View: Renders horizontal bar chart with color gradient from light to dark blue based on earnings intensity, displays location names on left, earnings bars in center, dollar amounts on right → Map View: Displays interactive OpenFreeMap showing NYC with custom markers at pickup locations, marker size/color reflects earnings, click marker to see details → On hover/click, shows detailed stats for selected location including earnings, hourly rate, trips, shifts, and percentage of total earnings → Top stats cards show best performing location, highest hourly rate, and number of tracked locations → Toggle between Chart and Map views via tabs → Export dropdown offers two options: "Export as CSV" downloads comprehensive spreadsheet with all location metrics (earnings, trips, hours, hourly rates, shift counts, averages) for analysis in Excel/Google Sheets, and "Export Chart as Image" converts the current bar chart visualization to PNG image for reports and presentations → Date range filter allows exporting specific time periods
- **Success criteria**: Driver can instantly see which start locations generate the most earnings through both color-coded bar chart and geographic map visualization, interact with locations in either view for detailed breakdown, understand the spatial distribution of their high-earning zones across NYC, identify patterns in their most profitable pickup areas for strategic positioning decisions, export complete location earnings data to CSV for tax preparation or detailed spreadsheet analysis, and export the heatmap chart as a high-quality PNG image for sharing with accountants, partners, or creating performance reports

### Location History Heatmap

- **Functionality**: Interactive frequency-based heatmap showing where the driver has driven most frequently based on historical shift data, with color-coded intensity overlay on OpenFreeMap visualization, detailed frequency breakdown showing percentage distribution across all locations, and smart insights analyzing driving patterns
- **Purpose**: Help drivers understand their geographic driving patterns and frequency distribution to identify whether they're overconcentrating in certain zones or maintaining healthy diversity across profitable neighborhoods, revealing habits and patterns that may not be obvious from earnings data alone
- **Trigger**: Automatically displayed on Earnings Optimizer tab when 1+ shifts have start location data, appears below Location Earnings Heatmap
- **Progression**: System analyzes all shifts with start location data → Counts frequency of shifts starting from each location → Calculates percentage distribution across all zones → Displays summary stats showing most frequent location, total unique zones, total tracked shifts, and average shifts per location → Renders interactive OpenFreeMap with frequency-based heatmap overlay (blue=rare, green=occasional, yellow=frequent, red=very frequent) → Toggle heatmap overlay on/off with switch → Color legend shows frequency intensity scale from rare to very frequent → Detailed frequency breakdown lists all locations ranked by frequency with visual progress bars, shift counts, and percentage of total → Top location highlighted in warning color → Pattern insights card analyzes concentration (e.g., "67% of your shifts start in Midtown") → Shows top 3 location concentration percentage → Provides diversity feedback when driver operates across 5+ zones → All visualizations use warm warning colors (yellow/orange) to distinguish from earnings-focused blue theme
- **Success criteria**: Driver can instantly see which locations they start from most frequently through color-coded heatmap intensity, understand their geographic concentration patterns (e.g., whether 80% of shifts are in one zone vs evenly distributed), see ranked frequency breakdown with percentages for all zones, identify if they have healthy geographic diversity (5+ zones) or are overconcentrated in 1-2 areas, receive insights about their top zones' share of total shifts, compare frequency patterns against earnings patterns from Location Earnings Heatmap to see if high-frequency zones are also high-earning zones, and use this data to make strategic decisions about diversifying into new neighborhoods or doubling down on proven zones

### Time-Based Earnings Heatmap

- **Functionality**: Interactive visual grid heatmap displaying earnings intensity by day of week and hour of day with color-coded cells showing average earnings per hour, top 5 best earning hours analysis, and comprehensive export capabilities for data analysis and reporting
- **Purpose**: Help drivers identify their peak earning hours throughout the week to optimize their work schedule, understand which specific day/hour combinations generate the highest income, and export this temporal data for strategic planning and analysis
- **Trigger**: Automatically displayed on Earnings Optimizer tab when 3+ shifts have been logged with time data
- **Progression**: System analyzes all shifts with start/end times → Calculates average earnings per hour for each day-hour combination → Renders 7x24 grid heatmap (7 days × 24 hours) with color intensity representing earnings levels (light blue = low, dark blue = high, gray = no data) → Each cell represents one hour on one day → Hover shows exact earnings amount and hour label → Color legend shows earnings intensity scale from minimum to maximum → Top 5 section displays the five highest-earning day/hour combinations with specific values (e.g., "Thu 7pm - $45/hr") → Export dropdown offers two options: "Export as CSV" downloads complete 7-day × 24-hour matrix with earnings values for each cell for analysis in spreadsheet software, and "Export as Image" converts the entire heatmap visualization to PNG image with title, legend, and labels for presentations and reports → All data persists and updates as new shifts are logged
- **Success criteria**: Driver can visually identify their peak earning hours at a glance through color intensity, understand which specific days and times generate the best income (e.g., Friday evenings vs Monday mornings), see their top 5 most profitable hour slots ranked by earnings, identify gaps or low-performing time periods to avoid or improve, export the complete hourly earnings matrix to CSV for detailed spreadsheet analysis and pattern identification, and export the heatmap visualization as a professional image for reports, presentations, or sharing with partners/accountants

### Veteran Location & Timing Insights

- **Functionality**: AI-powered recommendations on optimal locations and time periods throughout the day and year for experienced NYC TLC drivers, focused on hitting 2025 target of $300/day with quality rides, enhanced with NYC TLC Trip Record Data (millions of historical trip records showing high-fare zones, peak demand times, and average fares by neighborhood) combined with NYC DOT real-time data feeds integration
- **Purpose**: Leverage veteran driver knowledge, NYC traffic patterns, historical TLC trip data patterns (pickup/dropoff zones, fare amounts, trip distances, time-of-day patterns), and real-time NYC DOT data (traffic speeds, construction alerts, planned events, parking data) to guide drivers to high-earning locations at the right times where rides consistently hit $35+ averages based on historical TLC records while avoiding congestion using DOT feeds
- **Trigger**: Click "Generate" button in Veteran Driver Insights card on Earnings tab
- **Progression**: Click generate → AI analyzes NYC geography, commute patterns, events, seasons, and references both TLC Trip Record Data (<https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page>) showing historical high-fare zones and peak times AND NYC DOT data feeds (<https://www.nyc.gov/html/dot/html/about/datafeeds.shtml>) for traffic optimization → Returns 4 daily time-based location insights backed by TLC historical fare data with expected earnings supporting $300/day goal plus specific NYC DOT data usage tips → Returns 3 seasonal strategy insights with priority locations proven to generate premium fares in TLC records and traffic management recommendations → Displays in organized cards with times, locations (backed by TLC data patterns), reasons citing historical fare averages, earnings estimates, and actionable NYC DOT data tips → Can refresh for updated recommendations with current time/date context
- **Success criteria**: Driver receives specific neighborhood recommendations for 4 times of day plus 3 seasonal strategies, each backed by actual TLC Trip Record Data patterns showing these locations consistently produce high fares, with actionable location advice supported by historical trip records, earnings expectations aligned with 2025 targets based on TLC data averages, and practical guidance on using NYC DOT real-time data feeds for traffic optimization and efficient route planning to reach high-fare zones

### Traffic Pattern Comparison by Time of Day

- **Functionality**: AI-powered analysis comparing traffic conditions, earnings potential, and demand patterns across five distinct time slots throughout the day (Early Morning 5AM-9AM, Midday 9AM-4PM, Evening Rush 4PM-8PM, Night 8PM-2AM, Late Night 2AM-5AM) with separate weekday and weekend patterns
- **Purpose**: Help drivers strategically choose when to work by understanding how traffic congestion, trip volume, earnings potential, and hot zones vary throughout the day, enabling them to maximize earnings while minimizing time wasted in traffic
- **Trigger**: Automatically displayed on Earnings Optimizer tab, refreshable on demand, toggle between weekday and weekend patterns
- **Progression**: Component loads → Driver selects weekday or weekend mode → AI analyzes typical NYC traffic and demand patterns for selected day type → Generates detailed comparison for 5 time slots showing average speed, congestion level, estimated hourly earnings, trip volume, average trip time, and 3 hot zone neighborhoods → Displays color-coded cards with metrics, hot zones as badges, and specific actionable recommendations for each time period → Highlights best earnings time and heaviest traffic time in summary cards → Driver can refresh for updated patterns → Use insights to plan optimal work schedule
- **Success criteria**: Driver can instantly compare all time periods side-by-side, identify the most profitable hours with least congestion, learn which neighborhoods are hotspots during each period, understand weekday vs weekend differences, and receive specific actionable advice for timing their shifts to maximize earnings while minimizing traffic delays

### Real-Time Traffic Alerts & Hotspot Notifications

- **Functionality**: Intelligent notification system monitoring traffic conditions, high-earning zones, incidents, and earning opportunities with customizable alert preferences and real-time notifications
- **Purpose**: Keep drivers informed about changing conditions throughout their shift so they can make proactive decisions about where to position themselves, which routes to avoid, and which opportunities to pursue without constantly checking multiple data sources
- **Trigger**: Automatically displayed on Earnings Optimizer tab, generates periodic alerts every 2 minutes based on enabled notification types, initial alerts load on component mount
- **Progression**: Component loads → Displays 4 notification toggle switches (Traffic Alerts for congestion, Hotspot Notifications for high-demand zones, Incident Alerts for accidents/closures, Opportunity Alerts for surge pricing) → Driver enables/disables alert types based on preferences → System automatically generates realistic NYC-specific alerts using AI every 2 minutes for enabled types → New alerts appear at top of scrollable feed with unread badge → Alert card shows type icon (traffic sign/trend up/warning/lightning), severity color coding (low green/medium yellow/high red), title, detailed message, specific NYC location, and timestamp → Desktop users see toast notification popup for new alerts while app is visible → Driver can mark individual alerts as read, delete specific alerts, mark all as read, or clear entire feed → Test Alert button generates on-demand sample alert → Unread count badge shows number of new alerts → Read alerts display with reduced opacity but remain accessible → Alerts persist across sessions in KV storage
- **Success criteria**: Driver receives timely notifications about traffic congestion on specific corridors (FDR, BQE), high-demand hotspots with surge pricing in specific neighborhoods (Midtown, JFK), road incidents affecting their routes, and premium earning opportunities (airport runs, event-driven demand), can customize which alert types they want to receive, sees clear visual distinction between alert severity levels, gets actionable location-specific information in each alert, can manage alert history by marking as read or clearing old notifications, and maintains awareness of changing conditions without manually refreshing multiple data views

### Real-Time Traffic Overlay

- **Functionality**: Live NYC DOT traffic intelligence displaying real-time traffic speeds and incident data across all five boroughs with interactive map visualization and borough filtering
- **Purpose**: Help drivers avoid congestion, plan optimal routes to high-earning zones, and stay informed about construction, accidents, events, and road closures that impact driving efficiency
- **Trigger**: Automatically displayed on Earnings Optimizer tab, refreshable on demand
- **Progression**: Component loads → AI generates realistic NYC DOT-style traffic data for major corridors (FDR Drive, West Side Highway, BQE, LIE, Major Deegan, Cross Bronx, etc.) → Displays current average speeds, travel time indices, and congestion status → Shows active incidents (construction, accidents, planned events, closures) with severity levels → Borough filter buttons allow focusing on specific areas → Traffic Speeds tab shows speed data with status-coded badges (free-flow/moderate/congested/severe) on interactive OpenFreeMap → Incidents tab shows construction and events with impact descriptions and timelines → Refresh button generates updated data reflecting current time patterns → Summary cards show citywide average speed, congestion count, active incidents, and corridors tracked
- **Success criteria**: Driver sees real-time traffic conditions across NYC with average speeds by corridor, identifies congested areas to avoid, learns about active construction and road closures, can filter by borough for focused planning, and receives actionable tips on using traffic intelligence to reach high-earning zones efficiently

### Weather Impact Analysis

- **Functionality**: Comprehensive weather data overlay showing current conditions, seasonal patterns, and AI-powered analysis of how different weather scenarios impact rideshare demand and earnings, with detailed driver tips for optimizing performance in each weather condition
- **Purpose**: Help drivers understand seasonal earnings patterns, anticipate demand changes based on weather conditions, and make strategic decisions about when to work based on weather forecasts to maximize earnings throughout the year
- **Trigger**: Automatically displayed on Earnings Optimizer tab below Traffic Overlay, with current weather generated on load and AI-powered impact analysis available on demand
- **Progression**: Component loads → Generates realistic current weather based on current season (temperature, feels-like temp, precipitation, wind, visibility) → Displays current weather card with condition icon and temperature → Shows precipitation, wind speed, and visibility metrics → Calculates demand impact multiplier based on conditions (+25-40% for rain/snow, -10-15% for extreme heat, stable for mild weather) → Weather Impacts tab: Driver clicks refresh → AI generates 5 different weather scenario analyses (Heavy Rain, Snow Storm, Extreme Heat, Clear & Mild, Fog) → Each scenario shows demand change percentage, earnings impact per hour, fare multiplier (e.g., 1.3x for snow), ride volume change description, and 3 specific actionable tips for drivers → Seasonal Patterns tab: Driver selects season (Spring/Summer/Fall/Winter) → Displays seasonal overview card with month range, demand multiplier, average temperature, precipitation, and wind speed → Shows top weather conditions for selected season as badges → Provides seasonal earnings strategy specific to that time of year → All data refreshable on demand
- **Success criteria**: Driver sees current weather conditions with demand impact estimate, understands how 5 different weather scenarios affect earnings with specific dollar-per-hour impacts and fare multipliers, receives 3 actionable driver tips for each weather condition (e.g., "Position near transit hubs during heavy rain", "Focus on airport runs during snow"), can explore seasonal patterns for all four seasons with historical averages and demand multipliers (winter 1.35x, fall 1.15x, spring 1.1x, summer 0.95x), learns seasonal strategies for maximizing earnings (e.g., winter: focus on severe weather days and late-night shifts, summer: target evening entertainment districts), and makes informed decisions about working specific shifts based on weather forecasts and historical patterns showing which conditions drive highest demand

### Historical Weather Pattern Analysis

- **Functionality**: Comprehensive analysis tool that examines historical earning patterns across different weather conditions, showing which weather types produce the best earnings with detailed breakdowns by month, day of week, and top performing days ranked by earnings
- **Purpose**: Enable drivers to identify their most profitable weather conditions based on actual historical performance, understand seasonal earnings patterns across different weather types, and strategically plan their work schedule to maximize earnings by working during high-demand weather conditions
- **Trigger**: Automatically displayed on Earnings Optimizer tab below Weather Overlay, AI-powered pattern generation triggered on demand
- **Progression**: Component loads → Driver clicks "Generate" button → AI analyzes historical patterns and generates 6 weather pattern categories (Heavy Rain, Snow Storm, Clear & Mild, Extreme Heat, Light Rain, Fog/Overcast) → Each pattern displays comprehensive metrics: average daily earnings, average hourly rate, total days tracked, best/worst day of week performance, earnings range (min-max), demand multiplier, 3 specific driver strategies, and monthly breakdown showing performance across 4-6 months → Summary cards highlight best weather type for earnings (highest avg daily) and lowest earning weather type with comparison → Filter tabs allow viewing all weather or filtering by Rain/Snow/Clear → Weather Pattern Analysis section shows detailed cards for each weather type with color-coded intensity bars for monthly performance → Top Earning Days section displays ranked list of top 10 best earning days filtered by selected weather type, showing date, day of week, earnings, hourly rate, trips, with top 3 highlighted with special colors → All data persists across sessions for long-term tracking
- **Success criteria**: Driver can generate comprehensive historical weather pattern analysis with 6 distinct weather categories, see average daily earnings and hourly rates for each weather type ranging from $180-$450, understand which days of the week perform best in each weather condition, view earnings ranges showing volatility and consistency, receive 3 actionable strategies specific to each weather type, analyze monthly performance trends showing which months had the best/worst earnings for each weather, filter analysis by weather type (all/rain/snow/clear) to focus on specific conditions, view top 10 best earning days ranked and filtered by weather type with full financial details, compare best vs worst weather conditions side-by-side in summary cards showing demand multipliers and average earnings, and make strategic decisions about which weather conditions to prioritize for working based on proven historical earning patterns


### Optimal Positioning Map

- **Functionality**: Real-time interactive map showing optimal driver positioning zones based on NYC TLC Trip Record Data with AI-powered analysis of high-earning neighborhoods by time of day
- **Purpose**: Guide drivers to position themselves in locations that historically produce the highest fares and trip volume based on millions of TLC trip records, with dynamic recommendations adjusting for time of day and current conditions
- **Trigger**: Automatically displayed on Earnings Optimizer tab, refreshable on demand, time period selection via tabs
- **Progression**: Component loads → Driver selects time period (Right Now, Morning, Midday, Evening, Night) → AI analyzes TLC Trip Record Data patterns for that time period including average fares by pickup zone, historical demand patterns, and traffic conditions → Generates 5-7 hot zones with specific neighborhood names, coordinates, expected earnings, demand levels, and traffic status → Displays top 3 zones in summary cards → Interactive map view shows all hot zones with markers sized by earning potential → List view provides detailed breakdown with average fares, rides per hour, demand level, traffic conditions, and peak times → Each zone includes reasoning based on TLC historical data patterns → Refresh updates recommendations based on current time → Driver can toggle between map visualization and detailed zone information
- **Success criteria**: Driver receives specific neighborhood recommendations for optimal positioning with data-backed earnings estimates, understands which zones offer best combination of high fares and ride volume for current time period, can visualize zones geographically on map with clear markers, and gets actionable advice on where to stage between rides to maximize earnings based on TLC Trip Record Data showing historical pickup location performance

### Route Planner

- **Functionality**: AI-powered route planner that generates optimal paths connecting 3-5 high-earning zones in strategic sequences, with detailed stop-by-stop guidance showing expected earnings, timing, and demand patterns
- **Purpose**: Help drivers maximize efficiency by following pre-planned routes between hot zones rather than randomly moving around the city, reducing downtime and ensuring consistent ride flow throughout their shift
- **Trigger**: Automatically displayed on Earnings Optimizer tab below Optimal Positioning Map, time period selection updates routes
- **Progression**: Component loads → Generates 3 optimal routes for selected time period (Morning/Midday/Evening/Night) → Each route displays name, route type, total distance, total time, estimated earnings, and number of stops → Driver clicks route card to view details → Detail view shows interactive map with numbered stop markers and polyline path → Stop Details tab shows sequenced list of neighborhoods with average fares, expected rides per hour, estimated time at each stop, demand levels, and strategic reasoning → Each stop displays estimated earnings calculation → Route strategy card explains the logic behind the sequence → Driver can switch time periods to see different optimal routes → Refresh button regenerates routes with updated AI analysis
- **Success criteria**: Driver receives 3 distinct route options connecting high-earning neighborhoods in logical geographic sequences, can visualize the complete path on an interactive map, understands timing and earnings potential for each stop, sees total estimated earnings and ride count for the complete route, and gets strategic guidance on why stops are sequenced in that specific order based on TLC historical data and traffic patterns

### Weather-Based Route Recommendations

- **Functionality**: Intelligent route optimization system that combines real-time weather data (temperature, precipitation, visibility, advisories) with traffic conditions (congestion levels, average speeds, incident counts) to generate 3 specialized route strategies optimized for current conditions, with detailed stop-by-stop scoring for weather impact, traffic accessibility, and demand patterns
- **Purpose**: Help drivers adapt their routing strategy to current weather and traffic conditions by understanding which zones benefit most from weather-driven demand (rain/snow increases demand near transit), which areas have accessible traffic despite congestion, and how to balance weather opportunity with traffic efficiency for maximum earnings
- **Trigger**: Automatically displayed on Earnings Optimizer tab below Weather Overlay, refreshable on demand to fetch latest conditions
- **Progression**: Component loads → AI generates realistic current weather (type, temperature, precipitation %, visibility) and traffic conditions (congestion level, avg speed, incident count, affected areas) → Displays current conditions summary with weather icon, temperature, precipitation, visibility in one card and traffic congestion level, avg speed, incidents in another card → Generates 3 optimized route strategies accounting for BOTH weather and traffic: (1) Weather-Focused Route prioritizing high weather-driven demand zones (e.g., transit hubs during rain), (2) Traffic-Avoiding Route maximizing efficiency by routing around congested areas, (3) Balanced Route optimizing combination of weather opportunity and traffic flow → Each route shows 3-4 strategic stops with individual scores for weatherScore (1-10, how weather boosts demand), trafficScore (1-10, accessibility rating), demandScore (1-10, overall demand) → Driver selects any route card to view details → Map tab displays interactive OpenFreeMap with numbered markers at each stop → Stops tab shows detailed breakdown of each stop with stop name, borough, coordinates, weather/traffic/demand scores, expected earnings per hour, strategic reasoning citing weather/traffic factors, and specific warnings array (e.g., "Heavy traffic", "Poor visibility", "Road closures") → Tips tab displays route recommendations (3 actionable tips customized for current weather/traffic conditions), weather advisories if severe conditions exist, and earnings potential explanation → Each route includes metadata: weatherOptimized boolean, trafficOptimized boolean, totalDistance (miles), estimatedTime (minutes), estimatedEarnings (dollars), riskLevel (low/medium/high based on conditions) → Risk level displayed with color-coded badge → Refresh button re-analyzes with updated weather/traffic data
- **Success criteria**: Driver sees current weather conditions (type, temp, precipitation, visibility) and traffic conditions (congestion, speed, incidents) in clear summary cards, receives 3 distinct route strategies each optimized for different priorities (weather opportunity vs traffic avoidance vs balanced), understands how each stop performs across 3 dimensions with numeric scores (weather impact 1-10, traffic accessibility 1-10, demand level 1-10), sees specific warnings for each stop highlighting risks like heavy traffic or poor visibility, gets route-specific recommendations that account for current conditions (e.g., "Position near subway stops during heavy rain for +40% demand"), understands overall route risk level (low/medium/high) based on weather severity and traffic congestion, can visualize all stops on interactive map with earnings markers, and receives actionable intelligence on balancing weather-driven earnings opportunities against traffic efficiency challenges to maximize hourly income in current conditions

### Location-Based Route Generator

- **Functionality**: Generate optimized routes starting from driver's current GPS location using browser geolocation API with comprehensive permission management, showing 4-stop route with strategic neighborhood recommendations, travel times, distance calculations, expected earnings, and demand levels for each stop based on real-time position
- **Purpose**: Enable drivers to get instant, actionable route guidance customized to their exact current location rather than generic city-wide recommendations, maximizing relevance and reducing initial positioning time
- **Trigger**: Displayed on Rides tab, automatically requests location permission on component mount, generates route on button click after location is obtained
- **Progression**: Component loads → Automatically requests browser geolocation permission (first-time users see browser permission prompt) → If granted: Displays current coordinates with map showing position → Driver clicks "Generate Route" → AI fetches current location coordinates → Analyzes time of day, day of week (weekday/weekend), and hour to determine demand patterns → Queries NYC TLC data for nearby high-earning zones within 1-3 miles → Generates 4-stop route optimized for proximity, demand patterns, traffic flow, and earnings potential → Displays route name, type (e.g., "Proximity Loop", "Demand Chase"), estimated total earnings, distance, and time → Shows interactive map with starting position marker and 4 numbered stop markers → Lists each stop with zone name, coordinates, distance from previous point, travel time, average fare, demand level (high/medium/low), expected rides, and strategic reason for inclusion → Calculates total route distance, time, and earnings projection → If permission denied: Shows alert with browser-specific instructions to enable location (Chrome: click lock icon, Firefox: permissions panel, Safari: preferences, Edge: permissions menu) → Displays privacy notice explaining location is processed locally and never stored on servers → Refresh location button allows updating position
- **Success criteria**: Driver's location is automatically detected within 5 seconds when permission is granted, sees precise current coordinates on map, receives customized 4-stop route based on exact starting position, understands how to enable location if initially denied with clear browser-specific instructions, knows their location data is private and processed locally, can generate new routes as they move around the city, and gets hyper-relevant recommendations that account for their current neighborhood and proximity to demand zones

### Location Permission Configuration

- **Functionality**: Comprehensive location permissions management system with real-time permission state monitoring, browser-specific enablement instructions, location accuracy settings, timeout configuration, location testing tools, and privacy information, accessible from a dedicated Settings tab
- **Purpose**: Provide drivers with complete control over location-based features, ensure they understand privacy implications, troubleshoot location issues, and optimize location settings for their device and driving patterns
- **Trigger**: Navigate to Settings tab, or displayed inline when location features require permission
- **Progression**: Settings tab opens → Location Permission Config section displays current permission state (checking/prompt/granted/denied/unavailable) with color-coded status card → If prompt: "Enable Location Access" button requests permission → Browser shows native geolocation prompt → If granted: Shows green "Location Access Enabled" card with features list (generate routes, real-time insights, nearby hotspots, traffic alerts) → Refresh Status button verifies current state → If denied: Shows red "Location Access Denied" card with detailed browser-specific instructions (Chrome: lock icon > Location > Allow, Firefox: lock icon > More info > Permissions, Safari: Preferences > Websites > Location, Edge: lock icon > Permissions) → Privacy & Security alert explains local processing and no external storage → Location Accuracy section shows toggles for High Accuracy Mode (GPS vs battery saving), Cache Location Data (temporary storage for battery), Location Timeout slider (5-30 seconds), Maximum Location Age slider (0-5 minutes) → Test Location Access section with "Test Location" button → Click test → Retrieves position using current settings → Displays detailed results card with latitude, longitude, accuracy (meters), timestamp, altitude, speed → Shows error-specific messages for timeout/unavailable/denied → Clear Cache button removes cached position → About Location Data section lists 4 privacy principles with shield icons (processed locally, never stored externally, used only for routes/insights, revocable anytime) → All settings persist using useKV storage → Permission state changes trigger callbacks
- **Success criteria**: Driver sees real-time location permission status with clear visual indicators, can request permission with one click when needed, receives browser-specific step-by-step instructions if permission is denied, understands exactly how their location data is used and protected, can configure location accuracy mode based on battery vs precision preference, adjusts timeout and cache settings to optimize for their device and network, tests location access to verify settings work and see detailed position data (coordinates, accuracy, speed), troubleshoots location issues with specific error messages and remediation steps, and maintains full control over all location settings with persistent preferences across sessions

### Daily Schedule Planner

- **Functionality**: Comprehensive schedule planner with custom routes optimized for different times of day, featuring 5 distinct time blocks (Early Morning 5-9AM, Midday 9AM-4PM, Evening Rush 4-8PM, Night 8PM-2AM, Late Night 2AM-5AM), 5 pre-built full-day route strategies, ability to create, save, and customize favorite daily schedules with personal notes, and recurring schedule templates that can be assigned to specific days of the week (Monday-Sunday) for consistent weekly planning
- **Purpose**: Enable drivers to plan their entire day strategically by understanding earnings potential, demand patterns, traffic conditions, and optimal positioning zones for each time period, with ready-to-follow route templates that maximize earnings while minimizing downtime, plus the flexibility to create and save their own custom schedules based on personal preferences and work patterns, and assign specific schedules to specific days of the week for a complete weekly work routine
- **Trigger**: Automatically displayed on Earnings Optimizer tab below Route Planner, toggles between Time Blocks view, Templates (Full Day Routes) view, My Schedules (favorites) view, and Weekly Plan view
- **Progression**: Component loads → Driver selects Time Blocks, Templates, My Schedules, or Weekly Plan tab → Time Blocks: View all 5 time periods with earnings targets, expected rides, key zones, and platform recommendations → Click any time block card to see detailed breakdown with priority zones, interactive map, traffic status, average fares, demand levels, and strategic tips → Templates: View 5 pre-planned daily schedules combining multiple time blocks (Full Day Maximizer, Split Shift Strategy, Night Owl Premium, Steady Day Shift, Weekend Warrior) → Mark any template as favorite with star button → Click route card to see complete schedule breakdown → My Schedules: View all custom schedules and favorited templates → Click "Create Schedule" button → Enter schedule name, description, and personal notes → Select time blocks to include → See real-time earnings/hours/rides summary → Save custom schedule → Edit or delete custom schedules → Mark custom schedules as favorites → All favorite schedules (custom and templates) persist between sessions → Weekly Plan: View calendar-style weekly layout showing Monday through Sunday → Each day shows currently assigned schedule (if any) → Click any day to select a schedule from all available schedules (templates + custom) or mark as day off → Quick assign buttons for common patterns (weekday schedule to Mon-Fri, weekend schedule to Sat-Sun) → See weekly totals for projected earnings, hours, and rides → Clear individual day assignments or clear entire week → Weekly schedule assignments persist across sessions
- **Success criteria**: Driver can browse 5 distinct time periods with specific neighborhood recommendations and earnings targets for each, view 5 complete daily route templates showing how to combine time blocks for maximum earnings, mark any template as a favorite for quick access, create unlimited custom schedules by selecting their preferred time blocks with personalized names and notes, edit existing custom schedules to adjust time blocks or update notes, delete custom schedules they no longer need, view all their favorite schedules (both custom and templates) in one dedicated tab, assign any schedule to specific days of the week in the Weekly Plan view, see a complete 7-day weekly schedule at a glance with projected weekly totals, quickly apply schedules to multiple days with pattern shortcuts, mark days as off days, clear and reassign schedules as needed, and have all custom schedules, favorites, and weekly assignments persist across sessions for long-term planning and consistency

### Smart Ride Analyzer

- **Functionality**: AI-powered tool to evaluate whether a ride offer is worth accepting based on historical performance and NYC TLC Trip Record Data patterns
- **Purpose**: Help drivers make split-second decisions on which rides to accept for maximum profitability using both personal history and TLC historical data benchmarks
- **Trigger**: Driver enters ride details (distance, duration, platform, gross pay) and clicks "Analyze Ride"
- **Progression**: Enter ride parameters → Click analyze → AI compares against driver's historical averages AND TLC Trip Record Data benchmarks (typical fares by distance/location from millions of historical trips) → Evaluates pay per mile and pay per minute against both personal and TLC data → Assesses if ride supports $35+ target needed for $300/day goal → Returns accept/skip recommendation with confidence level → Shows specific reasons referencing TLC data patterns → Displays estimated value rating
- **Success criteria**: Driver gets clear accept/skip guidance with confidence level and reasoning referencing both personal history and TLC Trip Record Data patterns within 3 seconds

### Tabbed Navigation

- **Functionality**: Switch between License Manager, Earnings Optimizer, Ride Comparison, Ride Share Apps, Delivery Platforms, Trip Calculator, Chatroom, and Settings views with persistent tab state
- **Purpose**: Organize distinct driver needs into focused, purpose-built interfaces
- **Trigger**: Click tab buttons in header
- **Progression**: User clicks tab → View switches → State persists → Returns to last used tab on app reload
- **Success criteria**: Driver can seamlessly navigate between compliance tracking, earnings optimization, ride comparison, rideshare platform information, delivery platform information, trip income calculator, driver communication, and location settings

### The Chatroom

- **Functionality**: Real-time communication hub where drivers can send messages to connect with the TLC driver community and maintain a list of fellow drivers with online/offline status indicators
- **Purpose**: Build community, share real-time traffic updates, coordinate with fellow drivers, and maintain professional network connections
- **Trigger**: Navigate to Chatroom tab
- **Progression**: Tab opens → See chat messages with timestamps and online driver count → Switch between Chat and Fellow Drivers tabs → In Chat: Type message and send to general channel → Messages display with sender avatar, name, time, and message bubble → Scroll through conversation history → In Fellow Drivers: Add driver by name to personal network list → View online/offline status with badges → Remove drivers from list as needed → See when each driver was added
- **Success criteria**: Drivers can send and receive messages in the general chat with clear sender identification and timestamps, maintain a personal list of fellow drivers with visible status indicators, and quickly see who's online in their network

### License Status Dashboard

- **Functionality**: Display current TLC license status with expiration date, license number, and visual status indicator
- **Purpose**: Provide at-a-glance awareness of license validity to prevent driving with expired credentials
- **Trigger**: Automatically loads on License Manager tab
- **Progression**: Tab opens → License card displays with color-coded status (active/expiring soon/expired) → Shows days remaining until expiration
- **Success criteria**: Driver can immediately see if their license is current and when action is needed

### Document Tracker

- **Functionality**: Track multiple required documents (DMV license, defensive driving certificate, drug test, vehicle inspection, insurance)
- **Purpose**: Ensure all required documentation stays current to maintain TLC compliance
- **Trigger**: View on License Manager tab, add/edit via modal dialog
- **Progression**: Dashboard shows document list → Click document to edit → Update expiration date and notes → Save changes → Status updates with visual indicator
- **Success criteria**: All required documents are tracked with expiration dates and status indicators

### Renewal Reminders

- **Functionality**: Visual alerts for items expiring within 30 days or already expired
- **Purpose**: Prevent lapses in compliance that could result in fines or inability to work
- **Trigger**: Automatic based on current date vs. expiration dates
- **Progression**: System checks dates → Items within 30 days show warning badge → Expired items show alert badge → Driver reviews and takes action
- **Success criteria**: Driver receives clear visual warnings before documents expire

### Shift Logger

- **Functionality**: Log individual driving shifts with date, time, platform, earnings, trips, tips, expenses, and START LOCATION (neighborhood/area where shift began)
- **Purpose**: Build a comprehensive earnings history including location data to enable pattern analysis, identify which start locations correlate with higher earnings, and generate location-based optimization recommendations powered by TLC Trip Record Data
- **Trigger**: Click "Add Shift" button on Earnings Optimizer tab
- **Progression**: Click add → Modal opens → Enter shift details (date, platform, start/end time, START LOCATION, earnings, trips, tips, expenses, notes) → Save → Shift added to history with calculated hourly rate and location displayed on shift card with pin icon → Location data feeds into AI insights for pickup zone optimization recommendations
- **Success criteria**: Driver can log a complete shift including start location in under 60 seconds, location appears prominently on shift card, and location data powers AI insights comparing their pickup patterns to TLC Trip Record Data zone performance

### Platform-Specific Earnings Tracking

- **Functionality**: Track and compare earnings performance across all rideshare platforms (Uber, Lyft, Via, Curb, Revel, Juno, Other)
- **Purpose**: Identify which platforms are most profitable for individual driver patterns and optimize multi-apping strategy
- **Trigger**: Automatically generated after logging shifts on different platforms
- **Progression**: Log shifts on multiple platforms → System aggregates earnings by platform → Displays comparison chart showing total earnings, hourly rate, trips, and earning share per platform → Shows performance insights highlighting top earner and rate differences
- **Success criteria**: Driver can see at a glance which platforms generate the most income and highest hourly rates for their driving pattern

### Earnings Analytics Dashboard

- **Functionality**: Display key metrics including net earnings, average hourly rate, total trips, and tips with 2025 target progress tracking
- **Purpose**: Provide clear overview of financial performance across all logged shifts and show progress toward $300/day with 7-10 rides target
- **Trigger**: Automatically calculates from logged shifts on Earnings Optimizer tab
- **Progression**: View opens → Cards display metrics → 2025 target card shows $35/trip goal, current average per trip, and projected daily earnings → Updates in real-time as shifts are added → Visual indicators show if on-target or gap to close
- **Success criteria**: Driver can see total earnings, hourly rate, trip count, tips at a glance, and immediately understand how their performance compares to 2025 realistic targets

### Daily Goal Tracker

- **Functionality**: Track individual daily earnings progress toward customizable goal range ($500-$1000 default) with visual progress bars and achievement statistics
- **Purpose**: Help drivers monitor their daily performance against personal income targets and identify which days are meeting goals
- **Trigger**: Automatically displayed when shifts are logged on Earnings Optimizer tab
- **Progression**: View opens → System aggregates shifts by day → Displays last 7 days with earnings, trips, hours → Shows progress bar with min/max goal markers → Color-codes days (green for max met, blue for min met, yellow/orange for under goal) → Summary stats show days at min goal, days at max goal, average daily earnings
- **Success criteria**: Driver can instantly see which days met their $500-$1000 target range, track overall progress, and understand their daily earning patterns at a glance

### Peak Performance Insights

- **Functionality**: Analyze shift data to identify best earning hours, days, and platforms with personalized recommendations
- **Purpose**: Guide drivers to work during their most profitable times and on their best-performing platforms
- **Trigger**: Automatically generated after 3+ shifts are logged
- **Progression**: System analyzes patterns → Identifies peak hours, best days, top platforms → Displays insights with actionable recommendations → Updates as more data is added
- **Success criteria**: Driver receives specific, data-backed recommendations on when and where to drive for maximum earnings

### Quick Actions

- **Functionality**: Fast access buttons to update license info, add documents, and log shifts
- **Trigger**: Click action buttons on cards or in tab views
- **Progression**: Click action button → Modal opens with form → Enter/update information → Confirm → Data persists and UI updates
- **Success criteria**: Driver can update any information or log a shift in under 30 seconds

### Ride Share Platform Directory

- **Functionality**: Comprehensive directory of NYC ride-sharing apps including Uber, Lyft, Curb, Revel, Via, and Juno with key details
- **Purpose**: Help drivers understand commission rates, features, and best use cases for each platform to optimize multi-apping strategy
- **Trigger**: Navigate to Ride Share Apps tab
- **Progression**: View opens → Platform cards display with icon, description, commission rates, features, and market share → Star favorites for quick reference
- **Success criteria**: Driver can compare all major platforms at a glance and mark preferred apps

### Platform Comparison

- **Functionality**: Side-by-side comparison of commission rates, features, and best use cases for each ride-share platform
- **Purpose**: Enable informed decisions about which apps to prioritize based on commission structure and earning potential
- **Trigger**: View Ride Share Apps tab
- **Progression**: Cards display key metrics → Compare commission rates → Review features and best-use scenarios → Star favorites
- **Success criteria**: Driver understands commission differences and can choose optimal platforms for their strategy

### NYC TLC Current Bases Database

- **Functionality**: Live searchable database of all licensed TLC bases operating in NYC, sourced from NYC Open Data API (https://data.cityofnewyork.us/resource/eccv-9dzr.json), displaying base information including name, base number, type (Black-Car, Livery), DBA name, app company affiliation (Uber, Lyft, Via), physical address, phone number, website, and vehicle count with real-time search filtering by name/number/affiliation and filtering by base type
- **Purpose**: Help drivers discover and connect with licensed TLC bases that dispatch for their preferred platforms, understand which bases are affiliated with major ride-hailing apps, verify base legitimacy through official TLC data, and find contact information for potential base partnerships
- **Trigger**: Navigate to Ride Share Apps tab → Select Bases sub-tab
- **Progression**: Component loads → Automatically fetches up to 1,000 licensed bases from NYC Open Data API → Displays total count and last update time → Driver can search by base name, base number, DBA, or app affiliation in real-time → Filter by base type (All, Black-Car, Livery) with counts → Each base card shows base name, base number badge, base type badge, DBA name if different, app company affiliation (Uber, Lyft, Via, etc.) prominently displayed, full physical address with map pin icon, clickable phone number, clickable website link, vehicle count → Base cards have color-coded left borders (blue for Black-Car, green for Livery) → Scroll through results in 500px scrollable area → Refresh button manually updates data from API → Empty state shown when search/filter yields no results → Info card explains what TLC bases are and their role in FHV dispatch → Loading state with spinner during API fetch → Success toast shows number of bases loaded → Error handling with retry option if API fails
- **Success criteria**: Driver can search and find specific bases by name or number within 2 seconds, filter bases by type to see only Black-Car or Livery bases, identify which bases are affiliated with Uber, Lyft, Via and other major apps, get complete contact information (address, phone, website) for any base, see total vehicle count to understand base size, verify base legitimacy through official TLC base number, understand the difference between Black-Car and Livery bases, refresh data to get latest TLC information, and use this data to make informed decisions about which base to partner with based on their preferred platforms and geographic location

### Delivery Platforms Directory

- **Functionality**: Comprehensive directory of food, grocery, and package delivery platforms including Uber Eats, DoorDash, Grubhub, Seamless, Instacart, Amazon Flex, Relay, and Gopuff with detailed information on earnings, requirements, and features
- **Purpose**: Help drivers understand delivery opportunities beyond traditional rideshare, diversify income streams, and optimize multi-app delivery strategy
- **Trigger**: Navigate to Delivery tab
- **Progression**: Tab opens → Platform cards display with filtering by type (All/Food/Grocery/Package) → Each card shows earnings structure, commission rates, peak times, coverage areas, features list, requirements, and best-use cases → Mark platforms as active/enrolled to track which services driver is signed up for → View enrollment count badge → Read strategy tips for maximizing delivery earnings
- **Success criteria**: Driver can compare all major delivery platforms at a glance, understand earnings potential and requirements for each service, filter by delivery type (food/grocery/package), track which platforms they're enrolled in, learn optimal strategies for bike vs. car delivery, and make informed decisions about which delivery services to add to their income mix

### Multi-Apping Tips

Here's some content about multi-apping tips...

- **Functionality**: Curated advice on running multiple apps simultaneously to maximize earnings and minimize downtime
- **Purpose**: Educate drivers on best practices for using multiple platforms effectively
- **Trigger**: Displayed at bottom of Ride Share Apps tab
- **Progression**: Tips card shows → Driver reads strategies for multi-apping → Applies knowledge to daily driving routine
- **Success criteria**: Driver learns actionable strategies to improve earnings through platform diversification

### Individual Ride Tracking

- **Functionality**: Log individual rides with pickup/dropoff locations, distance, duration, gross pay, fees, and net pay
- **Purpose**: Enable granular comparison of ride quality and profitability beyond aggregate shift data
- **Trigger**: Click "Add Ride" button on Rides tab
- **Progression**: Click add → Modal opens → Enter ride details (platform, locations, distance, time, earnings, fees) → Save → Ride added to comparison view with efficiency score
- **Success criteria**: Driver can log a complete ride in under 45 seconds with automatic net pay calculation

### Ride Efficiency Rating

- **Functionality**: Automatically calculate and display a 1-5 star efficiency rating for each ride based on pay per mile and pay per minute
- **Purpose**: Provide quick visual feedback on ride quality to help identify patterns in profitable rides
- **Trigger**: Automatically calculated when ride is saved
- **Progression**: Ride saved → System calculates pay per mile and pay per minute → Normalizes against benchmarks → Displays 1-5 star rating on ride card
- **Success criteria**: Each ride has a clear visual efficiency indicator that correlates with actual profitability

### Platform Ride Performance Comparison

- **Functionality**: Compare rides across platforms showing average pay per mile, pay per minute, and fee percentages
- **Purpose**: Identify which platforms consistently offer the best value rides, not just overall earnings
- **Trigger**: Automatically displayed when rides from multiple platforms are logged
- **Progression**: Multiple rides logged → System aggregates by platform → Shows comparison with progress bars → Highlights best performer → Shows fee impact per platform
- **Success criteria**: Driver can see which platform gives best value per mile and lowest fees for individual rides

### Best and Worst Ride Insights

- **Functionality**: Automatically identify and highlight the best value ride (highest $/mile) and worst ride to show earning patterns
- **Purpose**: Help drivers recognize what types of rides to accept and which to avoid
- **Trigger**: Displayed after 3+ rides are logged on Rides tab
- **Progression**: 3+ rides logged → System identifies best and worst by pay per mile → Displays in insight card with route details → Provides actionable tips
- **Success criteria**: Driver receives specific guidance on ride types to prioritize based on their actual logged data

### Ride Data CSV Export

- **Functionality**: Export ride data to CSV format for tax records, accounting, or external analysis
- **Purpose**: Enable drivers to maintain official records for tax purposes and integrate ride data with external accounting systems
- **Trigger**: Click "Export CSV" button on Rides tab
- **Progression**: Click export → System generates CSV with all filtered ride data → Downloads file with date-stamped filename → Shows success toast with ride count → File includes date, time, platform, locations, distance, duration, gross pay, fees, net pay, pay per mile, pay per minute, rating, and notes
- **Success criteria**: Driver receives a properly formatted CSV file containing all visible rides with complete financial data suitable for tax filing and accounting software import

### Trip Income Calculator

- **Functionality**: Interactive calculator comparing potential earnings between rideshare platforms and medical transport services for identical trips
- **Purpose**: Help drivers make informed decisions about which types of trips to prioritize based on actual earning potential
- **Trigger**: Navigate to Calculator tab, enter trip distance and duration
- **Progression**: Enter distance and duration → Select rideshare platform (Uber/Lyft/Via/Curb/Revel/Juno) and medical provider (MTM/LogistiCare/Access2Care/Ambulette/Access-A-Ride) → System calculates gross pay, platform fees, net pay, pay per mile, pay per minute, and hourly rate for both options → Displays side-by-side comparison with difference amount and percentage → Shows recommendation with detailed breakdown of pros/cons
- **Success criteria**: Driver can instantly compare income potential between rideshare and medical transport for any trip and understand which option pays better and why

## Edge Case Handling

- **No Active Alerts**: Display empty state with success icon and encouraging message, offer Test Alert button to generate sample
- **All Notification Types Disabled**: System stops generating periodic alerts but maintains existing alert history
- **Alert Generation Fails**: Silently handle failure, continue periodic generation attempts for next cycle
- **New Alert While App Hidden**: Alert added to feed but toast notification only shown when app is visible
- **Unread Alert Count**: Badge displays count of unread alerts, updates in real-time as alerts are marked read
- **Mark All as Read**: Batch operation marks all alerts as read simultaneously, shows success toast
- **Clear All Alerts**: Removes entire alert history from storage and UI, shows confirmation toast
- **Delete Individual Alert**: Removes single alert from feed, remaining alerts maintain position
- **Read Alert Display**: Alerts marked as read show with 60% opacity but remain accessible in scrollable feed
- **Alert Persistence**: All alerts and notification settings persist in KV storage across sessions
- **Long Alert Messages**: Messages constrained to 120 characters during generation, wrap gracefully in UI
- **Long Location Names**: Location names truncate with ellipsis if exceeding container width
- **Rapid Alert Generation**: Test Alert button disabled while generating to prevent duplicate requests
- **Initial Load with No History**: Generates 3 sample alerts on first mount to demonstrate functionality
- **Timestamp Formatting**: Smart relative time (just now, minutes/hours ago, or date) updates based on alert age
- **Severity Color Coding**: Three severity levels (low/medium/high) with distinct colors (green/yellow/red) and border styling
- **Alert Type Icons**: Four distinct icons for traffic/hotspot/incident/opportunity with semantic colors
- **Toast Notification Styling**: Toast inherits severity colors and styling, displays for 6 seconds in top-right
- **Scrollable Alert Feed**: ScrollArea with 500px max height handles long alert history with smooth scrolling
- **Alert Settings Toggle**: Switch components immediately update preferences in KV storage
- **Periodic Generation Timing**: 120-second interval between automatic alert generation cycles
- **Time-Appropriate Content**: AI generates alerts relevant to current hour (rush hour congestion, late-night opportunities)
- **No Messages in Chatroom**: Display empty state encouraging users to start first conversation
- **Message Without Current User**: Prevent sending messages until user identity is initialized
- **Empty Message Input**: Disable send button when message field is empty or whitespace-only
- **Long Messages**: Messages wrap within bubble with max-width constraint
- **Message Timestamp Formatting**: Smart relative time display (just now, minutes ago, hours, or full date)
- **No Fellow Drivers**: Show empty state with call-to-action to add first driver
- **Duplicate Driver Names**: Prevent adding drivers with exact same name (case-insensitive)
- **Empty Driver Name Input**: Disable add button and show validation error
- **Removing Driver**: Shows confirmation via toast with removed driver name
- **Current User vs Other Messages**: Visually distinguish own messages (right-aligned, primary color) from others (left-aligned, muted)
- **Online Status**: Random online/offline status simulated for fellow drivers, displayed with animated indicator
- **Long Driver Names**: Truncate with ellipsis in fellow drivers list
- **Scroll Behavior**: Auto-scroll to latest message when new messages arrive
- **Message List Growth**: ScrollArea handles long conversation history with smooth scrolling
- **Chat Tab vs Drivers Tab**: Maintain separate state, show count badges appropriately
- **Online Count Display**: Real-time count of online drivers in header badge
- **No Data for AI**: AI Assistant works with minimal data, provides general TLC driver advice when no shifts/rides logged
- **AI Generation Fails**: Show graceful error message, allow retry, maintain previous insight if available
- **Veteran Insights Generation Fails**: Show error gracefully, allow retry, maintain previous insights if available
- **Veteran Insights Not Yet Generated**: Show empty state with clear call-to-action to generate first insights
- **Veteran Insights Refresh**: Updates timestamp and allows regeneration for fresh recommendations
- **Traffic Data Initial Load**: Automatically fetches traffic and incident data on component mount
- **Traffic Data Refresh**: Manually refresh traffic data with refresh button, loading spinner during fetch
- **Traffic Data Generation Fails**: Show graceful error message, allow retry, maintain previous traffic data if available
- **No Traffic Data**: Show empty state encouraging user to refresh data
- **Borough Filter Applied**: Traffic and incident lists filter to show only selected borough
- **No Data for Selected Borough**: Show friendly empty state suggesting to try different borough or refresh
- **Traffic Speed Status Colors**: Dynamic color coding based on speed thresholds (free-flow green, moderate yellow, congested orange, severe red)
- **Incident Severity Display**: Color-coded severity badges (low green, medium yellow, high red) with appropriate icons
- **Traffic Map View**: Interactive OpenFreeMap showing traffic corridor locations with speed markers
- **Incident Map View**: Interactive OpenFreeMap showing incident locations with type-specific markers
- **Ongoing vs Temporary Incidents**: Incidents show "Ongoing" for no end date or "Until [date]" for temporary events
- **Real-Time Timestamp**: Displays last update time in header, updates on each refresh
- **Multiple Boroughs**: "All Boroughs" shows complete citywide data, individual boroughs show filtered view
- **Travel Time Index**: Displays travel time multiplier (1.0x = normal, >1.5x = significant congestion)
- **Weather Overlay Initial Load**: Automatically generates current weather data based on current season and time on component mount
- **Weather Impacts Generation**: Driver clicks generate/refresh to fetch AI-powered analysis of 5 weather scenarios with earnings impacts
- **Weather Impacts Loading**: Display loading state with spinner and "Analyzing weather impact patterns..." message while AI generates scenarios
- **Weather Impacts Generation Fails**: Show graceful error message with toast notification, allow retry with refresh button
- **No Weather Impact Data**: Show empty state with call-to-action button to generate first analysis
- **Weather Condition Icons**: Dynamic icons based on condition type (sunny, cloudy, rainy, snowy, foggy, windy)
- **Season Selection**: Dropdown selector switches between Spring, Summer, Fall, Winter seasonal data
- **Seasonal Pattern Display**: Each season shows month range, average temperature, precipitation, wind speed, demand multiplier, and top conditions as badges
- **Weather Demand Impact Colors**: Color-coded demand impact display (green for increases, red for decreases, muted for stable)
- **Weather Multiplier Display**: Each weather scenario shows fare multiplier (e.g., 1.3x, 0.85x) prominently with formatted decimal
- **Current Weather Refresh**: Refresh button updates both current weather and impact analysis simultaneously
- **Weather Tips Display**: Each scenario includes 3 specific actionable driver tips displayed as bulleted list
- **Seasonal Strategy Card**: Comprehensive paragraph strategy for selected season with specific recommendations
- **Weather Tabs**: Two-tab interface switches between Weather Impacts (scenario analysis) and Seasonal Patterns (yearly overview)
- **Temperature Display**: Shows actual temperature and "feels like" temperature with appropriate icon (thermometer hot/cold/sun)
- **Precipitation Percentage**: Displays 0-100% precipitation chance with appropriate styling
- **Historical Weather Patterns Initial Load**: Component displays empty state with generate button on first mount
- **Historical Weather Patterns Generation**: Driver clicks Generate → AI analyzes historical patterns → Returns 6 weather categories with comprehensive metrics and top 10 earning days
- **Historical Weather Patterns Loading**: Display loading state with spinner and "Analyzing..." message in button during AI generation
- **Historical Weather Patterns Generation Fails**: Show graceful error message with toast notification, maintain previous data if exists, allow retry
- **No Historical Weather Data**: Show empty state with call-to-action encouraging driver to generate analysis
- **Weather Pattern Cards**: Each of 6 weather types displays in detailed card with icon, metrics grid, day performance badges, strategy tips, and monthly performance bars
- **Weather Type Filter Tabs**: Four tabs (All Weather, Rain, Snow, Clear) filter both pattern cards and top days list
- **Filtered Weather Patterns**: When filter applied, show only matching weather patterns and top earning days
- **Best/Worst Weather Summary**: Two summary cards at top compare highest vs lowest earning weather types with key metrics
- **Weather Pattern Icons**: Dynamic weather-specific icons (CloudRain, CloudSnow, Sun, ThermometerHot, Wind) displayed prominently
- **Monthly Performance Bars**: Progress bars show relative earnings performance across 4-6 months for each weather type
- **Top Earning Days Ranking**: Displays up to 10 best days ranked by earnings with position badges (gold/blue/accent for top 3)
- **Top Day Cards**: Each day shows ranking number, day of week, weather type badge, date, earnings, hourly rate, and trip count
- **Weather Type Badge**: Small badge on each top day showing which weather pattern it represents
- **Empty Top Days**: If no days match selected weather filter, shows appropriate empty state
- **Weather Pattern Persistence**: All generated weather pattern data persists in KV storage across sessions
- **Weather Pattern Refresh**: Clicking refresh regenerates new AI analysis with updated insights
- **Demand Multiplier Display**: Shows multiplier value (0.85x to 1.45x) indicating demand impact for each weather type
- **Earnings Range Display**: Min-max earnings range shows volatility and consistency for each weather type
- **Best/Worst Day Performance**: Each weather pattern identifies which days of week perform best and worst in those conditions
- **Driver Strategy Tips**: 3 bullet points per weather type with specific actionable advice for maximizing earnings
- **Weather Pattern Colors**: Success green for best weather, warning orange for lowest, primary blue accents throughout
- **Monthly Breakdown Progress**: Visual progress bars scaled relative to max earnings show performance trends
- **Optimal Positioning Initial Load**: Automatically generates hot zones based on current time on component mount
- **Optimal Positioning Time Period Change**: Refreshes hot zone data when driver selects different time period
- **Optimal Positioning Refresh**: Manually refresh hot zones with refresh button, animated spinner during AI generation
- **Optimal Positioning Generation Fails**: Show graceful error message with toast notification, allow retry
- **No Hot Zones Data**: Show empty state with call-to-action to load zones
- **Hot Zones Loading State**: Display loading card with spinner and "Analyzing TLC data patterns" message
- **Top 3 Zones Display**: Automatically sorts zones by average fare and highlights top 3 in summary cards
- **Zone Demand Level Colors**: Color-coded demand indicators (high green, medium yellow, low gray)
- **Zone Traffic Level Colors**: Color-coded traffic status badges (light green, moderate yellow, heavy red)
- **Map View with Hot Zones**: Interactive OpenFreeMap displays all zones with custom markers sized by earnings potential
- **List View with Zone Details**: Comprehensive breakdown showing fares, rides per hour, demand, traffic, and peak times
- **Time Period Selection**: Tabs allow switching between Right Now, Morning, Midday, Evening, and Night with dynamic recommendations
- **Peak Times Display**: Each zone shows peak time ranges as badges for optimal timing guidance
- **Zone Coordinates**: Uses precise NYC neighborhood coordinates for accurate map visualization
- **Multiple Peak Times**: Displays all relevant peak time periods for each zone as separate badges
- **Last Update Timestamp**: Shows when hot zones were last refreshed with clock icon
- **Route Planner Initial Load**: Automatically generates 3 optimal routes based on morning time period on component mount
- **Route Planner Time Period Change**: Regenerates all routes when driver selects different time period (Morning/Midday/Evening/Night)
- **Route Planner Refresh**: Manually refresh routes with refresh button, animated spinner during AI generation
- **Route Planner Generation Fails**: Show graceful error message with toast notification, allow retry
- **No Routes Generated**: Show empty state with call-to-action to generate routes
- **Route Loading State**: Display loading card with spinner and "Analyzing optimal routes..." message
- **Route Selection**: Click any route card to select and view details in expanded view
- **Selected Route Highlighting**: Active route card shows primary border and background tint
- **Route Map View**: Interactive OpenFreeMap displays numbered markers for each stop showing route sequence
- **Route Stop Details View**: Comprehensive list showing each stop with timing, earnings, demand, and reasoning
- **Route Strategy Card**: Explains the logic behind the route sequence and optimization approach
- **Multiple Routes Display**: Shows 3 distinct route options in grid layout, single column on mobile
- **Route Metrics**: Each route card shows stops count, distance, time, estimated earnings, and route type
- **Stop Numbering**: Stops numbered 1-5 showing logical sequence through hot zones
- **Stop Earnings Calculation**: Displays estimated earnings per stop based on avg fare × rides per hour × time at stop
- **Route Type Badges**: Color-coded badges showing route category (Residential to Business, Airport Run, etc.)
- **Time Formatting**: Converts minutes to hours and minutes format (e.g., 120m → 2h 0m)
- **Map Markers**: Each stop displays as numbered marker with neighborhood name and average fare in popup
- **Demand Level Colors**: Color-coded demand badges (high green, medium yellow, low gray) on stop cards
- **Next Stop Indicator**: Lightning icon between stops showing progression through route
- **Total Route Stats**: Summary cards showing distance, time, earnings, and average per stop
- **No Location Data for Heatmap**: Heatmap hidden until at least one shift has start location data
- **Single Location Tracked**: Heatmap displays single location with stats in both chart and map views, encourages tracking from multiple start points
- **Map View with Unknown Locations**: Locations not in NYC neighborhoods database default to Manhattan center coordinates, still show earnings data
- **Map View Toggle**: Chart and Map views preserve selected location state when switching between views
- **Map Marker Interactions**: Click map markers to view detailed location statistics, hover for location name and earnings preview
- **OpenFreeMap Integration**: Uses free, open-source OpenFreeMap tiles (Liberty style) from <https://tiles.openfreemap.org/> via Cloudflare CDN. Repository configured as git remote `openfreemap` tracking <https://github.com/telleriacarolina/openfreemap>. Fetch updates with `git fetch openfreemap`. See OPENFREEMAP.md integration guide for details on tile styles, self-hosting options, and development workflows.
- **Marker Clustering**: OpenFreeMap automatically clusters nearby markers when displaying large datasets (100+ locations) to improve map performance and readability. Cluster size indicated by number badge, click to zoom and expand. Clustering enabled by default, automatically adjusts radius based on zoom level.
- **Duplicate Location Names**: Case-insensitive matching normalizes location names (e.g., "Manhattan" and "manhattan" treated as same)
- **Location Names with Different Spellings**: Each unique spelling treated as separate location, shows importance of consistent naming
- **Very Long Location Names**: Location labels truncated with ellipsis if needed for clean display
- **Heatmap Hover State**: Selected location details update in real-time as user hovers over bars
- **Zero Hours for Location**: Displays location but shows N/A for hourly rate when hours cannot be calculated
- **Location History Heatmap Hidden**: History heatmap hidden until at least one shift has start location data
- **Single Location in History**: History heatmap displays single location at 100% frequency with appropriate messaging
- **Location History Heatmap Toggle**: Frequency heatmap overlay can be toggled on/off to view base map or intensity visualization
- **Unknown Locations in History Map**: Locations not in NYC neighborhoods database default to Manhattan center coordinates on map
- **Location History Frequency Bars**: All locations shown in ranked frequency list with visual progress bars proportional to max count
- **Top Location Highlighting**: Most frequent location highlighted with warning color throughout the component
- **Location History Insights**: Smart insights analyze concentration patterns and provide feedback on geographic diversity
- **High Concentration Pattern**: When top location exceeds 50% of shifts, insight highlights this concentration level
- **Top 3 Location Calculation**: System calculates combined percentage of top 3 locations for concentration analysis
- **Geographic Diversity Badge**: Positive feedback shown when driver operates across 5+ different zones
- **Frequency vs Earnings Comparison**: Driver can compare Location History (frequency) with Location Earnings (profitability) to identify patterns
- **Incomplete Ride Data for Analysis**: Smart Ride Analyzer requires all fields (distance, duration, platform, pay) before enabling analysis
- **First Time AI User**: Suggested questions help guide initial interactions with AI Assistant
- **AI Response Too Long**: Responses constrained to 2-3 paragraphs for readability in chat interface
- **Slow AI Response**: Loading indicators with animated dots maintain user confidence during API calls
- **Multiple Quick AI Requests**: Disable send button during analysis to prevent duplicate requests
- **No License Entered**: Display empty state with prominent call-to-action to add license information
- **All Documents Current**: Show success state with encouraging message and next expiration date
- **Multiple Expired Items**: Prioritize display by expiration date (most urgent first)
- **Invalid Dates**: Validate that expiration dates are in the future when adding new documents
- **First-Time User (License Tab)**: Show helpful onboarding hints about what documents are required
- **No Shifts Logged**: Display empty state on Earnings tab with clear explanation of benefits and CTA to log first shift
- **Insufficient Data for Insights**: Show message that 3+ shifts are needed for pattern analysis
- **Single Platform Usage**: Platform comparison displays one platform with encouragement to try multi-apping
- **No Platform Data**: Platform comparison hidden until at least one shift is logged
- **Overlapping Shifts**: Allow entry but highlight in UI for driver to review
- **Zero or Negative Earnings**: Allow entry for tracking purposes (bad days happen)
- **Missing Expense Data**: Optional field, calculations work with or without it
- **No Favorite Apps**: Apps tab displays all platforms equally without favorites filter
- **Single Platform Driver**: Tips section still valuable for learning about alternatives
- **No Rides Logged**: Display empty state on Rides tab encouraging user to track individual rides
- **Insufficient Ride Data**: Show ride insights after 3+ rides are logged
- **Single Ride Platform**: Platform comparison hidden until rides from 2+ platforms exist
- **Automatic Net Pay Calculation**: Net pay automatically calculated from gross pay minus fees
- **Invalid Ride Values**: Validate distance > 0, duration > 0, gross pay > 0 before allowing save
- **Zero Distance/Duration**: Prevent save and show validation error
- **High Fee Percentage**: Display fee percentage on each ride to highlight commission differences
- **No Rides to Export**: Show error toast when export is clicked with no rides logged or all rides filtered out
- **Filtered Export**: CSV export respects active filters, exports only visible rides with descriptive filename indicating filters applied
- **Empty CSV Fields**: Optional fields (rating, notes) export as empty cells when not provided
- **Calculator Zero Values**: Show empty state message when distance or duration is zero
- **Calculator with Valid Input**: Display full comparison results with side-by-side earnings breakdown
- **Medical Transport Always Wins**: Handle cases where medical transport consistently pays more and explain platform fee impact
- **Rideshare Competitive**: Handle cases where rideshare (especially low-fee Curb) competes well with medical transport
- **Very Short Trips**: Medical flat rates may significantly exceed rideshare for short trips
- **Very Long Trips**: Rideshare per-mile rates may accumulate to compete with medical bonuses
- **Weekly Plan No Assignments**: Show empty state encouraging driver to assign schedules to days
- **Weekly Plan Single Day Selected**: Show that day's schedule details with earnings/hours summary
- **Weekly Plan Multiple Days with Same Schedule**: Efficiently display pattern (e.g., "Mon-Fri: Full Day Maximizer")
- **Weekly Plan Day Off**: Display as "Day Off" badge with distinct styling, don't count in weekly totals
- **Weekly Plan Totals Calculation**: Dynamically update weekly projected earnings, hours, and rides as schedules are assigned/removed
- **Weekly Plan Quick Assign Patterns**: Apply same schedule to Mon-Fri or Sat-Sun with one button click
- **Weekly Plan Clear All**: Confirmation dialog before clearing entire weekly schedule
- **Weekly Plan Change Schedule for Day**: Selecting new schedule replaces existing assignment seamlessly
- **Weekly Plan Persistence**: All day-to-schedule assignments persist in KV storage across sessions
- **Weekly Plan with Deleted Schedule**: If assigned schedule is deleted, show "Schedule Not Found" state on that day with option to reassign
- **No Delivery Platforms Enrolled**: Delivery tab displays all platforms without enrollment filter
- **Single Delivery Platform Active**: Display single platform with encouragement to try multi-apping across delivery services
- **Delivery Platform Type Filter**: Filter platforms by food, grocery, or package delivery categories
- **Delivery Platform Enrollment Tracking**: Track and display count of enrolled delivery platforms with badge
- **Bike vs Car Delivery Guidance**: Show appropriate platforms and tips based on delivery vehicle type
- **NYC TLC Bases API Initial Load**: Component automatically fetches up to 1,000 bases from NYC Open Data on mount
- **NYC TLC Bases API Loading**: Display loading state with spinner and "Loading TLC base data..." message during fetch
- **NYC TLC Bases API Failure**: Show error toast "Failed to load TLC base data", allow retry with refresh button, maintain previous data if exists
- **NYC TLC Bases No Results**: Show empty state with buildings icon when search/filter yields no bases
- **NYC TLC Bases Search**: Real-time filtering as user types, searches across base name, base number, DBA, and app affiliation
- **NYC TLC Bases Type Filter**: Tabs filter bases by type (All/Black-Car/Livery) with dynamic counts
- **NYC TLC Bases Refresh**: Manually refresh data from API, show loading spinner in button during fetch
- **NYC TLC Bases Success Toast**: Toast notification shows number of bases loaded on successful fetch
- **NYC TLC Bases Missing Data**: Handle optional fields gracefully (phone, website, address, affiliation, vehicle count)
- **NYC TLC Bases Phone Links**: Phone numbers render as clickable tel: links for mobile dialing
- **NYC TLC Bases Website Links**: Websites render as clickable links, automatically prepend https:// if not present
- **NYC TLC Bases Long Names**: Base names truncate with ellipsis if too long for container
- **NYC TLC Bases Card Borders**: Color-coded left borders (blue for Black-Car, green for Livery) for quick visual identification
- **NYC TLC Bases Scrollable List**: ScrollArea with 500px height handles long lists of bases with smooth scrolling
- **NYC TLC Bases Empty Search**: Clear message "Try a different search term" when search yields no results
- **NYC TLC Bases DBA Display**: Shows DBA name separately if different from base name
- **NYC TLC Bases App Affiliation**: Prominently displays app company affiliation (Uber/Lyft/Via) with briefcase icon
- **NYC TLC Bases Info Card**: Educational card explains what TLC bases are and their role in FHV dispatch

## Design Direction

The design should evoke confidence, empowerment, and professionalism - like having a compliance assistant, business advisor, platform expert, AI consultant, real-time traffic control center with access to both live NYC traffic intelligence and millions of historical NYC TLC trip records, and a supportive driver community network. It should feel official yet data-forward, with clear status indicators for compliance and compelling visualizations that reveal earning patterns and opportunities. The Chatroom should feel welcoming and community-focused, like having a driver's lounge where colleagues share real-time traffic tips, coordinate meetups, and build professional relationships - with clean message bubbles, clear sender identification, and intuitive online/offline status indicators that make connecting with fellow drivers effortless. The integration of OpenFreeMap provides free, open-source mapping tiles that give drivers true geographic context for their earnings data and real-time traffic conditions, showing exactly where on NYC streets their high-earning zones are located and which corridors are flowing freely without reliance on proprietary mapping services. The AI features should feel accessible and trustworthy, with a friendly brain icon and smooth animations that build confidence in the intelligent recommendations enhanced by both NYC DOT real-time data feeds (<https://www.nyc.gov/html/dot/html/about/datafeeds.shtml>) and NYC TLC Trip Record Data (<https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page>). The integration of both data sources should feel like having insider knowledge - historical TLC trip data reveals which neighborhoods consistently produce high fares ($35+ rides), what times of day see premium demand, and where tips are highest, while NYC DOT real-time feeds help drivers avoid construction zones, monitor traffic speeds, check planned events, and optimize routes to reach those proven high-fare locations efficiently. The Real-Time Traffic Overlay should feel like mission control for NYC drivers, with color-coded speed indicators (green for free-flow, yellow for moderate, orange for congested, red for severe) that instantly communicate road conditions, interactive maps showing live traffic across all five boroughs, and actionable incident alerts (construction, accidents, events, closures) that help drivers plan optimal routes. The interactive map views powered by OpenFreeMap should feel fluid and responsive, with custom markers showing earnings intensity and traffic conditions at each location, smooth zoom/pan controls, and seamless integration with statistical views. The Earnings Optimizer should feel energizing and opportunity-focused, while the License Manager maintains urgency around deadlines. The Ride Share Apps section should feel informative and comparative, helping drivers make strategic decisions about platform usage. The Ride Comparison view should feel analytical and detail-oriented, empowering drivers with granular insights into ride-by-ride profitability to make better decisions about which rides to accept. The Trip Calculator should feel powerful and decisive, presenting clear financial comparisons that help drivers choose between rideshare and medical transport opportunities with confidence. AI-powered features should feel like having an expert advisor in your pocket with access to both real-time city traffic data and years of historical trip patterns, always ready with personalized insights that factor in proven high-earning locations from TLC records, current traffic conditions, construction alerts, and event schedules.

## Color Selection

A professional palette with strong status indicators inspired by official transportation signage and traffic signals.

- **Primary Color**: Deep Blue (oklch(0.35 0.08 250)) - Conveys authority, professionalism, and trustworthiness like official NYC TLC branding
- **Secondary Colors**:
  - Slate Gray (oklch(0.45 0.02 250)) for supporting elements and subtle backgrounds
  - Light Blue (oklch(0.92 0.03 250)) for card backgrounds and secondary surfaces
- **Accent Color**: Vibrant Yellow (oklch(0.85 0.15 90)) - Attention-grabbing for call-to-action buttons and important updates, inspired by NYC taxi yellow
- **Status Colors**:
  - Success Green (oklch(0.65 0.15 145)) for current/valid documents
  - Warning Orange (oklch(0.70 0.15 50)) for items expiring within 30 days
  - Alert Red (oklch(0.60 0.20 25)) for expired items
- **Foreground/Background Pairings**:
  - Background (Light Blue #EEF2F6): Dark text oklch(0.25 0.02 250) - Ratio 9.2:1 ✓
  - Primary (Deep Blue): White text oklch(0.98 0 0) - Ratio 8.5:1 ✓
  - Accent (Vibrant Yellow #F5D547): Dark text oklch(0.25 0.02 250) - Ratio 12.1:1 ✓
  - Success: White text oklch(0.98 0 0) - Ratio 4.6:1 ✓
  - Warning: Dark text oklch(0.25 0.02 250) - Ratio 9.8:1 ✓
  - Alert: White text oklch(0.98 0 0) - Ratio 5.2:1 ✓

## Font Selection

Typography should convey clarity and officialdom while remaining highly readable for quick scanning of dates and status information.

- **Primary Font**: Space Grotesk - A technical, geometric sans-serif that balances professionalism with approachability
- **Secondary Font**: JetBrains Mono - For license numbers, dates, and data fields requiring precision

- **Typographic Hierarchy**:
  - H1 (Page Title): Space Grotesk Bold/32px/tight letter spacing (-0.02em)
  - H2 (Section Headers): Space Grotesk Semibold/24px/normal letter spacing
  - H3 (Card Titles): Space Grotesk Medium/18px/normal letter spacing
  - Body (General Text): Space Grotesk Regular/16px/relaxed line height (1.6)
  - Data Fields (Dates, License Numbers): JetBrains Mono Medium/14px/monospace spacing
  - Labels: Space Grotesk Medium/14px/uppercase with wide letter spacing (0.05em)

## Animations

Animations should provide clear feedback for status changes and guide attention to urgent items without being distracting during critical compliance reviews.

- **Status transitions**: Smooth color fade when document status changes from current to expiring (300ms ease)
- **Card interactions**: Subtle lift and shadow on hover (200ms) to indicate interactivity
- **Modal entry**: Slide up with backdrop fade (250ms) for adding/editing documents
- **Badge pulses**: Gentle attention pulse on expired items (2s loop) to draw eye without overwhelming
- **Success confirmations**: Quick scale bounce (400ms) when items are updated successfully

## Component Selection

- **Components**:
  - **Tabs**: Primary navigation between License Manager, Earnings Optimizer, Ride Comparison, Ride Share Apps, Delivery Platforms, Trip Calculator, Chatroom, and Settings views; Secondary navigation for Chart vs Map view in Location Heatmap, Chat vs Fellow Drivers in Chatroom, delivery type filtering (All/Food/Grocery/Package), and TLC Bases filtering (All/Black-Car/Livery)
  - **OpenFreeMap**: Interactive map component using Leaflet with OpenFreeMap tiles (Liberty style, <https://tiles.openfreemap.org/styles/liberty/{z}/{x}/{y}.png>) and Leaflet.markercluster for geographic visualization of earnings locations and traffic patterns. Automatically clusters markers when displaying large datasets (100+ locations) with color-coded cluster size indicators (small: 1-20, medium: 21-100, large: 100+). Free, open-source tiles via Cloudflare CDN with no API keys or rate limits. Repository configured as git remote `openfreemap` tracking <https://github.com/telleriacarolina/openfreemap> - fetch updates with `git fetch openfreemap`. See integration guide for tile style options (Liberty/Bright/Positron), self-hosting, performance optimization, and development workflows. Alternative styles: Bright (clean/professional), Positron (minimal/data overlays).
  - **Card**: Primary container for license info, document groups, shift entries, ride entries, stat displays, platform details, calculator results, and TLC base information
  - **Badge**: Status indicators (Current, Expiring, Expired) with color variants, efficiency ratings, platform badges, fee percentages, base type badges (Black-Car, Livery)
  - **Dialog**: Modal for adding/editing license, documents, shift information, and individual rides
  - **Button**: Primary actions (yellow accent), secondary (outline), icon buttons for quick actions, and refresh buttons for API data
  - **Input**: Text fields for license numbers, document names, earnings amounts, shift details, ride locations, distances, times, pay amounts, calculator inputs, and search fields
  - **Select**: Dropdown for platform selection (Uber, Lyft, Via, Curb, Revel, Juno, Other), document types, rideshare platforms, medical providers in calculator, and base type filters
  - **Textarea**: Notes fields for documents, shifts, and rides
  - **Alert**: Prominent warnings for expired items and insights callouts for earnings opportunities
  - **Progress**: Visual bars showing relative earnings performance between platforms and ride comparisons
  - **Separator**: Dividers between document groups, shift groups, and calculator sections
  - **Scroll Area**: For long lists of documents, shifts, rides, TLC bases, and scrollable content areas on mobile

- **Customizations**:
  - Custom colored borders on Cards based on status (green/orange/red for compliance, gradient for earnings)
  - Badge variants with status-specific colors and icons
  - Custom stat cards with large numbers and icon accents
  - Platform badges with brand colors (black for Uber, pink for Lyft, teal for Via, green for Curb, blue for Revel, purple for Juno)
  - Platform cards with color-coded left borders matching brand identity
  - Platform comparison cards showing earnings breakdown with progress bars and percentage of total earnings
  - Insight cards with gradient backgrounds to draw attention to optimization recommendations
  - Veteran insights cards with time-of-day recommendations showing location, timing, reason, and expected hourly earnings
  - Seasonal strategy cards displaying multiple priority locations as pill badges with strategic guidance
  - Location insight cards with MapPin icons and expected earnings badges
  - Custom date display showing "X days remaining" countdown
  - Hourly rate calculation display showing $/hr alongside shift totals
  - Favorite/star toggle button for marking preferred platforms
  - Commission rate comparison display with visual emphasis
  - Platform performance metrics showing earnings share, hourly rate, trip count, and earnings per trip
  - Ride cards with route visualization (pickup → dropoff with arrow)
  - Efficiency star rating (1-5 stars) automatically calculated and displayed on ride cards
  - Net pay auto-calculation from gross pay minus fees
  - Pay per mile and pay per minute metrics prominently displayed
  - Fee percentage displayed to highlight commission impact
  - Best/worst ride comparison cards with visual indicators
  - Calculator comparison cards with side-by-side rideshare vs medical transport results
  - Real-time calculation updates as trip parameters change
  - Difference badge showing absolute dollar amount and percentage variance
  - Contextual recommendations based on which option pays more
  - Provider-specific rates and fee structures displayed in selectors
  - Delivery platform cards with type-specific icons (food, grocery, package, multi-service) and color-coded left borders
  - Delivery platform enrollment tracking with active/join button toggle
  - Delivery earnings structure display with per-delivery or hourly rates
  - Commission rate and peak times display for delivery platforms
  - Delivery type filter tabs (All/Food/Grocery/Package) with category icons
  - Delivery strategy cards comparing bike vs. car delivery with pros/cons
  - Enrollment count badge showing number of active delivery platforms
  - Traffic overlay card with gradient background (destructive/warning/success mix) and warning-colored border
  - Traffic speed cards with status-coded badges and colors (green free-flow, yellow moderate, orange/red congested)
  - Incident cards with severity-coded badges (green low, yellow medium, red high) and type-specific icons
  - Borough filter buttons for focusing on specific NYC areas
  - Traffic/Incidents tab switcher with badge counts
  - Interactive traffic map showing corridor locations with speed markers
  - Interactive incidents map showing event/construction locations with type markers
  - Traffic summary stats: average citywide speed, congestion count, incident count, corridors tracked
  - Real-time timestamp display with clock icon
  - Refresh button with spinning animation during data load
  - Travel time index display (1.0x normal, >1.5x congested)
  - Weather overlay card with gradient background (primary/accent mix) and primary-colored border
  - Current weather display with condition-specific icons (sun, cloud, rain, snow) and temperature
  - Weather metrics cards showing precipitation percentage, wind speed, and visibility
  - Weather demand impact card with success/warning coloring based on expected demand change
  - Weather scenario cards with condition name, demand change badge, earnings impact badge, and fare multiplier
  - Weather driver tips displayed as bulleted list with sparkle icon header
  - Seasonal pattern cards with month range, temperature icon (hot/cold/sun), and demand multiplier
  - Season selector dropdown for switching between Spring, Summer, Fall, Winter
  - Top weather conditions displayed as badge collection
  - Seasonal strategy card with gradient success background and detailed paragraph guidance
  - Weather impacts/seasonal patterns tabs for switching between analysis views
  - Weather refresh button updates both current conditions and AI-powered impact scenarios
  - Historical weather pattern card with gradient background (primary/accent/success mix) and calendar icon
  - Weather pattern analysis cards with left border (primary), weather-specific icons, and detailed metrics grid
  - Best weather summary card with success green border and background tint, trend up icon
  - Worst weather summary card with warning orange border and background tint, trend down icon
  - Weather filter tabs (All Weather/Rain/Snow/Clear) for filtering patterns and top days
  - Weather pattern metrics grid showing avg daily earnings (primary color), avg hourly rate, earnings range
  - Day performance section with success/muted badges for best/worst days of week
  - Driver strategies section with lightbulb icon and bullet list with accent-colored bullets
  - Monthly performance section with progress bars scaled to max earnings
  - Top earning days ranked list with numbered circular badges (success/primary/accent for top 3, muted for 4+)
  - Top day cards with weather type badge, earnings in success green, and trip/hourly details
  - Demand multiplier badges with outline style and color-coded text
  - Weather pattern card headers with large weather icons (32px) in primary color
  - Hover states on top day cards with muted background transition
  - Traffic alerts card with Bell icon and notification settings
  - Alert notification toggle switches for 4 alert types (traffic/hotspot/incident/opportunity)
  - Toggle switches with descriptive labels and icons showing alert categories
  - Alert feed with scrollable area (500px height) containing chronological alert cards
  - Alert cards with severity-based border colors and background tints (low green, medium yellow, high red)
  - Alert type icons: TrafficSign (traffic), TrendUp (hotspot), Warning (incident), Lightning (opportunity)
  - Unread badge showing count of new alerts in destructive red
  - Alert card headers with title, message, location (MapPin icon), and timestamp
  - Read/unread visual distinction (read alerts at 60% opacity)
  - Individual alert actions: Mark Read button, Delete button (X icon)
  - Bulk actions: Mark All Read, Clear All, Test Alert buttons
  - Toast notifications for new alerts with severity styling (6 second duration, top-right position)
  - Alert timestamp with smart relative formatting (just now, Xm ago, Xh ago, date)
  - Empty state for no alerts with CheckCircle icon and Test Alert CTA
  - Loading state for Test Alert button during AI generation
  - Alert persistence in KV storage with automatic periodic generation every 2 minutes
  - Optimal positioning map card with gradient primary background and border
  - Hot zone summary cards showing top 3 zones with ranking badges (#1, #2, #3)
  - Zone cards with color-coded demand levels (high/medium/low) and traffic status
  - Time period selector tabs (Right Now, Morning, Midday, Evening, Night) with active state styling
  - Map/List view toggle for hot zones visualization
  - Interactive map markers sized by earnings potential showing hot zone locations
  - Detailed zone cards with 4-metric grid (Avg Fare, Rides/Hour, Demand, Traffic)
  - Peak time badges showing optimal hours for each zone
  - Last update timestamp with clock icon
  - Loading state with animated spinner and "Analyzing TLC data patterns" message
  - Empty state with call-to-action to load hot zones
  - Sparkle icon for AI-powered insights and recommendations
  - Target icon for optimal positioning goals
  - Zone reason text citing TLC historical data patterns
  - Map marker clustering with color-coded cluster size badges (primary blue gradient: light for small clusters 1-20, medium for 21-100, dark for 100+). Clusters display count and expand on click with spiderfy animation. Custom cluster styling matches app's primary color scheme with rounded badges and drop shadow.
  - Route planner card with gradient background (primary/accent mix) and navigation arrow icon
  - Route option cards with route number badges, route type badges, and selectable state
  - Selected route highlighting with primary border and background tint
  - Route detail view with map/stop details tabs
  - Interactive map showing numbered stop markers in sequence
  - Stop cards with left border, numbered circles, and detailed metrics
  - Stop-to-stop progression indicators with lightning icons
  - Route summary statistics cards (distance, time, earnings, avg per stop)
  - Route strategy explanation card with gradient success background
  - Time period tabs for route generation (Morning/Midday/Evening/Night)
  - Route loading state with spinner and "Analyzing optimal routes" message
  - Empty state for no routes with navigation arrow icon
  - Chat message bubbles with rounded corners and directional tail (sender vs current user styling)
  - Message timestamp display with smart relative time formatting
  - Fellow driver cards with avatar, name, online/offline badge, and remove action
  - Online driver count badge in chatroom header
  - Auto-scrolling chat interface with smooth scroll behavior
  - Message input with send button and Enter key support
  - Driver input field with add button and Enter key support
  - Empty states for no messages and no fellow drivers with encouraging CTAs
  - Weekly schedule planner with 7-day calendar-style layout (Mon-Sun cards)
  - Day cards showing day name, assigned schedule name, earnings target, hours, and rides
  - Schedule assignment dialog with list of all available schedules (templates + custom)
  - Day off option in schedule selector with distinct badge styling
  - Weekly totals summary card showing projected weekly earnings, hours, and rides
  - Quick assign pattern buttons for weekday/weekend bulk assignment
  - Clear day and clear all week action buttons with confirmation
  - Schedule not found state when assigned schedule has been deleted
  - Day-to-schedule assignment persistence via KV storage
  - TLC Bases database cards with color-coded left borders (blue for Black-Car, green for Livery)
  - TLC Bases header card with gradient background and live data count
  - TLC Bases search input with magnifying glass icon for real-time filtering
  - TLC Bases type filter tabs (All/Black-Car/Livery) with dynamic counts
  - TLC Bases card showing base name, base number badge (outline monospace), base type badge (secondary)
  - TLC Bases DBA display as subtitle when different from base name
  - TLC Bases app affiliation prominently displayed with briefcase icon and primary color
  - TLC Bases contact information with clickable phone (tel:) and website links
  - TLC Bases address display with map pin icon
  - TLC Bases vehicle count with taxi icon
  - TLC Bases refresh button with spinning animation during API fetch
  - TLC Bases loading state with centered spinner and loading message
  - TLC Bases empty state with buildings icon and helpful message
  - TLC Bases scrollable list (500px height) with smooth scrolling
  - TLC Bases info card explaining what TLC bases are with buildings icon
  - TLC Bases success toast notification showing count of loaded bases
  - TLC Bases last update timestamp display

- **States**:
  - Buttons: Solid yellow accent for primary, subtle hover lift, pressed state with slight scale
  - Cards: Neutral default, colored left border on hover, full colored border for expired items
  - Tabs: Clear active state with icon and text, subtle inactive state
  - Inputs: Subtle focus ring in primary blue, error state in alert red
  - Badges: Static for current, animated pulse for expired
  - Shift cards: Hover shadow lift, edit/delete buttons appear on hover

- **Icon Selection**:
  - Brain: AI Assistant, intelligent features
  - Sparkle: AI insights, smart recommendations, AI-generated content
  - PaperPlaneRight: Send message to AI, send chat message
  - Lightning: Quick AI analysis, fast recommendations, next stop indicator in routes
  - NavigationArrow: Route planner feature, navigation and routing
  - Path: Route paths, route planning, distance metrics, trip details
  - IdentificationCard: License/ID card representation, License Manager tab
  - ChartBar: Earnings analytics, Earnings Optimizer tab, Chart view in heatmap
  - Globe: Map view in location heatmap, geographic visualization, website links
  - CarProfile: Ride share vehicles, Apps tab
  - MapTrifold: Individual rides, Ride Comparison tab
  - Calculator: Trip income calculator, Calculator tab
  - ChatCircleDots: Chatroom tab, chat interface, messaging
  - Users: Fellow drivers, multi-apping tips, online count
  - UserPlus: Add fellow driver
  - UserMinus: Remove fellow driver
  - Clock: Time and duration displays, daily timing insights, message timestamps
  - CurrencyDollar: Earnings and financial metrics
  - Car: Trip counts and ride metrics
  - TrendUp: Performance improvements and best rates, best rides, expected earnings
  - TrendDown: Lowest value rides
  - Lightbulb: Insights and recommendations
  - Star: Favorite/preferred platforms, ride ratings
  - Users: Multi-apping tips, fellow drivers
  - Globe: Platform availability, website links
  - MapPin: Location markers for pickup/dropoff, veteran location insights, location heatmap, route stops, base addresses
  - ArrowRight: Route direction indicator
  - Warning/WarningCircle: Expiring/expired alerts, important considerations
  - CheckCircle: Current/valid status
  - Plus: Add new document, shift, or ride
  - PencilSimple: Edit existing entries
  - Trash: Delete shifts or rides
  - DownloadSimple: CSV export for tax records
  - FirstAidKit: Medical transport icon
  - Package: Delivery platforms tab, package delivery
  - Pizza: Food delivery platforms
  - ShoppingBag: Grocery delivery platforms
  - Bicycle: Bike delivery, delivery vehicle type
  - Bag: Multi-service delivery platforms
  - Percent: Platform fees and commission rates
  - TrafficSign: Real-time traffic overlay, traffic intelligence, traffic alerts
  - Gauge: Traffic speed indicator, speed metrics
  - ArrowsClockwise: Refresh traffic data, refresh TLC bases data, reload API data
  - Bell: Traffic alerts and notifications, alert system
  - BellSlash: Notifications disabled
  - X: Road closures, clear/cancel actions, delete alerts
  - CloudRain: Weather overlay, rain conditions, precipitation metrics
  - CloudSnow: Snow conditions, winter weather
  - Sun: Clear weather, sunny conditions, mild weather indicator
  - Cloud: Cloudy weather, general weather icon
  - Wind: Wind speed indicator, windy conditions
  - ThermometerHot: High temperatures, heat conditions
  - ThermometerCold: Cold temperatures, winter conditions
  - FileText: Document tracking
  - CalendarBlank: Date/expiration displays, seasonal insights, season selection
  - Buildings: TLC bases, base facilities, dispatch centers
  - Taxi: TLC vehicles, base vehicle counts, ride-hailing
  - Briefcase: App company affiliations, business relationships
  - Phone: Contact information, base phone numbers
  - MagnifyingGlass: Search functionality, filter TLC bases
  - ListBullets: List counts, data summaries

- **Spacing**:
  - Page padding: px-6 py-8 (mobile), px-8 py-12 (desktop)
  - Card padding: p-5 for shifts, p-6 for license/documents
  - Stat cards: p-5 with generous spacing for large numbers
  - Section gaps: gap-6 for card grids, gap-4 for metric grids
  - Element gaps: gap-4 within cards, gap-2 for inline elements
  - Button padding: px-6 py-3 for primary, px-4 py-2 for secondary

- **Mobile**:
  - Single column layout for all cards on mobile (<768px)
  - Tabs span full width with clear touch targets, 8-column grid on larger screens wrapping as needed
  - Stat grid collapses to 2 columns on mobile
  - Platform cards stack in single column on mobile
  - Delivery platform cards stack in single column on mobile, 2-column grid on desktop
  - Ride cards stack in single column on mobile, 2-column grid on desktop
  - Calculator comparison cards stack vertically on mobile, side-by-side on desktop
  - Chat interface optimized for mobile with full-width message bubbles
  - Fellow drivers list stacks in single column with touch-friendly cards
  - Larger touch targets (min 44px) for all interactive elements
  - Bottom sheet dialog variant for forms on mobile
  - Sticky tab navigation at top
  - Collapsible sections to reduce scroll length
