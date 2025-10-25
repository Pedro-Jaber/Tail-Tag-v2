module.exports.deleteUndefinedProperties = function (obj) {
  for (key in obj) {
    // console.log(key, obj[key]);
    if (obj[key] === undefined) delete obj[key];
  }
};
