/**
 * A custom plugin which removes needless "&nbsp;" entities
 * after text has been edited. For example:
 */
CKEDITOR.plugins.add('remove-extra-nbsp', {
  afterInit: function(editor) {
    var dataProcessor = editor.dataProcessor,
      htmlFilter = dataProcessor && dataProcessor.htmlFilter;

    if (htmlFilter) {

      htmlFilter.addRules({
        text: function(text) {
          // Using variable replace since JS does not support negative
          // lookbehind.
          // Only nbsp entities that are neither preceded or followed by
          // whitespace or an opening/closing HTML tag are replaced.
          //
          // Examples:
          // - "&nbsp;" 					-> UNCHANGED
          // - "AAA&nbsp;BBB" 			-> "AAA BBB"
          // - "AAA&nbsp;&nbsp;BBB" 		-> "AAA &nbsp;BBB"
          // - "AAA &nbsp; &nbsp; BBB" 	-> UNCHANGED
          // - "<em>&nbsp;</em>" 			-> UNCHANGED
          if (text !== '&nbsp;') {
            text.replace(/(\s)?&nbsp;(?!\s)/gi, function($0, $1) {
              return $1 ? $0 : ' ';
            });
          }
          return text;
        }
      }, {
        applyToAll: true,
        excludeNestedEditable: true
      });
    }
  }
});
