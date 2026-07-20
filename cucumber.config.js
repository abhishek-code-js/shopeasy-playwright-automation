export default {
  paths: ["cucumber/features/**/*.feature"],
  import: ["cucumber/support/world.js", "cucumber/steps/**/*.steps.js"],
  format: [
    "progress-bar",
    "html:reports/cucumber-report.html",
    "json:reports/cucumber-report.json",
  ],
  formatOptions: {
    snippetInterface: "async-await",
  },
};
