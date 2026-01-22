# Planning Guide

A comprehensive driver management hub for NYC TLC (Taxi and Limousine Commission) drivers to track their license renewals, required documents, compliance deadlines, and optimize their earnings through data-driven insights.

**Experience Qualities**:
1. **Professional** - Clean, organized interface that inspires confidence and trust for managing critical licensing and earnings information
2. **Empowering** - Data-driven insights that help drivers maximize earnings and stay compliant with their licensing requirements
3. **Actionable** - Clear visual indicators and recommendations that guide drivers to make better decisions about when and where to drive

**Complexity Level**: Complex Application (advanced functionality with multiple views)
This is a multi-view application with document tracking, deadline management, shift logging, earnings analytics, pattern recognition, and personalized insights requiring sophisticated state management and data analysis.

## Essential Features

### AI Driver Assistant
- **Functionality**: Floating AI chat assistant that provides personalized advice on earnings optimization, compliance, multi-apping strategies, shift planning, and how to leverage NYC TLC Trip Record Data patterns combined with NYC DOT real-time data feeds for location and traffic optimization
- **Purpose**: Give drivers instant access to intelligent insights based on their actual data, NYC TLC context, millions of historical trip records from TLC Trip Record Data, and real-time traffic information from NYC DOT data feeds
- **Trigger**: Click floating AI button in bottom-right corner
- **Progression**: Click AI button → Chat window opens → User types question or selects suggested question → AI analyzes driver's data (shifts, rides, license) and references both TLC Trip Record Data (historical patterns, high-fare zones, peak times) and NYC DOT data feeds (traffic speeds, construction alerts, planned events) → Returns personalized, actionable advice including location recommendations from TLC data and traffic optimization tips from DOT feeds → Conversation continues with context
- **Success criteria**: Driver receives relevant, data-driven answers within 5 seconds that help them make better business decisions, understand which locations historically produce high fares based on TLC data, and learn how to use NYC DOT traffic data to reach those locations efficiently

### AI-Powered Earnings Insights
- **Functionality**: Automatically generated location-based insights analyzing START LOCATION patterns from logged shifts, comparing against NYC TLC Trip Record Data patterns (millions of historical trips organized by taxi zones) to identify which neighborhoods produce the highest earnings, with 2025 target tracking ($300/day with 7-10 rides at ~$35/trip) and NYC DOT data feeds for route optimization
- **Purpose**: Surface actionable intelligence about which START LOCATIONS correlate with higher earnings by comparing driver's actual shift start locations against TLC Trip Record Data showing historical pickup zone performance (average fares by neighborhood, high-tip areas, premium zones), helping drivers strategically position themselves at the beginning of shifts to maximize earnings and meet 2025 targets
- **Trigger**: Automatically generated when driver has 3+ shifts logged (with or without start locations specified), refreshable on demand
- **Progression**: System analyzes shifts with START LOCATION data → Cross-references against TLC Trip Record Data organized by taxi zones showing pickup location performance (Manhattan Core $45-65, Financial District $50+, Airports $55-75+, Entertainment zones $40-60) → Identifies correlation between driver's start locations and their earnings → Compares to TLC historical data showing which zones consistently produce $35+ average pickups → Generates focused location-based insight recommending specific neighborhoods/zones to START from based on time of day and TLC pickup zone performance data → Displays in gradient card with location pin icon → Updates when new shift data with locations added or manually refreshed
- **Success criteria**: Driver receives one specific, actionable recommendation about which neighborhoods or zones to BEGIN their shifts from based on their start location history patterns compared to TLC Trip Record Data showing those zones' historical pickup performance, understands which areas correlate with hitting the $35+ per trip target needed for $300/day goal, and learns how to strategically position themselves using TLC taxi zone data and NYC DOT traffic feeds to reach high-earning pickup locations

### Location Earnings Heatmap
- **Functionality**: Interactive visual heatmap displaying earnings by start location with dual view modes - a bar chart view with color-coded bars showing earnings intensity, and an interactive map view using OpenFreeMap tiles showing pickup locations on a real NYC map with earnings markers
- **Purpose**: Provide immediate visual insight into geographic earnings patterns through both statistical (chart) and spatial (map) visualizations, helping drivers identify their most profitable starting locations at a glance with real geographic context
- **Trigger**: Automatically displayed on Earnings Optimizer tab when 1+ shifts have start location data
- **Progression**: System aggregates all shifts by start location → Calculates total earnings, trips, hours, and hourly rate per location → Chart View: Renders horizontal bar chart with color gradient from light to dark blue based on earnings intensity, displays location names on left, earnings bars in center, dollar amounts on right → Map View: Displays interactive OpenFreeMap showing NYC with custom markers at pickup locations, marker size/color reflects earnings, click marker to see details → On hover/click, shows detailed stats for selected location including earnings, hourly rate, trips, shifts, and percentage of total earnings → Top stats cards show best performing location, highest hourly rate, and number of tracked locations → Toggle between Chart and Map views via tabs
- **Success criteria**: Driver can instantly see which start locations generate the most earnings through both color-coded bar chart and geographic map visualization, interact with locations in either view for detailed breakdown, understand the spatial distribution of their high-earning zones across NYC, and identify patterns in their most profitable pickup areas for strategic positioning decisions

