import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';

export default {
  mode: 'production',
  target: 'web',
  entry: {
	contentScript: './src/scripts/content.js',
	background: './src/scripts/background.js',
	react: './src/react/index.tsx',
	popup: './src/scripts/popup.js'
  },
  output: {
	path: path.resolve('dist'),
	filename: '[name].js',
	clean: true
  },
  plugins: [
	new HtmlWebpackPlugin({
	  template: './src/pages/hello.html',
	  inject: false
	}),
	new CopyPlugin({
	  patterns: [{
		from: path.resolve('manifest.json'),
		to: path.resolve('dist')
	  }]
	}),
	new CopyPlugin({
		patterns: [{
			from: path.resolve('./src/assets'),
			to: path.resolve('dist/assets')
		}]
	})
  ],
  module: {
	rules: [
	  {
		test: /.(ts|tsx)$/,
		exclude: /node_modules/,
		use: {
		  loader: 'babel-loader',
		  options: {
			presets: [
			  '@babel/preset-env',
			  ['@babel/preset-react', {'runtime': 'automatic'}],
			  '@babel/preset-typescript'
			]
		  }
		}
	  }
	]
  },
  resolve: {
	extensions: ['.ts', '.tsx']
  }
};