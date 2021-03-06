const fs = require('fs');
const path = require('path');
module.exports = async () => {
    const socket_io_path = `${path.resolve(__dirname, '..')}/node_modules/socket.io/lib/index.js`;
    if (fs.existsSync(socket_io_path)) {
        fs.readFile(socket_io_path, 'utf8', (err1, files) => {
            const result = files.replace('this.serveClient(false !== opts.serveClient);', '// this.serveClient(false !== opts.serveClient);');
            fs.writeFile(socket_io_path, result, 'utf8', (err2) => console.log(err2));
        });
        Promise.resolve();
    }
};
//# sourceMappingURL=fix.js.map