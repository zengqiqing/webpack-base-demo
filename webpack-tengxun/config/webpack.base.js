const path = require('path')
//引入各种使用到的插件包
const HtmlWebpackPlugin = require('html-webpack-plugin')
//分离 css 文件插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//每次打包清除一下dist文件内容，避免残留之前多余的打包内容
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

//配置 webpack 的配置文件，需要将配置的对象到处，给予webpack使用

module.exports = {
	/* 1.entry:(入口)：从哪个文件开始打包 */
	entry: './src/main.js',

	/*output:(出口)：打包到哪里去  
			@path: 打包输出的目录;(输出的目录必须是一个绝对路径);
			@filename:打包后生成的文件名;
			@__dirname：从当前目录出发
	*/
	output: {
		path: path.join(__dirname, '../dist'),
		filename: 'js/bundle.js'
	},

	/* module：模块加载规则：
			webpack只认识js,json；不认识其他类型的文件，如果希望打包处理其他类型的文件，就需要配置对应的loader
			实际的执行顺序是从右往左
			style-loader：通过动态的创建style标签的方式，让解析后的css内容能作用到页面中 
	 */
	module: {
		rules: [
			//(1) 配置css 文件解析
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '../'   //publicPath：公共资源加载的路径
						}
					}, 'css-loader']
			},
			//(2) 配置less 文件解析
			{
				test: /\.less$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '../'   //publicPath：公共资源加载的路径
						}
					}, 'css-loader', 'less-loader']  //执行顺序依旧是从右到左
			},
			//(3) 配置图片文件解析
			/*  */
			{
				test: /\.(png|jpg|gif)$/,
				use: [
          {
						//注意：如果url-loader不配置，图片默认转成base64格式
            loader: 'url-loader',
            options: {
							limit: 20 * 1024,
							//配置输出的文件名  ext是指图片后缀不被改变
							name:'[name].[ext]',
							//配置静态资源引用的路径
							publicPath:'../images/',
							//配置输出文件目录  注意：publicPath和outputPath定义的文件夹名称要一致
							outputPath:'images/'
            }
          }
        ]
			},
			//(4) 配置高版本js语法的兼容性处理 babel
			{
				//匹配js后缀，针对js文件进行兼容处理
				test: /\.m?js$/,
				//排除项：排除不需要处理的js文件，例如node_modules里面的文件
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		]
	},

	/* 插件包的配置 */
	plugins: [
		//打包生成html页面
		new HtmlWebpackPlugin({ template: './public/index.html' }),
		//调用清除打包目录插件
		new CleanWebpackPlugin(),
		/* 分离css文件
			filename:指定生成后的文件文件名称和文件夹
			css/index.css是指：打包后再dist文件中生成css文件夹里面放置一个index.css的文件用来存放css文件打包后的内容
		*/
		new MiniCssExtractPlugin({
			filename: 'css/index.css'
		})
	]
}