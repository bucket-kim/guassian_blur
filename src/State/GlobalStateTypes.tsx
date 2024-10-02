import { UIModuleTypes } from './UIModule/UIModuleTypes';

export interface GlobalStateTypes extends UIModuleTypes {}

export type SetState<T extends object> = (
  partial: Partial<T> | ((state: T) => void),
  replace?: boolean,
) => void;

export type GetState<T extends object> = () => T;

export type globalStateApiType = {
  set: SetState<GlobalStateTypes>;
  get: GetState<GlobalStateTypes>;
};
