console.log('--- 这是home模块 ----')

const $ = require ('jquery')

require ('./css/index.css')
require ('./css/test.css')
require ('./less/header.less')


$('#app li:nth-child(odd)').css('color','red')
$('#app li:nth-child(even)').css('color','pink')

const func = () => {
  console.log('嘎嘎！')
}
