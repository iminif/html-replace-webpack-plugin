function HtmlReplaceWebpackPlugin(options) {
  options = Array.isArray(options) ? options : [options]

  options.forEach(function(option) {
    if (typeof option.pattern == 'undefined' || typeof option.replacement == 'undefined') {
      throw new Error('Both `pattern` and `replacement` options must be defined!')
    }
  })

  this.replace = function(htmlData) {
    options.forEach(function(option) {
      if (typeof option.replacement === 'function') {
        var matches = null;
        var isPatternValid = true;
        try {
          new RegExp(option.pattern);
        } catch (e) {
          isPatternValid = false;
        }

        if (!isPatternValid) throw new Error("Invalid `pattern` option provided, it must be a valid regex.");
        while ((matches = option.pattern.exec(htmlData)) != null) {
          var replacement = option.replacement.apply(null, matches)

          // matches[0]: matching content string
          htmlData = htmlData.replace(matches[0], replacement)
        }
      } else {
        // htmlData = htmlData.replace(option.pattern, option.replacement)
        htmlData = htmlData.split(option.pattern).join(option.replacement)
      }
    })
    return htmlData
  }
}

HtmlReplaceWebpackPlugin.prototype.apply = function(compiler) {
  var _this = this
  compiler.hooks.compilation.tap('HtmlReplaceWebpackPlugin', function(compilation) {
    // console.log('The compiler is starting a new compilation...')
    compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync('html-webpack-plugin-before-html-processing',
      function(htmlPluginData, callback) {
        htmlPluginData.html = _this.replace(htmlPluginData.html)
        callback(null, htmlPluginData)
      })
  })
}

module.exports = HtmlReplaceWebpackPlugin
