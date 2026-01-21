# ✨ Welcome to Your Spark Template!
You've just launched your brand-new Spark Template Codespace — everything’s fired up and ready for you to explore, build, and create with Spark!

This template is your blank canvas. It comes with a minimal setup to help you get started quickly with Spark development.

🚀 What's Inside?
- A clean, minimal Spark environment
- Pre-configured for local development
- Ready to scale with your ideas
- Three-layer typography system for responsive, elegant text handling
  
🧠 What Can You Do?

Right now, this is just a starting point — the perfect place to begin building and testing your Spark applications.

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
