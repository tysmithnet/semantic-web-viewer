import {createReducer} from 'modules/helpers';

import {ActionTypes} from 'constants/index';

export const allDbState = {
    storedProcs: null,
    tables: null,
    relations: null,
    loaded: false,
    isGraphView: true,
    selectedStoredProcedures: null,
    selectedTables: null,
    selectedRelations: null
};

export default {
    allDb : createReducer(allDbState, {
        [ActionTypes.VIEWS.ALL_DB.ALL_DB_LOAD_SUCESS](state, {payload}) {
            return Object.freeze({
                ...state,
                storedProcs: payload.storedProcs,
                tables: payload.tables,
                relations: payload.relations,
                selectedStoredProcedures: [],
                selectedTables: [],
                selectedRelations: [],
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
        },
        [ActionTypes.VIEWS.ALL_DB.ALL_DB_TABLE_SELECTION_CHANGED](state, {payload}) {
            return Object.freeze({
                ...state,
                selectedTables: payload
            });
        },
        [ActionTypes.VIEWS.ALL_DB.ALL_DB_RELATION_SELECTION_CHANGED](state, {payload}) {
            return Object.freeze({
                ...state,
                selectedRelations: payload
            });
        },
        [ActionTypes.VIEWS.ALL_DB.ALL_DB_REMOVE_NODES_REQUESTED](state, {payload}) {
            const storedProcs = state.storedProcs.filter(f => !payload.some(n => f.id === n.id));
            const tables = state.tables.filter(f => !payload.some(n => f.id === n.id));
            const relations = state.relations.filter(r => !payload.some(n => r.source === n.id || r.target == n.id));
            return Object.freeze({
                ...state,
                storedProcs,
                tables,
                relations,
                selectedStoredProcedures: state.selectedStoredProcedures.filter(sp => storedProcs.some(x => x.id == sp.id)),
                selectedTables: state.selectedTables.filter(sp => tables.some(x => x.id == sp.id)),
                selectedRelations: state.selectedRelations.filter(sp => relations.some(x => x.id == sp.id))
            });
        }
    })
};
