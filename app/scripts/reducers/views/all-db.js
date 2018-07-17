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
    selectedRelationTypes: [],
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
                    return {source: x.sp.value, target: x.tb.value, type: x.rel.value, name: x.relType.value}
                });
            const seenTypes = new Set();
            const distinctRelationTypes = links.reduce((agg, cur) => {
                if(!seenTypes.has(cur.name)) {
                    seenTypes.add(cur.name);
                    agg.push(cur.name);
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
                    .filter(r => links.some(x => x.id == r.source.id || r.target.id == x.id))
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
        [ActionTypes.VIEWS.ALL_DB.ALL_DB_RELATION_TYPES_SELECTION_CHANGED](state, {payload}) {
            return Object.freeze({
                ...state,
                selectedRelationTypes: payload
            });
        }
    })
};
