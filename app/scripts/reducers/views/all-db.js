import {createReducer} from 'modules/helpers';

import {ActionTypes} from 'constants/index';

export const allDbState = {
    storedProcs: null,
    tables: null,
    relations: null,
    loaded: false,
    isGraphView: true,
    selectedStoredProcedures: null
};

export default {
    allDb : createReducer(allDbState, {
        [ActionTypes.VIEWS.ALL_DB.ALL_DB_LOAD_SUCESS](state, {payload}) {
            return Object.freeze({
                ...state,
                storedProcs: payload.storedProcs,
                tables: payload.tables,
                relations: payload.relations,
                loaded: true
            });
        },
        [ActionTypes.VIEWS.ALL_DB.ALL_DB_TOGGLE_GRAPH_VIEW](state, {payload}) {
            return Object.freeze({
                ...state,
                isGraphView: payload
            });
        },
        [ActionTypes.VIEWS.ALL_DB.ALL_DB_STORED_PROC_SELECTION_CHANGED](state, {payload}) {
            return Object.freeze({
                ...state,
                selectedStoredProcedures: payload
            });
        }
    })
};
