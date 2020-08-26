const blacklist = require('metro-config/src/defaults/blacklist');

// blacklist is a function that takes an array of regexes and combines
// them with the default blacklist to return a single regex.

module.exports = {
  resolver: {
    blacklistRE: blacklist([/test\/.*/]),
    // 'ts' must be here to work with some deps written in TS, e.g. @react-native-community/netinfo
    sourceExts: ['jsx', 'js', 'ts', 'tsx'],
  },
};
