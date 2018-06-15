
;(function($, window, document, undefined){
    'use strict';

var
    //format的分隔符
    separator = '%',

    //多选默认样式的参数
    defaultWidth = 57,
    defaultSpace = 2,

    //展示全部时默认加载的个数，最小是dropdownMaxItem + 1
    allDropdownNum = 100,

    //box的默认动画时长,单位ms
    boxAnimateTime = 200,

    //默认搜索延迟,单位ms
    searchDelay = 200,

    //按键相关的值
    KEY = {
        BACKSPACE: 8,
        ENTER: 13,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
    },

    //缓存常用字符
    doms = {
        wrapper: 'magicsearch-wrapper',
        box: 'magicsearch-box',
        arrow: 'magicsearch-arrow',
        items: 'multi-items',
        item: 'multi-item',
        close: 'multi-item-close'
    },

    isString = function(value) {
        return $.type(value) === 'string';
    },
    //转换以百分号为标志的字符串
    formatParse = function(format, data) {
        var fields = format.match(/\%[^\%]+\%/g);
        for (var i = 0; i < fields.length; i++) {
            fields[i] = fields[i].replace(/\%/g, '');
        }
        for (var i = 0; i < fields.length; i++) {
            format = format.replace(separator + fields[i] + separator, data[fields[i]] ? data[fields[i]] : 'error');
        }
        return format;
    },
    //去掉结尾的px
    deletePx = function(value) {
        var index = value.lastIndexOf('px');
        return index < 0 ? Number(value) : Number(value.substring(0, index));
    },
    //转换成大于0的值
    transform2PositiveNum = function(value, key) {
        if (! $.isNumeric(value)) {
            value = MagicSearch.defaults[key];
        } else {
            value = Math.ceil(Number(value));
            if (value <= 0) {
                value = MagicSearch.defaults[key];
            }
        }
        return value;
    },
    //constructor
    MagicSearch = function(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = options;
    };


    MagicSearch.defaults = {
        dataSource: [],         //array or string or function(url?)
        id: '',                 //string
        fields: '',             //string or array
        format: '',             //string
        maxShow: 5,             //int
        dropdownBtn: false,     //boolean
        dropdownMaxItem: 8,     //int
        multiple: false,        //boolean
        maxItem: true,          //boolean or int
        showMultiSkin: true,    //boolean
        multiField: '',         //string
        isProlong: false,       //boolean
        disableRule: function(data) {
            return false;
        },
        success: function($input, data) {
            return true;
        }
    };

    MagicSearch.prototype = {
        init: function() {
            //每初始化一次，index就加1，确保唯一性
            window.MagicSearch.index += 1;
            this.options = $.extend({}, MagicSearch.defaults, this.options);

            //只能绑定在input text上
            if (! this.$element.is('input:text')) {
                console.error('magicsearch: Can not bind magicsearch to other elements except input which type is text.');
                return false;
            }

            //initOptions
            if (! isString(this.options.id) || this.options.id == '') {
                console.error('magicsearch: The option id must be a string which is not empty.');
                return false;
            }
            if ($.isFunction(this.options.dataSource)) {
                this.options.dataSource = this.options.dataSource(this.$element);
            }
            if (! this.options.dataSource) {
                this.options.dataSource = [];
            } else if (isString(this.options.dataSource)) {
                if (this.options.dataSource.toLowerCase() == 'null') {
                    this.options.dataSource = [];
                } else {
                    try {
                        this.options.dataSource = $.parseJSON(this.options.dataSource);
                        if (! $.isArray(this.options.dataSource)) {
                            var dadataSource = [];
                            for (var id in this.options.dataSource) {
                                dadataSource.push(this.options.dataSource[id]);
                            }
                            this.options.dataSource = dadataSource;
                            // console.warn('magicsearch: The option dataSource is not an array or string of json array.Index: ' + window.MagicSearch.index);
                        }
                    } catch (err) {
                        this.options.dataSource = [];
                        console.error('magicsearch: A problem is occured during parsing dataSource,please check.Index: ' + window.MagicSearch.index);
                    }
                }
            }
            if (isString(this.options.fields)) {
                this.options.fields = [this.options.fields == '' ? this.options.id : this.options.fields];
            } else if (! $.isArray(this.options.fields)) {
                this.options.fields = [this.options.id];
            }
            if (! isString(this.options.format) || this.options.format == '') {
                this.options.format = separator + this.options.id + separator;
            }
            this.options.maxShow = transform2PositiveNum(this.options.maxShow, 'maxShow');
            if (this.options.dropdownBtn) {
                this.options.dropdownMaxItem = transform2PositiveNum(this.options.dropdownMaxItem, 'dropdownMaxItem');
            }
            if (this.options.multiple) {
                if (this.options.maxItem !== true) {
                    this.options.maxItem = transform2PositiveNum(this.options.maxItem, 'maxItem');
                }
                if (this.options.showMultiSkin) {
                    if (! isString(this.options.multiField) || this.options.multiField == '') {
                        this.options.multiField = this.options.id;
                    }
                }
            }
            if (! $.isFunction(this.options.success)) {
                this.options.success = function($input, data) {
                    return true;
                };
            }
            if (! $.isFunction(this.options.disableRule)) {
                this.options.disableRule = function(data) {
                    return false;
                };
            }

            //initDoms
            var $input = this.$element;
            var ids = $input.attr('data-id');
            if ($input.parent().attr('data-belong') !== 'magicsearch') {
                $input.wrap('<div class="' + doms.wrapper + '" data-belong="magicsearch"></div>');
            }
            var $magicsearch_wrapper = $input.parent();
            //init magicsearch-wrapper
            $magicsearch_wrapper.css({
                'display': $input.css('display'),
                'float': $input.css('float'),
                'margin': $input.css('margin')
            });
            $magicsearch_wrapper.attr('data-index', window.MagicSearch.index);

            //init input
            $input.css({
                'margin': 0
            });
            $input.removeAttr('disabled');
            if (ids === undefined) {
                $input.attr('data-id', '');
                ids = '';
            }
            var borderTopWidth = deletePx($input.css('border-top-width')),
                borderBottomWidth = deletePx($input.css('border-bottom-width')),
                paddingTop = deletePx($input.css('padding-top')),
                paddingBottom = deletePx($input.css('padding-bottom')),
                paddingLeft = deletePx($input.css('padding-left')),
                paddingRight = deletePx($input.css('padding-right')),
                inputHeight = $input.height();
            //init multi-items
            if (this.options.multiple) {
                $input.addClass('multi');
                if (this.options.showMultiSkin && $magicsearch_wrapper.find('.' + doms.items).length == 0) {
                    var borderLeftWidth = deletePx($input.css('border-left-width'));
                    $magicsearch_wrapper.append('<div class="' + doms.items + '"></div>');
                    $magicsearch_wrapper.find('.' + doms.items).css({
                        'top': defaultSpace + borderTopWidth + paddingTop,
                        'left': defaultSpace + borderLeftWidth + paddingLeft,
                        'bottom': defaultSpace + borderBottomWidth + paddingBottom
                    });
                }
            }

            //init magicsearch-box
            if ($magicsearch_wrapper.find('.' + doms.box).length == 0) {
                /*<span class="loading"><img src="/public/static/components/layer/skin/default/loading-2.gif"></span>*/
                $magicsearch_wrapper.append('<div class="' + doms.box + '"></div>');
            }
            $magicsearch_wrapper.find('.' + doms.box).css({
                'top': inputHeight + borderTopWidth + borderBottomWidth + paddingTop + paddingBottom
            });

            //init magicsearch-arrow
            if (this.options.dropdownBtn) {
                var borderRightWidth = deletePx($input.css('border-right-width'));
                $input.addClass('dropdown');
                $magicsearch_wrapper.append('<div class="' + doms.arrow + '"><i></i></div>');
                $magicsearch_wrapper.find('.' + doms.arrow).css({
                    'top': borderTopWidth,
                    'bottom': borderBottomWidth,
                    'right': borderRightWidth
                });
            }

            if (this.options.multiple) {
                var width = $input.width() + borderLeftWidth + borderRightWidth;
                if (this.options.dropdownBtn) {
                    width += 24;
                }
                $input.css('width', width);
                var idArr = ids ? ids.split(',') : [];

                //TODO 正在考虑要不要加
                // for (var i = 0; i < this.options.dataSource.length; i++) {
                //     var initLength = 0;
                //     for (var j = 0; j < idArr.length; j++) {
                //         if (this.options.dataSource[i][this.options.id] == idArr[j]) {
                //             initLength ++;
                //             this.options.success($input, this.options.dataSource[i]);
                //             break;
                //         }
                //     }
                //     if (initLength >= idArr.length) {
                //         break;
                //     }
                // }

                if (this.options.maxItem !== true && idArr.length >= this.options.maxItem) {
                    $input.attr('disabled', 'disabled');
                    if (this.options.dropdownBtn) {
                        $magicsearch_wrapper.find('.' + doms.arrow).addClass('disabled');
                    }
                }

                //初始化默认样式
                if (this.options.showMultiSkin) {
                    for (var i = 0; i < idArr.length; i++) {
                        var data = {};
                        for (var j = 0; j < this.options.dataSource.length; j ++) {
                            if (this.options.dataSource[j][this.options.id] == idArr[i]) {
                                data = this.options.dataSource[j];
                                break;
                            }
                        }
                        this.appendHtml(data);
                    }
                }
            } else {
                //单选时初始化input的value
                for (var i = 0; i < this.options.dataSource.length; i ++) {
                    if (this.options.dataSource[i][this.options.id] == ids) {
                        $input.val(formatParse(this.options.format, this.options.dataSource[i]));
                        break;
                    }
                }
            }
            return this;
        },
        destroy: function() {
            var $input = this.$element,
                $magicsearch_wrapper = $input.parent();
            if ($magicsearch_wrapper.attr('data-belong') === 'magicsearch') {
                var ids = $input.attr('data-id'),
                    idArr = ids ? ids.split(',') : [];
                $input.css({
                    'margin': $magicsearch_wrapper.css('margin'),
                    'padding-left': deletePx($input.css('padding-left')) - idArr.length * (defaultWidth + defaultSpace)
                });
                $input.removeClass('dropdown multi').removeAttr('disabled data-id');
                $input.off();
                $input.siblings().remove();
                $input.unwrap();
            }
        },
        setData: function() {
            var $input = this.$element,
                $magicsearch_wrapper = $input.parent(),
                $magicsearch_box = $magicsearch_wrapper.find('.' + doms.box),
                $magicsearch_arrow = $magicsearch_wrapper.find('.' + doms.arrow),
                $ishover = $magicsearch_box.find('li.ishover');
            var options = this.options,
                ids = $input.attr('data-id'),
                data = {};
            data[options.id] = $ishover.attr('data-id');//TODO
            options.fields.forEach(function(field){
                data[field] = $ishover.attr('data-' + field.toLowerCase());
            });
            if (options.multiple) {
                if ($magicsearch_box.is(':hidden')) {
                    return;
                }
                $input.val('');

                var idArr = ids ? ids.split(',') : [];
                if (options.maxItem !== true && idArr.length >= options.maxItem) {
                    return this;
                }
                idArr.push($ishover.attr('data-id'));
                if (options.maxItem !== true && idArr.length == options.maxItem) {
                    $input.attr('disabled', 'disabled');
                    if (options.dropdownBtn) {
                        $magicsearch_arrow.addClass('disabled');
                    }
                }
                $input.attr('data-id', idArr.join(','));
                if (options.showMultiSkin) {
                    this.appendHtml(data);
                }
            } else {
                $input.val($ishover.text());
                $input.attr('data-id', $ishover.attr('data-id'));
            }
            options.success($input, data);
            return this;
        },
        searchData: function(isAll, isScroll) {//TODO 两个参数整合
            var $input = this.$element,
                $magicsearch_box = $input.parent().find('.' + doms.box);

            var options = this.options,
                dataJson = options.dataSource,
                ids = $input.attr('data-id'),
                idArr = ids ? ids.split(',') : [],
                inputVal = $.trim($input.val()),
                htmlStr = '',
                data = [],
                isAppendHtml = true;

            //如果是不是滚动的话，先清空所有的item
            if (isScroll !== true) {
                $magicsearch_box.html('');
            }
            if (inputVal == '' && ! isAll) {
                return this;
            }
            //获取符合条件的data
            if (! options.multiple && ids != '' && ! isAll) {//单选时点击已经选择过的输入框
                for (var i = 0; i < dataJson.length; i ++) {
                    if (dataJson[i][options.id] == ids) {
                        data.push(dataJson[i]);
                        break;
                    }
                }
            } else if (isAll) {
                var page = $input.data('page');
                for (var i = 0; i < dataJson.length; i ++) {//TODO 优化中断的时机，以减少循环次数（全部时判断ids数组是否用完）
                    var index = idArr.indexOf(dataJson[i][options.id]);
                    if (index > -1) {
                        // idArr.splice(index, 1);
                        continue;
                    }
                    data.push(dataJson[i]);
                }
                if (page <= Math.ceil(data.length / allDropdownNum)) {//page小于总页数，则页数+1
                    $input.data('page', page + 1);
                }
                data = data.slice((page - 1) * allDropdownNum, page * allDropdownNum);
                if (page != 1 && data.length == 0) {//滚动时，如果data长度为0，则不会添加html
                    isAppendHtml = false;
                }
            } else {
                var inputVals = inputVal.toLowerCase().split(' ');
                var inputData = [];
                for (var i = 0; i < inputVals.length; i++) {
                    if (inputVals[i] === '') {
                        continue;
                    }
                    inputData.push({value: inputVals[i], flag: false});
                }
                //搜索符合条件的data
                for (var i = 0; i < dataJson.length; i ++) {
                    //跳过已经选择过的
                    if (idArr.indexOf(dataJson[i][options.id]) > -1) {
                        continue;
                    }
                    inputData = inputData.map(function(item){
                        item.flag = false;
                        return item;
                    });
                    for (var j = 0; j < options.fields.length; j ++) {
                        for (var k = 0; k < inputData.length; k ++) {
                            if (dataJson[i][options.fields[j]] != null && dataJson[i][options.fields[j]].toLowerCase().indexOf(inputData[k].value) > -1) {
                                inputData[k].flag = true;
                            }
                        }
                        var isMatch = inputData.every(function(item){
                            return item.flag;
                        });
                        if (isMatch) {
                            data.push(dataJson[i]);
                            break;
                        }
                    }
                    if (data.length >= options.maxShow) {
                        break;
                    }
                }
            }

            //生成htmlStr
            if (data.length == 0) {
                htmlStr = '<span class="no-result">&#x672a;&#x641c;&#x7d22;&#x5230;&#x7ed3;&#x679c;</span>';
            } else {
                //去掉为空字符串的item
                var inputVals = inputVal.split(' ').filter(function(item){
                    return item !== '';
                });
                //定位需要高亮的字符的位置
                var dataHighlight = $.extend(true, [], data);
                data.forEach(function(item, index){
                    options.fields.forEach(function(field){
                        var posArr = [];
                        if (item[field] != null) {
                            for (var i = 0; i < item[field].length; i ++) {//TODO 不是字符串
                                posArr[i] = 0;
                            }
                            inputVals.forEach(function(value){
                                var position = item[field].toLowerCase().indexOf(value.toLowerCase());
                                if (position > -1) {
                                    for (var i = position; i < value.length + position; i ++) {
                                        posArr[i] = 1;
                                    }
                                }
                            });
                        }
                        var tmpPosArr = [];
                        var hasStarted = false, start = -1, length = 0;
                        for (var i = posArr.length - 1; i >= 0; i --) {
                            if (posArr[i] == 1) {
                                if (! hasStarted) {
                                    hasStarted = true;
                                    start = i;
                                } else {
                                    start --;
                                }
                                length ++;
                                if (i == 0) {
                                    tmpPosArr.push({start: start, length: length});
                                }
                            } else {
                                if (hasStarted) {
                                    hasStarted = false;
                                    tmpPosArr.push({start: start, length: length});
                                    length = 0;
                                }
                            }
                        }
                        if (dataHighlight[index][field] !== undefined) {
                            dataHighlight[index][field] = tmpPosArr;
                        }
                    });
                });

                htmlStr += '<ul>';
                data.forEach(function(item, index){
                    var tmpItem = $.extend({}, item);
                    htmlStr += '<li class="';
                    htmlStr += options.disableRule(item) ? 'disabled' : 'enabled';
                    htmlStr += '" data-id="' + (item[options.id] === undefined ? '' : item[options.id]) + '"';
                    options.fields.forEach(function(field){
                        htmlStr += ' data-' + field.toLowerCase() + '="' + (item[field] === undefined ? '' : item[field]) + '"';
                        if (item[field] != null) {
                            dataHighlight[index][field].forEach(function(value){
                                var matchStr = tmpItem[field].substr(value.start, value.length);
                                tmpItem[field] = tmpItem[field].replace(eval('/' + matchStr + '/i'), '<span class="keyword">' + matchStr + '</span>');
                            });
                        }
                    });
                    htmlStr += ' title="' + formatParse(options.format, item) + '">' + formatParse(options.format, tmpItem) + '</li>';
                });
                htmlStr += '</ul>';
            }

            //生成dom
            if (isAll) {
                if (isAppendHtml) {
                    $magicsearch_box.html($magicsearch_box.html() + htmlStr);
                }
                $magicsearch_box.addClass('all');
            } else {
                $magicsearch_box.html(htmlStr);
                $magicsearch_box.removeClass('all').css('max-height', 'none');
            }
            return this;
        },
        showSearchBox: function(callback) {
            var $input = this.$element,
                $magicsearch_wrapper = $input.parent(),
                $magicsearch_box = $magicsearch_wrapper.find('.' + doms.box);
            if ($magicsearch_box.is(':visible')) {
                return false;
            }
            //rotate the dropdown button 180deg
            if (this.options.dropdownBtn) {
                var $magicsearch_arrow = $magicsearch_wrapper.find('.' + doms.arrow);
                $magicsearch_arrow.addClass('arrow-rotate-180');
                setTimeout(function(){
                    $magicsearch_arrow.addClass('rotate180');
                    $magicsearch_arrow.removeClass('arrow-rotate-180');
                }, boxAnimateTime);
            }
            $magicsearch_box.slideDown(boxAnimateTime, callback);
            return this;
        },
        hideSearchBox: function(isClear) {
            var $input = this.$element,
                $magicsearch_wrapper = $input.parent(),
                $magicsearch_box = $magicsearch_wrapper.find('.' + doms.box);
            if (! $magicsearch_box.is(':visible')) {
                return false;
            }
            if (isClear === undefined) {
                if (this.options.multiple || $input.attr('data-id') == '') {
                    $input.val('');
                }
            } else {
                if (isClear) {
                    $input.val('');
                }
            }
            //rotate the dropdown button 360deg
            if (this.options.dropdownBtn) {
                var $magicsearch_arrow = $magicsearch_wrapper.find('.' + doms.arrow);
                $magicsearch_arrow.addClass('arrow-rotate-360');
                setTimeout(function(){
                    $magicsearch_arrow.removeClass('rotate180');
                    $magicsearch_arrow.removeClass('arrow-rotate-360');
                }, boxAnimateTime);
            }
            setTimeout(function(){
                $magicsearch_box.scrollTop(0);
            }, boxAnimateTime - 1);
            $magicsearch_box.slideUp(boxAnimateTime, function(){
                $magicsearch_box.html('');
            });
            return this;
        },
        appendHtml: function(data) {
            var $input = this.$element,
                $magicsearch_wrapper = $input.parent(),
                $magicsearch_box = $magicsearch_wrapper.find('.' + doms.box),
                $magicsearch_arrow = $magicsearch_wrapper.find('.' + doms.arrow),
                $ishover = $magicsearch_box.find('li.ishover');
            var options = this.options;
            $magicsearch_wrapper.find('.' + doms.items).append('<div class="' + doms.item + '" title="' + formatParse(options.format, data) + '"><span>' + formatParse(separator + options.multiField + separator, data) + '</span><a class="' + doms.close + '" data-id="' + data[options.id] + '" href="javascript:void(0);"></a></div>');

            $input.css('padding-left', deletePx($input.css('padding-left')) + defaultWidth + defaultSpace);
            if (options.isProlong) {
                $input.css('width', deletePx($input.css('width')) + defaultWidth + defaultSpace);
            }
            $magicsearch_wrapper.find('.' + doms.items + ' .' + doms.close + ':last').click(function(){
                var $this = $(this);
                var ids = $magicsearch_wrapper.find(':text').attr('data-id');
                var idArr = ids ? ids.split(',') : [];
                for (var i = 0; i < idArr.length; i++) {
                    if (idArr[i] == $this.attr('data-id')) {
                        idArr.splice(i, 1);
                        break;
                    }
                }
                $input.attr('data-id', idArr.join(','));
                $input.removeAttr('disabled');
                $magicsearch_arrow.removeClass('disabled');
                $this.parent().fadeOut(function(){
                    $(this).remove();
                    $input.css('padding-left', deletePx($input.css('padding-left')) - defaultWidth - defaultSpace);
                    if (options.isProlong) {
                        $input.css('width', deletePx($input.css('width')) - defaultWidth - defaultSpace);
                    }
                });
            });
        }
    }

    $.fn.magicsearch = function(options) {
        var hasDropdownBtn = false;
        var searchTimeout = null;
        var preInput = '';
        var jqo = this.each(function(){
            var $this = $(this);
            var magicSearch = $.data(this, 'magicsearch');
            if (magicSearch) {
                magicSearch.destroy();
            }
            magicSearch = new MagicSearch(this, options);
            if (magicSearch.init() === false) {
                return;
            }
            $.data(this, 'magicsearch', magicSearch);
            var selfOptions = magicSearch.options;
            var $magicsearch_wrapper = $this.parent(),
                $magicsearch_box = $magicsearch_wrapper.find('.' + doms.box);
            var blurFunc = function() {
                magicSearch.hideSearchBox();
                if (selfOptions.multiple && selfOptions.showMultiSkin) {
                    $magicsearch_wrapper.find('.' + doms.item + '.current').removeClass('current');
                }
            };
            $this.off().on('keyup', function(e){
                var $_this = $(this);
                if (e.which == KEY.ESC) {
                    $_this.val('').focus();
                    magicSearch.hideSearchBox();
                } else if (e.which == KEY.DOWN) {
                    var $li = $magicsearch_box.find('li');
                    var $ishover = $magicsearch_box.find('li.ishover');
                    if ($li.length > 0) {
                        if ($ishover.length > 0) {
                            $ishover.toggleClass('ishover');
                            if ($ishover.next().length > 0) {
                                $ishover.next().toggleClass('ishover');
                            } else {
                                $magicsearch_box.find('li:first').toggleClass('ishover');
                            }
                        } else {
                            $magicsearch_box.find('li:first').toggleClass('ishover');
                        }
                    }
                    return false;
                } else if (e.which == KEY.UP) {
                    var $li = $magicsearch_box.find('li');
                    var $ishover = $magicsearch_box.find('li.ishover');
                    if ($li.length > 0) {
                        if ($ishover.length > 0) {
                            $ishover.toggleClass('ishover');
                            if ($ishover.prev().length > 0) {
                                $ishover.prev().toggleClass('ishover');
                            } else {
                                $magicsearch_box.find('li:last').toggleClass('ishover');
                            }
                        } else {
                            $magicsearch_box.find('li:last').toggleClass('ishover');
                        }
                    }
                    return false;
                } else if (e.which == KEY.ENTER) {
                    var $ishover = $magicsearch_box.find('li.ishover');
                    if ($ishover.length > 0) {
                        magicSearch.setData().hideSearchBox();
                    }
                } else if (e.which == KEY.LEFT || e.which == KEY.RIGHT) {
                    return true;
                } else {
                    var currentInput = $_this.val();
                    if ($.trim(preInput) == $.trim(currentInput)) {
                        return true;
                    }
                    if (currentInput != '') {
                        if ($.trim(currentInput) == '') {
                            magicSearch.hideSearchBox((e.which == KEY.BACKSPACE || e.which == KEY.SPACE) ? false : undefined);
                            return false;
                        }
                        //hide search box when key up
                        if (! selfOptions.multiple && $_this.attr('data-id') != '') {
                            magicSearch.hideSearchBox();
                            return;
                        } else if (selfOptions.multiple && selfOptions.showMultiSkin) {
                            $magicsearch_wrapper.find('.' + doms.items + ' .' + doms.item + '.current').removeClass('current');
                        }
                        clearTimeout(searchTimeout);
                        searchTimeout = setTimeout(function(){
                            magicSearch.searchData().showSearchBox();
                        }, searchDelay);
                    } else {
                        magicSearch.hideSearchBox();
                    }
                }
            }).on('keydown', function(e){
                var $_this = $(this);
                if (e.which == KEY.ESC) {
                } else if (e.which == KEY.UP) {
                    return false;
                } else if (e.which == KEY.DOWN) {
                    return false;
                } else if (e.which == KEY.ENTER) {
                    return true;
                } else if (e.which == KEY.BACKSPACE) {
                    preInput = $_this.val();
                    if (selfOptions.multiple) {
                        var $last_multi_item = $magicsearch_wrapper.find('.' + doms.items + ' .' + doms.item + ':last');
                        if (selfOptions.showMultiSkin && $_this.val() == '') {
                            if ($last_multi_item.hasClass('current')) {
                                $last_multi_item.find('.' + doms.close).click();
                            } else {
                                $last_multi_item.addClass('current');
                            }
                        }
                    } else {
                        if ($(this).attr('data-id') != '') {
                            $(this).val('');
                            $(this).attr('data-id', '');
                            magicSearch.hideSearchBox();
                        }
                    }
                } else if (e.which == KEY.LEFT || e.which == KEY.RIGHT) {
                    return true;
                } else {
                    preInput = $_this.val();
                    if (preInput != '') {
                        //set empty value when key down
                        if (! selfOptions.multiple && $_this.attr('data-id') != '') {
                            $_this.val('');
                            $_this.attr('data-id', '');
                            return;
                        }
                    }
                }
            }).on('focus', function(){
                if ($(this).val() != '') {
                    magicSearch.searchData().showSearchBox();
                }
            }).on('blur', blurFunc);

            $magicsearch_box.off().on('mouseenter','ul', function(){
                $this.unbind('blur');
            }).on('mouseleave','ul', function(){
                $this.blur(blurFunc);
            }).on('mouseenter','li', function(){
                $(this).parent().find('li.ishover').removeClass('ishover');
                $(this).addClass('ishover');
            }).on('mouseleave','li', function(){
                $(this).removeClass('ishover');
            }).on('click','li', function(){
                magicSearch.setData().hideSearchBox();
            });

            //When the option of dropdownBtn is true,bind the related event.
            if (selfOptions.dropdownBtn) {
                hasDropdownBtn = true;
                $magicsearch_wrapper.on('click', '.' + doms.arrow + ':not(.disabled)', function(){
                    if ($magicsearch_box.is(':visible')) {
                        magicSearch.hideSearchBox();
                    } else {
                        $magicsearch_box.css({
                            'max-height': selfOptions.dropdownMaxItem * 30 + 8
                        });
                        $magicsearch_box.unbind('scroll');
                        $this.data('page', 1);
                        magicSearch.searchData(true).showSearchBox(function(){
                            $magicsearch_box.on('scroll', function(e){
                                if ((this.scrollHeight - $(this).scrollTop()) < 300) {
                                    magicSearch.searchData(true, true);
                                }
                            });
                        });
                    }
                });
            }
            $this.on('clear', function(){
                $this.val('');
                if (selfOptions.multiple) {
                    if (selfOptions.showMultiSkin) {
                        $magicsearch_wrapper.find('.' + doms.items + ' .' + doms.close).click();
                    } else {
                        $this.attr('data-id', '');
                    }
                } else {
                    $this.attr('data-id', '');
                }
            }).on('update', function(){
                //TODO uodate dom and css
                //id's length
            }).on('destroy', function(){
                $.data(this, 'magicsearch').destroy();
            });
        });

        if (hasDropdownBtn && ! window.MagicSearch.hasBindBody) {
            $('body').on('mousedown', function(e){
                var $target = $(e.target),
                    $magicsearch_wrapper = $(this).find('.' + doms.wrapper + ' .' + doms.box + ':visible').first().parent(),
                    $input = $magicsearch_wrapper.find('input:text');
                var index = $magicsearch_wrapper.attr('data-index');
                if (index !== undefined && ! $target.is('.' + doms.wrapper + '[data-index="' + index + '"] *')) {
                    $.data($input.get(0), 'magicsearch').hideSearchBox();
                }
            });
            window.MagicSearch.hasBindBody = true;
        }
        return jqo;
    };

    window.MagicSearch = {
        v: '1.5.3',
        index: 0,
        hasBindBody: false
    };
})(jQuery, window, document);
