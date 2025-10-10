# Project Summary: CV Template Maker

## 🎯 What Was Built

A complete, production-ready web application for creating and editing HTML/CSS templates with Jinja templating syntax support. The application features:

- Live code editing with Monaco Editor
- Real-time preview with automatic updates
- Jinja syntax highlighting in preview
- Export functionality to download templates
- Light/dark theme support
- Resizable split-pane layout
- Persistent storage using localStorage

## 📂 Project Structure

```
cv-template-maker/
├── src/
│   ├── components/          # React components
│   │   ├── Editor.tsx       # Monaco editor with HTML/CSS tabs
│   │   ├── Editor.css
│   │   ├── Preview.tsx      # Live preview with iframe
│   │   ├── Preview.css
│   │   ├── Toolbar.tsx      # Top toolbar with actions
│   │   ├── Toolbar.css
│   │   ├── ResizablePanel.tsx  # Drag-to-resize layout
│   │   └── ResizablePanel.css
│   ├── store/
│   │   └── editorStore.ts   # Zustand state management
│   ├── utils/
│   │   ├── editorUtils.ts   # Helper functions
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useClickOutside.ts
│   │   └── index.ts
│   ├── constants/
│   │   └── defaultTemplate.ts  # Default HTML/CSS
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── index.css            # Global styles & theme variables
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md                # Original Vite template README
├── USAGE.md                 # Comprehensive usage documentation
└── QUICKSTART.md            # Quick reference guide
```

## 🔑 Key Technologies

### Core Stack
- **React 18.3** - UI framework
- **TypeScript 5.6** - Type safety
- **Vite 6.0** - Build tool and dev server

### Libraries
- **@monaco-editor/react** - VS Code editor component
- **Zustand** - Lightweight state management with persistence

### Features Implemented
- ✅ Monaco Editor integration
- ✅ HTML/CSS tabs
- ✅ Real-time preview with debouncing
- ✅ Jinja syntax highlighting ({{ }} and {% %})
- ✅ Export to .html file
- ✅ Reset to default template
- ✅ Light/dark theme toggle
- ✅ Resizable panels with drag handle
- ✅ localStorage persistence
- ✅ Professional UI/UX

## 🎨 Component Architecture

### 1. App.tsx
Main application component that:
- Manages theme state
- Composes all components
- Sets up the layout structure

### 2. Toolbar.tsx
Top navigation bar with:
- Title and subtitle
- Theme toggle button
- Reset button
- Export button

### 3. Editor.tsx
Code editor component featuring:
- Monaco Editor integration
- HTML/CSS tab switching
- Syntax highlighting
- Auto-complete
- VS Code shortcuts

### 4. Preview.tsx
Live preview panel that:
- Renders HTML/CSS in iframe
- Highlights Jinja syntax visually
- Debounces updates (300ms)
- Sandboxed for security

### 5. ResizablePanel.tsx
Layout component providing:
- Drag-to-resize functionality
- Min/max width constraints
- Smooth resize experience

## 🔧 Utility Functions

### editorUtils.ts

**highlightJinjaSyntax(html: string)**
- Detects {{ }} and {% %} patterns
- Wraps them in styled spans
- Adds visual highlighting

**debounce(func, wait)**
- Prevents excessive function calls
- Used for preview updates
- Improves performance

**exportAsJinjaTemplate(html, css)**
- Combines HTML and CSS
- Creates downloadable blob
- Preserves Jinja syntax

**updateIframeContent(iframe, html, css)**
- Injects content into iframe
- Applies Jinja highlighting
- Updates preview safely

## 💾 State Management

Using Zustand with persistence:

```typescript
interface EditorState {
  html: string;           // Current HTML code
  css: string;            // Current CSS code
  theme: 'light' | 'dark'; // UI theme
  setHtml: (html: string) => void;
  setCss: (css: string) => void;
  setTheme: (theme: Theme) => void;
  reset: () => void;      // Restore defaults
}
```

Persisted to localStorage automatically.

## 🎨 Theming System

CSS variables for easy customization:

