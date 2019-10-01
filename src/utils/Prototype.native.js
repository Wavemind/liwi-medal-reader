/**
 * This file contains Prototype for JS core
 *  The Object.prototype is a property of the Object constructor. It is also the end of a prototype chain.
 *  Nearly all objects in JavaScript are instances of Object;
 *  a typical object inherits properties (including methods) from Object.prototype, although these properties may be shadowed (a.k.a. overridden).
 *
 * */

/**
 *  Compare two object with deep properties
 *  to use :
     let obj1 = {};
     let obj2 = {};
     Object.compare(obj1, obj2);
 *
 * @param obj1
 * @param obj2
 * @return {boolean}
 */
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

/**
 * Return the first element of an array.
 * ex:
    let arr = [1,2,3];
    arr.first(); // return 1
 *
 * @return {*}
 */
Array.prototype.first = function() {
  return this[0];
};

/**
 * Return the last element of an array.
 * ex:
 let arr = [1,2,3];
 arr.last(); // return 3
 *
 * @return {*}
 */
Array.prototype.last = function() {
  return this[this.length - 1];
};

/**
 * Return a boolean if an array is empty
 * ex :
      yourArray.isEmpty() // return true / false
 * @return {boolean}
 */
Array.prototype.isEmpty = function() {
  return this === undefined || this.length === 0;
};

/**
 * change a property name correctly
    ex :
    let obj = {
      number_one : 100,
      number_two : 200,
    };

 obj.renameKey(number_one, number_new);
 console.log(obj) // return :
                     number_new: 100
                     number_two: 200
 */
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

// disabled console yellow box
// eslint-disable-next-line no-console
console.disableYellowBox = true;

/**
 * Optimisazion for production
 */

if (!__DEV__) {
  // eslint-disable-next-line no-console
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};
}
