/*
 * @description:
 * @author: tracyqiu
 * @LastEditors: tracyqiu
 * @LastEditTime: 2019-08-23 16:08:26
 */
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const SourceMapDevToolPlugin = require('webpack/lib/SourceMapDevToolPlugin');
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { AutoWebPlugin } = require('web-webpack-plugin');
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';
const isDev = env === 'development';
const analyze = process.env.analyze || false;
const outputPath = 'static';

console.log(
  `env: ${env}
   analyze: ${process.env.analyze}`
);

// 自动寻找 page 目录下的所有目录，把每一个目录看成一个单页应用
const autoWebPlugin = new AutoWebPlugin('src/client/pages', {
  // HTML 模版文件所在的文件路径
  template: 'src/client/template.ejs',
  templateCompiler: function(pageName, templateFullPath) {
    const ejsTemplate = fs.readFileSync(templateFullPath, {
      encoding: 'utf8',
    });
    return ejs.render(String(ejsTemplate), {
      isProd: isProd,
      isDev: isDev,
      // 获取 pageConfig 配置, 在首页ejs里面挂载到winodw。
      pageConfig: JSON.stringify({
        testParam: 'testParam',
      }),
    });
  },
  // 全局样式
  preEntrys: [path.resolve(__dirname, 'src/client/global.css')],
});

