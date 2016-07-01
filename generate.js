var Node = function() {
  this.children = {
    // key: child val
    // 
  };
  this.fileIds = [];
}

// traverse down the tree of files
  // for each, give it a unique id and save its path to PATHS
  // do a split on spaces of its content, into words
  // for each word,
    // for each letter,
      // append its file id to the array for that letter