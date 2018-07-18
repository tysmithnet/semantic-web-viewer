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
    selectedUsers: [],
    selectedTeams: [],
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

            let links = payload
                .relations
                .map(x => {
                    return {
                        source: storedProcs.find(sp => sp.id == x.sp.value), 
                        target: tables.find(t => t.id == x.tb.value), 
                        type: x.rel.value, 
                        name: x.relType.value
                    }
                });
            const seenTypes = new Set();
            const distinctRelationTypes = links.reduce((agg, cur) => {
                if(!seenTypes.has(cur.name)) {
                    seenTypes.add(cur.name);
                    agg.push(cur.name);
                }
                return agg;
            }, []);

            const teams = payload.teams.map(t => {
                return {
                    id: t.team.value,
                    name: t.teamname.value,
                    type: "team"
                }
            })

            const users = payload.teams.map(t => {
                return {
                    id: t.user.value,
                    name: t.username.value,
                    type: "user",
                }
            });

            const teamMemberships = payload.teams.map(t => {
                return {
                    source: users.find(u => u.id == t.user.value),
                    target: teams.find(x => x.id == t.team.value),
                    type: "teamMembership"
                }
            })

            const modifications = payload.modifications.map(m => {
                const source = storedProcs.find(s => s.id == m.sp.value);
                const target = users.find(u => u.id == m.user.value);
                return {
                    source,
                    target,
                    name: "edit",
                    type: "http://example.org/actions/edit"
                }
            });
            
            links = links.concat(teamMemberships).concat(modifications);
            const nodes = [...(storedProcs || []), ...(tables || []), ...(users || []), ...(teams || [])];
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
        },
        [ActionTypes.VIEWS.ALL_DB.ALL_DB_USER_SELECTION_CHANGED](state, {payload}) {
            return Object.freeze({
                ...state,
                selectedUsers: payload
            });
        },
        [ActionTypes.VIEWS.ALL_DB.ALL_DB_TEAM_SELECTION_CHANGED](state, {payload}) {
            return Object.freeze({
                ...state,
                selectedTeams: payload
            });
        }
    })
};
