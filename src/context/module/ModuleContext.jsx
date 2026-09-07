import { createContext, useContext, useMemo } from 'react';
import { arrayToObject, buildModuleObject, isModuleActive } from './utils';

const ModuleContext = createContext({
  hasMainMenuPermission: () => {},
  hasMenuPermission: () => {},
  hasModulePermission: () => {},
});

const ModuleContextProvider = ({ children, mainMenu, menu, module }) => {
  const proccessedModule = useMemo(() => {
    if (!module) return {};
    return {
      mainMenu: arrayToObject(mainMenu),
      menu: arrayToObject(menu),
      module: buildModuleObject(module),
    };
  }, [module, mainMenu, menu]);

  const hasModulePermission = (execution, feature) => {
    return isModuleActive(proccessedModule.mainMenu, execution, feature);
  };

  const hasMenuPermission = (code) => {
    return (
      (proccessedModule.menu[code] && proccessedModule.menu[code]?.active) ||
      false
    );
  };

  const hasMainMenuPermission = (code) => {
    return (
      (proccessedModule.mainMenu[code] &&
        proccessedModule.mainMenu[code]?.active) ||
      false
    );
  };

  return (
    <ModuleContext.Provider
      value={{ hasMainMenuPermission, hasMenuPermission, hasModulePermission }}
    >
      {children}
    </ModuleContext.Provider>
  );
};

export const useModulePermission = () => useContext(ModuleContext);

export default ModuleContextProvider;
