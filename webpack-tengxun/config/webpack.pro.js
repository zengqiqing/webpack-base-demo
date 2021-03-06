//生产环境webpack配置文件

//引入公共配置文件
const base = require('./webpack.base.js')

//导入一个用于合并的包
const merge = require('webpack-merge')

//
module.exports = merge(base,
  {
    /*mode: 模式
			@ 1.development(开发环境，源代码未经压缩)
			@ 2.production (生成环境，通常源代码都会进行压缩)
	 */
    mode: 'production',
    //配置开发环境时，运行服务器的端口和是否自动打开页面
    devServer:{
      port:3000,
      open:true
    }
  }
  )