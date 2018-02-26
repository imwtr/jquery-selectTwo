
## 下拉框模糊搜索插件 selectTwo

此插件是对模糊搜索插件 [select2](https://select2.org) 的封装

---

### Basic 基本

依赖：jQuery、select2

调用1：`$('.elem').selectTwo(options)`

调用2：`$('.elem').selectTwo(trigger, option)`


### Options 参数

##### `useSelect2`
*boolean* 可选
默认：false
直接使用原来的select2插件绑定（一般不需要）

##### `data`
*array/object* 对数据进行分组时可选，不分组时必选
默认：[]
模糊搜索的数据来源，可为对象或数组形式，建议数组
```
[{
    "postID":"p1",
    "postNo":"J1234",
    "postName":"岗位1",
    'status': 2
}]
```
##### `id`
*string* 必选
默认：'id'
id域，用于标识某一项，选择之后得到的值也是这个id值

##### `matchField`
*array* 必选
默认：['text']
指定哪些字段为搜索的字段（如职位搜索中需要搜索职位代号和名称）

##### `resultFormat`
*string* 可选
默认：matchField的组合
搜索下拉列表的格式 % %里为项名，如 [%postNo%] %postName%

##### `selectedFormat`
*string* 可选
默认：resultFormat
选中项的显示格式  % %里为项名，如 [%postNo%] %postName%

##### `allowClear`
*boolean* 可选
默认：true
下拉框选中值后是否允许直接清除（存在x按钮）

##### `multiple`
*boolean* 可选
默认：false
是否允许多选

##### `notMatched`
*boolean* 可选
默认：false
设置为true可用于不精确匹配（也能搜索），输入数据时会临时加一项当前输入值到下拉列表中提供选择

##### `width`
*string* 可选
默认：'153px'
输入框的长度

##### `placeholder`
*string* 可选
默认：'请选择'
输入框的提示文本

##### `maxItemShow`
*number* 可选
默认：100
搜索时最大展示的列表项目

##### `maxSelectedItem`
*number* 可选
默认：-1（无限制）
搜索时允许多选的个数

##### `minInputLength`
*number* 可选
默认：-1（无限制）
搜索之前至少输入的字符个数

##### `minInputText`
*string* 可选
默认：'请至少输入%min%个字'
输入字符太少的文本提示   需携带%min%占位符

##### `noResultText`
*string* 可选
默认：'没有匹配结果'
无匹配的文本提示

##### `searchingText`
*string* 可选
默认：'查询中...'
查询中的文本提示

##### `loadingMoreText`
*string* 可选
默认：'加载中...'
分页时加载更多的文本提示

##### `maxSelectedText`
*string* 可选
默认：'只能选择%max%项'
多选限制最大项的文本提示  需携带%max%占位符

##### `group`
*boolean/array* 可选
默认：false
搜索是否需要进行分组，可同时搜索多个数据源
需要分组时，此项设置为数组，数组中每项为各个组，字段属性类似不分组的情况，例如
```javascript
[{
    data: [],
    title: '部门',
    maxItemShow: 3,
    id: 'depID',
    matchField: ['depName'],
    resultFormat: '%depName%',
    selectedFormat: '%depName%'
}]
```

##### `groupTitleShow`
*boolean* 可选
默认：true
搜索进行分组时，是否显示分组标头

##### `groupEmptyTitleShow`
*boolean* 可选
默认：true
搜索进行分组时，若该组没有数据，是否需要显示分组标头（优先级低于groupTitleShow）

##### `beforeBinding`
*function(obj)* 可选
默认：空的函数，返回obj本身
在绑定之前的处理函数，如后端传值之后，前端先进行转换，处理某一项，处理之后需要返回这个新的项
如设置某一项默认选择
```javascript
beforeBinding: function(obj) {
    if (obj.depID == 'd19') {
        obj.selected = true;
    }

    return obj;
}
```

##### `change`
*function($elem, data, values)* 可选
默认：空的函数
当选项改变之后，会调用这个函数
$elem: 绑定的选择标签元素
data:
    异步的数据源：选择时为所选值所在的数据项，取消选择时为取消选择的值所在的数据项
    非异步的数据源：已经选择的值所在的数据项
        分组：为一个包含各组已选值所在的数据项集合，键值为所设置的各组id域 {id: []|{}}
              多选：多个数据项的数组集合 [{}, {}]
              单选：单个数据项 {}
        不分组：
              多选：多个数据项的数组集合 [{}, {}]
              单选：单个数据项 {}

values:
    异步的数据源：已经选择的值
    非异步的数据源：已经选择的值
        多选：多个值的数组集合 ['d1', 'd2']
        单选：单个值 'd1'


##### `ajax`
*object* 可选
默认：null 数据源非异步
可设置数据源是否为异步的形式，异步时还可以设置是否分页（分页较少用）
异步时默认的参数如下，可传参覆盖
```javascript
var ajaxDefault = {
    // 设置输入停顿多久（ms）后进行查询
    delay: 250,
    // 请求地址
    url: 'url',
    // 请求的参数，需要返回，默认键值为k，params.term为输入的值
    data: function(params) {
        return {
            k: params.term
        };
    },
    // 请求返回之后的处理，需要返回data的键值
    success: function(rs, params) {
        rs = typeof rs === 'string' ? JSON.parse(rs) : rs;

        return {
            data: rs
        };
    }
};
```

如果需要分页，data回调中需要返回 page键值，success回调中需要返回pagination键值，标识more，如
```javascript
    data: function(params) {
        return {
            k: params.term,
            page: params.page || 1
        };
    },
    // 请求返回之后的处理，需要返回data的键值
    success: function(rs, params) {
        rs = typeof rs === 'string' ? JSON.parse(rs) : rs;

        return {
            data: rs,
            pagination: {
                more: true
            }
        };
    }
```

如果异步的数据源还需要进行分组，则在group参数中设置groupKey标识作为匹配，然后在success回调中设置返回的data为各组groupKey所对应的数据，详见Demo


### Trigger 参数
可调用的几个参数，trigger为字符串，各个trigger的option不同

##### `updateData`
更新数据源，在绑定之后的更新才生效，option为新的数据源，格式与绑定时相同，如
```javascript
$('.elem').selectTwo('updateData', [{depID: 'd1', depName: '部门1'}]);
```

##### `updateValue`
设置值选中，option为这个值，单选时为单个字符串，多选时为值的数组集合
```javascript
$('.elem').selectTwo('updateValue', 'p1');
$('.elem').selectTwo('updateValue', ['p11', 'p22']);
```

##### `destroy`
取消绑定，option为是否将select下拉项也一并清空，默认false
```javascript
$('.elem').selectTwo('destroy', true);
```


### Usage 使用

引入`select2`和`selectTwo`的资源文件，或者直接引入`selectTwo.full`的资源文件（已将select2文件打包在一起）
绑定的元素对象限制为 `<select>` 标签

一般使用   参见 [Demo](https://imwtr.github.io/selectTwo/)
```javascript
            // 单选
            $('#dep-select-1').selectTwo({
                data: allDeps,
                placeholder: '请选择部门',
                id: 'depID',
                matchField: ['depName'],
                resultFormat: '%depName%',
                change: function($elem, data, value) {
                    console.log($elem, data, value);
                }
            })

            // 多选，设置最多为3
            $('#dep-select-2').selectTwo({
                data: allDeps,
                placeholder: '请选择部门',
                id: 'depID',
                matchField: ['depName'],
                resultFormat: '%depName%',
                multiple: true,
                maxSelectedItem: 3,
                change: function($elem, data, value) {
                    console.log($elem, data, value);
                }
            })

            // 设置列表最大项为5
            $('#dep-select-3').selectTwo({
                data: allDeps,
                placeholder: '请选择部门',
                id: 'depID',
                matchField: ['depName'],
                resultFormat: '%depName%',
                maxItemShow: 5,
                change: function($elem, data, value) {
                    console.log($elem, data, value);
                }
            })

            // 设置下拉显示的格式和选中后的文本格式
            $('#post-select-1').selectTwo({
                data: allPosts,
                placeholder: '请选择职位',
                id: 'postID',
                matchField: ['postNo', 'postName'],
                resultFormat: '[%postNo%] %postName%',
                // selectedFormat: '[%postNo%] %postName%',
                change: function($elem, data, value) {
                    console.log($elem, data, value);
                }
            })
            
            /** 自定义下拉项的样式
                1. 设置customClass为true
                2. 设置自定义的样式，使用下方的选择器，相关样式可自定义设置
                .select2-container--default .select2-results__option.custom-class {
                    color: blue;
                }
            */
            $('#staff-select-1').selectTwo({
                data: allPosts,
                placeholder: '请选择职位',
                id: 'postID',
                matchField: ['postNo', 'postName'],
                resultFormat: '[%postNo%] %postName%',
                // selectedFormat: '[%postNo%] %postName%',
                beforeBinding: function(obj) {
                    if (obj.using == -1) {
                        // 设置customClass为true
                        obj.customClass = true;
                    }

                    return obj;
                }
            })

            // 设置默认选择和将某项置为不可选
            $('#post-select-2').selectTwo({
                data: $.extend(true, [], allPosts),
                placeholder: '请选择职位',
                width: '260px',
                id: 'postID',
                matchField: ['postNo', 'postName'],
                resultFormat: '[%postNo%] %postName%',
                // selectedFormat: '[%postNo%] %postName%',
                multiple: true,
                beforeBinding: function(obj) {
                    if (obj.status == 2) {
                        obj.disabled = true;
                    }

                    if (obj.postID == 'p11') {
                        obj.selected = true;
                    }

                    return obj;
                },
                change: function($elem, data, value) {
                    console.log($elem, data, value);
                }
            })

            // 自定义无匹配文案
            $('#post-select-3').selectTwo({
                data: allPosts,
                placeholder: '请选择职位',
                id: 'postID',
                matchField: ['postNo', 'postName'],
                resultFormat: '[%postNo%] %postName%',
                noResultText: '搜不到搜不到',
                change: function($elem, data, value) {
                    console.log($elem, data, value);
                }
            })

            // 无匹配时也可以进行选择
            $('#post-select-4').selectTwo({
                data: allPosts,
                placeholder: '请选择职位',
                id: 'postID',
                matchField: ['postNo', 'postName'],
                resultFormat: '[%postNo%] %postName%',
                notMatched: true,
                change: function($elem, data, value) {
                    console.log($elem, data, value);
                }
            })

            // 限制至少输入2个字后才进行搜索
            $('#post-select-5').selectTwo({
                data: allPosts,
                placeholder: '请选择职位',
                id: 'postID',
                matchField: ['postNo', 'postName'],
                resultFormat: '[%postNo%] %postName%',
                minInputLength: 2,
                minInputText: '快点把这%min%个字输完吧',
                change: function($elem, data, value) {
                    console.log($elem, data, value);
                }
            })

            // 将数据进行分组
            $('#post-select-6').selectTwo({
                group: [{
                    data: allDeps,
                    title: '部门',
                    maxItemShow: 5,
                    id: 'depID',
                    matchField: ['depName'],
                    resultFormat: '%depName%',
                    // selectedFormat: '%depName%',
                }, {
                    data: allPosts,
                    maxItemShow: 10,
                    title: '职位',
                    id: 'postID',
                    matchField: ['postNo', 'postName'],
                    resultFormat: '[%postNo%] %postName%',
                    // selectedFormat: '[%postNo%] %postName%',
                }],
                // groupTitleShow: false,
                notMatched: true,
                placeholder: '搜索部门/职位',
                minInputLength: 1,
                change: function($elem, data, value) {
                    console.log($elem, data, value);
                }
            })

            // 将数据进行分组，隐藏分组标头
            $('#post-select-7').selectTwo({
                group: [{
                    data: allDeps,
                    title: '部门',
                    maxItemShow: 5,
                    id: 'depID',
                    matchField: ['depName'],
                    resultFormat: '%depName%',
                }, {
                    data: allPosts,
                    maxItemShow: 10,
                    title: '职位',
                    id: 'postID',
                    matchField: ['postNo', 'postName'],
                    resultFormat: '[%postNo%] %postName%',
                }],
                groupTitleShow: false,
                notMatched: true,
                placeholder: '搜索部门/职位',
                minInputLength: 1,
                change: function($elem, data, value) {
                    console.log($elem, data, value);
                }
            })

            // 数据源为异步获取，不分组
            $('#post-select-8').selectTwo({
                data: [],
                ajax: {
                    url: './allPosts.json'
                },
                placeholder: '搜索职位',
                id: 'postID',
                resultFormat: '[%postNo%] %postName%',
                minInputLength: 1,
                multiple: true,
                change: function($elem, data, value) {
                    console.log($elem, data, value);
                }
            })

            // 数据源为异步获取，分组
            $('#post-select-9').selectTwo({
                ajax: {
                    url: './postAndDep.json',
                    success: function(rs, params) {
                        rs = typeof rs === 'string' ? JSON.parse(rs) : rs;

                        return {
                            data: {
                                dep: rs.dep,
                                post: rs.post
                            },
                            pagination: {
                                more: false
                            }
                        };
                    }
                },
                group: [{
                    data: [],
                    groupKey: 'dep',
                    id: 'depID',
                    title: '部门',
                    maxItemShow: 3,
                    matchField: ['depName'],
                    resultFormat: '%depName%',
                }, {
                    data: [],
                    groupKey: 'post',
                    id: 'postID',
                    title: '职位',
                    maxItemShow: 10,
                    matchField: ['postNo', 'postName'],
                    resultFormat: '[%postNo%] %postName%',
                }],
                placeholder: '搜索职位/部门',
                minInputLength: 1,
                change: function($elem, data, value) {
                    console.log($elem, data, value);
                }
            })

            // 数据源为异步获取，设置输入延迟多久才发请求，自定义请求参数
            $('#post-select-10').selectTwo({
                ajax: {
                    delay: 300,
                    url: './postAndDep.json',
                    data: function(params) {
                        var query = {
                            k: params.term,
                            otherParam: 'otherParam',
                            // page: params.page || 1
                        };

                        return query;
                    },
                    success: function(rs, params) {
                        rs = typeof rs === 'string' ? JSON.parse(rs) : rs;

                        return {
                            data: {
                                dep: rs.dep,
                                post: rs.post
                            },
                            pagination: {
                                more: false
                            }
                        };
                    }
                },
                group: [{
                    data: [],
                    groupKey: 'dep',
                    id: 'depID',
                    title: '部门',
                    maxItemShow: 3,
                    matchField: ['depName'],
                    resultFormat: '%depName%',
                }, {
                    data: [],
                    groupKey: 'post',
                    id: 'postID',
                    title: '职位',
                    maxItemShow: 10,
                    matchField: ['postNo', 'postName'],
                    resultFormat: '[%postNo%] %postName%',
                }],
                placeholder: '搜索职位/部门',
                minInputLength: 1,
                change: function($elem, data, value) {
                    console.log($elem, data, value);
                }
            })


            // 已经对原来的select2样式做一些整合，如有需要可自行修改样式来覆盖
            // 默认<select>标签在绑定成功后才会隐藏，绑定的延迟可能会导致模糊搜索位置元素大小有跳动。可通过初始设置其样式来解决
           
            // 设置单个值
            $('.elem').selectTwo('updateValue', 'p1');
            // 设置多个值
            $('.elem').selectTwo('updateValue', ['p22', 'p11']);
            // 更新数据源
            $('.elem').selectTwo('updateData', [{depID: 'd1', depName: '部门1'}]);
            // 取消绑定  并将select的下拉项清空
            $('.elem').selectTwo('destroy', true);
            // 隐藏下拉项
            $('.elem').selectTwo('close');
            // 显示下拉项  在窗口大小发生改变时 下拉项的位置可能会错乱，这时可通过调用 $('.elem').selectTwo('close').selectTwo('open') 来解决
            $('.elem').selectTwo('open');
            // 设置为不可选
            $('.elem').prop('disabled', true);

```
