import fs from 'fs';
import path from 'path';
import { minimatch } from 'minimatch'; // Ensure you have installed this package

interface GitignorePattern {
  pattern: string;
  source: string;
}

let ignorePatterns: GitignorePattern[] = [];

// List of .gitignore files to ignore
const ignoreGitignoreFiles: string[] = [
  '/Users/milesmoran/Personal/gitignore/community/Golang/Go.AllowList.gitignore'
];

// Function to process .gitignore file and return patterns
function processGitignore(filePath: string): GitignorePattern[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  return lines
    .filter(line => line.trim() !== '' && !line.startsWith('#') && !line.startsWith('!'))
    .map(pattern => ({ pattern, source: filePath }));
}

// Recursive function to find .gitignore files and collect patterns
function findGitignoreFiles(dir: string) {
  try {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.lstatSync(fullPath);

      if (stat.isDirectory()) {
        findGitignoreFiles(fullPath);
      } else if (file.endsWith('.gitignore') && !ignoreGitignoreFiles.includes(fullPath)) {
        ignorePatterns = ignorePatterns.concat(processGitignore(fullPath));
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error);
  }
}

// Function to find the first matching pattern for a path
function findMatchingPattern(filePath: string, patterns: GitignorePattern[]): GitignorePattern | undefined {
  for (const { pattern, source } of patterns) {
    if (minimatch(filePath, pattern, { dot: true, matchBase: true })) {
      console.log(`File: ${filePath} matches pattern: ${pattern} from ${source}`);
      return { pattern, source };
    }
  }
  console.log(`No matched pattern found for: ${filePath}`);
  return undefined;
}

// Recursive function to scan directory and find matches along with their patterns
function findMatches(dir: string, patterns: GitignorePattern[]): { path: string; matchedPattern: GitignorePattern }[] {
  let matches: { path: string; matchedPattern: GitignorePattern }[] = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const relativePath = path.relative(rootDirectory, fullPath); // Get relative path for pattern matching
    const stat = fs.lstatSync(fullPath);

    const matchingPattern = findMatchingPattern(relativePath, patterns);
    if (matchingPattern) {
      // Corrected line here
      matches.push({ path: fullPath, matchedPattern: matchingPattern });
    }

    if (stat.isDirectory()) {
      matches = matches.concat(findMatches(fullPath, patterns));
    }
  }

  return matches;
}

console.log('Running');
const rootDirectory = '/Users/milesmoran/Personal/gitignore';
findGitignoreFiles(rootDirectory);
console.log('Collected ignore patterns:', ignorePatterns);

const targetDirectory = '/Users/milesmoran/Personal/exclusion-pattern-generator/demo/'; // Set your target directory here
const matchedFiles = findMatches(targetDirectory, ignorePatterns);
console.log('Matched Files with Patterns:', matchedFiles.map(({ path, matchedPattern }) => ({ path, pattern: matchedPattern.pattern, source: matchedPattern.source })));
