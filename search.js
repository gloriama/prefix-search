// var nextLetterOffsets = default to offsets for first-char

// for each letter in string
  // look up offset in nextLetterOffsets
  // if doesn't exist
    // console.log('No files found!')
    // return
  // read in 4 bytes at that offset to get size to read
  // read in offset + 4 bytes, for that amount of bytes, to get json
  // nextLetterOffsets = parsed json