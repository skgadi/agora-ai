import path from "path"; // For path manipulation
import fs from "fs"; // For file system operations
import { fileURLToPath } from "url"; // For ES Modules to get __dirname
import { dirname } from "path"; // For ES Modules to get __dirname
// In ES Modules, __dirname is not directly available. We need to derive it.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Export the function so it can be used elsewhere if needed
export const clearTemporaryFiles = () => {
  // Construct the path to the /tmp directory relative to the current script
  const tmpDir = path.join(__dirname, "../tmp"); // Go up one level from current dir, then into tmp

  console.log(`Checking temporary directory: ${tmpDir}`);

  // Check if the directory exists
  if (fs.existsSync(tmpDir)) {
    fs.readdir(tmpDir, (err, files) => {
      if (err) {
        console.error("Error reading temporary directory:", err);
        return;
      }

      if (files.length === 0) {
        console.log("Temporary directory is empty, nothing to clear.");
        return;
      }

      console.log(
        `Found ${files.length} files in temporary directory. Deleting...`
      );

      files.forEach((file) => {
        const filePath = path.join(tmpDir, file);

        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Error deleting temporary file ${filePath}:`, err);
          } else {
            console.log(`Deleted temporary file: ${filePath}`);
          }
        });
      });
    });
  } else {
    console.log(
      `Temporary directory "${tmpDir}" does not exist, nothing to clear.`
    );
    // Optionally, you might want to create the directory if it doesn't exist
    // fs.mkdir(tmpDir, { recursive: true }, (err) => {
    //     if (err) console.error("Error creating temporary directory:", err);
    //     else console.log("Created temporary directory:", tmpDir);
    // });
  }
};

// --- Execution Logic ---

// Schedule the function to run every 5 hours
const FIVE_HOURS_IN_MS = 5 * 60 * 60 * 1000;
setInterval(clearTemporaryFiles, FIVE_HOURS_IN_MS);
console.log(
  `Scheduled temporary file cleanup to run every ${
    FIVE_HOURS_IN_MS / (1000 * 60 * 60)
  } hours.`
);
