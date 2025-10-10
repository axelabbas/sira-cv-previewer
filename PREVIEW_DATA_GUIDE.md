# Preview Data Editor Guide

## Overview

The Preview Data Editor allows you to customize the sample data that appears when Preview Mode is enabled. This helps you see how your template will look with different data without modifying the template code.

## How to Use

### Opening the Editor

1. Click the **⚙️ Edit Data** button in the toolbar
2. A modal window will open with a JSON editor

### Editing the Data

The preview data is stored as JSON. You can:

- **Edit existing values** - Change names, emails, dates, etc.
- **Add new variables** - Create new fields in the JSON structure
- **Add/remove array items** - Modify lists like skills, education, work experience
- **Nest data** - Create complex object structures

### Example Structure

```json
{
  "personalData": {
    "fullname": "John Anderson",
    "email": "john@example.com",
    "phone": "+1 (555) 123-4567",
    "location": "San Francisco, CA",
    "summary": "A professional summary...",
    "skills": ["JavaScript", "React", "Node.js"],
    "education": [
      {
        "degree": "Master of Science",
        "institution": "Stanford University",
        "year": "2015"
      }
    ]
  },
  "experienceSections": [
    {
      "sectionName": "Work Experience",
      "entries": [
        {
          "company": "Tech Corp Inc.",
          "jobtitle": "Senior Software Engineer",
          "startDate": "Jan 2020",
          "endDate": "Present",
          "description": "Led development of..."
        }
      ]
    }
  ]
}
```

## Mapping to Template Variables

### Simple Variables
```html
{{ personalData.fullname }}
```
Maps to:
```json
{
  "personalData": {
    "fullname": "John Anderson"
  }
}
```

### Nested Variables
```html
{{ personalData.education[0].degree }}
```
Maps to:
```json
{
  "personalData": {
    "education": [
      {"degree": "Master of Science"}
    ]
  }
}
```

### Loops
```html
{% for skill in personalData.skills %}
  <span>{{ skill }}</span>
{% endfor %}
```
Maps to:
```json
{
  "personalData": {
    "skills": ["JavaScript", "React", "Node.js"]
  }
}
```

### Conditionals
```html
{% if personalData.summary %}
  <p>{{ personalData.summary }}</p>
{% endif %}
```
The section shows if `personalData.summary` exists and has a value.

## Adding New Variables

### Step 1: Add to JSON Data
In the **Edit Data** modal, add your new field:
```json
{
  "personalData": {
    "fullname": "John Anderson",
    "linkedin": "linkedin.com/in/john-anderson"  // New field
  }
}
```

### Step 2: Use in Template
In your HTML editor:
```html
<a href="{{ personalData.linkedin }}">LinkedIn</a>
```

### Step 3: Enable Preview Mode
Click **👁️ Preview: ON** to see the value rendered.

## Tips

### Valid JSON Syntax
- Keys must be in quotes: `"fullname"` not `fullname`
- String values in quotes: `"John"` not `John`
- Numbers without quotes: `123` not `"123"`
- Booleans: `true` or `false` (no quotes)
- Arrays: `["item1", "item2"]`
- Objects: `{"key": "value"}`

### Common Mistakes
❌ Missing comma between properties
```json
{
  "name": "John"
  "email": "john@example.com"  // Missing comma above
}
```

✅ Correct syntax
```json
{
  "name": "John",
  "email": "john@example.com"
}
```

### Testing Your Changes
1. Edit the JSON in the modal
2. Click **Save Changes**
3. Make sure **Preview Mode** is ON
4. Check the preview panel to see your data

### Resetting Data
Click **Reset to Current** in the modal to discard your changes and revert to the currently saved data.

## Advanced Usage

### Multiple Experience Sections
```json
{
  "experienceSections": [
    {
      "sectionName": "Work Experience",
      "entries": [...]
    },
    {
      "sectionName": "Volunteer Work",
      "entries": [...]
    }
  ]
}
```

### Conditional Sections with Data
```json
{
  "personalData": {
    "portfolio": "https://johndoe.com",
    "github": "https://github.com/johndoe"
  }
}
```

Template:
```html
{% if personalData.portfolio %}
  <a href="{{ personalData.portfolio }}">Portfolio</a>
{% endif %}
```

## Workflow

### Typical Editing Flow
1. **Design Template** - Write HTML with Jinja variables
2. **Edit Data** - Click ⚙️ Edit Data to customize values
3. **Preview** - Click 👁️ Preview: ON to see result
4. **Iterate** - Adjust template or data as needed
5. **Export** - Download the template (exports template, not data)

### Best Practices
- Keep data structure consistent with your template
- Use meaningful variable names
- Test with different data sets
- Use Preview Mode to catch template errors
- Remember: exported template contains variables, not data

## Troubleshooting

### Preview shows blank
- Check JSON syntax is valid
- Ensure variable names match between template and data
- Check browser console for errors

### Invalid JSON error
- Look for missing commas
- Check all quotes are properly closed
- Ensure no trailing commas in arrays/objects
- Use a JSON validator if needed

### Variables not rendering
- Verify the path matches: `personalData.fullname` must exist in JSON
- Check spelling and capitalization
- Ensure Preview Mode is ON

## Storage

- Preview data is saved automatically to localStorage
- Data persists across browser sessions
- Each browser/device has its own data
- Clearing browser data will reset to defaults

---

**Remember:** The preview data is only for testing. When you export, you get the template with Jinja variables, not the sample data.
