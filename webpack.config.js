var HTMLWebpackPlugin = require('html-webpack-plugin');
var webpack = require("webpack");
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
    resolve: {
        extensions: ['.js', '.jsx']
    },
	output: {
		filename: 'transformed.js',
		path:__dirname + '/build'
	},
	plugins: [HTMLWebpackPluginConfig,
        new webpack.DefinePlugin({
            'process.env': {
                BIAS_SERVER_URL: JSON.stringify(process.env.BIAS_SERVER_URL || "http://localhost:3000"),
                FB_APP_ID: JSON.stringify(process.env.FB_APP_ID || "382449245425765"),
                BC_APP_ID: JSON.stringify(process.env.BC_APP_ID || "0909367047e24c43956ae4511cb28f00"),
                BC_APP_SECRET: JSON.stringify(process.env.BC_APP_SECRET || "0e4f843becb044e496a317f3befc5105")
            }
        })
    ]  
};