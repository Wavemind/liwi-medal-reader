import { isArrayLike, isString } from 'lodash';

export const stringifyDeepRef = (item) => {
  let cache = [];

  const replacer = JSON.stringify(item, function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Duplicate reference found
        try {
          // If this value does not reference a parent it can be deduped
          return JSON.parse(JSON.stringify(value));
        } catch (error) {
          // discard key if value cannot be deduped
          return;
        }
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
  cache = null; // Enable garbage collection

  return replacer;
};

export const memorySizeOf = (obj) => {
  let bytes = 0;

  function sizeOf(obj) {
    if (obj !== null && obj !== undefined) {
      switch (typeof obj) {
        case 'number':
          bytes += 8;
          break;
        case 'string':
          bytes += obj.length * 2;
          break;
        case 'boolean':
          bytes += 4;
          break;
        case 'object':
          var objClass = Object.prototype.toString.call(obj).slice(8, -1);
          if (objClass === 'Object' || objClass === 'Array') {
            for (const key in obj) {
              if (!obj.hasOwnProperty(key)) continue;
              sizeOf(obj[key]);
            }
          } else bytes += obj.toString().length * 2;
          break;
      }
    }
    return bytes;
  }

  function formatByteSize(bytes) {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(3)} KiB`;
    if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(3)} MiB`;
    return `${(bytes / 1073741824).toFixed(3)} GiB`;
  }

  return formatByteSize(sizeOf(obj));
};

/**
 * Function get from https://gomakethings.com/getting-the-differences-between-two-objects-with-vanilla-js/
 *
 * This func will return the diff property between 2 objects
 *
 */

export const diff = function (obj1, obj2) {
  // Make sure an object to compare is provided
  if (!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') {
    return obj1;
  }

  //
  // Variables
  //

  const diffs = {};
  let key;

  //
  // Methods
  //

  /**
   * Check if two arrays are equal
   * @param  {Array}   arr1 The first array
   * @param  {Array}   arr2 The second array
   * @return {Boolean}      If true, both arrays are equal
   */
  const arraysMatch = function (arr1, arr2) {
    // Check if the arrays are the same length
    if (arr1.length !== arr2.length) return false;

    // Check if all items exist and are in the same order
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }

    // Otherwise, return true
    return true;
  };

  /**
   * Compare two items and push non-matches to object
   * @param  {*}      item1 The first item
   * @param  {*}      item2 The second item
   * @param  {String} key   The key in our object
   */
  const compare = function (item1, item2, key) {
    // Get the object type
    const type1 = Object.prototype.toString.call(item1);
    const type2 = Object.prototype.toString.call(item2);

    // If type2 is undefined it has been removed
    if (type2 === '[object Undefined]') {
      diffs[key] = null;
      return;
    }

    // If items are different types
    if (type1 !== type2) {
      diffs[key] = item2;
      return;
    }

    // If an object, compare recursively
    if (type1 === '[object Object]') {
      const objDiff = diff(item1, item2);
      if (Object.keys(objDiff).length > 1) {
        diffs[key] = objDiff;
      }
      return;
    }

    // If an array, compare
    if (type1 === '[object Array]') {
      if (!arraysMatch(item1, item2)) {
        diffs[key] = item2;
      }
      return;
    }

    // Else if it's a function, convert to a string and compare
    // Otherwise, just compare
    if (type1 === '[object Function]') {
      if (item1.toString() !== item2.toString()) {
        diffs[key] = item2;
      }
    } else if (item1 !== item2) {
      diffs[key] = item2;
    }
  };

  //
  // Compare our objects
  //

  // Loop through the first object
  for (key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      compare(obj1[key], obj2[key], key);
    }
  }

  // Loop through the second object and find missing items
  for (key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (!obj1[key] && obj1[key] !== obj2[key]) {
        diffs[key] = obj2[key];
      }
    }
  }

  // Return the object of differences
  return diffs;
};

/**
 * Round sup of number
 *
 * @param number : number to round
 * @return number
 * ex : roundSup(1.55555) => 1.6
 */
export const roundSup = (n) => Math.round(n * 10) / 10;

/**
 * Return is variable is function or not
 *
 * @param functionToCheck
 * @return {*|boolean}
 */
export function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

/**
 * Diff nodes
 * @param  {Object} newNodes Nodes Object compared
 * @param  {Object} oldNodes Old NodesObject to compare with
 * @return {Object}        Return a new array who represent the diff
 */
export function differenceNodes(newNodes, oldNodes, answerKey = 'answer', idKey = 'id') {
  const diff = [];
  Object.keys(newNodes).map((key) => {
    const log = {};
    const iterator = ['value', answerKey];

    const isDifferent = iterator.some((index) => {
      if (oldNodes[key] === undefined) return newNodes[key][index] !== null;
      return newNodes[key][index] !== oldNodes[key][index];
    });

    if (isDifferent) {
      log[idKey] = idKey === 'id' ? key : newNodes[key][idKey];
      log.value = newNodes[key].value;
      log[answerKey] = newNodes[key][answerKey];
      diff.push(log);
    }
  });

  return diff;
}

/**
 * Convert Realm object to javascript object
 * @param { realmObject } realmObject - the realm Object
 * @param { integer } maxDepth
 * @param { integer } depth
 * @returns { object }
 */
export const convertToObject = (realmObject, maxDepth = 3, depth = 0) => {
  depth++;
  if (depth > maxDepth) {
    return realmObject;
  }

  if (typeof realmObject !== 'object') {
    return realmObject;
  }

  if (realmObject === null) {
    return null;
  }

  let keys = Object.getOwnPropertyDescriptors(realmObject);

  if (typeof realmObject.objectSchema === 'function') {
    keys = realmObject.objectSchema().properties;
  }

  const object = {};

  for (const key in keys) {
    if (realmObject.hasOwnProperty(key)) {
      // We don't follow linkinh objects
      if (keys[key].type === 'linkingObjects') {
        object[key] = realmObject[key];
      } else if (isString(realmObject[key])) {
        object[key] = realmObject[key];
      } else if (isArrayLike(realmObject[key]) && !isString(realmObject[key])) {
        object[key] = realmObject[key].map((item) => convertToObject(item, maxDepth, depth, key));
      } else {
        object[key] = convertToObject(realmObject[key], maxDepth, depth, key);
      }
    }
  }
  return object;
};
