const path = require('path');

module.exports = {
    entry: './lib/vue.js',
    output: {
        path: path.join(__dirname, 'test'),
        filename: 'vue.js'
    },
    module: {
        rules: [
            
        ]
    }
}