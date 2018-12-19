const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')

const gamedir = 'examples/game-air-rider';

module.exports = {
    // game: path.join(__dirname, 'examples/game-air-rider'),
    entry: path.resolve(__dirname, gamedir + '/src/ts/main.ts'),
    mode: "development",
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: ['babel-loader', 'ts-loader'],
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [ new CopyWebpackPlugin([
        { from: 'src/html/index.html' },
        { from: gamedir + '/res', to: 'res/' },
        { from: 'src/css', to: 'css/' }
      ])],
};

