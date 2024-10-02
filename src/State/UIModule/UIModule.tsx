import { globalStateApiType } from '../GlobalStateTypes';

const UIModule = ({ set }: globalStateApiType) => {
  return {
    loaded: false,
    setLoaded: (loaded: boolean) => {
      set({ loaded: loaded });
    },
  };
};

export { UIModule };
