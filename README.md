# [html-replace-webpack-plugin]

A Webpack plugin for replace HTML contents with custom pattern string or regex.

## Examples

https://github.com/iminif/html-replace-webpack-plugin-howto

## :green_heart: Special Note! :eyes:

This plugin works together with [html-webpack-plugin]!

## Usage

First of all, you need both `html-webpack-plugin` and `html-replace-webpack-plugin`.

```shell
npm i -D html-webpack-plugin html-replace-webpack-plugin
```

Then, add it to your `webpack.config.js` file:

### In your `webpack.config.js` file:

> :green_heart: Please ensure that `html-webpack-plugin` was placed before `html-replace-webpack-plugin` in your Webpack config if you were working with Webpack 4.x!

```javascript
var webpack = require('webpack')
var HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin')

// file types & file links
const resource = {
  js: { bootstrap: '//cdn/bootstrap/bootstrap.min.js' },
  css: { bootstrap: '//cdn/bootstrap/bootstrap.min.css' },
  img: { 'the-girl': '//cdn/img/the-girl.jpg' }
}

const tpl = {
  img: '<img src="%s">',
  css: '<link rel="stylesheet" type="text/css" href="%s">',
  js: '<script type="text/javascript" src="%s"></script>'
}

module.exports = {
  // Definition for Webpack plugins
  plugin: [
    new HtmlWebpackPlugin({
      /* configs */
    }),
    // Replace html contents with string or regex patterns
    new HtmlReplaceWebpackPlugin([
      {
        pattern: 'foo',
        replacement: '`foo` has been replaced with `bar`'
      },
      {
        pattern: '@@title',
        replacement: 'html replace webpack plugin'
      },
            {
        pattern: /<p>(.+?)<\/p>/g, // /g => replace all
        replacement: '<div>$1</div>'
      },
      {
        pattern: /(<!--\s*|@@)(css|js|img):([\w-\/]+)(\s*-->)?/g,
        replacement: function(match, $1, type, file, $4, index, input) {
          // those formal parameters could be:
          // match: <-- css:bootstrap-->
          // type: css
          // file: bootstrap
          // Then fetch css link from some resource object
          // var url = resources['css']['bootstrap']

          var url = resource[type][file]

          // $1==='@@' <--EQ--> $4===undefined
          return $4 == undefined ? url : tpl[type].replace('%s', url)
        }
      }
    ])
  ]
}
```

#### In your `src/index.html` file:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>@@title</title>
      <!-- css:bootstrap -->
    </head>
    <body>
      <div>foo</div>
      <p>I wanna be in a div</p>
      <!-- js:bootstrap -->
    </body>
</html>
```

#### After replacing, in the `dist/index.html` file:

```html
<html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>html replace webpack plugin</title>
      <link rel="stylesheet" type="text/css" href="//cdn/bootstrap/bootstrap.min.css">
    </head>
    <body>
      <div>`foo` has been replaced with `bar`</div>
      <div>I wanna be in a div</div>
      <script type="text/javascript" src="//cdn/bootstrap/bootstrap.min.js"></script>
    </body>
</html>
```

## API

html-replace-webpack-plugin can be called with an objects array or an object.

### Options for `html-replace-webpack-plugin`

new HtmlReplaceWebpackPlugin([obj1[, obj2[, obj3[, ...[, objN]]]]] | obj)

#### [obj1[, obj2[, obj3[, ...[, objN]]]]] | obj

Type: `Objects Array` | `Object`

#### obj1, obj2, obj3, ..., objN | obj

Type: `Object`

#### obj.pattern

Type: `String` | `RegExp`

string or regex pattern for matching HTML content. See the [MDN documentation for RegExp] for details.

#### obj.replacement

Type: `String` | `Function`

string with which the matching string be replaced, or function which returns a string for replacing. See the [MDN documentation for String.replace] for details.

[html-webpack-plugin]: https://www.npmjs.com/package/html-webpack-plugin
[html-replace-webpack-plugin]: https://www.npmjs.com/package/html-replace-webpack-plugin
[mdn documentation for regexp]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
[mdn documentation for string.replace]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter
