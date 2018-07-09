import { all, fork } from 'redux-saga/effects';

import github from './github';
import user from './user';
import allDb from './views/all-db';
/**
 * rootSaga
 */
export default function* root() {
  yield all([
    fork(user),
    fork(allDb)
  ]);
}
