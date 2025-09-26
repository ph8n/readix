```
src/app/
├── (auth)/                 # auth group
│   ├── login/
│   └── signup/
├── (dashboard)/           # Protected dashboard group  
│   ├── documents/         # Document library
│   ├── read/[id]/        # PDF reading view
│   └── layout.tsx        # Sidebar + minimal header
├── page.tsx              # Landing/welcome
└── layout.tsx            # Root layout
```

## Visual Design Elements

### Color Palette

```
Primary: Warm whites (#FEFEFE, #FAF9F6)
Accent: Soft sage green (#E8F0E3) 
Text: Deep charcoal (#2C2C2C)
Subtle: Light gray (#F5F5F5)
Warning: Muted amber (#D4A574)
```

### Typography

- **Headings**: Clean serif (Playfair Display, Lora)
- **Body**: Modern sans (Inter, Nunito Sans)
- **Japanese inspiration**: Consider subtle vertical text elements

### Components

- **Cards**: Subtle shadows, rounded corners (4-8px)
- **Buttons**: Ghost-style, minimal borders, hover states
- **Upload**: Dashed border zone, gentle hover animations
- **Navigation**: Breadcrumbs like stepping stones

## Page Layouts

### Landing Page (/)

- **Hero**: Minimal with single focus - "Read. Reflect. Remember."
- **Aesthetic**: Clean typography, subtle paper texture, maybe cherry blossom accent
- **CTA**: Simple "Enter Library" button

### Document Library (/documents)

- **Layout**: Grid of document cards like stones in a zen garden
- **Cards**: Minimal - just title, type icon, subtle shadow
- **Actions**: Hover reveals options (view, delete) - no clutter
- **Upload**: Central floating "+" or drag zone with gentle animation

### Reading View (/read/[id])

- **Focus**: PDF takes 70% width, minimal controls
- **Sidebar**: Thin, retractable - document info, bookmarks
- **Colors**: Warm whites, soft grays, minimal black text

## Navigation Philosophy

- **Minimal breadcrumbs** instead of complex menus
- **Progressive disclosure** - show only what's needed
- **Gentle transitions** between states
- **Contextual actions** appear on hover/focus

## Design Decisions

### 1. **Homepage approach**: Simple landing page ✓

**Decision: Keep the simple landing page**
- Current implementation with "Read. Reflect. Remember." philosophy aligns perfectly with zen aesthetic
- Landing page provides gentle introduction before requiring authentication
- "Enter Library" button offers clear navigation without being pushy
- Respects Japanese design principle of gradual disclosure

### 2. **Document cards**: Grid view primary, with optional list toggle ✓

**Decision: Grid view primary, with optional list toggle**
- Grid view aligns with "stones in a zen garden" concept
- Start with grid as default for visual appeal with document previews
- Add subtle toggle option for users preferring list view efficiency
- Grid cards remain minimal: title, file type icon, subtle shadow

### 3. **Reading interface**: Flexible sidebar with fullscreen option ✓

**Decision: Flexible sidebar with fullscreen option**
- Default: PDF 70% width with retractable sidebar (matches design brief)
- Add fullscreen toggle for immersive reading
- Sidebar stays minimal: document info, bookmarks only
- Use smooth transitions between states to maintain zen-like flow

### 4. **Japanese elements**: Subtle approach ✓

**Decision: Subtle approach (well implemented)**
- Current typography (Playfair Display + Inter) works excellently
- Existing color palette (#FEFEFE, #E8F0E3, #2C2C2C) captures aesthetic perfectly
- Focus on: generous whitespace, subtle textures, gentle transitions
- Avoid literal imagery - let minimalism speak for itself
- Consider subtle vertical text elements for navigation breadcrumbs

### 5. **Upload experience**: Inline drag zone ✓

**Decision: Inline drag zone in document library**
- Central floating "+" or drag zone with gentle animation
- Appears in document grid as special card when library empty or via persistent upload area
- Modal overlays would break zen flow
- Dedicated upload page adds unnecessary friction
- Drag-and-drop with subtle visual feedback maintains calm aesthetic
