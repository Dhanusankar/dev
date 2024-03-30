const express = require('express');
const simpleGit = require('simple-git');
const fs = require('fs').promises;
const path = require('path');

const app = express();

async function searchAndExecuteCodeSnippet(searchTerm) {
    const repositoryUrl = 'https://github.com/Dhanusankar/dev.git';
    const branch = 'main';
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
        const result = eval(codeSnippet);
        return result;
    } catch (error) {
        console.error('Error executing code snippet:', error);
        throw error;
    }
}

app.use(express.static('public'));

app.post('/execute', async (req, res) => {
    const searchTerm = req.query.searchTerm;
    try {
        const result = await searchAndExecuteCodeSnippet(searchTerm);
        res.send('Execution result: ' + result);
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
