var Node = function() {
  this.children = {
    // key: child val
    // value: Node
  };
  this.fileIds = [];
}

Node.prototype.addChild = function(val) {
  this.children[val] = new Node();
};

Node.prototype.addFileId = function(fileId) {
  this.fileIds.push(fileId);
};

//-----
var ROOT_PATH = __dirname + '/enron_mail_20110402';
console.log(ROOT_PATH);
var fs = require('fs');
var root = new Node();

// CREATE ID->PATH FILE
// CREATE IN-MEMORY TRIE THAT CONTAINS FILEIDS FOR EACH SEARCH STRING

// traverse down the tree of files
  // for each file, give it a unique id and save its path to PATHS
  // do a split on spaces of its content, into words
  // for each word,
    // for each letter,
      // append its file id to the array for that letter
      // 

var traverseFiles = function(rootPath) {
  if (fs.lstatSync(rootPath).isDirectory()) {
    var childrenNames = fs.readdirSync(rootPath);
    childrenNames.forEach(function(childName) {
      var childPath = rootPath + '/' + childName;
      traverseFiles(childPath);
    });
  } else {
    console.log(rootPath);
  }

};

traverseFiles(ROOT_PATH);

// CREATE PREFIX_THUS_FAR->CHILDREN_ARRAY FILE
// 'f' -> 5032
// for each node:
  // write size as int
  // write json of its this.children array to the file