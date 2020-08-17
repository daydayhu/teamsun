"use strict";
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require("path");

const MODULE = process.env.MODULE_ENV || "undefined";

// const os = require('os');
// let netIp = os.networkInterfaces();
// let Ip = netIp['en0'][1].address;

module.exports = {
    dev: {
        // Paths
        assetsSubDirectory: "static",
        assetsPublicPath: "/",
        // 配置代理
        proxyTable: {
            "/v1/api/ip/": {
                target: "http://172.16.193.21:31315/",
                // target: "http://172.16.194.160:31315/",
                // target: "http://172.16.198.3:31315/",
                changeOrigin: true //set the option changeOrigin to true for name-based virtual hosted site
            },
            "/v1/api/oc/": {
                target: "http://172.16.193.21:31314/",
                // target: "http://172.16.194.160:31314/",
                // target: "http://172.16.198.3:31314/",
                //target: 'http://172.16.193.20:8010/',
                changeOrigin: true //set the option changeOrigin to true for name-based virtual hosted site
            },
            "/v1/api/vmware/": {
                target: "http://172.16.193.21:31312/",
                // target: "http://172.16.194.160:31312/",
                // target: "http://172.16.198.3:31312/",
                //target: 'http://10.10.12.81:8002/',
                changeOrigin: true //set the option changeOrigin to true for name-based virtual hosted site
            },
            "/v1/api/ops/": {
                target: "http://172.16.193.21:31311/",
                // target: "http://172.16.194.160:31311/",
                // target: "http://172.16.198.3:31311/",
                changeOrigin: true //set the option changeOrigin to true for name-based virtual hosted site
            },
            "/v1/api/flow/": {
                target: "http://172.16.193.21:31316/",
                // target: "http://172.16.194.160:31316/",
                // target: "http://172.16.198.3:31316/",
                changeOrigin: true //set the option changeOrigin to true for name-based virtual hosted site
            },
            "/v1/api/openstack/": {
                target: "http://172.16.193.21:31313/",
                // target: "http://172.16.194.160:31313/",
                // target: "http://172.16.198.3:31313/",
                changeOrigin: true //set the option changeOrigin to true for name-based virtual hosted site
            },
            // "/v1/api/file_storage/file_store/": {
            //     // target: "http://172.16.193.21:31318/",
            //     // target: "http://172.16.194.160:31318/",
            //     // target: 'http://172.16.193.32:9080', // http://10.10.12.81:8008
            //     changeOrigin: true //set the option changeOrigin to true for name-based virtual hosted site
            // },
            "/v1/api/file_storage": {
                target: "http://172.16.194.160:31317/",
                // target: "http://172.16.198.3:31317/",
                // target: 'http://172.16.193.32:8004', // http://10.10.12.81:8008
                changeOrigin: true //set the option changeOrigin to true for name-based virtual hosted site
            },
            "/download/packages": {
                target: " http://172.16.193.32/", // http://10.10.12.81:8008
                changeOrigin: true //set the option changeOrigin to true for name-based virtual hosted site
            },
            "/v1/api/app": {
                target: "http://172.16.193.21:31319/",
                // target: "http://172.16.194.160:31319", // http://10.10.12.81:8008/172.16.193.32:8007
                // target: "http://172.16.193.99:8007", // http://10.10.12.81:8008/172.16.193.32:8007
                changeOrigin: true //set the option changeOrigin to true for name-based virtual hosted site
            },
            "/v1/api/lic": {
                target: "http://172.16.193.21:31320/",
                // target: "http://172.16.194.160:31320", // http://10.10.12.81:8008/172.16.193.32:8007
                changeOrigin: true //set the option changeOrigin to true for name-based virtual hosted site
            },
            "/v1/": {
                target: "http://172.16.193.21:31310/",
                // target: "http://172.16.194.160:31310/",
                //  target: "http://172.16.193.19:8001/",
                changeOrigin: true //set the option changeOrigin to true for name-based virtual hosted sites
                // pathRewrite: {
                //     //'^/apps': '/apps' // 这种接口配置出来     http://XX.XX.XX.XX:8080/apps/XXX
                //     '^/apps': isApps
                //     //'^/api': '/' 这种接口配置出来     http://XX.XX.XX.XX:8080/XXX
                // }
            }
        },
        // Various Dev Server settings
        // host: "0.0.0.0", // can be overwritten by process.env.HOST
        host: 'localhost', // can be overwritten by process.env.HOST
        port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        autoOpenBrowser: false,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

        /**
         * Source Maps
         */

        // https://webpack.js.org/configuration/devtool/#development
        devtool: "cheap-module-eval-source-map",

        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,

        cssSourceMap: true
    },

    build: {
        // Template for index.html
        index: path.resolve(__dirname, "../dist", MODULE, "index.html"),
        // Paths
        assetsRoot:
            process.env.MODE_ENV === "separate" || MODULE !== "undefined"
                ? path.resolve(__dirname, "../dist", MODULE)
                : path.resolve(__dirname, "../dist"),
        assetsSubDirectory: "static",
        assetsPublicPath: "./",

        /**
         * Source Maps
         */

        productionSourceMap: false,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: "#source-map",

        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ["js", "css"],

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    }
};
