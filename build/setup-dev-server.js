const webpack = require('webpack');
const MFS = require('memory-fs');
const fs = require('fs');
const path = require('path');
const chokidar = require("chokidar");
const clientConfig = require('./webpack.client.config');
const serverConfig = require('./webpack.server.config');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

// TODO: currently doesnt work correctly.
const enableHotReload = true;

const readFile = (fs, filepath) => {
    try {
        return fs.readFileSync(filepath, 'utf-8');
    } catch (e) {
        console.log("can't load: ", filepath);
    }
};

const setupDevServer = (app, templatePath, onServerBundleReady) => {
    let serverBundle, clientManifest;
    let ready;
    let template;

    const readyPromise = new Promise(r => {
        ready = r;
    });

    const update = () => {
        if (serverBundle && clientManifest) {
            ready();

            if (enableHotReload) {
                console.log("onServerBundleReady updated");
            } else {
                console.log("onServerBundleReady updated, hot reload disabled, please refresh page in browser!");
            }

            onServerBundleReady(serverBundle, {
                    template,
                    clientManifest,
                });
        }
    };

    template = fs.readFileSync(templatePath, "utf-8");

    chokidar.watch(templatePath).on("change", () => {
        template = fs.readFileSync(templatePath, "utf-8");
        console.log("Index template file updated");

        update();
    });

    // additional client entry for hot reload
    if (enableHotReload) {
        clientConfig.entry.app = [
            'webpack-hot-middleware/client',
            clientConfig.entry.app
        ];
    }


    clientConfig.output.filename = "[name].js";

    if (enableHotReload) {
        clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    const clientCompiler = webpack(clientConfig);

    const devMiddleware = webpackDevMiddleware(clientCompiler, {
        publicPath: clientConfig.output.publicPath,
        writeToDisk: false,
    });

    app.use(devMiddleware);

    if (enableHotReload) {
        const hotMiddleware = webpackHotMiddleware(clientCompiler, {
            log: false,
            heartbeat: 2000,
        });
        
        // setup hot middleware
        app.use(hotMiddleware);
    }

    clientCompiler.hooks.done.tap("clientCompiler", stats => {
        stats = stats.toJson();
        stats.errors.forEach(err => console.error(err));
        stats.warnings.forEach(err => console.warn(err));

        if (stats.errors.length) {
          return;
        }

        console.log("setup-dev-server clientCompiler finished!");

        clientManifest = JSON.parse(readFile(
            clientCompiler.outputFileSystem,
            path.join(serverConfig.output.path, 'vue-ssr-client-manifest.json'),
        ));

        update();
    });

    // watch src files and rebuild SSR bundle
    console.log('Building SSR bundle...');
    const serverCompiler = webpack(serverConfig);

    const mfsServer = new MFS();
    serverCompiler.outputFileSystem = mfsServer;

    serverCompiler.watch({}, (err, stats) => {
        if (err) throw err;
        
        /*
        global.console.log(
            `${stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false,
            })}\n\n`
        );

        if (stats.hasErrors()) {
            console.error(stats.compilation.errors);
            throw new Error(stats.compilation.errors);
        }
        */
        stats = stats.toJson();
        stats.errors.forEach(err => console.error(err));
        stats.warnings.forEach(err => console.warn(err));

        if (stats.errors.length) {
          return;
        }

        console.log("setup-dev-server clientCompiler finished!");

        serverBundle = JSON.parse(readFile(
            serverCompiler.outputFileSystem,
            path.join(serverConfig.output.path, 'vue-ssr-server-bundle.json'),
        ));

        update();
    });

    return readyPromise;
};

module.exports = setupDevServer;
