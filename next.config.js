const sass = require('@zeit/next-sass')
const routing = require('./routing')
const withPlugins = require('next-compose-plugins')

const sassConfig = {
	cssModules: false,
	cssLoaderOptions: {
	  importLoaders: 1,
	  localIdentName: "[local]___[hash:base64:5]",
	}
}

const nextConfig = {
	port: process.env.PORT || 3000,
	host: process.env.HOST || "0.0.0.0",

	//transpileModules: [],

	publicRuntimeConfig: {
		asset_url: '',
	},

	exportPathMap: routing,
	useFileSystemPublicRoutes: false,
}

const c = withPlugins([
	[sass, sassConfig],
  ], nextConfig)

module.exports = c('', {})