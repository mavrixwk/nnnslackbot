var parse5 = require('parse5');

module.exports = function() {
    function getText(node){
      var text = ''
      node.childNodes && node.childNodes.map(function(node){
        getText(node);
      });
    }
    function stripMarkup(text) {
        var scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            styleRegex = /<style\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/style>/gi,
            htmlRegex = /<(?:.|\n)*?>/gm,
            multiLineRegex = /\n\s*\n/g;

        var stripped = text
            .replace(scriptRegex, '')
            .replace(styleRegex, '');
        var finalText = '';
        var fragment = parse5.parseFragment(stripped);
        seen = [];


        fragment.childNodes.map(function(node) {
            finalText += JSON.stringify(node, function(key, val) {
               if (val != null && typeof val == "object") {
                    if (seen.indexOf(val) >= 0) {
                        return;
                    }
                    seen.push(val);
                }
                return val;
            });
        });
        return finalText;
    }
    var service = {
        stripHtml: stripMarkup
    };
    return service;
}();
