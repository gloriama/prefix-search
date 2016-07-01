var Node = function() {
  this.children = {
    // key: child val
    // value: Node
  };
  this.fileIds = {
    // key: fileId
    // value: true
  };
}

Node.prototype.addChild = function(val) {
  if (!this.children[val]) {
    this.children[val] = new Node();
  }
  return this.children[val];
};

Node.prototype.getChild = function(val) {
  return this.children[val];
};

Node.prototype.getChildren = function() {
  return this.children;
};

Node.prototype.addFileId = function(fileId) {
  this.fileIds[fileId] = true;
};

Node.prototype.getFileIds = function() {
  return Object.keys(this.fileIds);
};

Node.prototype.isLeaf = function() {
  return Object.keys(this.children).length === 0;
};

//-----
// var ROOT_PATH = __dirname + '/enron_mail_20110402';
var ROOT_PATH = __dirname + '/sample';
var fs = require('fs');

// CREATE ID->PATH FILE
// CREATE IN-MEMORY TRIE THAT CONTAINS FILEIDS FOR EACH SEARCH STRING

// traverse down the tree of files
  // for each file, give it a unique id and save its path to PATHS
  // do a split on spaces of its content, into words
  // for each word,
    // for each letter,
      // append its file id to the array for that letter
      // 

var nextId = 0;
var idToPath = [];
var assignId = function(rootPath) {
  idToPath[nextId++] = rootPath;
  return nextId - 1;
};

var filterToLowerCase
var trie = new Node();
// Adds file's contents, split on spaces, to trie
var scanFile = function(fileId) {
  var content = fs.readFileSync(idToPath[fileId], 'utf-8');
  var tokens = content.split(' ');
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    var currNode = trie;
    for (var j = 0; j < token.length; j++) {
      var char = token[j];
      var childNode = currNode.addChild(char);
      childNode.addFileId(fileId);
      currNode = childNode;
    }
  }
};

var traverseFiles = function(rootPath) {
  if (fs.lstatSync(rootPath).isDirectory()) {
    var childrenNames = fs.readdirSync(rootPath);
    childrenNames.forEach(function(childName) {
      var childPath = rootPath + '/' + childName;
      traverseFiles(childPath);
    });
  } else {
    var id = assignId(rootPath);
    scanFile(id);
  }
};

traverseFiles(ROOT_PATH);

var search = function(str) {
  var currNode = trie;
  for (var i = 0; i < str.length; i++) {
    var char = str[i];
    currNode = currNode.getChild(char);
    if (!currNode) {
      return [];
    }
  }
  return currNode.getFileIds().map(function(fileId) {
    return idToPath[fileId];
  });
};

var FILE_IDS_PATH = 'TEMP_FILE_IDS';
var TRIE_PATH = 'TEMP_TRIE';
fs.writeFileSync(FILE_IDS_PATH, JSON.stringify(idToPath));
// fs.writeFileSync(TRIE_PATH, JSON.stringify(trie));

// CREATE PREFIX_THUS_FAR->CHILDREN_ARRAY FILE
// 'f' -> 5032
// for each node:
  // write size as int
  // write json of its this.children array to the file

// start from leaves:
  // write size
  // write json of its fileIds to disk
  // save its offset to global offsets hash

// then up to its parent:
//   for each of its children prefixes,
//     look up offset in offsets
//     delete from offsets
//     create a hash of its own children:
//       key: child letter
//       val: offset
//     stringify this hash
    // write to TRIE_PATH

var getSize = function(str) {
  return Buffer.byteLength(str, 'utf8');
};

var currOffset = 0;
var offsets = {
  // key: full prefix
  // value: offset in bytes (int)
};
var bottomUp = function(rootNode, prefix) {
  prefix = prefix || '';

  var childTuples = {};
  for (var childChar in rootNode.getChildren()) {
    var childNode = rootNode.getChild(childChar);
    childTuples[childChar] = bottomUp(childNode, prefix + childChar);
  }
  var writeContents = JSON.stringify({
    children: childTuples,
    fileIds: rootNode.getFileIds()
  });
  var size = getSize(writeContents);
  fs.appendFileSync(TRIE_PATH, writeContents);

  if (rootNode === trie) {
    fs.writeFileSync('TEMP_TRIE_ROOT', writeContents);
  }
  currOffset += size;
  console.log(prefix, currOffset - size, size);
  return [ currOffset - size, size ];
};

fs.writeFileSync(TRIE_PATH, '');
bottomUp(trie);