**Light Theme:**
- Clean white backgrounds
- Blue accents (#3498db)
- Dark text on light background

**Dark Theme:**
- Dark gray backgrounds (#1e1e1e)
- Same blue accents
- Light text on dark background

All components use CSS variables for consistent theming.

## 🚀 Running the Project

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

## 📝 Default Template

Pre-loaded with a professional CV template including:
- Header with contact info
- Professional summary (conditional)
- Experience sections (with loops)
- Skills section (with loops)
- Education section (conditional)

All using Jinja syntax for dynamic data.

## ✨ Jinja Support Features

### Variables
```html
{{ personalData.fullname }}
{{ personalData.email }}
```

### Conditionals
```html
{% if personalData.summary %}
  <p>{{ personalData.summary }}</p>
{% endif %}
```

### Loops
```html
{% for skill in personalData.skills %}
  <span>{{ skill }}</span>
{% endfor %}
```

### Nested Structures
```html
{% for section in experienceSections %}
  {% for entry in section.entries %}
    {{ entry.company }}
  {% endfor %}
{% endfor %}
```

## 🎯 User Workflows

### Editing Workflow
1. User opens app
2. Sees default template loaded
3. Switches between HTML/CSS tabs
4. Types code → Preview updates
5. Drags divider to adjust view
6. Toggles theme as needed

### Export Workflow
1. User finishes editing
2. Clicks "Export as Jinja Template"
3. Browser downloads .html file
4. File contains all Jinja syntax
5. Ready for Flask/Django/etc.

### Reset Workflow
1. User clicks "Reset Example"
2. Confirmation dialog appears
3. User confirms
4. Default template restored
5. localStorage updated

## 🔒 Security Features

- **Sandboxed iframe** - Preview cannot access parent DOM
- **No JavaScript execution** - Scripts in preview are not run
- **localStorage only** - No server-side data storage
- **Client-side only** - No backend vulnerabilities

## 🎨 UI/UX Highlights

- **Professional design** - Clean, modern interface
- **Smooth interactions** - Transitions and animations
- **Visual feedback** - Hover states, active states
- **Responsive layout** - Works on different screen sizes
- **Keyboard shortcuts** - Monaco Editor shortcuts work
- **Intuitive controls** - Clear button labels and icons

## 📊 Performance Optimizations

- **Debounced updates** - Prevents excessive re-renders
- **useMemo hooks** - Memoizes expensive operations
- **Lazy loading** - Monaco loads only when needed
- **Efficient state** - Zustand is lightweight
- **CSS variables** - Fast theme switching

## 🧪 Testing Recommendations

To test the application:
1. Load the app
2. Verify default template appears
3. Edit HTML → Check preview updates
4. Edit CSS → Check styles apply
5. Add Jinja syntax → Check highlighting
6. Export → Verify download works
7. Toggle theme → Check colors change
8. Resize panels → Check drag works
9. Reset → Check confirmation works
10. Refresh → Check localStorage works

## 📚 Documentation Files

- **README.md** - Original Vite template info
- **USAGE.md** - Comprehensive user guide
- **QUICKSTART.md** - Quick reference
- **PROJECT_SUMMARY.md** - This file

## 🎯 Success Criteria Met

✅ Built with React + TypeScript + Vite
✅ Monaco Editor integration
✅ HTML/CSS dual editors
✅ Live preview with real-time updates
✅ Jinja variable support ({{ }})
✅ Jinja conditionals support ({% if %})
✅ Jinja loops support ({% for %})
✅ Visual highlighting of Jinja syntax
✅ Export functionality
✅ Reset functionality
✅ Theme toggle (light/dark)
✅ Resizable panels
✅ localStorage persistence
✅ Debounced updates
✅ Clean folder structure
✅ Professional UI/UX

## 🚀 Next Steps

The application is ready to use! To get started:

```bash
npm run dev
```

Then open your browser and start creating templates!

---

**Total Development Time:** Complete implementation
**Lines of Code:** ~1000+ (excluding dependencies)
**Components:** 5 main components
**Utilities:** 4 helper functions
**State Management:** Zustand with persistence
**Type Safety:** Full TypeScript coverage
