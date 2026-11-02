/**
 * Returns shallow copy of an object.
 *
 * @param {Object} obj - an object to copy
 * @return {Object}
 */
function shallowCopy(obj) {
  const copy = {};
  return Object.assign(copy, obj);
}

/**
 * Merges array of objects into a single object. If there are overlapping keys, the values
 * should be summed.
 *
 * @param {Object[]} objects - The array of objects to merge
 * @return {Object} - The merged object
 */
function mergeObjects(objects) {
  return objects.reduce((result, obj) => {
    return Object.entries(obj).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: (acc[key] || 0) + value,
      }),
      result
    );
  }, {});
}

/**
 * Removes properties from an object.
 *
 * @param {Object} obj - The object from which to remove the property
 * @param {string[]} keys - The keys of the properties to remove
 * @return {Object} - The object with the specified keys removed
 */
function removeProperties(obj, keys) {
  const result = { ...obj };

  keys.forEach((key) => {
    delete result[key];
  });

  return result;
}

/**
 * Compares two source objects. Returns true if the objects are equal and false otherwise.
 * There are no nested objects.
 *
 * @param {Object} obj1 - The first object to compare
 * @param {Object} obj2 - The second object to compare
 * @return {boolean}
 */
function compareObjects(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  return keys1.every((key) => obj1[key] === obj2[key]);
}

/**
 * Checks if the source object is empty.
 *
 * @param {Object} obj - The object to check
 * @return {boolean}
 */
function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Makes the source object immutable.
 *
 * @param {Object} obj - The source object to make immutable
 * @return {Object}
 */
function makeImmutable(obj) {
  return Object.freeze(obj);
}

/**
 * Returns a word from letters whose positions are provided as an object.
 *
 * @param {Object} lettersObject
 * @return {string}
 */
function makeWord(lettersObject) {
  const letters = [];

  Object.entries(lettersObject).forEach(([letter, positions]) => {
    positions.forEach((position) => {
      letters[position] = letter;
    });
  });

  return letters.join('');
}

/**
 * Returns true if the seller can sell tickets to everyone, false otherwise.
 *
 * @param {number[]} queue
 * @return {boolean}
 */
function sellTickets(queue) {
  let cash25 = 0;
  let cash50 = 0;
  let canSell = true;

  queue.every((bill) => {
    if (bill === 25) {
      cash25 += 1;
    } else if (bill === 50) {
      if (cash25 < 1) {
        canSell = false;
        return false;
      }

      cash25 -= 1;
      cash50 += 1;
    } else if (bill === 100) {
      if (cash50 >= 1 && cash25 >= 1) {
        cash50 -= 1;
        cash25 -= 1;
      } else if (cash25 >= 3) {
        cash25 -= 3;
      } else {
        canSell = false;
        return false;
      }
    }

    return true;
  });

  return canSell;
}

/**
 * Returns the rectangle object with width and height parameters and getArea() method.
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;

  this.getArea = function getArea() {
    return this.width * this.height;
  };
}

function getJSON(obj) {
  return JSON.stringify(obj);
}

function fromJSON(proto, json) {
  const obj = JSON.parse(json);

  return Object.setPrototypeOf(obj, proto);
}

/**
 * Sorts the specified array by country name first and city name
 * (if countries are equal) in ascending order.
 *
 * @param {GeoEntity[]} arr
 * @return {GeoEntity[]}
 */
function sortCitiesArray(arr) {
  return [...arr].sort((a, b) => {
    if (a.country < b.country) {
      return -1;
    }

    if (a.country > b.country) {
      return 1;
    }

    if (a.city < b.city) {
      return -1;
    }

    if (a.city > b.city) {
      return 1;
    }

    return 0;
  });
}

/**
 * Groups elements of the specified array by key.
 *
 * @param {GeoEntity[]} array
 * @param {(item: GeoEntity) => string} keySelector
 * @param {(item: GeoEntity) => string} valueSelector
 * @return {Map<string, string[]>}
 */
function group(array, keySelector, valueSelector) {
  return array.reduce((result, item) => {
    const key = keySelector(item);
    const value = valueSelector(item);

    if (!result.has(key)) {
      result.set(key, []);
    }

    result.get(key).push(value);

    return result;
  }, new Map());
}

class CssSelector {
  constructor() {
    this.parts = [];
    this.lastOrder = 0;
    this.counts = {
      element: 0,
      id: 0,
      class: 0,
      attr: 0,
      pseudoClass: 0,
      pseudoElement: 0,
    };
  }

  add(type, value) {
    const order = {
      element: 1,
      id: 2,
      class: 3,
      attr: 4,
      pseudoClass: 5,
      pseudoElement: 6,
    };

    if (order[type] < this.lastOrder) {
      throw new Error(
        'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'
      );
    }

    if (
      ['element', 'id', 'pseudoElement'].includes(type) &&
      this.counts[type] > 0
    ) {
      throw new Error(
        'Element, id and pseudo-element should not occur more than one time inside the selector'
      );
    }

    this.parts.push({ type, value });
    this.counts[type] += 1;
    this.lastOrder = order[type];

    return this;
  }

  element(value) {
    return this.add('element', value);
  }

  id(value) {
    return this.add('id', value);
  }

  class(value) {
    return this.add('class', value);
  }

  attr(value) {
    return this.add('attr', value);
  }

  pseudoClass(value) {
    return this.add('pseudoClass', value);
  }

  pseudoElement(value) {
    return this.add('pseudoElement', value);
  }

  stringify() {
    return this.parts
      .map(({ type, value }) => {
        switch (type) {
          case 'element':
            return value;
          case 'id':
            return `#${value}`;
          case 'class':
            return `.${value}`;
          case 'attr':
            return `[${value}]`;
          case 'pseudoClass':
            return `:${value}`;
          case 'pseudoElement':
            return `::${value}`;
          default:
            return '';
        }
      })
      .join('');
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new CssSelector().element(value);
  },

  id(value) {
    return new CssSelector().id(value);
  },

  class(value) {
    return new CssSelector().class(value);
  },

  attr(value) {
    return new CssSelector().attr(value);
  },

  pseudoClass(value) {
    return new CssSelector().pseudoClass(value);
  },

  pseudoElement(value) {
    return new CssSelector().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return {
      stringify() {
        return `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
      },
    };
  },
};

module.exports = {
  shallowCopy,
  mergeObjects,
  removeProperties,
  compareObjects,
  isEmptyObject,
  makeImmutable,
  makeWord,
  sellTickets,
  Rectangle,
  getJSON,
  fromJSON,
  group,
  sortCitiesArray,
  cssSelectorBuilder,
};
