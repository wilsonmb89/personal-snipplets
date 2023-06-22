import * as loginActions from '../actions/login.action';
import * as catalogueActions from '../actions/catalogue.action';
import * as userSettingsActions from '../actions/user-settings.action';
import { Catalogs, initialState, UserState } from '../states/user.state';

type UserActions =
  | loginActions.UserLoginActions
  | catalogueActions.CatalogueActions
  | userSettingsActions.UserSettingsActions;

const getUpdatedCatalogs = (catalogs: Catalogs, newCatalogue) => {
  const exists = Object.keys(catalogs).find(catalogueName => catalogueName === Object.keys(newCatalogue)[0]);
  return !exists ? { ...catalogs, ...newCatalogue } : catalogs;
};

export function userReducer(
  state = initialState,
  action: UserActions
): UserState {
  switch (action.type) {
    case loginActions.USER_LAST_LOGIN_SUCCESS:
      return {
        ...state,
        lastLogin: { ...action.lastLogin },
      };
    case userSettingsActions.USER_PUBLIC_KEY:
      return {
        ...state,
        publicKey: null,
        diffTime: null,
      };
    case userSettingsActions.USER_PUBLIC_KEY_SUCCESS:
      return {
        ...state,
        publicKey: action.publicKey,
        diffTime: action.diffTime,
      };
    case userSettingsActions.USER_BASIC_DATA_SUCCESS:
      return {
        ...state,
        basicData: action.basicData,
      };
    case userSettingsActions.USER_BASIC_DATA_ERROR:
      return {
        ...state,
        basicData: undefined,
      };
    case userSettingsActions.USER_BASIC_DATA_REFRESH_SUCCESS:
      return {
        ...state,
        basicData: action.basicData,
      };
    case userSettingsActions.USER_BASIC_DATA_REFRESH_ERROR:
      return {
        ...state,
        basicData: undefined,
      };
    case userSettingsActions.USER_FEATURES_DATA:
      return {
        ...state,
        userFeaturesData: {
          ...state.userFeaturesData,
          working: true
        }
      };
    case userSettingsActions.USER_FEATURES_UPDATE:
      return {
        ...state,
        userFeaturesData: {
          userFeatures: null,
          working: true,
          completed: false,
          error: null
        }
      };
    case userSettingsActions.USER_FEATURES_REFRESH:
      return {
        ...state,
        userFeaturesData: {
          ...state.userFeaturesData,
          completed: false
        }
      };
    case userSettingsActions.USER_FEATURES_SUCCESS:
      return {
        ...state,
        userFeaturesData: {
          userFeatures: action.userFeatures,
          working: false,
          completed: true,
          error: null
        }
      };
    case userSettingsActions.USER_FEATURES_ERROR:
      return {
        ...state,
        userFeaturesData: {
          userFeatures: null,
          working: false,
          completed: false,
          error: action.error
        }
      };
    case userSettingsActions.USER_FEATURES_REMOVE:
      return {
        ...state,
        userFeaturesData: {
          userFeatures: null,
          working: false,
          completed: false,
          error: null
        }
      };
    case catalogueActions.GET_CATALOGUE_SUCCESS:
      return {
        ...state,
        catalogs: getUpdatedCatalogs(state.catalogs, action.catalogue)
      };
    case userSettingsActions.USER_RESET:
      return {
        ...state,
        basicData: null,
        lastLogin: {
          currentIp: '127.0.0.1',
          currentTime: new Date().toLocaleString(),
          lastLoginTime: new Date().toLocaleString(),

        },
        catalogs: {}
      };
    default:
      return state;
  }
}
