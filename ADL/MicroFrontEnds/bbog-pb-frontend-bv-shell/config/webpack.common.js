const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');

const defaultCachingConfiguration = name => ({
  handler: 'NetworkFirst',
  options: {
    cacheName: name,
    expiration: {
      maxAgeSeconds: 10 * 60 // 10 minutes
    }
  }
});

module.exports = {
  entry: {
    main: './src/index.ts',
    deleteLegacyPWA: './src/utils/service-worker-utils.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, '../src'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-typescript', '@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpg|gif|svg|ttf|eot|woff)$/i,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' },
        { from: 'public/manifest.json', to: 'manifest.json' }
      ]
    }),
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      exclude: [/.*/],
      disableDevLogs: true,
      runtimeCaching: [
        {
          urlPattern: context => {
            return (
              context.request.url.match(/bbog-pb-frontend-legacy-web\/[\s\S]+\.(?:js|css|svg|png|ttf|woff|woff2)$/) ||
              context.request.url.includes('/bbog-pb-frontend-legacy-web/index.html')
            );
          },
          ...defaultCachingConfiguration('legacy-web-cache')
        },
        {
          urlPattern: /bbog-pb-frontend-legacy-app\/[\s\S]+\.(?:html|js|css|svg|png|ttf|woff|woff2)$/,
          ...defaultCachingConfiguration('legacy-app-cache')
        },
        {
          urlPattern: /bbog-pb-frontend-settings-app\/[\s\S]+\.(?:html|js|css|svg|png|ttf|woff|woff2)$/,
          ...defaultCachingConfiguration('settings-app-cache')
        },
        {
          urlPattern: /bbog-pb-frontend-transfers-app\/[\s\S]+\.(?:html|js|css|svg|png|ttf|woff|woff2)$/,
          ...defaultCachingConfiguration('transfers-app-cache')
        },
        {
          urlPattern: /bbog-pb-customer-assistance-app\/[\s\S]+\.(?:html|js|css|svg|png|ttf|woff|woff2)$/,
          ...defaultCachingConfiguration('customer-assistance-app-cache')
        }
      ]
    })
  ]
};
