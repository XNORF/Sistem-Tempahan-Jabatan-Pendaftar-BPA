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
        admin_home: path.resolve(__dirname, "src/js/admin-home.js"),
        mohon_kenderaan: path.resolve(__dirname, "src/js/mohon-kenderaan.js"),
        adminfunctions: path.resolve(__dirname, "src/js/adminfunctions.js"),
        admin_request_detail: path.resolve(__dirname, "src/js/admin-request-detail.js"),
        admin_requests: path.resolve(__dirname, "src/js/admin-requests.js"),
        admin_user_management: path.resolve(__dirname, "src/js/admin-user-management.js"),
        admin_bilik_mesyuarat: path.resolve(__dirname, "src/js/admin-bilik-mesyuarat.js"),
        admin_vehicle: path.resolve(__dirname, "src/js/admin-vehicle.js"),
        admin_stationaries: path.resolve(__dirname, "src/js/admin-stationaries.js"),
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
        new HtmlWebpackPlugin({
            filename: "admin-home.html",
            template: path.resolve(__dirname, "src/html/admin-home.html"),
            chunks: ["admin_home"],
        }),
        new HtmlWebpackPlugin({
            filename: "mohon-kenderaan.html",
            template: path.resolve(__dirname, "src/html/mohon-kenderaan.html"),
            chunks: ["mohon_kenderaan"],
        }),
        new HtmlWebpackPlugin({
            filename: "adminfunctions.html",
            template: path.resolve(__dirname, "src/html/adminfunctions.html"),
            chunks: ["adminfunctions"],
        }),
        new HtmlWebpackPlugin({
            filename: "admin-request-detail.html",
            template: path.resolve(__dirname, "src/html/admin-request-detail.html"),
            chunks: ["admin_request_detail"],
        }),
        new HtmlWebpackPlugin({
            filename: "admin-requests.html",
            template: path.resolve(__dirname, "src/html/admin-requests.html"),
            chunks: ["admin_requests"],
        }),
        new HtmlWebpackPlugin({
            filename: "admin-user-management.html",
            template: path.resolve(__dirname, "src/html/admin-user-management.html"),
            chunks: ["admin_user_management"],
        }),
        new HtmlWebpackPlugin({
            filename: "admin-bilik-mesyuarat.html",
            template: path.resolve(__dirname, "src/html/admin-bilik-mesyuarat.html"),
            chunks: ["admin_bilik_mesyuarat"],
        }),
        new HtmlWebpackPlugin({
            filename: "admin-vehicle.html",
            template: path.resolve(__dirname, "src/html/admin-vehicle.html"),
            chunks: ["admin_vehicle"],
        }),
        new HtmlWebpackPlugin({
            filename: "admin-stationaries.html",
            template: path.resolve(__dirname, "src/html/admin-stationaries.html"),
            chunks: ["admin_stationaries"],
        }),
        /*new HtmlWebpackPlugin({
            filename: "admindashboard.html",
            template: path.resolve(__dirname, "src/html/admindashboard.html"),
            chunks: ["admindashboard"],
        }),*/
    ],
};
