##webpack 学习第二章 
学习资源来自于腾讯课堂课程：  
 [腾讯课堂webpack入门](https://ke.qq.com/course/483060?taid=5018699350630132)

 [教程文档github](https://github.com/JepsonGithub/webpack-public-stu)

 
 

###（一）文件介绍：

1.dist文件夹：的目录存放的是打包后的资源  
2.src文件夹：是存放源代码  
3.package.json文件：存储安装依赖包记录  
4.webpack.config.js文件：打包的配置文件  
5.package-lock.json文件：是在npm i 时生成的文件，用于记录当前状态下实际安装的各个npm package的具体来源和版本号。  
6.public 文件夹：存储一些静态资源，不太需要额外处理的东西，例如logo小图片，html  


### （二）module:(模块加载规则)：loader(转换器)
注意： webpack只认识js,json文件；不认识其他类型的文件，如果希望打包处理其他类型的文件，就需要配置对应的loader

⚠️ rules是个数组，也就说明规则可以有多个，而且每一个规则都是一个对象  

🌰语法：

```
/* webpack.config.js文件 */

module.exports = {
	……//此处省略
	   module:{
	        rules:[
	            {
	                test:/\.css$/,
	                /*
	                	* 实际执行顺序是从右往左；
	                	* style-loader：通过动态的创建style标签的方式，让解析后的css内容能作用到页面中 
	                */
	                use:[ 'style-loader', 'css-loader' ]  
	            }
	        ]
    },
}

```
**🌺css-loader**   **🌺leass-loader**  **🌺style-loader**

解析css文件，less文件，style样式。成为webpack能够读取的类型文件



**🌺url-loader:**

url-loader可以对图片文件进行解析。建议还是进行配置
1.如果不配置，那么图片默认都是转成base64格式。  
好处：浏览器不需要发送请求获取图片资源。可以直接读取，节约请求次数。  
坏处：如果图片太大就会让图片的体积增加多30%左右，得不偿失。
结果：需要通过配置options配置选项中进行配置limt,可以设置一个临界值，大于此值则整个文件直接打包到dist目录下，小于此值则直接生成base64


🌰语法：

```
module.exports = {
	....
	module:{
	  rules:[
	    ....  //各种loader
	    {
	      test: /\.(png|jpg|gif)$/,
	      use:[
	      	   {
	      	     //注意：如果url-loader不配置，图片默认转成base64格式
            		loader: 'url-loader',
	            options: {
	              limit: 20 * 1024   //临界值是20k
	            }
	      	   }
	      ]
	    }   
	  ]
	}
}
```
**❓此时有疑问：**  
①：大于临界值的图片直接生成在dist文件的根目录上了，图片一旦多起来dist文件看起来很乱，能不能在dist里面用一个图片文件夹装载这些图片呢？还有生成在dist文件上的图片名称是随机生成的数字和符号的组合，能否让他变成我一开始定义的图片名称呢？

```
{
	test: /\.(png|jpg|gif)$/,
		use: [
          		{
			 //注意：如果url-loader不配置，图片默认转成base64格式
            		loader: 'url-loader',
            		options: {
						limit: 20 * 1024,
						name:'[name].[ext]',        //配置输出的文件名  ext是指图片后缀不被改变
						publicPath:'../images/',   //配置静态资源引用的路径 
						outputPath:'images/'     //配置输出文件目录 注意1：publicPath和outputPath定义的文件夹名称要一致 注意2：定义的文件名称不必与存放静态资源的图片文件夹名称一致
            		}
          		}
        	]
	}
```
②：现在看dist目录，样式和图片都有文件去管理了，那js呢，能否也用文件去装载，而不是直接放在dist文件夹的根目录下

```
语法：
//只需在output配置打包文件里，加多一个前缀即可
//代码是这句：filename: 'js/bundle.js'

module.exports = {
	.....
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'js/bundle.js'
	},
	.....
}
```

**🌺babel-loader（兼容处理器）：**    
介绍：此loader用于配置高版本js语法的兼容性处理，类似于箭头函数，import或者es6语法等。

```
语法：
module.export = {
	.....
	module:{
		rule:[
		{
			test: /\.m?js$/,  //匹配js后缀，针对js文件进行兼容处理
			exclude: /(node_modules)/,  //排除项：排除不需要处理的js文件，例如node_modules里面的文件
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env']
				}
			}
		}
	]
}
	.......
}
```
🌰 例子：
在main.js文件中写下const func = () => { console.log('this is 箭头函数') }  
如果进行了babel-loader的转换，原本的const 就会转成var ... 转成低版本支持的语法



###（三）plugins : 插件的介绍
**🐶HtmlWebpackPlugin**  

介绍：自动生成html的插件。  

🌺使用方式 & 语法：  
1.先下载HtmlWebpackPlugin：yarn add HtmlWebpackPlugin  
2.到webpack.config.js文件进行配置  
3.重新打包
结果：配置好后，public目录下的index.html就不需要引入打包后的文件，打包好的文件会自动插入到html中


```
/* webpack.config.js文件 */

语法：
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
...... //此处省略
	plugins:[
		new HtmlWebpackPlugin({
			template:'./plublic/index.html'  //核心展示html文件
		})
	]
}

```


🐶 **MiniCssExtractPlugin （分离 css 文件插件）** 
  
[MiniCssExtractPlugin文档](https://webpack.js.org/plugins/mini-css-extract-plugin/#root)  

使用了这个这个插件就可以不用style-loader了；结合html-webpack-plugin，以link的形式插入到html文件中。

语法：

  ```
  module: {
		rules: [
			{
				test: /\.css$/,
				use: [
				{
					loader: MiniCssExtractPlugin.loader,
					options: {
						publicPath: '../'   //publicPath：公共资源加载的路径
					}
				}, 'css-loader']
		}]
	}
  ```
  
**🐶CleanWebpackPlugin （调用清除打包目录插件）**  

介绍：只要在webpack.config.js里面引入使用了这个插件，那么每次打包时，都可以清空掉上一次生成的一些残余文件
  
🌰例子：  
上面有介绍url-loader图片的转换器，我设定了一张背景图片大于设定的临界值时dist文件内就会在dist的根目录下生成一张图片。此时，我再次设定该背景图片是一张小于临界值的图，再次打包时，由于引入了CleanWebpackPlugin插件，那么上一次打包生成在dist文件里的图片就会先被清空掉，然后重新执行打包


**webpack-dev-server：(自动刷新)**  
介绍：没更改一次内容我们就执行一次build，对于开发来说是拖慢开发进度的，可以使用webpack-dev-server插件，实现每次更改内容可以自动编译，不需要手动打包。要知道每次在dist文件中打包生成文件和编译都是消耗性能的，所以我们需要设多一个dev环节，在dev环节中编辑相当于一个挂起的状态，不会实时打包生成文件的。直到上生产的时候才build一下就可以啦！~

🌰使用方式：  
1.安装webpack-dev-server包  
2.到package.json进行配置script

  ```
  语法：
  "scripts": {
    "build": "webpack --config webpack.config.js",
    "dev":"webpack-dev-server --config webpack.config.js"
  }
  ```
3.实现修改端口和服务器开启后自动打开页面可以到webpack.config.js文件中配置

  ```
  语法：
  module.exports = {
  	.....,
  	plugins:[....],
  	
  	//注意，他是module.exports里面一个新的对象，与plugins，mode等平级
  	devServer:{   
	port:3000,
	open:true
	}
  }
  ```
  
  此时运行yarn dev就可以自动打开页面啦~~~每修改一次他就自动编译一次哦！~  
 
  
###（四）分离开发环境和生产环境
使用webpack-merge 插件将公共配置文件和当前环境的配置文件合并为一体   
介绍，生产环境一般要求打包后的文件，文件，图片都会尽量去压缩达到包尽可能的小，加载才能变快。那么生成环境和开发环境就出现异同了。因此我们会把2个环境分离出各自环境的配置文件；而且需要分别指定

🌺过程：  
1.抽取出公共配置。  
在根目录中新建一个config文件，里面再建个三个文件：webpack.base.js(存储公共配置)；webpack.dev.js(存储开发环境配置)；webpack.pro.js（存储生产环境配置）
注意：由于文件路径改变，那么配置文件中的一些绝对路径（__dirname:从当前文件夹去查找）需要修成相对路径（../xxxx）


2.抽取出公共配置后，dev和pro配置文件，使用webpack-merge进行与公共配置文本的代码合并。例子语法如下：  

  ```
  //开发环境webpack配置文件
  
//引入公共配置文件
const base = require('./webpack.base.js')

//导入一个用于合并的包
const merge = require('webpack-merge')

//merge可以传入多个参数，会将多个参数合并成一个对象，如果有重复的属性名，后面的对象属性会覆盖前面的

module.exports = merge(base,
  {
    /*mode: 模式
		@ 1.development(开发环境，源代码未经压缩)
		@ 2.production (生成环境，通常源代码都会进行压缩)
	 */
    mode: 'development',
    //配置开发环境时，运行服务器的端口和是否自动打开页面
    devServer:{
      port:3000,
      open:true
    }
  }
  )
  ```
3.package.json文件请注意了，配置运行命令的scripts之前引入的路径是存放在根目录下的webpack.config.js文件的目录，如今得修改为 ：

```
"scripts": {
    "build": "webpack --config config/webpack.pro.js",
    "dev": "webpack-dev-server --config config/webpack.dev.js"
  },
```

###(五).多入口的配置
介绍：如果有多个模块，不要打包生成同一个文件，避免体积过大的问题，那么可以到配置文件进行配置  

注意点：
1.对比单入口,entry入口配置从字符串路径改为对象去装载入口文件路径。  
🌰例子：

```
module.exports = {
	/* 1.entry:(入口)：
		*从哪个文件开始打包
		*此时的entry有多个入口，需要配置成对象
	 */
	entry: {
		index:'./src/index.js',
		about:'./src/about.js'
	},

}
```
2.对比单入口，output的filename配置也修改。但入口的配置是只配置一个文件，多入口需要增加多一个[name]区分不同文件名称 ，避免文件覆盖

🌰例子：  

```
module.exports = {
	/*output:(出口)：打包到哪里去  
		@path: 打包输出的目录;(输出的目录必须是一个绝对路径);
		@filename:打包后生成的文件名;
		@__dirname：从当前目录出发
		@[name]的作用是：由于有多个入口，如果后期有文件名称重名会出现覆盖问题，那么添加【name】就会取entry入口上配置的键名称
	*/
	output: {
		path: path.join(__dirname, '../dist'),
		filename: 'js/[name].bundle.js'
	},
}

```

最后：执行打包命令，dist文件里面就会生成2个bundle文件啦   
 
 
##（五）提取公共模块
介绍：当个别文件同时引入一个库时，那么打包时这些文件的体积就会大，此时我们可以提取公共模块降低文件的体积  
🌰例子：个别文件中同时引入了jq，此时打包后看到这些的体积都非常大，此时可以在公共配置文件中（webpack.base.js）引入代码块：

```
module.exports = {
	........//省略前面的配置
	
	//提取公共模块配置
	optimization:{
		splitChunks:{
			chunks:'all', //提取所有文件的共同模块
		}
	}
}
```
那么此刻可以看到dist文件中的js文件中提取公共模块的文件，而之前文件的体积都减少了   

🌺注意：并非所有的公共模块都适合做拆分，建议公共模块的大小必须大于30kb才会独立打包，而上面提到的jq的大小是87kb


 
 
  
  