### Veteran Location & Timing Insights
- **Functionality**: AI-powered recommendations on optimal locations and time periods throughout the day and year for experienced NYC TLC drivers, focused on hitting 2025 target of $300/day with quality rides, enhanced with NYC TLC Trip Record Data (millions of historical trip records showing high-fare zones, peak demand times, and average fares by neighborhood) combined with NYC DOT real-time data feeds integration
- **Purpose**: Leverage veteran driver knowledge, NYC traffic patterns, historical TLC trip data patterns (pickup/dropoff zones, fare amounts, trip distances, time-of-day patterns), and real-time NYC DOT data (traffic speeds, construction alerts, planned events, parking data) to guide drivers to high-earning locations at the right times where rides consistently hit $35+ averages based on historical TLC records while avoiding congestion using DOT feeds
- **Trigger**: Click "Generate" button in Veteran Driver Insights card on Earnings tab
- **Progression**: Click generate → AI analyzes NYC geography, commute patterns, events, seasons, and references both TLC Trip Record Data (https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page) showing historical high-fare zones and peak times AND NYC DOT data feeds (https://www.nyc.gov/html/dot/html/about/datafeeds.shtml) for traffic optimization → Returns 4 daily time-based location insights backed by TLC historical fare data with expected earnings supporting $300/day goal plus specific NYC DOT data usage tips → Returns 3 seasonal strategy insights with priority locations proven to generate premium fares in TLC records and traffic management recommendations → Displays in organized cards with times, locations (backed by TLC data patterns), reasons citing historical fare averages, earnings estimates, and actionable NYC DOT data tips → Can refresh for updated recommendations with current time/date context
- **Success criteria**: Driver receives specific neighborhood recommendations for 4 times of day plus 3 seasonal strategies, each backed by actual TLC Trip Record Data patterns showing these locations consistently produce high fares, with actionable location advice supported by historical trip records, earnings expectations aligned with 2025 targets based on TLC data averages, and practical guidance on using NYC DOT real-time data feeds for traffic optimization and efficient route planning to reach high-fare zones

### Traffic Pattern Comparison by Time of Day
- **Functionality**: AI-powered analysis comparing traffic conditions, earnings potential, and demand patterns across five distinct time slots throughout the day (Early Morning 5AM-9AM, Midday 9AM-4PM, Evening Rush 4PM-8PM, Night 8PM-2AM, Late Night 2AM-5AM) with separate weekday and weekend patterns
- **Purpose**: Help drivers strategically choose when to work by understanding how traffic congestion, trip volume, earnings potential, and hot zones vary throughout the day, enabling them to maximize earnings while minimizing time wasted in traffic
- **Trigger**: Automatically displayed on Earnings Optimizer tab, refreshable on demand, toggle between weekday and weekend patterns
- **Progression**: Component loads → Driver selects weekday or weekend mode → AI analyzes typical NYC traffic and demand patterns for selected day type → Generates detailed comparison for 5 time slots showing average speed, congestion level, estimated hourly earnings, trip volume, average trip time, and 3 hot zone neighborhoods → Displays color-coded cards with metrics, hot zones as badges, and specific actionable recommendations for each time period → Highlights best earnings time and heaviest traffic time in summary cards → Driver can refresh for updated patterns → Use insights to plan optimal work schedule
- **Success criteria**: Driver can instantly compare all time periods side-by-side, identify the most profitable hours with least congestion, learn which neighborhoods are hotspots during each period, understand weekday vs weekend differences, and receive specific actionable advice for timing their shifts to maximize earnings while minimizing traffic delays

### Real-Time Traffic Overlay
- **Functionality**: Live NYC DOT traffic intelligence displaying real-time traffic speeds and incident data across all five boroughs with interactive map visualization and borough filtering
- **Purpose**: Help drivers avoid congestion, plan optimal routes to high-earning zones, and stay informed about construction, accidents, events, and road closures that impact driving efficiency
- **Trigger**: Automatically displayed on Earnings Optimizer tab, refreshable on demand
- **Progression**: Component loads → AI generates realistic NYC DOT-style traffic data for major corridors (FDR Drive, West Side Highway, BQE, LIE, Major Deegan, Cross Bronx, etc.) → Displays current average speeds, travel time indices, and congestion status → Shows active incidents (construction, accidents, planned events, closures) with severity levels → Borough filter buttons allow focusing on specific areas → Traffic Speeds tab shows speed data with status-coded badges (free-flow/moderate/congested/severe) on interactive OpenFreeMap → Incidents tab shows construction and events with impact descriptions and timelines → Refresh button generates updated data reflecting current time patterns → Summary cards show citywide average speed, congestion count, active incidents, and corridors tracked
- **Success criteria**: Driver sees real-time traffic conditions across NYC with average speeds by corridor, identifies congested areas to avoid, learns about active construction and road closures, can filter by borough for focused planning, and receives actionable tips on using traffic intelligence to reach high-earning zones efficiently

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
- **Functionality**: Switch between License Manager, Earnings Optimizer, Ride Comparison, Ride Share Apps, Trip Calculator, and Chatroom views with persistent tab state
- **Purpose**: Organize distinct driver needs into focused, purpose-built interfaces
- **Trigger**: Click tab buttons in header
- **Progression**: User clicks tab → View switches → State persists → Returns to last used tab on app reload
- **Success criteria**: Driver can seamlessly navigate between compliance tracking, earnings optimization, ride comparison, platform information, trip income calculator, and driver communication

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

### Multi-Apping Tips
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
- **OpenFreeMap Integration**: Uses free, open-source OpenFreeMap tiles (Liberty style) from https://tiles.openfreemap.org/ via Cloudflare CDN. Repository configured as git remote `openfreemap` tracking https://github.com/telleriacarolina/openfreemap. Fetch updates with `git fetch openfreemap`. See OPENFREEMAP.md integration guide for details on tile styles, self-hosting options, and development workflows.
- **Marker Clustering**: OpenFreeMap automatically clusters nearby markers when displaying large datasets (100+ locations) to improve map performance and readability. Cluster size indicated by number badge, click to zoom and expand. Clustering enabled by default, automatically adjusts radius based on zoom level.
- **Duplicate Location Names**: Case-insensitive matching normalizes location names (e.g., "Manhattan" and "manhattan" treated as same)
- **Location Names with Different Spellings**: Each unique spelling treated as separate location, shows importance of consistent naming
- **Very Long Location Names**: Location labels truncated with ellipsis if needed for clean display
- **Heatmap Hover State**: Selected location details update in real-time as user hovers over bars
- **Zero Hours for Location**: Displays location but shows N/A for hourly rate when hours cannot be calculated
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

## Design Direction
The design should evoke confidence, empowerment, and professionalism - like having a compliance assistant, business advisor, platform expert, AI consultant, real-time traffic control center with access to both live NYC traffic intelligence and millions of historical NYC TLC trip records, and a supportive driver community network. It should feel official yet data-forward, with clear status indicators for compliance and compelling visualizations that reveal earning patterns and opportunities. The Chatroom should feel welcoming and community-focused, like having a driver's lounge where colleagues share real-time traffic tips, coordinate meetups, and build professional relationships - with clean message bubbles, clear sender identification, and intuitive online/offline status indicators that make connecting with fellow drivers effortless. The integration of OpenFreeMap provides free, open-source mapping tiles that give drivers true geographic context for their earnings data and real-time traffic conditions, showing exactly where on NYC streets their high-earning zones are located and which corridors are flowing freely without reliance on proprietary mapping services. The AI features should feel accessible and trustworthy, with a friendly brain icon and smooth animations that build confidence in the intelligent recommendations enhanced by both NYC DOT real-time data feeds (https://www.nyc.gov/html/dot/html/about/datafeeds.shtml) and NYC TLC Trip Record Data (https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page). The integration of both data sources should feel like having insider knowledge - historical TLC trip data reveals which neighborhoods consistently produce high fares ($35+ rides), what times of day see premium demand, and where tips are highest, while NYC DOT real-time feeds help drivers avoid construction zones, monitor traffic speeds, check planned events, and optimize routes to reach those proven high-fare locations efficiently. The Real-Time Traffic Overlay should feel like mission control for NYC drivers, with color-coded speed indicators (green for free-flow, yellow for moderate, orange for congested, red for severe) that instantly communicate road conditions, interactive maps showing live traffic across all five boroughs, and actionable incident alerts (construction, accidents, events, closures) that help drivers plan optimal routes. The interactive map views powered by OpenFreeMap should feel fluid and responsive, with custom markers showing earnings intensity and traffic conditions at each location, smooth zoom/pan controls, and seamless integration with statistical views. The Earnings Optimizer should feel energizing and opportunity-focused, while the License Manager maintains urgency around deadlines. The Ride Share Apps section should feel informative and comparative, helping drivers make strategic decisions about platform usage. The Ride Comparison view should feel analytical and detail-oriented, empowering drivers with granular insights into ride-by-ride profitability to make better decisions about which rides to accept. The Trip Calculator should feel powerful and decisive, presenting clear financial comparisons that help drivers choose between rideshare and medical transport opportunities with confidence. AI-powered features should feel like having an expert advisor in your pocket with access to both real-time city traffic data and years of historical trip patterns, always ready with personalized insights that factor in proven high-earning locations from TLC records, current traffic conditions, construction alerts, and event schedules.

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
  - **Tabs**: Primary navigation between License Manager, Earnings Optimizer, Ride Comparison, Ride Share Apps, Trip Calculator, and Chatroom views; Secondary navigation for Chart vs Map view in Location Heatmap and Chat vs Fellow Drivers in Chatroom
  - **OpenFreeMap**: Interactive map component using Leaflet with OpenFreeMap tiles (Liberty style, https://tiles.openfreemap.org/styles/liberty/{z}/{x}/{y}.png) and Leaflet.markercluster for geographic visualization of earnings locations and traffic patterns. Automatically clusters markers when displaying large datasets (100+ locations) with color-coded cluster size indicators (small: 1-20, medium: 21-100, large: 100+). Free, open-source tiles via Cloudflare CDN with no API keys or rate limits. Repository configured as git remote `openfreemap` tracking https://github.com/telleriacarolina/openfreemap - fetch updates with `git fetch openfreemap`. See integration guide for tile style options (Liberty/Bright/Positron), self-hosting, performance optimization, and development workflows. Alternative styles: Bright (clean/professional), Positron (minimal/data overlays).
  - **Card**: Primary container for license info, document groups, shift entries, ride entries, stat displays, platform details, and calculator results
  - **Badge**: Status indicators (Current, Expiring, Expired) with color variants, efficiency ratings, platform badges, fee percentages
  - **Dialog**: Modal for adding/editing license, documents, shift information, and individual rides
  - **Button**: Primary actions (yellow accent), secondary (outline), and icon buttons for quick actions
  - **Input**: Text fields for license numbers, document names, earnings amounts, shift details, ride locations, distances, times, pay amounts, and calculator inputs
  - **Select**: Dropdown for platform selection (Uber, Lyft, Via, Curb, Revel, Juno, Other), document types, rideshare platforms, and medical providers in calculator
  - **Textarea**: Notes fields for documents, shifts, and rides
  - **Alert**: Prominent warnings for expired items and insights callouts for earnings opportunities
  - **Progress**: Visual bars showing relative earnings performance between platforms and ride comparisons
  - **Separator**: Dividers between document groups, shift groups, and calculator sections
  - **Scroll Area**: For long lists of documents, shifts, and rides on mobile

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
  - Globe: Map view in location heatmap, geographic visualization
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
  - Globe: Platform availability
  - MapPin: Location markers for pickup/dropoff, veteran location insights, location heatmap, route stops
  - ArrowRight: Route direction indicator
  - Warning/WarningCircle: Expiring/expired alerts, important considerations
  - CheckCircle: Current/valid status
  - Plus: Add new document, shift, or ride
  - PencilSimple: Edit existing entries
  - Trash: Delete shifts or rides
  - DownloadSimple: CSV export for tax records
  - FirstAidKit: Medical transport icon
  - Percent: Platform fees and commission rates
  - TrafficSign: Real-time traffic overlay, traffic intelligence
  - Gauge: Traffic speed indicator, speed metrics
  - ArrowsClockwise: Refresh traffic data
  - X: Road closures, clear/cancel actions
  - FileText: Document tracking
  - CalendarBlank: Date/expiration displays, seasonal insights

- **Spacing**:
  - Page padding: px-6 py-8 (mobile), px-8 py-12 (desktop)
  - Card padding: p-5 for shifts, p-6 for license/documents
  - Stat cards: p-5 with generous spacing for large numbers
  - Section gaps: gap-6 for card grids, gap-4 for metric grids
  - Element gaps: gap-4 within cards, gap-2 for inline elements
  - Button padding: px-6 py-3 for primary, px-4 py-2 for secondary

- **Mobile**:
  - Single column layout for all cards on mobile (<768px)
  - Tabs span full width with clear touch targets, 6-column grid on larger screens wrapping as needed
  - Stat grid collapses to 2 columns on mobile
  - Platform cards stack in single column on mobile
  - Ride cards stack in single column on mobile, 2-column grid on desktop
  - Calculator comparison cards stack vertically on mobile, side-by-side on desktop
  - Chat interface optimized for mobile with full-width message bubbles
  - Fellow drivers list stacks in single column with touch-friendly cards
  - Larger touch targets (min 44px) for all interactive elements
  - Bottom sheet dialog variant for forms on mobile
  - Sticky tab navigation at top
  - Collapsible sections to reduce scroll length
