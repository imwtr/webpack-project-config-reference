
+function ($) {

    var Pager = function (element, options) {

        this.options = options;
        this.$element = $(element);

        this.pageStart = 1;
        this.current = 1;
        this.pageSize = 15;

        // 初始化
        this.init()
    }

    Pager.defaults = {
        pages: 0,                   // 页数
        show: 'auto',               // 显示模式
        hasPrev: true,              // 上一页
        hasNext: true,              // 下一页
        current: 1,                 // 当前页
        continuous: false,          // 是否连续
        size: 'middle',             // 尺寸
        count: 8,                   // 显示页码数
        itemCount: 0, // 总记录数
        pageSize: 15, // 每页记录数
        totalShow: true, // 是否显示总记录数
        goPage: false,
        onchange: function () {
        }      // 点击页码的回调
    }

    Pager.prototype.classes = {
        'large': 'pagination pagination-lg',
        'middle': 'pagination',
        'small': 'pagination pagination-sm'
    }

    Pager.prototype.init = function () {
        var $group, $container, self = this;

        this.current = this.options.current || this.current;
        this.pageSize = this.options.pageSize || this.pageSize

        if (this.options.show === 'auto' && this.options.pages <= 1) {
            this.$element.hide()
        } else {
            this.$element.show()
        }

        this.pageStart = (Math.ceil(this.current / this.options.count) - 1) * this.options.count + 1
        this.pageStart = this.pageStart < 1 ? 1 : this.pageStart

        this.$pageTotal = $('<p style="float:left;margin-top:23px;">').html(this.options.totalShow ? this.getPageTotal() : '');

        this.$pager = $('<ul style="float:right;">').addClass(this.classes[this.options.size]).html(this.getPageHtml())
        this.$element.html('').append(this.$pageTotal).append(this.getGoPageHtml()).append(this.$pager);

        this.bind()
        //this.$element.trigger('change.bs.pager')
    }

    Pager.prototype.bind = function () {

        var self = this;

        $(document).off('click.goPage').on('click.goPage', '.go-page-btn', function() {
            var goPageVal = $(this).siblings('.go-page-val').val();
            var index = 1;

            if (goPageVal < 1 || isNaN(Number(goPageVal))) {
                index = 1;
            } else {
                index = Math.floor(goPageVal);
                index = Math.min(index, self.options.pages);
            }

            self.changePage(index);
        });

        $(document).off('change.pageSize').on('change.pageSize', '.pageSize-select', function() {
            self.pageSize = this.value;
            self.current = 1;

            self.options.onchange(self);
        });

        this.$element.off('click.bs.pager')
            .on('click.bs.pager', '.pager-btn-next', function () {
                self.nextPage()
            })
            .on('click.bs.pager', '.pager-btn-prev', function () {
                self.prevPage()
            })
            .on('click.bs.pager', '.pager-btn-page', function () {
                var _page = parseInt($(this).attr('data-page'))
                self.changePage(_page)
            })
            .on('click.bs.pager', '.pager-btn-prevgroup', function () {
                self.prevGroup()
            })
            .on('click.bs.pager', '.pager-btn-nextgroup', function () {
                self.nextGroup()
            })

        this.$element.off('change.bs.pager')
            .on('change.bs.pager', function (event) {
                if (!$(event.target).is('.go-page-val') && !$(event.target).is('.pageSize-select')) {
                    event.preventDefault()
                    self.options.onchange(self)
                }
            })

    }

    Pager.prototype.showPage = function () {
        this.$element.find('li.active').removeClass('active')
        this.$element.find('[data-page=' + this.current + ']').parent().addClass('active')
    }

    Pager.prototype.changePage = function (_current) {

        if (this.current == _current || !_current) {
            return
        } else {
            this.current = _current
        }

        this.showPage()
        this.$element.trigger('change.bs.pager')
    }

    Pager.prototype.prevPage = function () {
        if (this.current > 1) {
            this.current--

            if (this.current >= this.pageStart) {
                this.showPage()
                this.$element.trigger('change.bs.pager')
            } else {
                // 超出现有页码，重置html
                if (this.options.continuous) {
                    // 连续模式
                    this.pageStart--
                    this.$pager.html(this.getPageHtml())
                    this.$element.trigger('change.bs.pager')
                } else {
                    // 分组模式
                    this.prevGroup()
                }
            }
        }
    }

    Pager.prototype.nextPage = function () {
        if (this.current < this.options.pages) {
            this.current++

            if (this.current < this.pageStart + this.options.count) {
                this.showPage()
                this.$element.trigger('change.bs.pager')
            } else {
                // 超出现有页码，重置html
                if (this.options.continuous) {
                    // 连续模式
                    this.pageStart++
                    this.$pager.html(this.getPageHtml())
                    this.$element.trigger('change.bs.pager')
                } else {
                    // 分组模式
                    this.nextGroup()
                }
            }
        }
    }

    Pager.prototype.prevGroup = function () {
        this.pageStart = this.pageStart - this.options.count

        if (this.pageStart <= 0) {
            this.pageStart = 1
        }

        this.current = this.pageStart + this.options.count - 1
        this.$pager.html(this.getPageHtml())
        this.$element.trigger('change.bs.pager')
    }

    Pager.prototype.nextGroup = function () {
        this.pageStart = this.pageStart + this.options.count
        this.current = this.pageStart

        this.$pager.html(this.getPageHtml())
        this.$element.trigger('change.bs.pager')
    }

    Pager.prototype.getPageTotal = function () {
        var options = this.options;

        // total  todo
        var total = '<span>共%itemCount%条纪录，当前第%current%/%pages%页，每页' +
                    '<select class="form-control input-sm pageSize-select">' +
                        [15, 50, 100, 200].map(function(item) {
                            return '<option value="' + item + '" ' + (item == options.pageSize ? 'selected' : '') + '>' + item + '</option>'
                        }).join('') +
                    '</select>' +
                '条纪录</span>';

        return total.replace(/%itemCount%/, options.itemCount)
            .replace(/%current%/, options.current)
            .replace(/%pages%/, options.pages);
    };

    Pager.prototype.getGoPageHtml = function () {
        var options = this.options;

        if (!options.goPage) {
            return '';
        }

        // total
        return '<span class="go-page-btn">跳到</span><input type="text" name="" class="form-control input-sm go-page-val">';
    };

    Pager.prototype.getPageHtml = function () {
        var options = this.options,
            start = this.pageStart,
            current = this.current,
            html = [];

        // prev
        options.hasPrev && html.push('<li><a class="pager-btn-prev" href="javascript:void(0);" title="prev" data-page="prev">前页</a></li>')

        // prevgroup
        if (start > 1) {
            html.push('<li><a class="pager-btn-prevgroup" href="javascript:void(0);" title="prevgroup" data-page="prevgroup">...</a></li>')
        }

        for (var i = start, len = options.pages; i <= len; i++) {
            var _active = current == i ? 'class="active"' : '';
            html.push(
                '<li %active%><a class="pager-btn-page pager-btn-page-%i%" href="javascript:void(0);" title="%i%" data-page="%i%">%i%</a></li>'
                    .replace(/%i%/g, i)
                    .replace(/%active%/, _active)
            )

            // nextgroup
            if ((i - start + 1) % options.count == 0 && current < options.pages) {
                html.push('<li><a class="pager-btn-nextgroup" href="javascript:void(0);" title="nextgroup" data-page="nextgroup">...</a></li>')
                break
            }
        }

        // next
        options.hasNext && html.push('<li><a class="pager-btn-next" href="javascript:void(0);" title="next" data-page="next">后页</a></li>')

        return html.join('')
    }


    // Pager PLUGIN DEFINITION
    // =========================

    var old = $.fn.pager

    $.fn.pager = function (option, args) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.pager')
            var options = $.extend({}, Pager.defaults, $this.data(), typeof option == 'object' && option)

            $this.data('bs.pager', (data = new Pager(this, options)))
            if (typeof option == 'string') data[option](args)
        })
    }

    $.fn.pager.Constructor = Pager

    // Pager NO CONFLICT
    // ===================

    $.fn.pager.noConflict = function () {
        $.fn.pager = old
        return this
    }

}(jQuery);
