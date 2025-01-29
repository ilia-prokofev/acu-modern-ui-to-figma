const fs = require('fs');
const path = require('path');

// Function to copy files and directories recursively
function copyRecursiveSync(src, dest) {
    const stats = fs.statSync(src);

    // If the source is a directory
    if (stats.isDirectory()) {
        // Create the destination directory if it does not exist
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }
        // Recursively copy all files and subdirectories
        fs.readdirSync(src).forEach(childItem => {
            copyRecursiveSync(path.join(src, childItem), path.join(dest, childItem));
        });
    } else {
        // If it's a file, simply copy it
        fs.copyFileSync(src, dest);
        console.log(`${src} copied to ${dest}`);
    }
}

function doCopy(destDir, fileList) {
    // Copy each file or directory recursively
    fileList.forEach(item => {
        const srcPath = path.resolve(item); // Use absolute path for source
        const destPath = path.join(destDir, path.basename(item)); // Ensure destination path
        copyRecursiveSync(srcPath, destPath);
    });
}

// Files to copy to dist directory (popup, css, icons, manifest)
const srcDir = path.resolve(__dirname, './src');
const distDir = path.resolve(__dirname, './dist');

const filesAndFoldersToCopyToDist = [
    path.resolve(srcDir, 'popup.html'),
    path.resolve(srcDir, 'popup.css'),
    path.resolve(srcDir, 'manifest.json'),
    path.resolve(srcDir, 'icon16.png'),
    path.resolve(srcDir, 'icon48.png'),
    path.resolve(srcDir, 'icon128.png')
];

// Destination directories

// Create the destination directory if it does not exist
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Copy other files to dist directory
doCopy(distDir, filesAndFoldersToCopyToDist);
