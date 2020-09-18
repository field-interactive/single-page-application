const Encore = require('@symfony/webpack-encore'),
    CompressionPlugin = require('compression-webpack-plugin'),
    config = require('./webpack-config.json');

Encore.setOutputPath(config.outputPath)
    .setPublicPath(config.publicPath)
    .cleanupOutputBeforeBuild()
    .autoProvidejQuery()
    .enableSassLoader()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(true);

Object.keys(config.scripts).forEach(key => {
    let script = config.scripts[key];
    Encore
        .addEntry(script.dest, script.src);
});

Object.keys(config.styles).forEach(key => {
    let style = config.styles[key];
    Encore
        .addStyleEntry(style.dest, style.src);
});

Encore
    .copyFiles({
        from: config.copy.from,
        to: config.copy.to
    })
    .disableSingleRuntimeChunk()
    .configureBabel(() => {}, {
        useBuiltIns: 'usage',
        corejs: 3,
        exclude: /node_modules/
    })
    .enableBuildNotifications();

if (Encore.isProduction()) {
    Encore
        .addPlugin(
            new CompressionPlugin({
                algorithm: 'gzip',
                test: /\.(js|css)$/
            }),
            10
        )
    ;
}

module.exports = Encore.getWebpackConfig();
