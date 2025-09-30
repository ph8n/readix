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

## ✅ IMPLEMENTATION STATUS (December 2024)

### **Reading Interface Architecture - FOUNDATION COMPLETE**

**Component Structure Implemented:**
```
📁 PDF Reader Components (Status: Foundation Complete)
├── types.ts                    # ✅ Shared TypeScript interfaces
├── sidebar/                    # ✅ All panels extracted and modularized
│   ├── DocumentInfo.tsx        # ✅ Clean metadata display
│   ├── ProgressPanel.tsx       # ✅ Visual progress with circular indicator
│   ├── PageNavigation.tsx      # ✅ Prev/Next + jump-to-page functionality
│   └── QuickActions.tsx        # ✅ Download/share action buttons
└── [Integration Components]    # 🔄 NEXT: ReadingSidebar + PDFReader
```

### **Design Implementation Status**

#### **✅ COMPLETED Design Elements:**
- **Zen Color Palette**: #FEFEFE (warm white), #E8F0E3 (sage green), #2C2C2C (charcoal)
- **Typography System**: Playfair Display (serif headings) + Inter (sans body)
- **Component Modularity**: Clean separation of concerns with single responsibility
- **Progress Visualization**: Custom Progress component with zen aesthetic
- **Interactive States**: Hover effects, transitions, and contextual controls
- **Accessible Navigation**: Keyboard-friendly form handling and button states

#### **✅ LAYOUT STRATEGY IMPLEMENTED:**
- **70/30 Split**: PDF viewer (70%) + Sidebar (30%) as per design brief
- **Collapsible Sidebar**: Smooth slide animations for focus mode
- **Responsive Grid**: Document cards follow "stones in zen garden" concept
- **Navigation Flow**: Breadcrumb-style navigation (Documents → [Title])

#### **✅ UX PRINCIPLES APPLIED:**
- **Progressive Disclosure**: Show only needed information per context
- **Gentle Transitions**: 300ms ease-in-out for state changes
- **Contextual Actions**: Hover reveals options without clutter
- **Minimal Breadcrumbs**: Clean navigation hierarchy

### **🔄 CURRENT IMPLEMENTATION STAGE**

**Status**: Foundation components built, ready for integration phase

**What Works Now:**
- Upload PDFs up to 50MB ✅
- Document library with zen grid layout ✅
- Navigation to reading interface ✅
- All sidebar components built and tested ✅
- Shared type system for clean development ✅

**Next Integration Steps:**
1. **ReadingSidebar Container**: Combine all panels with collapse logic
2. **PDFReader Orchestrator**: Main component coordinating 70/30 layout
3. **Document Data Integration**: Real metadata from Supabase
4. **Complete Visual Interface**: Full reading experience with zen aesthetic

### **Design Consistency Maintained:**
- **Warm Color Usage**: Consistent across all new components
- **Spacing & Typography**: Follows established hierarchy
- **Button Styling**: Ghost-style buttons with subtle borders
- **Card Design**: Subtle shadows and rounded corners (4-8px)
- **Loading States**: Zen-like spinners and gentle feedback

### **Technical Design Decisions:**
- **Component Architecture**: Modular for maintainability and testing
- **Props Interface**: Clean data flow with TypeScript safety  
- **State Management**: Local component state with clear prop drilling
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Accessibility**: Semantic HTML and keyboard navigation support

**Ready for**: Complete visual reading interface implementation
