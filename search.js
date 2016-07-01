var fs = require('fs');

// this is a converted node, i.e. using tuples for children
var currNode = JSON.parse(fs.readFileSync('TEMP_TRIE_ROOT', 'utf-8'));
// console.log(currNode);

// for each letter in string
  // look up offset in nextLetterOffsets
  // if doesn't exist
    // console.log('No files found!')
    // return
  // read in 4 bytes at that offset to get size to read
  // read in offset + 4 bytes, for that amount of bytes, to get json
  // nextLetterOffsets = parsed json

var str = process.argv[2];

var lookupChar = function(char, callback) {
  var tuple = currNode.children[char];
  if (!tuple) {
    console.log('No files found!');
    return;
  }
  var offset = tuple[0];
  var size = tuple[1];
  var buffer = new Buffer(size);
  var fd = fs.openSync('TEMP_TRIE', 'r');
  fs.read(fd, buffer, 0, size, offset, function(err, bytesRead, buffer) {
    var content = buffer.toString();
    currNode = JSON.parse(content);
    fs.closeSync(fd);
    callback();
  });
}

var lookupStr = function(str) {
  if (str.length === 0) {
    var fileIds = currNode.fileIds;
    var idToPath = JSON.parse(fs.readFileSync('TEMP_FILE_IDS', 'utf-8'));
    console.log(fileIds.map(function(fileId) {
      return idToPath[parseInt(fileId)];
    }).join('\n'));
    return;
  }
  lookupChar(str[0], function() {
    lookupStr(str.slice(1));
  });
};

lookupStr(str);