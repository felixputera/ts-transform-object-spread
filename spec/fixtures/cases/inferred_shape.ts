const emptyObj = {};

const firstObj = {
  ...emptyObj,
  one: 1
};

const secondObj = {
  ...firstObj,
  two: 2,
  three: 3
};

const thirdObj = {
  ...secondObj,
  four: 4
};


