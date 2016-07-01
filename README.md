# Prefix search

## Quick start
```
node generate
```

```
node search [prefix]
```
`prefix` is a required argument, consisting of the search term prefix to search.


## Usage

This repo consists of two scripts:
* `generate`, which pre-processes a given directory for fast prefix searching
* `search`, which returns all files within the processed directory that contain words starting with the given prefix


## Algorithm

### `generate`

This script traverses downward from the given root directory. For each file found, it:
* assigns a unique id to that file
* adds every word in the file (split on spaces) to one global trie

Every node in the trie, including internal nodes (i.e. non-leaf nodes), contains an array of file ids of all files that contain at least one word with the prefix up to that node.

Then, the script writes this trie to a file, with the data for each node located at a recorded tuple of offset and size. Each node knows the location tuple for all of its children. Thus for this portion, the script traverses *upward* from the leaves, such that leaves are written first to disk. Therefore, child locations are already known before the parent is written.