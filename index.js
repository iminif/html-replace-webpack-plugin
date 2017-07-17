function HtmlReplaceWebpackPlugin(options)
{
  options = Array.isArray(options) ? options : [options]

  options.forEach(function(option)
  {
    if(typeof option.pattern == 'undefined' ||
      typeof option.replacement == 'undefined')
    {
      throw new Error('Both `pattern` and `replacement` options must be defined!')
    }
  })

  this.replace = function(htmlData)
  {
    options.forEach(function(option)
    {
      if(typeof option.replacement === 'function')
      {
        var matches = null
        while((matches = option.pattern.exec(htmlData)) != null)
        {
          var replacement = option.replacement.apply(null, matches)

          // matches[0]: matching content string
          htmlData = htmlData.replace(matches[0], replacement)
        }
      }
      else
      {
        htmlData = htmlData.split(option.pattern).join(option.replacement)
      }
    })
    return htmlData
  }
}

HtmlReplaceWebpackPlugin.prototype.apply = function(compiler)
{
  var self = this
  compiler.plugin('compilation', function(compilation)
  {
    // console.log('The compiler is starting a new compilation...')
    compilation.plugin('html-webpack-plugin-before-html-processing',
      function(htmlPluginData, callback)
      {
        htmlPluginData.html = self.replace(htmlPluginData.html)
        callback(null, htmlPluginData)
      })
  })
}

module.exports = HtmlReplaceWebpackPlugin
