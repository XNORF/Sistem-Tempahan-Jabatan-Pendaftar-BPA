const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    //basics
    mode: "development",
    entry: {
        main: path.resolve(__dirname, "src/js/main.js"),
        smtp: path.resolve(__dirname, "src/js/smtp.js"),
        index: path.resolve(__dirname, "src/js/index.js"),
        home: path.resolve(__dirname, "src/js/home.js"),
        stationaries: path.resolve(__dirname, "src/js/stationaries.js"),
        vehicle: path.resolve(__dirname, "src/js/vehicle.js"),
        stationaries_history: path.resolve(__dirname, "src/js/stationaries-history.js"),
        request_detail: path.resolve(__dirname, "src/js/request-detail.js"),
        bilik_mesyuarat: path.resolve(__dirname, "src/js/bilik-mesyuarat.js"),
        mohon_bilik: path.resolve(__dirname, "src/js/mohon-bilik.js"),
        //admindashboard: path.resolve(__dirname, "src/js/admindashboard.js"),
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        clean: true,
    },
    devtool: "inline-source-map",
    devServer: {
        static: path.join(__dirname, "dist"),
        open: true,
        hot: true,
    },

    //loaders
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
            {
                test: /\.html$/,
                use: ["html-loader"],
            },
            {
                test: /\.(svg|ico|png|webp|jpg|jpeg|gif|woff2?)$/,
                type: "asset/resource",
                generator: {
                    filename: "img/[name][ext]",
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 8192,
                    },
                },
            },
        ],
    },
    //plugins
    plugins: [
        //do not touch
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),

        /*ADD NEW HTMLWEBPACKPLUGIN WHEN NEW HTML ADDED (COPY PASTE)
            new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.resolve(__dirname, "src/html/index.html"),
            chunks: ["index"], //CHUNK IS JAVASCRIPT USED (LINE 8 TO ADD MORE JS) !!! FOLLOW THE HTML NAME
        }),
        */

        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.resolve(__dirname, "src/html/index.html"),
            chunks: ["index"],
        }),
        new HtmlWebpackPlugin({
            filename: "home.html",
            template: path.resolve(__dirname, "src/html/home.html"),
            chunks: ["home"],
        }),
        new HtmlWebpackPlugin({
            filename: "stationaries.html",
            template: path.resolve(__dirname, "src/html/stationaries.html"),
            chunks: ["stationaries"],
        }),
        new HtmlWebpackPlugin({
            filename: "vehicle.html",
            template: path.resolve(__dirname, "src/html/vehicle.html"),
            chunks: ["vehicle"],
        }),
        new HtmlWebpackPlugin({
            filename: "stationaries-history.html",
            template: path.resolve(__dirname, "src/html/stationaries-history.html"),
            chunks: ["stationaries_history"],
        }),
        new HtmlWebpackPlugin({
            filename: "request-detail.html",
            template: path.resolve(__dirname, "src/html/request-detail.html"),
            chunks: ["request_detail"],
        }),
        new HtmlWebpackPlugin({
            filename: "bilik-mesyuarat.html",
            template: path.resolve(__dirname, "src/html/bilik-mesyuarat.html"),
            chunks: ["bilik_mesyuarat"],
        }),
        new HtmlWebpackPlugin({
            filename: "mohon-bilik.html",
            template: path.resolve(__dirname, "src/html/mohon-bilik.html"),
            chunks: ["mohon_bilik"],
        }),
        /*new HtmlWebpackPlugin({
            filename: "admindashboard.html",
            template: path.resolve(__dirname, "src/html/admindashboard.html"),
            chunks: ["admindashboard"],
        }),*/
    ],
};
