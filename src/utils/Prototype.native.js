Object.compare = function(obj1, obj2) {
  let p;
  //Loop through properties in object 1
  for (p in obj1) {
    //Check property exists on both objects
    if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

    switch (typeof obj1[p]) {
      //Deep compare objects
      case 'object':
        if (!Object.compare(obj1[p], obj2[p])) return false;
        break;
      //Compare function code
      case 'function':
        if (
          typeof obj2[p] == 'undefined' ||
          (p !== 'compare' && obj1[p].toString() !== obj2[p].toString())
        )
          return false;
        break;
      //Compare values
      default:
        if (obj1[p] !== obj2[p]) return false;
    }
  }

  //Check object 2 for any extra properties
  for (p in obj2) {
    if (typeof obj1[p] == 'undefined') return false;
  }
  return true;
};

Array.prototype.first = function() {
  return this[0];
};

Array.prototype.isEmpty = function() {
  return this === undefined || this.length === 0;
};

Object.defineProperty(Object.prototype, 'renameKey', {
  writable: false, // Cannot alter this property
  enumerable: false, // Will not show up in a for-in loop.
  configurable: false, // Cannot be deleted via the delete operator
  value: function(oldName, newName) {
    // Do nothing if the names are the same
    if (oldName === newName) {
      return this;
    }
    // Check for the old property name to
    // avoid a ReferenceError in strict mode.
    if (this.hasOwnProperty(oldName)) {
      this[newName] = this[oldName];
      delete this[oldName];
    }
    return this;
  },
});

// eslint-disable-next-line no-console
console.disableYellowBox = true;
