const fileSys = require('fs/promises');
const path = require('path');

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,

  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  webpack: (config, { isServer }) => {
    config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    //https://github.com/vercel/next.js/issues/25852#issuecomment-1057059000
    config.plugins.push(
      new (class {
        apply(compiler) {
          compiler.hooks.afterEmit.tapPromise('SymlinkWebpackPlugin', async compiler => {
            if (isServer) {
              const from = path.join(compiler.options.output.path, '../static');
              const to = path.join(compiler.options.output.path, 'static');

              try {
                await fileSys.access(from);
                console.log(`${from} already exists`);
                return;
              } catch (error) {
                if (error.code === 'ENOENT') {
                  // No link exists
                } else {
                  throw error;
                }
              }

              await symlink(to, from, 'junction');
              console.log(`created symlink ${from} -> ${to}`);
            }
          });
        }
      })()
    );

    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    });

    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/images',
          outputPath: 'static/images/',
        },
      },
    });

    config.module.rules.push({
      test: /\.(mp3)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/sounds/',
          outputPath: 'static/sounds/',
          name: '[name].[ext]',
          esModule: false,
        },
      },
    });

    config.module.rules.push({
      test: /\.(mp4)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/sounds/',
          outputPath: 'static/sounds/',
          name: '[name].[ext]',
          esModule: false,
        },
      },
    });

    return config;
  },
};
