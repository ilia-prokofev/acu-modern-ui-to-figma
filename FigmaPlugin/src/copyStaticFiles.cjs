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
const filesAndFoldersToCopyToDist = [

];

// The ExtLib folder is two levels above
const filesAndFoldersToCopyToSrc = [
    path.resolve(__dirname, '../../ExtLib/elements')
];

// Destination directories
const distDir = path.resolve(__dirname, '../dist');
const srcDir = path.resolve(__dirname, './');

// Create the destination directory if it does not exist
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir);
}

// Copy ExtLib to src directory
doCopy(srcDir, filesAndFoldersToCopyToSrc);

// Copy other files to dist directory
doCopy(distDir, filesAndFoldersToCopyToDist);
