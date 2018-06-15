
require(['handlebars'], function(Handlebars){
    // equal
    Handlebars.registerHelper('equal', function (v1, v2, options) {
        if (v1 == v2) {
            return options.fn(this)
        } else {
            return options.inverse(this)
        }
    })

    // less
    Handlebars.registerHelper('less', function (v1, v2, options) {
        if (v1 < v2) {
            return options.fn(this)
        } else {
            return options.inverse(this)
        }
    })

    // slice
    Handlebars.registerHelper('slice', function (string, start, end) {
        var result = ''
        if(typeof end != 'object'){
            result = string.slice(parseInt(start), parseInt(end))
        }else{
            result = string.slice(0, parseInt(start))
        }
        return result
    })

    // slice
    Handlebars.registerHelper('key_value', function (obj, options) {
        var result = []
        for(var key in obj){
            result.push(options.fn({
                '$key': key,
                '$value': obj[key]
            }))
        }
        return result.join('')
    })

    Handlebars.registerHelper('value', function (obj, key) {
        return obj[key] || ''
    })

    // array
    Handlebars.registerHelper('array', function (arr, index) {
        return arr[index]
    })

    // neq
    Handlebars.registerHelper('neq', function (v1, v2, options) {
        if (v1 != v2) {
            return options.fn(this)
        } else {
            return options.inverse(this)
        }
    })

    Handlebars.registerHelper('html', function(text) {
        return new Handlebars.SafeString(text)
    })

    Handlebars.registerHelper('date_format', function(text, format) {
        var date = new Date(text == parseInt(text) ? parseInt(text) * 1000 : text)

        var data = {
            year: date.getFullYear(),
            year_short: date.getYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds()
        }

        var addZero = function(num){
            num = parseInt(num)
            return num > 9 ? num : '0' + num
        }

        format = typeof format == 'object' ? 'yyyy-mm-dd' : format
        format = format
            .replace(/yyyy/g, data['year'])
            .replace(/yy/g, data['year_short'])

            .replace(/mm/g, addZero(data['month']))
            .replace(/m/g, data['month'])

            .replace(/dd/g, addZero(data['day']))
            .replace(/d/g, data['day'])

            .replace(/hh/g, addZero(data['hour']))
            .replace(/h/g, data['hour'])

            .replace(/ii/g, addZero(data['minute']))
            .replace(/i/g, data['minute'])

            .replace(/ss/g, addZero(data['second']))
            .replace(/s/g, data['second'])

        return format
    })

    Handlebars.registerHelper('breaklines', function(text) {
        text = Handlebars.Utils.escapeExpression(text)
        text = text.toString().replace(/(\r\n|\n|\r)/gm, '<br>')

        return new Handlebars.SafeString(text)
    })

    Handlebars.registerHelper('substr', function(text, len, ex){
        ex = typeof ex == 'object' ? '' : ex
        ex = ex === false ? '' : (ex || '...')
        text = text.substr(0, len) + ex
        return text
    })

    Handlebars.registerHelper('or', function (v1, v2, options) {
        if (v1 || v2) {
            return options.fn(this)
        } else {
            return options.inverse(this)
        }
    })

    return Handlebars
});
