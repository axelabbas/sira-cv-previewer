# Features & Capabilities

## ✨ Core Features

### 🎨 Live Code Editor
- **Monaco Editor** - The same editor that powers VS Code
  - Syntax highlighting for HTML and CSS
  - IntelliSense and autocomplete
  - Multi-cursor editing (Alt+Click)
  - Find and replace (Ctrl+F)
  - Code folding
  - Bracket matching
  - Auto-indentation
  - Format document
  - Line numbers
  - Minimap (disabled by default for cleaner look)

### 📝 Dual Editor Tabs
- **HTML Tab** - Write your template structure
  - Full HTML5 support
  - Jinja template syntax
  - Real-time validation
  - Syntax highlighting

- **CSS Tab** - Style your templates
  - Modern CSS support
  - Flexbox and Grid
  - CSS variables
  - Media queries
  - Animations

### 👁️ Live Preview Panel
- **Real-time Updates** - See changes instantly as you type
  - 300ms debounce to prevent lag
  - Updates both HTML and CSS changes
  - Smooth transitions

- **Jinja Syntax Highlighting**
  - Variables `{{ }}` - Yellow highlight with subtle border
  - Blocks `{% %}` - Green highlight with subtle border
  - Visual distinction without breaking layout
  - Monospace font for template syntax

- **Sandboxed iframe** - Safe preview environment
  - Isolated from main page
  - No JavaScript execution
  - Prevents XSS attacks
  - Clean rendering

### 🔧 Jinja Template Support

#### Variables
```html
{{ variable }}
{{ object.property }}
{{ nested.object.property }}
```

#### Conditionals
```html
{% if condition %}
{% elif other_condition %}
{% else %}
{% endif %}
```

#### Loops
```html
{% for item in list %}
{% endfor %}

{% for key, value in dict.items() %}
{% endfor %}
```

#### Nested Structures
```html
{% for section in sections %}
  {% if section.visible %}
    {% for item in section.items %}
      {{ item.name }}
    {% endfor %}
  {% endif %}
{% endfor %}
```

### 💾 Export Functionality
- **Download as HTML** - Get production-ready templates
  - All Jinja syntax preserved
  - CSS embedded in `<style>` tag
  - Clean, formatted output
  - Ready for Flask/Django/Jinja2

- **Filename** - Downloads as `cv-template.html`
  - Can be used directly in web frameworks
  - Compatible with static site generators

### 🔄 Reset to Example
- **Restore Default** - Go back to the starting template
  - Confirmation dialog to prevent accidents
  - Restores both HTML and CSS
  - Updates localStorage
  - Professional CV example template included

### 🎨 Theme Support
- **Light Theme**
  - Clean white backgrounds
  - Dark text (#1a1a1a)
  - Blue accents (#3498db)
  - Professional appearance

- **Dark Theme**
  - Dark backgrounds (#1e1e1e)
  - Light text (#cccccc)
  - Same blue accents
  - Easy on the eyes

- **Instant Toggle** - Switch with one click
  - Smooth transitions
  - Persistent across sessions
  - Affects all UI elements

### 📐 Resizable Layout
- **Drag to Resize** - Adjust panel sizes
  - Click and drag the divider
  - Visual feedback on hover
  - Smooth resize animation
  - Min/max constraints (30%-70%)
  - Maintains aspect ratios

- **Flexible Panels**
  - Left: Code editor
  - Right: Live preview
  - Adapt to your workflow

### 💾 Auto-Save
- **localStorage Persistence**
  - Automatically saves HTML code
  - Automatically saves CSS code
  - Saves theme preference
  - No manual save needed

- **Session Recovery**
  - Return to your work after closing
  - Survives page refreshes
  - Per-browser storage

## 🎯 User Experience

### Keyboard Shortcuts
All VS Code shortcuts work in Monaco Editor:
- **Ctrl+F** - Find
- **Ctrl+H** - Find and replace
- **Ctrl+Z** - Undo
- **Ctrl+Y** - Redo
- **Ctrl+D** - Select next occurrence
- **Alt+Click** - Add cursor
- **Ctrl+/** - Toggle comment
- **Alt+Up/Down** - Move line up/down

### Visual Feedback
- **Hover Effects** - Buttons and controls
- **Active States** - Current tab highlighted
- **Smooth Transitions** - Theme changes, panel resize
- **Loading States** - Monaco editor initialization
- **Focus States** - Accessible keyboard navigation

### Professional UI
- **Clean Layout** - No clutter
- **Intuitive Controls** - Clear labels
- **Icon Support** - Emoji icons for quick recognition
- **Consistent Spacing** - Well-organized interface
- **Modern Design** - Inspired by VS Code

## 🔒 Security Features

### Safe Preview
- **Sandboxed iframe** - `sandbox="allow-same-origin"`
- **No JavaScript execution** - Scripts are not run
- **DOM isolation** - Cannot access parent window
- **CSS-only rendering** - Safe styling only

### Client-Side Only
- **No backend** - All processing in browser
- **No data upload** - Nothing sent to servers
- **localStorage only** - Local browser storage
- **Privacy-focused** - Your code stays with you

## ⚡ Performance

### Optimizations
- **Debounced Updates** - Prevents excessive re-renders
- **useMemo Hooks** - Memoizes expensive operations
- **Efficient State** - Zustand is lightweight
- **CSS Variables** - Fast theme switching
- **Lazy Components** - Load only when needed

### Fast Load Times
- **Vite Build** - Optimized production builds
- **Code Splitting** - Load what you need
- **Tree Shaking** - Remove unused code
- **Minification** - Compressed output

## 🎨 Customization

### Easy to Modify
- **CSS Variables** - Change colors easily
- **Component-based** - Edit individual parts
- **TypeScript Types** - Type-safe customization
- **Well-documented** - Comments and guides

### Extensible
- **Add new themes** - Update CSS variables
- **Add new features** - Component architecture
- **Add new templates** - Edit constants file
- **Add new utilities** - Helper functions ready

## 📱 Browser Support

### Modern Browsers
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Opera (latest)

### Features Used
- ES6+ JavaScript
- CSS Grid and Flexbox
- CSS Variables
- localStorage API
- Blob and URL APIs

## 🎓 Learning Features

### Great for Learning
- **See Results Instantly** - Immediate feedback
- **Experiment Safely** - Can always reset
- **Example Template** - Learn from working code
- **Visual Highlighting** - Understand template syntax

### Educational Value
- Learn HTML/CSS structure
- Understand Jinja templating
- Practice responsive design
- Experiment with layouts
- Test CSS properties

## 🚀 Production Ready

### Professional Output
- Clean, valid HTML
- Optimized CSS
- Production-ready templates
- Framework-compatible

### Real-World Use Cases
- CV/Resume templates
- Email templates
- Landing pages
- Documentation pages
- Static site components
- Content templates

## 🎁 Bonus Features

### Developer Experience
- **Hot Module Replacement** - Vite HMR
- **TypeScript Support** - Full type safety
- **ESLint** - Code quality
- **Fast Refresh** - Instant updates

### Documentation
- Comprehensive README
- Quick start guide
- Usage documentation
- Project summary
- Feature list (this file)

---

**Total Feature Count:** 50+ features and capabilities
**Framework:** React + TypeScript + Vite
**Editor:** Monaco Editor (VS Code)
**State:** Zustand with persistence
**Styling:** CSS Variables + Modern CSS
