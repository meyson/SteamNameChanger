const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const staticFiles = [
    {
        from: 'html/**/*'
    },
    {
        from: 'css/**/*'
    },
    {
        from: 'img/**/*'
    },
    {
        from: 'audio/**/*'
    },
    {
        from: '_locales/**/*'
    },
    {
        from: 'manifest.json'
    }
];


const DIST_FOLDER = 'dist';
const IS_PRODUCTION = process.env.NODE_ENV !== 'dev';
const POSSIBLE_BROWSERS = ['chrome', 'firefox'];

module.exports = (env) => {
    if (!env || !env.browser || !POSSIBLE_BROWSERS.includes(env.browser)) {
        throw new Error(`Please provide a browser! webpack --env.browser=BROWSER Possible values: ${POSSIBLE_BROWSERS.toString()}`);
    }

    const staticFilesPath = staticFiles.map(i => ({ context: './src/', ...i }));
    // staticFilesPath.push({
    //     from: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js',
    //     context: './',
    //     to: 'js'
    // });

    return {
        entry: {
            'js/popup': './src/js/popup',
            'js/background': './src/js/background'
        },
        output: {
            path: path.join(__dirname, DIST_FOLDER),
            filename: '[name].js'
        },
        devtool: 'source-map',
        // module: {
        //     rules: [
        //         {
        //             test: /\.js$/, // для яких пряцюють модулі
        //             exclude: /node_modules/,
        //             // loader: 'babel-loader'
        //             use: [
        //                 {
        //                     loader: ''// який лоадер
        //                 }
        //             ] // лоадери які будуть працювіати над JS

        //         }
        //     ]
        // },
        // const exclude = ['!node_modules{,/**}', '!dist{,/**}'];
        plugins: [
            new CleanWebpackPlugin([DIST_FOLDER]),
            (IS_PRODUCTION && env.browser !== 'firefox') ? new UglifyJSPlugin({
                parallel: true
            }) : () => null,
            new CopyWebpackPlugin(staticFilesPath)
        ]
    };
};

// if (IS_PRODUCTION) {
//     module.exports.plugins.push(new UglifyJSPlugin({
//         uglifyOptions: {
//             // Keep it somewhat readable for AMO reviewers
//             mangle: false,
//             compress: false,
//             output: {
//                 beautify: true,

//                 // Reduce beautification indentation from 4 spaces to 1 to save space
//                 indent_level: 2 // eslint-disable-line camelcase
//             }
//         }
//     }));
// } else {
//     module.exports.
// }