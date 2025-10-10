# CV Template Maker - Live HTML & CSS Editor with Jinja Support

A powerful web-based HTML & CSS editor built with React, TypeScript, and Vite. This tool allows you to create, edit, and preview HTML/CSS templates in real-time with full support for Jinja templating syntax.

![CV Template Maker](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue) ![Vite](https://img.shields.io/badge/Vite-6.0-purple)

## ✨ Features

### 🎨 Live Code Editing
- **Monaco Editor Integration** - Professional code editor with syntax highlighting
- **Dual Editors** - Separate tabs for HTML and CSS editing
- **Real-time Preview** - See changes instantly as you type (300ms debounce)
- **Auto-save** - Your work is automatically saved to localStorage

### 🔧 Jinja Template Support
- **Variable Syntax** - Use `{{ variableName }}` for dynamic data
- **Conditionals** - Support for `{% if condition %}` blocks
- **Loops** - Iterate with `{% for item in list %}` syntax
- **Visual Highlighting** - Jinja syntax is highlighted in the live preview
- **Export Ready** - Download as production-ready Jinja template

### 🎯 User Interface
- **Resizable Panels** - Drag the divider to adjust editor/preview sizes
- **Light/Dark Theme** - Toggle between themes with one click
- **Professional Layout** - Clean, modern design inspired by VS Code
- **Responsive** - Works on various screen sizes

### 📦 Export & Reset
- **Export as Jinja** - Download your template with all Jinja syntax intact
- **Reset Example** - Restore the default CV template instantly
- **Persistent Storage** - Your work is saved automatically

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**
```bash
cd cv-template-maker
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to the URL shown in the terminal (typically `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist` folder.

## 📁 Project Structure

```
cv-template-maker/
├── src/
│   ├── components/
│   │   ├── Editor.tsx          # Monaco editor with HTML/CSS tabs
│   │   ├── Editor.css
│   │   ├── Preview.tsx         # Live preview iframe
│   │   ├── Preview.css
│   │   ├── Toolbar.tsx         # Top toolbar with actions
│   │   ├── Toolbar.css
│   │   ├── ResizablePanel.tsx  # Drag-to-resize layout
│   │   └── ResizablePanel.css
│   ├── store/
│   │   └── editorStore.ts      # Zustand state management
│   ├── utils/
│   │   ├── editorUtils.ts      # Helper functions
│   │   └── index.ts
│   ├── constants/
│   │   └── defaultTemplate.ts  # Default HTML/CSS templates
│   ├── App.tsx                 # Main app component
│   ├── App.css
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles & themes
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 How to Use

### 1. Edit HTML/CSS
- Switch between HTML and CSS tabs in the left panel
- Start typing - changes appear in real-time on the right
- Monaco Editor provides IntelliSense and syntax highlighting

### 2. Use Jinja Syntax
Add dynamic variables:
```html
<h1>{{ personalData.fullname }}</h1>
<p>{{ personalData.email }}</p>
```

Add conditionals:
```html
{% if personalData.summary %}
  <section>{{ personalData.summary }}</section>
{% endif %}
```

Add loops:
```html
{% for skill in personalData.skills %}
  <span>{{ skill }}</span>
{% endfor %}
```

### 3. Preview & Adjust
- The preview updates automatically
- Jinja variables appear highlighted (yellow background)
- Jinja blocks appear highlighted (green background)
- Drag the center divider to resize panels

### 4. Export
- Click "📥 Export as Jinja Template" in the toolbar
- A `.html` file downloads with all Jinja syntax intact
- Use this file in your Flask/Django/Jinja2 project

### 5. Theme Toggle
- Click the 🌙/☀️ button to switch between light and dark themes
- Theme preference is saved automatically

## 🧱 Technical Stack

- **Frontend Framework**: React 18.3
- **Language**: TypeScript 5.6
- **Build Tool**: Vite 6.0
- **Code Editor**: Monaco Editor (VS Code editor)
- **State Management**: Zustand (with localStorage persistence)
- **Styling**: CSS Modules with CSS Variables for theming

## 🔍 Key Features Explained

### Real-time Preview
The preview updates with a 300ms debounce to prevent excessive re-renders while typing. Changes to both HTML and CSS are reflected instantly.

### Jinja Highlighting
The preview uses regex to detect Jinja syntax and wraps it in styled spans:
- `{{ variable }}` - Yellow highlight
- `{% block %}` - Green highlight

This visual feedback helps you see where dynamic content will be inserted.

### Export Functionality
When you export, the HTML and CSS are combined into a single file with the CSS injected into the `<style>` tag, preserving all Jinja syntax exactly as written.

### Local Storage
Your HTML and CSS are automatically saved to localStorage every time you make changes. When you return, your work is restored.

## 🎯 Use Cases

- **CV/Resume Templates** - Create professional resume templates with dynamic data
- **Email Templates** - Design HTML emails with Jinja variables
- **Web Components** - Build reusable HTML/CSS components
- **Static Site Templates** - Create templates for static site generators
- **Rapid Prototyping** - Quickly test HTML/CSS ideas

## 🛠️ Customization

### Adding More Default Templates
Edit `src/constants/defaultTemplate.ts` to change the initial HTML/CSS.

### Modifying Theme Colors
Update CSS variables in `src/index.css` under the theme sections.

### Adjusting Debounce Time
Change the debounce value in `src/components/Preview.tsx` (currently 300ms).

## 📝 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 💡 Tips

1. **Keyboard Shortcuts**: Monaco Editor supports VS Code shortcuts (Ctrl+F for find, etc.)
2. **Multi-cursor Editing**: Hold Alt and click to add multiple cursors
3. **Format Code**: Right-click in the editor and select "Format Document"
4. **Undo/Redo**: Standard Ctrl+Z and Ctrl+Y work in the editors

## 🐛 Known Limitations

- Jinja syntax is not evaluated in the preview - it's only highlighted
- JavaScript in the HTML is not executed in the preview (for security)
- The iframe is sandboxed for safety

## 🚀 Future Enhancements

- [ ] Live data injection for testing Jinja variables
- [ ] Multiple template save slots
- [ ] Export to PDF preview
- [ ] Collaborative editing
- [ ] Template gallery/marketplace
- [ ] CSS preprocessor support (SASS/LESS)

---

Built with ❤️ using React, TypeScript, and Vite
