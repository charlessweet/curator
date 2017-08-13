var HTMLWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
	template:__dirname + '/app/index.html',
	filename: 'index.html',
	inject: 'body'
});

module.exports = {
	entry: __dirname + "/app/index.js",
	module: {
		loaders:[
			{
				test:/\.js$/,
				exclude:/node_modules/,
				loader: 'babel-loader'
			},
			{
    			test: /\.(jpe?g|png|gif|svg)$/i,
    			use: [
    				{
    					loader: 'file-loader',
    					options: {
	    					query: {
    							name: 'assets/images/[name].[ext]'
    						}
    					}
    				},
    				{
    					loader: 'image-webpack-loader',
    					query:{
    						mozjpeg:{
    							progressive: true
    						},
    						gifsicle:{
    							interlaced: true
    						},
    						optipng:{
    							optimizationLevel: 7
    						}
    					}
    				}
    			]
  			} 
		]
	},
	output: {
		filename: 'transformed.js',
		path:__dirname + '/build'
	},
	plugins: [HTMLWebpackPluginConfig]
};