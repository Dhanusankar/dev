const simpleGit = require('simple-git');
const fs = require('fs');
const path = require('path');

// Function to recursively search for a code snippet in the repository
async function searchAndExecuteCodeSnippet(repositoryUrl, branch, searchTerm) {
    const repoDir = './temp_repo'; // Temporary directory to clone the repository
    const git = simpleGit();

    try {
        await git.clone(repositoryUrl, repoDir, ['--branch', branch]);
        const snippetPath = await searchForSnippet(repoDir, searchTerm);
        if (snippetPath) {
            const codeSnippet = fs.readFileSync(snippetPath, 'utf8');
            // Print the code snippet to the user
            console.log('Code snippet to be executed:', codeSnippet);
            // Execute the code snippet
            const result = executeCodeSnippet(codeSnippet);
            return result;
        } else {
            throw new Error('Code snippet not found in the repository.');
        }
    } catch (error) {
        console.error('Error searching for and executing code snippet:', error);
        throw error;
    } finally {
        // Cleanup: Delete temporary directory after fetching code snippet
        fs.rmdirSync(repoDir, { recursive: true });
    }
}

// Recursive function to search for code snippet in a directory
async function searchForSnippet(directory, searchTerm) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            const result = await searchForSnippet(filePath, searchTerm);
            if (result) {
                return result;
            }
        } else if (file.includes(searchTerm)) {
            return filePath;
        }
    }

    return null;
}

// Function to execute code snippet
function executeCodeSnippet(codeSnippet) {
    try {
        // Execute the code snippet
        const result = eval(codeSnippet);
        return result;
    } catch (error) {
        console.error('Error executing code snippet:', error);
        throw error;
    }
}

// Example usage
const repositoryUrl = 'https://github.com/Dhanusankar/dev.git';
const branch = 'main';
const userInput = 'fibonacci'; // User provides the search term to find the snippet

searchAndExecuteCodeSnippet(repositoryUrl, branch, userInput)
    .then(result => {
        console.log('Execution result2:', result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
