import reducer from 'reducers/user';
import { ActionTypes } from 'constants/index';

describe('User', () => {
  it('should return the initial state', () => {
    expect(reducer.user(undefined, {})).toMatchSnapshot();
  });

  it(`should handle ${ActionTypes.USER.USER_LOGIN_REQUEST}`, () => {
    expect(reducer.user(undefined, { type: ActionTypes.USER.USER_LOGIN_REQUEST })).toMatchSnapshot();
  });

  it(`should handle ${ActionTypes.USER.USER_LOGIN_SUCCESS}`, () => {
    expect(reducer.user(undefined, { type: ActionTypes.USER.USER_LOGIN_SUCCESS })).toMatchSnapshot();
  });

  it(`should handle ${ActionTypes.USER.USER_LOGOUT_REQUEST}`, () => {
    expect(reducer.user(undefined, { type: ActionTypes.USER.USER_LOGOUT_REQUEST })).toMatchSnapshot();
  });

  it(`should handle ${ActionTypes.USER.USER_LOGOUT_SUCCESS}`, () => {
    expect(reducer.user(undefined, { type: ActionTypes.USER.USER_LOGOUT_SUCCESS })).toMatchSnapshot();
  });
});
