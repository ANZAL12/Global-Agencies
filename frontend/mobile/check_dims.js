const fs = require('fs');
const path = require('path');

function getPngDimensions(filePath) {
  const buffer = Buffer.alloc(24);
  const fd = fs.openSync(filePath, 'r');
  fs.readSync(fd, buffer, 0, 24, 0);
  fs.closeSync(fd);
  if (buffer.slice(0, 8).toString('hex') !== '89504e470d0a1a0a') return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

const dir = 'a:\\GlobalAgencies\\frontend\\mobile\\assets\\images';
const files = ['GLOBAL2.png', 'android-icon-foreground.png', 'icon.png', 'logo.png'];

files.forEach(f => {
  try {
    const dims = getPngDimensions(path.join(dir, f));
    console.log(`${f}: ${dims ? `${dims.width}x${dims.height}` : 'Not valid'}`);
  } catch (e) {}
});
