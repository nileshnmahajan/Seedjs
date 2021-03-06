# Seedjs

可以将您的 `js` 、 `css` 文件在 `localStorage` 中管理。

```js

	Seed.use(
            [
                '//cdn.bootcss.com/bootstrap/3.3.6/css/bootstrap.min.css',
                '//cdn.bootcss.com/jquery/3.0.0-beta1/jquery.min.js'
            ],
            function () {
	    
                $('body').append(
                    '<div class="alert alert-warning"> bootstrap、jQuery 准备完毕。 </div>'
                );
		
            }
        );
	
```

## 全局配置

### data.delimiter

- 类型： `String`
- 默认值： `seed`
- 用法：

    ```js
    
        Seed.data.delimiter = 'src';
        
    ```

    修改 dom 查找的界定符。

### data.debug

- 类型： `Boolean`
- 默认值： `false`
- 用法：

    ```js
    
        Seed.data.debug = true;
        
    ```

    实时获取文件，并且文件不会存储到 `localStorage`中。


### data.base

- 类型： `String`
- 默认值： `window.location.origin`
- 用法：
 
   ```js
       
        Seed.data.base = 'http://www.domain.com/assets/';
           
    ```
  
  文件路径查找的前缀。

  注意：文件路径本身为绝对路径的话，不受 `base` 限制


### data.jsonp

- 类型： `String`
- 默认值： `null`
- 用法：

    ```js
    
        Seed.data.jsonp = '_seedJsonp_';
        
    ```

    `Seedjs` 拉取文件的方式为 `xhr` 拉取，但是需要对应的静态服务器开启 `CORS`。

    也提供了 `jsonp` 的方式，将我们的文件文本返回前端执行。

### data.map

- 类型： `Function`
- 默认值： `null`
- 用法：

    ```js
    
        // defaultConfig 为 Seedjs 为您分析好的返回值，可供参考，或再无需分析的时候可直接返回他
        Seed.data.map = function ( url, defaultConfig ) {
            // 根据 url 分析出如下数据结构
        
            return {
                id     : '将会被存储的id',
                hook   : '是否应该更新的标记',
                fileUrl: '原始路径'
            }
        
            // 如果拿不定主意，或者有些许资源无需分析，可以返回 defaultConfig
            return defaultConfig;
        }
        
    ```
    
    该配置可对文件路径进行映射修改，可用于路径转换、在线调试等。

### data.load

- 类型： `Function`
- 默认值： `null`
- 用法：

    ```js
    
        // 一个蠢sample；
        Seed.data.load = function ( ajaxData ) {
			if( ajaxData.indexOf( '404 not found' ) !== -1 ) {
				return false;
			}
        }
        
    ```

	[记录一个致命的问题](https://github.com/litson/Seedjs/issues/1)
    
    将每次通过 `ajax`（或 `jsonp` ）获取的文件字符串（ `responseText` ）返回给这个钩子函数，

	由这个钩子函数判断返回值是否符合预期，不符合则可以返回 `false` 中断该文件的加载，那么再次刷新页面

	（或再次执行）的时候，会从新向服务器获取。
    
## API

### Seed.config( config )

- 参数：
    - `{Object} config`
- 用法：
    
    再也不用挨个 `Seed.data` 设置了，可以使用 `config` 方法批量配置。
    
    ```js
        
        Seed.config(
            {
                base : '/res',
                debug: true,
                delimiter: 'src'
            }
        )
    
    ```
    
    乙未年，年三十新增。

### Seed.setItem( key, dataString )

- 参数：
    - `{String} key`
    - `{String} dataString`
- 用法：
    
    对 `localStorage.setItem` 的封装。
    
    内部做了是否支持 `localStorage` 的检测。
    
    ```js
        
        Seed.setItem( 'documents', '一些数据' );
    
    ```
    
### Seed.getItem( key )

- 参数：
    - `{String} key`
- 返回值：`key` 对应的 `localStorage` 数据。
- 用法：
    
    根据 `key` 来获取本地存储的数据。
    
    内部做了是否支持 `localStorage` 的检测。
    
    ```js
        
        Seed.getItem( 'documents' );
    
    ```
    
    结果：
    
    ```js
    
        // output: '一些数据'
        
    ```
    
### Seed.removeItem( key )

- 参数：
    - `{String} key`
- 用法：
    
    对 `localStorage.removeItem` 的封装，无参调用，会清除所有的 `localStorage`。
    
    内部做了是否支持 `localStorage` 的检测。
    
    ```js
        
        Seed.removeItem( 'documents' );
    
    ```

### Seed.use( ids, ready )

- 参数：
    - `{String} id | {Array} ids`
    - `{Function} ready`
- 用法：

    `ready` 方法可选。

    获取一个资源 `url` （或资源列表），来做存储&执行操作,
    
    资源列表中某些资源若已在`localStorage`中，会自动跳过。
    
    资源全部准备完毕后，执行 `ready` 方法。
    
    ```js
        
        Seed.use(
            [
                '//cdn.bootcss.com/bootstrap/3.3.6/css/bootstrap.min.css',
                '//cdn.bootcss.com/jquery/3.0.0-beta1/jquery.min.js'
            ],
            function () {
                $('body').append(
                    '<div class="alert alert-warning"> bootstrap、jQuery 准备完毕。 </div>'
                )
            }
        );
    
    ```

### Seed.scan( ready )

- 参数：
    - `{Function} ready`
- 用法：

    扫描 `DOM` 中 `data-[delimiter]` 标识的元素，获得资源列表，内部调用 `Seed.use` 。
    
    该方法省去了手动在 `js` 中填写 资源列表的麻烦，也让页面中资源的依赖关系一目了然。
    
    ```html
	
    	<!-- 假设 delimiter 被设置为 "src" -->
        <style data-src="//cdn.bootcss.com/bootstrap/3.3.6/css/bootstrap.min.css"></style>
        <script data-src="//cdn.bootcss.com/jquery/3.0.0-beta1/jquery.min.js"></script>
    
    ```
    
    ```js
    
        Seed.scan(
            function () {
                $( 'body' ).append(
                    '<div class="alert alert-warning"> bootstrap、jQuery 准备完毕。 </div>'
                );
            }
        );
    
    ```
    
## TODO

- requirejs 插件
    - 支持将模块单个进行存储，思路是将 `define` 当做 `jsonpCallback` ，获得 `factory` 函数，然后将其整个 set 到 LS中。
- modjs 支持
    - 解决内需
