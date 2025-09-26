# **Readix Dashboard Design Prompt for v0**

## **Project Context**
Create a dashboard interface for Readix, a PDF reader application with AI chat capabilities. The dashboard serves as the main hub after user authentication.

## **Design Philosophy: Zen Minimalism**
- **Inspiration**: Japanese aesthetic principles - "ma" (negative space), wabi-sabi (imperfect beauty)
- **Core Principle**: "Read. Reflect. Remember." - Every element should support focused reading
- **Approach**: Subtle sophistication over flashy design

## **Color Palette**
```css
/* Primary */
--primary: #FEFEFE (warm white)
--primary-soft: #FAF9F6 (softer warm white)

/* Accent */
--accent: #E8F0E3 (soft sage green)
--accent-foreground: #2C2C2C

/* Text */
--foreground: #2C2C2C (deep charcoal)
--muted-foreground: #666666

/* Subtle */
--background: #F5F5F5 (light gray)
--border: rgba(44, 44, 44, 0.1)

/* Warning */
--warning: #D4A574 (muted amber)
```

## **Typography**
- **Headings**: Playfair Display (serif) - elegant, readable
- **Body**: Inter (sans-serif) - clean, modern
- **Hierarchy**: Clear size/weight differences, generous line spacing

## **Layout Requirements**

### **Dashboard Structure**
1. **Left Sidebar** (280px width)
   - Readix logo/branding at top
   - Navigation menu (minimal icons + text)
   - User profile section at bottom
   - Collapsible on smaller screens

2. **Main Content Area** 
   - Document library grid layout
   - "Stones in zen garden" arrangement
   - Responsive grid (3-4 cols desktop, 2 mobile)

3. **Header Bar** (minimal, 60px height)
   - Breadcrumb navigation
   - Search functionality  
   - User avatar/menu

### **Document Library (Main View)**

#### **Empty State**
- Central upload zone with dashed border
- Gentle hover animation
- "Drag & drop your first PDF here" message
- Small "+" icon, not overwhelming

#### **Populated State**
- Grid of document cards (like stones in garden)
- Each card: 240x160px approximately
- Subtle shadows (2px blur, low opacity)
- Rounded corners (6px)

#### **Document Cards**
```
Card Structure:
┌─────────────────┐
│   [File Icon]   │  <- PDF icon, subtle
│                 │
│   Document      │  <- Title, truncated
│   Title         │
│                 │
│   [metadata]    │  <- Date, size, small text
└─────────────────┘
```

- **Hover State**: Slight elevation, reveal action buttons
- **Actions**: View, Delete (only on hover)
- **Metadata**: Upload date, file size, page count

### **Navigation Menu Items**
- 📚 Documents (primary)
- 🔍 Search  
- ⭐ Favorites
- 📊 Analytics
- ⚙️ Settings
- 🚪 Sign Out

### **Interactive Elements**

#### **Upload Zone**
- Dashed border: `2px dashed rgba(44, 44, 44, 0.3)`
- Hover: Gentle color shift to sage green
- Active drag: Slight scale transform (1.02)

#### **Document Cards**
- Default: `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08)`
- Hover: `box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12)`
- Transition: `all 0.2s ease`

#### **Buttons**
- Primary: Sage green background, minimal
- Secondary: Ghost style, subtle borders
- Hover: Gentle opacity/color changes

## **Component Specifications**

### **Sidebar Component**
```jsx
- Logo area: 64px height
- Navigation items: 48px height each
- Icons: 20px, text: 14px
- Spacing: 16px between sections
- Background: #FEFEFE
- Border: 1px solid rgba(44, 44, 44, 0.08)
```

### **Document Card Component**
```jsx
- Size: 240px x 160px
- Padding: 16px
- Border radius: 6px
- Background: #FEFEFE
- Border: 1px solid rgba(44, 44, 44, 0.06)
```

### **Upload Zone Component**
```jsx
- Min height: 200px
- Border: 2px dashed rgba(44, 44, 44, 0.3)
- Border radius: 8px
- Text: "Drag & drop PDFs here or click to browse"
- Icon: Simple plus or upload icon
```

## **Responsive Behavior**
- **Desktop** (1200px+): 4-column grid, full sidebar
- **Tablet** (768px-1199px): 3-column grid, collapsed sidebar
- **Mobile** (767px-): 2-column grid, hidden sidebar (overlay on menu)

## **Accessibility**
- High contrast ratios (4.5:1 minimum)
- Keyboard navigation support
- Screen reader friendly
- Focus indicators visible

## **Technical Notes for v0**
- Use Tailwind CSS classes
- Implement with React components
- Include hover/focus states
- Add loading states for document cards
- Use Lucide React icons
- Support drag & drop file uploads

## **Key Features to Include**
1. Document grid with upload zone
2. Sidebar with navigation
3. Header with breadcrumbs
4. Search functionality
5. User profile area
6. Responsive design
7. Empty state handling

## **Mood/Feel**
Think: Apple's design clarity + Japanese minimalism + cozy reading nook. Clean, uncluttered, focused on content, with subtle warmth through typography and spacing choices.

## **Current Implementation Context**
- Already using shadcn/ui components
- Next.js 15 with App Router
- Tailwind CSS v4
- Playfair Display + Inter fonts configured
- Supabase for authentication and data
- Existing color scheme matches the zen aesthetic

## **Copy This Prompt to v0:**
"Create a React dashboard component for a PDF reading app called Readix. Design should be zen minimalist with Japanese aesthetic principles. Use warm whites (#FEFEFE, #FAF9F6), soft sage green accent (#E8F0E3), and deep charcoal text (#2C2C2C). 

Layout: Left sidebar (280px) with logo, navigation menu (Documents, Search, Favorites, Analytics, Settings), and user profile. Main area has document grid - cards 240x160px with subtle shadows and 6px border radius. Include empty state with dashed border upload zone.

Typography: Playfair Display for headings, Inter for body. Components should feel like 'stones in zen garden' - minimal, breathing space, hover reveals actions. Use Tailwind CSS and Lucide React icons. Make it responsive (4 cols desktop, 2 mobile)."