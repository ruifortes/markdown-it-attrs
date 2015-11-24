/**
 * parse {.class #id key=val} strings
 * @param {string} str: string to parse
 * @param {int} start: where to start parsing (not including {)
 * @param {int} end: where to stop parsing (not including })
 * @returns {2d array}: [['key', 'val'], ['class', 'red']]
 */
function getAttrs(str, start, end) {
  // not tab, line feed, form feed, space, solidus, greater than sign, quotation mark, apostrophe and equals sign
  var allowedKeyChars = /[^\t\n\f \/>"'=]/;
  var pairSeparator = ' ';
  var keySeparator = '=';
  var classChar = '.';
  var idChar = '#';

  var attrs = [];
  var key = '';
  var value = '';
  var parsingKey = true;
  var valueInsideQuotes = false;

  // read inside {}
  for (var i=start; i <= end; ++i) {
    var char = str.charAt(i);

    // switch to reading value if equal sign
    if (char === keySeparator) {
      parsingKey = false;
      continue;
    }

    // {.class}
    if (char === classChar && key === '') {
      key = 'class';
      parsingKey = false;
      continue;
    }

    // {#id}
    if (char === idChar && key === '') {
      key = 'id';
      parsingKey = false;
      continue;
    }

    // {value="inside quotes"}
    if (char === '"' && value === '') {
      valueInsideQuotes = true;
      continue;
    }
    if (char === '"' && valueInsideQuotes) {
      valueInsideQuotes = false;
      continue;
    }

    // read next key/value pair
    if ((char === pairSeparator && !valueInsideQuotes) || i === end) {
      attrs.push([key, value]);
      key = '';
      value = '';
      parsingKey = true;
      continue;
    }

    // continue if character not allowed
    if (parsingKey && char.search(allowedKeyChars) === -1) {
      continue;
    }

    // no other conditions met; append to key/value
    if (parsingKey) {
      key += char;
      continue;
    }
    value += char;
  }
  return attrs;
}

module.exports = {
  getAttrs: getAttrs
}