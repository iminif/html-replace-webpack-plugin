function HtmlReplaceWebpackPlugin(options) {
  options = Array.isArray(options) ? options : [options]

  options.forEach(option => {
    if (typeof option.pattern == 'undefined' || typeof option.replacement == 'undefined') {
      throw new Error('Both `pattern` and `replacement` options must be defined!')
    }
  })

  this.replace = function(htmlPluginData, callback) {
    options.forEach(option => {
      if (typeof option.replacement === 'function') {
        var matches = null
        var isPatternValid = true
        try {
          new RegExp(option.pattern)
        } catch (e) {
          isPatternValid = false
        }

        if (!isPatternValid) throw new Error("Invalid `pattern` option provided, it must be a valid regex.")
        while ((matches = option.pattern.exec(htmlPluginData.html)) != null) {
          var replacement = option.replacement.apply(null, matches)

          // matches[0]: matching content string
          htmlPluginData.html = htmlPluginData.html.replace(matches[0], replacement)
        }
      } else {
        // htmlPluginData.html.replace(option.pattern, option.replacement)
        htmlPluginData.html = htmlPluginData.html.split(option.pattern).join(option.replacement)
      }
    })

    callback(null, htmlPluginData)
  }
}

HtmlReplaceWebpackPlugin.prototype.apply = function(compiler) {
  if (compiler.hooks) {
    compiler.hooks.compilation.tap('HtmlReplaceWebpackPlugin', compilation => {
      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync('html-webpack-plugin-after-html-processing', this.replace)
    })
  } else {
    compiler.plugin('compilation', compilation => {
      compilation.plugin('html-webpack-plugin-after-html-processing', this.replace)
    })
  }
}

module.exports = HtmlReplaceWebpackPlugin
