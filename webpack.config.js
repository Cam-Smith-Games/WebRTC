const path = require('path');
const webpack = require('webpack');


/*const ElectronReloadPlugin = require('webpack-electron-reload')({
    //path: path.join(__dirname, './dist/main.js'),

    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
    // ignore data folder to prevent infinite loop when saving files
    ignored: path.join(__dirname, "/game/data"),
    //hardResetMethod: 'exit'
});*/

/** @type {import('webpack').Configuration} */
module.exports = {
    //entry: "./out/game/main.js",
    entry: {
        "main": "/src/main.ts",
    },

    resolve: { 
        // only including .ts files
        extensions: [".ts"]
    },
    module: {
        rules: [
            {
                // all files with a `.ts` extension will be handled by `ts-loader`
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: [
                    path.resolve(__dirname, "./ignore")
                ]
            },
            {
                // wasm files need to be delivered with correct MIME type and loaded from file-loader plugin,
                // this is because sql.js requires the .wasm file to be distributed
                test: /\.wasm$/,
                loader: "file-loader",
                type: 'javascript/auto',
            },
            {
                test: /\.(png|jpe?g|gif|html)$/i,
                use: [{
                    loader: 'file-loader',
                }],
            }
    
        ]
    },

    output: {
        //filename: "bundle.js",
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].js",
        sourceMapFilename: "[name].js.map"
    },

    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"]
        })
    ],


    // "production" minifies into giant file. 
    // "development" includes all scripts in separate eval statements
    mode: "development",

    // this determines how source maps are generated
    devtool: "source-map",


    // using --watch instead
    //watch: true
};