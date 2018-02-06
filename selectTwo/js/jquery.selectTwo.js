// 模糊下拉搜索  select2插件的小封装
//
;(function($) {
    $.fn.select2.amd.define('CustomResults', ['jquery', 'select2/utils', 'select2/results'], function ($, Utils, Results) {
        Results.prototype.option = function (data) {
            var option, append = false;
            if (data.children) {
                 option = $('.select2-results__option[aria-label="' + data.text + '"]')[0];
                if ($(option).length === 0) {
                     option = document.createElement('li');
                   option.className = 'select2-results__option';
               }
                 else {
                    append = true;
                }
             }
           else {
                 option = document.createElement('li');
                option.className = 'select2-results__option';
             }


            var attrs = {
                 'role': 'treeitem',
                 'aria-selected': 'false'
             };

             if (data.disabled) {
                 delete attrs['aria-selected'];
                attrs['aria-disabled'] = 'true';
             }

           if (data.id == null) {
               delete attrs['aria-selected'];
             }

             if (data._resultId != null) {
                 option.id = data._resultId;
             }

             if (data.title) {
                 option.title = data.title;
             }

             if (data.children) {
                 attrs.role = 'group';
                 attrs['aria-label'] = data.text;
                 delete attrs['aria-selected'];
             }

            for (var attr in attrs) {
                 var val = attrs[attr];

                 option.setAttribute(attr, val);
             }

             if (data.children) {
                 var $option = $(option);

                 var label = document.createElement('strong');
                 label.className = 'select2-results__group';

                 var $label = $(label);
                 this.template(data, label);

                 var $children = [];

                 for (var c = 0; c < data.children.length; c++) {
                     var child = data.children[c];

                     var $child = this.option(child);

                     $children.push($child);
                 }

                 var $childrenContainer;
                 if(append){
                   $childrenContainer =  $option.find('.select2-results__options--nested');
                 } else{
                   $childrenContainer =  $('<ul></ul>', {
                     'class': 'select2-results__options select2-results__options--nested'
                   });
                 }

                 $childrenContainer.append($children);
                 if (!append) {
                     $option.append(label);
                     $option.append($childrenContainer);
                 }

             } else {
                 this.template(data, option);
             }

             $.data(option, 'data', data);

            return option;
            };
        });
        // 重写SelectAdapter的几个方法
        $.fn.select2.amd.define('CustomSelectAdapter', ['select2/data/select'], function (SelectAdapter) {
            SelectAdapter.prototype.query = function (a, b) {
                var d = [],
                    e = this;

                this.$element.children().each(function() {
                    var b = $(this);
                    if (b.is("option") || b.is("optgroup")) {
                        var f = e.item(b);
                        var g = e.matches(a, f, d);
                        null !== g.data && d.push(g.data);
                    }
                });

                b({
                    results: d
                });
            };

            SelectAdapter.prototype.matches = function(params, data, datas) {
                return this.options.get("matcher")(params, data, datas)
            };

            // 重写current方法，原方法中使用this.$element.find(':selected') 获取元素性能不佳，在数据量大时严重卡顿
            SelectAdapter.prototype.current = function (callback) {
                var data = [];
                var self = this;

                this.$element.find('option').each(function () {
                  var $option = $(this);

                    if (this.selected) {
                        var option = self.item($option);
                        data.push(option);
                    }
                });

                callback(data);
            };
        })

    var MAX_ITEM_SHOE = 100;

    $.fn.selectTwo = function(trigger, options) {
        var defaults = {
            // 直接使用原来的select2插件
            useSelect2: false,
            // 模糊搜索数据源
            data: [],
            // 允许情况  右方有X
            allowClear: true,
            // 允许多选
            multiple: false,
            // 输入框长度
            width: '153px',
            // 提示文本
            placeholder: '请选择',
            // id域，用于标识某一项，选择之后得到的值也是id
            id: 'id',
            // 设置需要匹配的区域（属性），默认为text
            matchField: ['text'],
            // 搜索下拉列表的格式 % %里为项名，如 [%postNo%] %postName%，不设置则直接使用matchField的项
            resultFormat: '',
            // 选中项的显示格式 % %里为项名，默认使用resultFormat的值  如 [%postNo%] %postName%，不设置则直接使用matchField的项
            selectedFormat: '',
            // 设置为true可用于不精确匹配（也能搜索），输入数据时会临时加一项当前输入值到下拉列表中提供选择
            notMatched: false,
            // 最大展示的列表项目 默认100
            maxItemShow: MAX_ITEM_SHOE,
            // 多选的个数
            maxSelectedItem: -1,
            // 搜索之前至少输入的字符个数
            minInputLength: -1,
            // 输入字符太少的文本提示   需携带%min%占位符
            minInputText: '请至少输入%min%个字',
            // 无匹配的文本提示
            noResultText: '没有匹配结果',
            // 查询中的文本提示
            searchingText: '查询中...',
            // 分页时加载更多的文本提示
            loadingMoreText: '加载中...',
            // 多选限制最大项的文本提示  需携带%max%占位符
            maxSelectedText: '只能选择%max%项',

            ajax: null,

            // 是否进行分组，同事搜索多个数据源
            /**
             * @example
             * [{
             *     data: [],
             *     title: '部门',
             *     maxItemShow: 3,
             *     id: 'depID',
             *     matchField: ['depName'],
             *     resultFormat: '%depName%',
             *     selectedFormat: '%depName%'
             * }]
             */
            group: false,
            // 搜索进行分组时，是否显示分组标头
            groupTitleShow: true,
            // 搜索进行分组时，若该组没有数据，是否需要显示分组标头（优先级低于groupTitleShow）
            groupEmptyTitleShow: true,
            /**
             * 内容选择改变后触发
             * @param  {Object} $elem 绑定的元素
             * @param  {Array} data   所选值归属的数据项
             * @param  {Array} values 所选值
             */
            change: function($elem, data, values) {

            },

            /**
             * 在绑定之前的处理函数，如后端传值之后，前端先进行转换
             * @param   {Object} obj   某个数据项
             * @return  {Object} obj   返回这个新的数据项
             */
            beforeBinding: function(obj) {
                return obj;
            }
        };

        var ajaxDefault = {
                delay: 250,
                url: 'url',
                data: function(params) {
                    return {
                        k: params.term
                    };
                },
                success: function(rs, params) {
                    rs = typeof rs === 'string' ? JSON.parse(rs) : rs;

                    return {
                        data: rs
                    };
                },
                processResults: function(rs, params) {
                    return {
                        results: rs
                    };
                }
            };

        var triggers = {
            // 更新数据源的例子  使用dataAdapter，先清空原有数据，再进行添加options项
            updateData: function($elem, data) {
                $elem.empty();
                // 如果原来需要空的option项 ，旧在这里添加
                $elem.html('<option />');

                data = createIDTextField(data, $elem.data('select2').options.options);

                var dataAdapter = $elem.data('select2').dataAdapter;
                dataAdapter.addOptions(dataAdapter.convertToOptions(data));
            },

            // 更新值
            updateValue: function($elem, value) {
                $elem.val(value).trigger('change');
            },

            // 销毁
            destroy: function($elem, empty) {
                $elem.select2('destroy');

                empty && $elem.empty();
            },
        };

        if (typeof trigger === 'string') {
            if (triggers[trigger]) {
                this.each(function() {
                    var $this = $(this);

                    if (!$this.data('select2')) {
                        return;
                    }

                    triggers[trigger]($this, options);
                });
            }

            return;
        } else {
            options = trigger;
        }

        if (options.useSelect2) {
            this.select2(options);
            return;
        }

        if (options.ajax) {
            var defaultsClone = $.extend(true, {}, defaults);
            defaultsClone.ajax = ajaxDefault;

            var opts = $.extend(true, {}, defaultsClone, options);
        } else {
            var opts = $.extend(true, {}, defaults, options);
        }

        opts.minimumInputLength = opts.minInputLength;
        opts.maximumSelectionLength = opts.maxSelectedItem;
        opts.tags = opts.notMatched;

        opts.language = {
            inputTooShort: function(e) {
                if (e.minimum === 1) {
                    return '请输入';
                }

                return opts.minInputText.replace('%min%', e.minimum);
            },
            noResults: function() {
                return opts.noResultText;
            },
            searching: function() {
                return opts.searchingText;
            },
            loadingMore: function() {
                return opts.loadingMoreText;
            },
            maximumSelected: function(e) {
                return opts.maxSelectedText.replace('%max%', e.maximum);
            }
        };

        if (opts.ajax) {
            opts.ajax.processResults = function(rs, params) {
                var data = opts.ajax.success(rs, params);
                var results = data.data;

                if (!opts.group) {
                    opts.data = results;
                } else {
                    opts.group.forEach(function(item) {
                        item.data = results[item.groupKey] || [];
                    });
                }

                opts.data = createIDTextField(opts.group || opts.data, opts);

                data.results = opts.data;

                return data;
            };
        }
        else {
            opts.data = createIDTextField(opts.group || opts.data, opts);
        }

        this.each(function() {
            selectTwo($(this), opts);
        });
    };

    function createIDTextField(data, option) {
        if (!option.group) {
            option.idField = option.id;
            option.textField = option.matchField;

            // 设置select2支持的id和text域
            data = $.map(data, function(obj) {
                obj = option.beforeBinding(obj);

                obj.id = obj.id || obj[option.idField];

                var text = [];

                option.textField.forEach(function(item) {
                    obj[item] && text.push(obj[item]);
                });

                obj.text = obj.text || text.join('');

                return obj;
            });

            return data;
        } else {
            var groupData = [];

            data.forEach(function(item) {
                item.idField = item.id;
                item.textField = item.matchField;
                item.maxItemShow = item.maxItemShow || MAX_ITEM_SHOE;

                item.data = $.map(item.data, function(obj) {
                    obj = option.beforeBinding(obj);

                    obj.matchField = item.matchField;
                    obj.resultFormat = item.resultFormat;
                    item.selectedFormat = item.selectedFormat;

                    obj.id = obj.id || obj[item.idField];

                    var text = [];

                    item.textField.forEach(function(item) {
                        obj[item] && text.push(obj[item]);
                    });

                    obj.text = obj.text || text.join('');

                    return obj;
                });

                if (item.data.length || option.groupEmptyTitleShow) {
                    groupData.push({
                        id: item.id,
                        text: item.title,
                        children: item.data,
                        maxItemShow: item.maxItemShow
                    });
                }
            });

            return groupData;
        }
    }

    function selectTwo($elem, option) {
        // 多选时使用allowClear会导致错位，这里直接强制不共用；单选时需要空的<option>
        if (option.multiple) {
            option.allowClear = false;
            $elem.find('option[value=""]').remove();
        } else {
            !$elem.find('option[value=""]').length && $elem.prepend('<option value="" />');
        }

        // select2所调用的参数
        var options = $.extend(true, {
            Results: $.fn.select2.amd.require('CustomResults'),
            SelectAdapter: $.fn.select2.amd.require('CustomSelectAdapter'),
            matcher: function(params, data, datas) {
                    if ($.trim(params.term) === '' && data.text) {
                        return {
                            data: data
                        };
                    }

                    if (typeof data.text === 'undefined' || data.text === '' || data.id === ''
                        || (options.group && typeof data.children === 'undefined')) {
                        return {
                            data: null
                        };
                    }

                    var q = params.term.toLowerCase();

                    // 分组的匹配
                    if (option.group) {
                        var filterChildren = [];

                        data.children.forEach(function(cItem) {
                            cItem.matchField.forEach(function(item) {
                                if (cItem[item] && cItem[item].toLowerCase().indexOf(q) !== -1) {
                                    filterChildren.push(cItem);
                                    return false;
                                }
                            });
                        });

                        // 将匹配到的数据返回
                        if (filterChildren.length) {
                            var matchedData = $.extend(true, {}, data);
                            matchedData.children = filterChildren;

                            return {
                                data: matchedData
                            }
                        }

                        return {
                            data: null
                        };
                    }


                    var matched = false;
                    options.matchField.forEach(function(item) {
                        if (data[item] && data[item].toLowerCase().indexOf(q) !== -1) {
                            matched = true;
                            return false;
                        }
                    });

                    // 返回匹配
                    if (matched) {
                        return {
                            data: $.extend(true, {}, data)
                        };
                    } else {
                        return {
                            data: null
                        };
                    }
                },
                sorter: function(data) {
                    // 分组的
                    if (options.group) {
                        var newData = $.extend(true, [], data);
                        // 没有限制最大展示的条目数的配置项，可以在sorter返回之前截取（返回之后才会进行渲染）
                        // 当前选项值，如['p1','p2']
                        var selected = $('.my-select').val() || [];
                        selected = typeof selected === 'string' ? [selected] : selected;

                        newData.forEach(function(item) {
                            if (item['children']) {
                                var MAX_RESULTS_SHOW = item.maxItemShow;
                                var tempData = item['children'].slice(0, MAX_RESULTS_SHOW);

                                // 在剩余项中有当前选项值，需要将其提取出来
                                var selectedInElse = false;

                                // 匹配选中的值，提取
                                for (var i = MAX_RESULTS_SHOW; i < item['children'].length; ++i) {
                                    for (var j = 0; j < selected.length; ++j) {
                                        if (item['children'][i][option.idField] === selected[j]) {
                                            selectedInElse = true;
                                            tempData.push(item['children'][i]);
                                        }
                                    }
                                }
                                // 调整返回的项目总量
                                selectedInElse && tempData.splice(MAX_RESULTS_SHOW - selected.length, selected.length);
                                item['children'] = tempData;
                            }
                        });

                        return newData;
                    }

                    // 可直接限制列表展示的最大项数量，可以在sorter返回之前截取（返回之后才会进行渲染）
                    var MAX_RESULTS_SHOW = options.maxItemShow;
                    var newData = data.slice(0, MAX_RESULTS_SHOW);

                    // 在剩余项中有当前选项值，需要将其提取出来
                    var selectedInElse = false;
                    // 当前选项值，如['p1','p2']
                    var selected = $elem.val() || [];
                    selected = typeof selected === 'string' ? [selected] : selected;

                    // 匹配选中的值，提取
                    for (var i = MAX_RESULTS_SHOW; i < data.length; ++i) {
                        for (var j = 0; j < selected.length; ++j) {
                            if (data[i][option.idField] === selected[j]) {
                                selectedInElse = true;
                                newData.push(data[i]);
                            }
                        }
                    }

                    // 调整返回的项目总量
                    selectedInElse && newData.splice(MAX_RESULTS_SHOW - selected.length, selected.length);

                    return newData;
                },
                templateResult: function(item) {
                    // 如果是分组，则取分组里面的参数
                    var resultFormat = options.group ? item.resultFormat : options.resultFormat;
                    var text = resultFormat;

                    if (!text || item.loading) {
                        return item.text;
                    }

                    for (var i in item) {
                        if (item.hasOwnProperty(i)) {
                            var reg = new RegExp('%' + i + '%', 'gi');
                            text = text.replace(reg, item[i]);
                        }
                    }

                    // 没有匹配到的 如果设置了也可选，则直接返回
                    if (text === resultFormat && options.tags) {
                        return item.text;
                    }

                    return text;
                },
                templateSelection: function(item) {
                    // 如果是分组，则取分组里面的参数
                    var resultFormat = options.group ? item.resultFormat : options.resultFormat;
                    var selectedFormat = options.group ? item.selectedFormat : options.selectedFormat;
                    var text = selectedFormat || resultFormat;

                    if (!text || item.text === options.placeholder) {
                        return item.text;
                    }

                    for (var i in item) {
                        if (item.hasOwnProperty(i)) {
                            var reg = new RegExp('%' + i + '%', 'gi');
                            text = text.replace(reg, item[i]);
                        }
                    }

                    // 没有匹配到的 如果设置了也可选，则直接返回
                    if (text === (selectedFormat || resultFormat) && options.tags) {
                        return item.text;
                    }

                    return text;
                }
        }, option);

        $elem.select2(options)
            .on('select2:close', function(e) {
                var select2 = $(this).data('select2');
                select2.$selection.removeClass('no-top no-bottom');

                // 防止下拉内容隐藏之后就失焦
                setTimeout(function() {
                    select2.$selection.find('.select2-search__field').focus();
                }, 0);
            })
            .on('select2:open', function(e) {
                var select2 = $(this).data('select2');

                if (select2.$dropdown.find('.select2-dropdown--above').length) {
                    select2.$dropdown.addClass('no-margin-top');
                    select2.$selection.addClass('no-top').removeClass('no-bottom');
                } else {
                    select2.$dropdown.removeClass('no-margin-top');
                    select2.$selection.addClass('no-bottom').removeClass('no-top');
                }
            })
            .on('select2:select', function(e) {
                if (options.ajax) {
                    var $this = $(this);

                    options.change($this, e.params.data, $this.val());
                }
            })
            .on('select2:unselect', function(e) {
                if (options.ajax) {
                    var $this = $(this);

                    options.change($this, e.params.data, $this.val());
                }
            })
            .on('change', function() {
                if (options.ajax) {
                    return;
                }

                var select2 = $(this).data('select2');
                select2.$container.find('.select2-selection__rendered, .select2-selection__choice').attr('title', '');

                var $this = $(this),
                    data = [],
                    groupData = {},
                    ids = [].concat($this.val());

                if (options.group) {
                    options.group.forEach(function(cItem) {
                        var temp = [];
                        cItem.data.forEach(function(item) {
                            if (ids.indexOf(item.id) !== -1) {
                                temp.push(item);

                                if (!options.multiple) {
                                    return false;
                                }
                            }
                        });

                        if (options.multiple) {
                            groupData[cItem.id] = temp
                        } else {
                            groupData[cItem.id] = temp[0];
                        }
                    });

                    options.change($this, groupData, options.multiple ? ids : ids[0]);

                    return;
                }

                options.data.forEach(function(item) {
                    if (ids.indexOf(item.id) !== -1) {
                        data.push(item);

                        if (!options.multiple) {
                            return false;
                        }
                    }
                });

                if (options.multiple) {
                    options.change($this, data, ids);
                } else {
                    options.change($this, data[0], ids[0]);
                }
            });

        var select2 = $elem.data('select2');

        select2.$container.find('.select2-selection__rendered, .select2-selection__choice').attr('title', '');

        if (options.group && !options.groupTitleShow) {
            select2.$dropdown.addClass('select2-results__groupHide');
        }

        select2.$selection.css('width', options.width);
    }

})(jQuery);


