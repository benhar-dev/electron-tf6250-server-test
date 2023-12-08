const fs = require("fs");

const permissiveLicenses = ["MIT", "ISC"];

fs.readFile("./licenses/licenses.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the licenses.json file:", err);
    return;
  }

  if (data.charCodeAt(0) === 0xfeff) {
    data = data.slice(1);
  }
  data = data.trim();

  const licenses = JSON.parse(data);
  let licenseText = "THIRD-PARTY LICENSES\n\n";
  let nonPermissiveFound = false;

  for (const [key, value] of Object.entries(licenses)) {
    // Check if the license is permissive
    if (!permissiveLicenses.includes(value.licenses)) {
      console.warn(
        `Warning: Non-permissive license found for ${key}: ${value.licenses}`
      );
      nonPermissiveFound = true;
    }

    licenseText += `-------------------------------------------------------------------------------\n`;
    licenseText += `Package: ${key}\n`;
    licenseText += `License: ${value.licenses}\n`;
    licenseText += `Repository: ${value.repository}\n`;
    licenseText += `Publisher: ${value.publisher}\n`;
    licenseText += `Email: ${value.email}\n`;
    licenseText += `URL: ${value.url}\n\n`;
    licenseText += `Text: ${value.licenseText}\n\n`;
  }

  fs.writeFile("THIRD-PARTY-NOTICES.txt", licenseText, "utf8", (err) => {
    if (err) {
      console.error("Error writing the THIRD-PARTY-NOTICES.txt file:", err);
    } else {
      console.log("Successfully written to THIRD-PARTY-NOTICES.txt");
      if (nonPermissiveFound) {
        throw new Error("Non-permissive licenses found. Build process halted.");
      }
    }
  });
});
