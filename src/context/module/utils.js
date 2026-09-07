export const buildModuleObject = (module) => {
  return arrayToObject(module, (acc, curr) => {
    acc[curr.code] = arrayToObject(curr.action, (accAction, currAction) => {
      accAction[currAction.code] = currAction;
    });
  });
};

export const arrayToObject = (
  array,
  callback = (acc, curr) => (acc[curr.code] = curr)
) => {
  return array.reduce((accAction, currAction) => {
    callback(accAction, currAction);
    return accAction;
  }, {});
};

export const isModuleActive = (moduleObject, exectute, feature) => {
  return (
    (moduleObject?.[exectute] &&
      moduleObject?.[exectute]?.[feature] &&
      moduleObject?.[exectute]?.[feature]?.active) ||
    false
  );
};
