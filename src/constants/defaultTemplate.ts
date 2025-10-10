export const DEFAULT_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ personalData.fullname }} - CV</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f4f4f4;
        padding: 20px;
      }

      .container {
        max-width: 900px;
        margin: 0 auto;
        background: white;
        padding: 40px;
        box-shadow: 0 0 20px rgba(0,0,0,0.1);
        border-radius: 8px;
      }

      header {
        border-bottom: 3px solid #2c3e50;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }

      h1 {
        color: #2c3e50;
        font-size: 2.5em;
        margin-bottom: 10px;
      }

      h2 {
        color: #34495e;
        font-size: 1.8em;
        margin-bottom: 15px;
        margin-top: 25px;
        border-bottom: 2px solid #3498db;
        padding-bottom: 8px;
      }

      .contact-info {
        color: #7f8c8d;
        font-size: 1.1em;
      }

      .contact-info a {
        color: #3498db;
        text-decoration: none;
      }

      .contact-info a:hover {
        text-decoration: underline;
      }

      section {
        margin-bottom: 30px;
      }

      .summary {
        font-size: 1.1em;
        line-height: 1.8;
        color: #555;
        font-style: italic;
        padding: 15px;
        background-color: #ecf0f1;
        border-left: 4px solid #3498db;
        border-radius: 4px;
      }

      .experience-item {
        margin-bottom: 25px;
        padding-left: 15px;
        border-left: 3px solid #e0e0e0;
      }

      .experience-header {
        font-size: 1.2em;
        margin-bottom: 5px;
      }

      .company {
        font-weight: bold;
        color: #2c3e50;
      }

      .job-title {
        color: #555;
      }

      .experience-date {
        color: #7f8c8d;
        font-size: 0.95em;
        margin-bottom: 10px;
      }

      .experience-description {
        color: #666;
        line-height: 1.7;
      }

      .skills {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 15px;
      }

      .skill-tag {
        background-color: #3498db;
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.95em;
        display: inline-block;
      }

      .education-item {
        margin-bottom: 15px;
        padding-left: 15px;
        border-left: 3px solid #e0e0e0;
      }

      .education-date {
        color: #7f8c8d;
        font-size: 0.95em;
        margin-top: 5px;
      }

      @media print {
        body {
          background-color: white;
          padding: 0;
        }
        
        .container {
          box-shadow: none;
          padding: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <header>
        <h1>{{ personalData.fullname }}</h1>
        <p class="contact-info">
          {{ personalData.location }} | {{ personalData.phone }} |
          <a href="mailto:{{ personalData.email }}">{{ personalData.email }}</a>
          {% if personalData.protfilio %}
          | <a href="{{ personalData.protfilio }}" target="_blank">Portfolio</a>
          {% endif %}
        </p>
      </header>
      
      {% if personalData.summary %}
      <section>
        <h2>Professional Summary</h2>
        <p class="summary">{{ personalData.summary }}</p>
      </section>
      {% endif %}
      
      {% for section in experinceSections %}
      <section>
        <h2>{{ section.sectionName }}</h2>
        {% for entry in section.entries %}
        <div class="experience-item">
          <div class="experience-header">
            <span class="company">{{ entry.company }}</span> - <span class="job-title">{{ entry.jobtitle }}</span>
          </div>
          <div class="experience-date">{{ entry.startyear }} - {{ entry.endyear }}</div>
          <p class="experience-description">{{ entry.description }}</p>
        </div>
        {% endfor %}
      </section>
      {% endfor %}
      
      {% if skills %}
      <section>
        <h2>Skills</h2>
        <div class="skills">
          {% for skill in skills %}
          <span class="skill-tag">{{ skill }}</span>
          {% endfor %}
        </div>
      </section>
      {% endif %}
      
      {% if education %}
      <section>
        <h2>Education</h2>
        {% for edu in education %}
        <div class="education-item">
          <strong>{{ edu.department }}</strong> - {{ edu.school }}
          <div class="education-date">{{ edu.level }} | {{ edu.startyear }} - {{ edu.endyear }}</div>
        </div>
        {% endfor %}
      </section>
      {% endif %}
    </div>
  </body>
</html>`;

// Keep legacy exports for compatibility during transition
export const DEFAULT_HTML = DEFAULT_TEMPLATE;
export const DEFAULT_CSS = ``;
