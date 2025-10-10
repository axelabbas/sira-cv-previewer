// Quick test of the injectPreviewData function
import { injectPreviewData } from "./src/utils/editorUtils.ts";
import { readFileSync } from "fs";

const testData = {
  experienceSections: [
    {
      sectionName: "Work Experience",
      entries: [
        {
          company: "Tech Corp Inc.",
          jobtitle: "Senior Software Engineer",
          startDate: "Jan 2020",
          endDate: "Present",
          description: "Led development of microservices architecture.",
        },
        {
          company: "StartupXYZ",
          jobtitle: "Full Stack Developer",
          startDate: "Jun 2017",
          endDate: "Dec 2019",
          description: "Built customer-facing web applications.",
        },
      ],
    },
    {
      sectionName: "Volunteer Work",
      entries: [
        {
          company: "Code for Good",
          jobtitle: "Volunteer Developer",
          startDate: "Jan 2019",
          endDate: "Present",
          description: "Building tools for non-profits.",
        },
      ],
    },
  ],
};

const html = readFileSync("./test-nested-loops.html", "utf-8");
const result = injectPreviewData(html, testData);

console.log("=== RESULT ===");
console.log(result);
console.log("");
console.log("=== CHECK ===");
console.log('Contains "Tech Corp Inc."?', result.includes("Tech Corp Inc."));
console.log(
  'Contains "Senior Software Engineer"?',
  result.includes("Senior Software Engineer")
);
console.log('Contains "Work Experience"?', result.includes("Work Experience"));
console.log('Contains "Volunteer Work"?', result.includes("Volunteer Work"));
console.log('Contains "Code for Good"?', result.includes("Code for Good"));
console.log("Still has {% for %}?", result.includes("{% for"));
console.log(
  "Still has {{ entry.company }}?",
  result.includes("{{ entry.company }}")
);
