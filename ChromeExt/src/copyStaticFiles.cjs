const fs = require('fs');
const path = require('path');

const filesToCopy = ['popup.html', 'popup.css', 'manifest.json', 'icon16.png', 'icon48.png', 'icon128.png'];

const destinationDir = path.join(__dirname, '../dist');

if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir);
}

filesToCopy.forEach(file => {
    const srcPath = path.join(__dirname, file);
    const destPath = path.join(destinationDir, file);

    fs.copyFileSync(srcPath, destPath);
    console.log(`${file} copied dist`);
});
