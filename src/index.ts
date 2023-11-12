console.log('Running');

import fs from 'fs';
import path from 'path';

// Function to process .gitignore file
function processGitignore(filePath: string) {
  console.log(`Processing .gitignore file at: ${filePath}`);
  // Add your processing logic here
}

// Recursive function to find .gitignore files
function findGitignoreFiles(dir: string) {
  try {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.lstatSync(fullPath);

      if (stat.isDirectory()) {
        findGitignoreFiles(fullPath); // Recurse into subdirectories
      } else if (file.endsWith('.gitignore')) {
        processGitignore(fullPath); // Found a .gitignore file
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error);
  }
}

const rootDirectory = '/Users/milesmoran/Personal/gitignore';
findGitignoreFiles(rootDirectory);
