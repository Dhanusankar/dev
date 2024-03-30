const simpleGit = require('simple-git');
const fs = require('fs').promises;
const path = require('path');

async function searchAndExecuteCodeSnippet(repositoryUrl, branch, searchTerm) {
    const repoDir = './temp_repo'; // Temporary directory to clone the repository
    const git = simpleGit();

    try {
        await git.clone(repositoryUrl, repoDir, ['--branch', branch]);
        const snippetPath = await searchForSnippet(repoDir, searchTerm);
        if (snippetPath) {
            const codeSnippet = await fs.readFile(snippetPath, 'utf8');
            console.log('Code snippet to be executed:', codeSnippet);
            const result = await executeCodeSnippet(codeSnippet);
            return result;
        } else {
            throw new Error('Code snippet not found in the repository.');
        }
    } catch (error) {
        console.error('Error searching for and executing code snippet:', error);
        throw error;
    } finally {
        // Cleanup: Delete temporary directory after fetching code snippet
        try {
            await fs.rm(repoDir, { recursive: true, force: true });
        } catch (cleanupError) {
            console.error('Error cleaning up:', cleanupError);
        }
    }
}

async function searchForSnippet(directory, searchTerm) {
    const files = await fs.readdir(directory);

    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = await fs.stat(filePath);
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

async function executeCodeSnippet(codeSnippet) {
    try {
        const result1 = eval(codeSnippet);
        return result1;
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
        console.log('Execution result:', result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
