const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        // path: path.resolve(__dirname, 'dist'),
        path: path.resolve(__dirname, '../easy-basic.github.io/src/src/assets/'),
        filename: 'Easybasic.bundle.js'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-env']
                    }
                }
            }
        ]
    }
};