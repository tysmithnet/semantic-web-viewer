import {createReducer} from 'modules/helpers';

import {ActionTypes} from 'constants/index';

export const allDbState = {
    storedProcs: [],
    tables: [],
    distinctRelationTypes: [],
    isGraphView: true,
    nodes: [],
    links: [],
    selectedStoredProcedures: [],
    selectedTables: [],
    selectedRelations: [],
    isLoaded: false
};

export default {
    allDb : createReducer(allDbState, {
        [ActionTypes.VIEWS.ALL_DB.ALL_DB_LOAD_SUCESS](state, {payload}) {
            const storedProcs = payload
                .storedProcs
                .map(x => {
                    return {id: x.sp.value, name: x.title.value, type: "storedProc"}; // todo: constant value
                });

            const tables = payload
                .tables
                .map(x => {
                    return {id: x.tb.value, name: x.title.value, type: "table"}; // todo: constant value
                });

            const links = payload
                .relations
                .map(x => {
                    return {source: x.sp.value, target: x.tb.value, type: x.rel.value}
                });
            const distinctRelationTypes = links.reduce((agg, cur) => {
                if(agg.indexOf(cur.type) == -1) {
                    agg.push(cur.type);
                }
                return agg;
            }, []);
            const nodes = [...(storedProcs || []), ...(tables || [])];
            return Object.freeze({
                ...state,
                isLoaded: true,
                storedProcs,
                tables,
                distinctRelationTypes,
                nodes,
                links,
                selectedStoredProcedures: state
                    .selectedStoredProcedures
                    .filter(sp => storedProcs.some(x => x.id == sp.id)),
                selectedTables: state
                    .selectedTables
                    .filter(sp => tables.some(x => x.id == sp.id)),
                selectedRelations: state
                    .selectedRelations
                    .filter(sp => links.some(x => x.id == sp.id))
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
            const storedProcs = state
                .storedProcs
                .filter(f => !payload.some(n => f.id === n.id));
            const tables = state
                .tables
                .filter(f => !payload.some(n => f.id === n.id));
            const links = state
                .relations
                .filter(r => !payload.some(n => r.source === n.id || r.target == n.id));
            return Object.freeze({
                ...state,
                storedProcs,
                tables,
                links,
                nodes: [...storedProcs, ...tables],
                selectedStoredProcedures: state
                    .selectedStoredProcedures
                    .filter(sp => storedProcs.some(x => x.id == sp.id)),
                selectedTables: state
                    .selectedTables
                    .filter(sp => tables.some(x => x.id == sp.id)),
                selectedRelations: state
                    .selectedRelations
                    .filter(sp => links.some(x => x.id == sp.id))
            });
        }
    })
};
