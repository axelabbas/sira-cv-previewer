# Quick Start Guide

## 🚀 Run the Application

```bash
npm run dev
```

Then open your browser to the URL shown (typically http://localhost:5173)

## 📝 Basic Usage

1. **Edit Code**: Use the HTML/CSS tabs on the left to write your code
2. **See Preview**: Watch the right panel update automatically as you type
3. **Export**: Click "Export as Jinja Template" to download your file
4. **Reset**: Click "Reset Example" to restore the default template

## 🎨 Jinja Syntax Examples

### Variables
```html
{{ personalData.fullname }}
{{ personalData.email }}
{{ personalData.phone }}
```

### Conditionals
```html
{% if condition %}
  Content here
{% endif %}

{% if personalData.summary %}
  <p>{{ personalData.summary }}</p>
{% endif %}
```

### Loops
```html
{% for item in list %}
  <div>{{ item }}</div>
{% endfor %}

{% for skill in personalData.skills %}
  <span>{{ skill }}</span>
{% endfor %}
```

### Nested Loops
```html
{% for section in experienceSections %}
  <h2>{{ section.sectionName }}</h2>
  {% for entry in section.entries %}
    <div>{{ entry.company }} - {{ entry.jobtitle }}</div>
  {% endfor %}
{% endfor %}
```

## 🎯 Tips

- **Drag to Resize**: Click and drag the vertical divider to adjust panel sizes
- **Theme Toggle**: Click the 🌙/☀️ button to switch themes
- **Auto-Save**: Your work saves automatically to browser storage
- **Monaco Shortcuts**: All VS Code shortcuts work (Ctrl+F to find, etc.)

## 📦 File Structure

```
src/
├── components/      # UI components
├── store/          # State management
├── utils/          # Helper functions
├── constants/      # Default templates
└── hooks/          # Custom React hooks
```

## 🔧 Customization

### Change Default Template
Edit: `src/constants/defaultTemplate.ts`

### Modify Theme Colors
Edit: `src/index.css` (look for CSS variables)

### Adjust Preview Debounce
Edit: `src/components/Preview.tsx` (line ~13)

## 🐛 Troubleshooting

**Preview not updating?**
- Check browser console for errors
- Try refreshing the page
- Clear localStorage and reload

**Export not working?**
- Check browser's download settings
- Make sure pop-ups are not blocked

**Theme not changing?**
- Clear browser cache
- Check localStorage in DevTools

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Jinja2 Documentation](https://jinja.palletsprojects.com/)
- [Zustand State Management](https://zustand-demo.pmnd.rs/)
