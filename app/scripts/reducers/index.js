import app from './app';
import user from './user';
import allDb from "./views/all-db";

export default {
  ...app,
  ...user,
  ...allDb
};
