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
            const procNodes = payload
                .storedProcs
                .map(x => {
                    return {id: x.sp.value, name: x.title.value, type: "storedProc"}; // todo: constant value
                });

            const tableNodes = payload
                .tables
                .map(x => {
                    return {id: x.tb.value, name: x.title.value, type: "table"}; // todo: constant value
                });

            const relations = payload
                .relations
                .map(x => {
                    return {source: x.sp.value, target: x.tb.value, type: x.rel.value}
                });
            const distinctRelationTypes = relations.reduce((agg, cur) => {
                if(agg.indexOf(cur.type) == -1) {
                    agg.push(cur.type);
                }
                return agg;
            }, []);
            this.links = relations;
            return Object.freeze({
                ...state,
                storedProcs: procNodes,
                tables: tableNodes,
                relations,
                distinctRelationTypes,
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
