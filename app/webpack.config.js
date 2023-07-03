module.exports = {
	entry  : './lib/index.jsx',
	output : {
		path     : `${__dirname }/build`,
		filename : 'bundle.js'
	},
	module : {
		rules : [
			{
				test : /\.css$/, 
				use  : [
					'style-loader',
					{ loader: 'css-loader', options: { modules: true } }
				]
			}
		]
	},
	devtool : 'source-map'
};
