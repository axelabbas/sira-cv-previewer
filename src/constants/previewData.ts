/**
 * Sample preview data for Jinja template variables
 */
export const PREVIEW_DATA = {
  personalData: {
    fullname: 'Axel Abbas',
    email: 'fadelabdabbas@gmail.com',
    phone: '07711914860',
    location: 'Baghdad',
    protfilio: 'https://fadelwebsite.com', // Optional
    summary: 'Experienced software engineer with 8+ years of expertise in full-stack development, specializing in React, TypeScript, and Node.js.' // Optional
  },
  skills: [
    'JavaScript/TypeScript',
    'React & Redux',
    'Node.js & Express',
    'Python & Django',
    'PostgreSQL & MongoDB',
    'Leadership',
    'Problem Solving'
  ],
  education: [
    {
      department: 'Computer Science',
      school: 'University of Technology',
      level: 'bachelors',
      startyear: '2024',
      endyear: '2028',
      isPresent: false
    },
    {
      department: 'Software Engineering',
      school: 'Baghdad University',
      level: 'masters',
      startyear: '2028',
      endyear: 'Present',
      isPresent: true
    }
  ],
  experinceSections: [
    {
      sectionName: 'Work Experience',
      deleteable: false,
      entries: [
        {
          company: 'Tech Corp Inc.',
          jobtitle: 'Senior Software Engineer',
          startyear: '2020',
          endyear: 'Present',
          isPresent: true,
          description: 'Led development of microservices architecture serving 2M+ users. Mentored team of 5 junior developers and improved code quality through automated testing.'
        },
        {
          company: 'StartupXYZ',
          jobtitle: 'Full Stack Developer',
          startyear: '2017',
          endyear: '2019',
          isPresent: false,
          description: 'Built customer-facing web applications using React and Node.js. Implemented CI/CD pipelines reducing deployment time by 60%.'
        }
      ]
    },
    {
      sectionName: 'Volunteer Work',
      deleteable: true,
      entries: [
        {
          company: 'Code for Good',
          jobtitle: 'Volunteer Developer',
          startyear: '2019',
          endyear: 'Present',
          isPresent: true,
          description: 'Building tools for non-profits and community organizations.'
        }
      ]
    }
  ]
};