const webpackConfig = {
  mode: env || 'none',
  entry: autoWebPlugin.entry({
    base: path.resolve(__dirname, 'src/client/base.ts'),
  }),
  output: {
    // 给输出的文件名称加上 hash 值
    filename: isProd ? '[name]_[chunkhash:8].js' : '[name].js',
    path: path.resolve(__dirname, outputPath),
  },
  // webpack4  采用 splitChunks 代替 CommonsChunksPlugin 来做代码分割
  // 详情参考： https://juejin.im/post/5ce53a7f6fb9a07eb67d668c
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        commons: {
          chunks: 'all',
          minChunks: 2,
          name: 'commons',
          maxInitialRequests: 5,
          minSize: 0, // 默认是30kb，minSize设置为0之后
        },
        mobxBase: {
          test: (module) => {
            // 直接使用 test 来做路径匹配，抽离mobx相关代码
            return /node_modules\/mobx|node_modules\/mobx-react/.test(
              module.context
            );
          },
          chunks: 'initial',
          name: 'mobx-base',
          priority: 20,
          reuseExistingChunk: true,
        },
        reactBase: {
          test: (module) => {
            // 直接使用 test 来做路径匹配，抽离react相关代码
            return /node_modules\/prop-types|node_modules\/react-dom|node_modules\/react/.test(
              module.context
            );
          },
          chunks: 'initial',
          name: 'react-base',
          priority: 10,
          reuseExistingChunk: true,
        },
        antd: {
          test: (module) => {
            // 直接使用 test 来做路径匹配，抽离antd相关代码
            return /node_modules\/antd/.test(module.context);
          },
          chunks: 'initial',
          name: 'antd-base',
          priority: 10,
          reuseExistingChunk: true,
        },
        antdIcons: {
          test: (module) => {
            // 直接使用 test 来做路径匹配，抽离antd相关代码
            return /node_modules\/@ant-design/.test(module.context);
          },
          chunks: 'initial',
          name: 'antd-icons',
          priority: 10,
          reuseExistingChunk: true,
        },
        rcComponents: {
          test: (module) => {
            // 直接使用 test 来做路径匹配，抽离rc 原子组件相关代码
            return /node_modules\/rc-*/.test(module.context);
          },
          chunks: 'initial',
          name: 'rc-components',
          priority: 10,
          reuseExistingChunk: true,
        },
        verdor: {
          test: /node_modules/, // 其他node_modules下面的模块，统一放到vendor里面
          chunks: 'initial',
          name: 'vendor',
          priority: -10,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
    minimizer: isProd
      ? [
          new UglifyJsPlugin({
            exclude: /\.min\.js$/, // 过滤掉以".min.js"结尾的文件，我们认为这个后缀本身就是已经压缩好的代码，没必要进行二次压缩
            cache: true,
            parallel: true, // 开启并行压缩，充分利用cpu
            sourceMap: false,
            extractComments: false, // 移除注释
            uglifyOptions: {
              warnings: false,
              compress: {
                unused: true,
                drop_debugger: true,
              },
              output: {
                comments: false,
              },
            },
          }),
          new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
              autoprefixer: { disable: true },
              safe: true,
              mergeLonghand: false,
              preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: true,
          }),
        ]
      : [],
    runtimeChunk: true,
  },
  resolve: {
    // 先尝试 ts,tsx 后缀的 TypeScript 源码文件
    extensions: ['.tsx', '.ts', '.js'],
    // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
    mainFields: ['jsnext:main', 'browser', 'main'],
    // 使用 alias 把导入 react 的语句换成直接使用单独完整的 react.min.js 文件，
    // 减少耗时的递归解析操作
    alias: {
      react: path.resolve(
        __dirname,
        `./node_modules/react/umd/${
          isDev ? 'react.development.js' : 'react.production.min.js'
        }`
      ),
      'react-dom': path.resolve(
        __dirname,
        `./node_modules/react-dom/umd/${
          isDev ? 'react-dom.development.js' : 'react-dom.production.min.js'
        }`
      ),
      mobx: path.resolve(__dirname, './node_modules/mobx/lib/mobx.umd.min.js'),
      'mobx-react': path.resolve(
        __dirname,
        './node_modules/mobx-react/dist/mobx-react.umd.js'
      ),
      moment: 'dayjs',
      '@src': path.resolve(__dirname, './src'),
      '@root': __dirname,
      '@server': path.resolve(__dirname, './src/server'),
      '@client': path.resolve(__dirname, './src/client'),
      '@clientUtils': path.resolve(__dirname, './src/client/utils'),
      '@component': path.resolve(__dirname, './src/client/component'),
    },
  },
  module: {
    // 对单独完整的未采用模块化的库文件，不需要采用递归去解析，比如react.production.min.js
    noParse: [/react\..+\.js$/, /mobx\..+\.js$/],
    rules: [
      {
        test: /\.tsx?$/,
        use: ['happypack/loader?id=ts'],
        include: [path.resolve('src/client')],
      },
      {
        // 增加对 CSS 文件的支持 组件库css解析 不用再postcss了
        // 特别注意，MiniCssExtractPlugin.loader  不能放到happypack里面
        test: /\.css/,
        use: isDev
          ? [
              'css-hot-loader',
              MiniCssExtractPlugin.loader,
              'happypack/loader?id=css',
            ]
          : [MiniCssExtractPlugin.loader, 'happypack/loader?id=css'],
        exclude: [path.resolve(__dirname, 'src/client')],
      },
      {
        // 增加对 PostCSS 文件的支持 项目css,需要过postcss
        test: /\.css/,
        use: isDev
          ? [
              'css-hot-loader',
              MiniCssExtractPlugin.loader,
              'happypack/loader?id=css',
            ]
          : [MiniCssExtractPlugin.loader, 'happypack/loader?id=css'],
        include: [path.resolve(__dirname, 'src/client')],
      },
      {
        test: /\.(png|jpe?g|gif|eot|woff|woff2|ttf)$/,
        use: [`file-loader${isProd ? '?name=[name]_[hash:8].[ext]' : ''}`],
      },
      {
        test: /\.svg$/,
        // 内嵌svg
        use: ['raw-loader'],
      },
    ].concat(
      isProd
        ? // 只在生产环境
          []
        : // 只在开发环境
          [
            {
              test: /\.js$/,
              use: ['source-map-loader'],
              enforce: 'pre',
            },
          ]
    ),
  },
  plugins: [
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /node_modules/,
      // add errors to webpack instead of warnings
      failOnError: false,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    }),
    autoWebPlugin,
    // 开启 Scope Hoisting
    new ModuleConcatenationPlugin(),
    // HappyPack 加速构建
    new HappyPack({
      // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      id: 'ts',
      threadPool: happyThreadPool,
      verbose: true,
      loaders: [
        {
          loader: 'ts-loader',
          options: {
            configFile: 'src/client/tsconfig.json',
            getCustomTransformers: __dirname + '/tsCustomTransformer.js',
            happyPackMode: true,
            // disable type checker - we will use it in fork plugin
            transpileOnly: true,
          },
        },
      ],
    }),
    new HappyPack({
      id: 'postcss',
      threadPool: happyThreadPool,
      verbose: true,
      loaders: ['css-loader', 'postcss-loader'],
    }),
    new HappyPack({
      id: 'css',
      threadPool: happyThreadPool,
      verbose: true,
      loaders: ['css-loader'],
    }),
    // 输出 SourceMap 方便在浏览器里调试 TS 代码
    new SourceMapDevToolPlugin({
      filename: '[file].map',
    }),
  ]
    .concat(
      isProd
        ? // 只在生成环境下启用的插件
          [
            new OptimizeCssAssetsPlugin({}),
            new MiniCssExtractPlugin({
              filename: `[name]_[contenthash:8].css`, // 给输出的 CSS 文件名称加上 hash 值
            }),
          ]
        : // 只在开发环境下启用的插件
          [
            new MiniCssExtractPlugin({
              filename: `[name].css`,
            }),
            new ForkTsCheckerWebpackPlugin(),
          ]
    )
    .concat(
      analyze
        ? new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerHost: '127.0.0.1',
            analyzerPort: 8081,
            reportFilename: 'report.html',
            defaultSizes: 'parsed',
            openAnalyzer: true,
            generateStatsFile: false,
            statsFilename: 'stats.json',
            statsOptions: null,
            logLevel: 'info',
          })
        : []
    ),
};

if (isDev) {
  webpackConfig.devServer = {
    host: '0.0.0.0',
    port: 8888,
    inline: false,
    hot: false,
  };
}

/**
 * @name: 资源占用情况
 * @param {type}
 * @return:
 */
const resourceCost = () => {
  console.log(
    `############################################################################`
  );
  console.log(`##         os: ${os.type()} ${os.arch()} ${os.release()}`);
  console.log(
    `##        ram: ${
      os.freemem() / 1024 / 1024 / 1024 < 1
        ? (os.freemem() / 1024 / 1024).toFixed(0) + 'MB'
        : (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + 'GB'
    }`
  );
  console.log(`##       time: ${new Date()}`);
  console.log(
    `############################################################################`
  );
};

resourceCost();

module.exports = webpackConfig;
