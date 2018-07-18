import { ActionTypes } from 'constants/index';

export function toggleGraphView(isGraphView) {
    return {
        type: ActionTypes.VIEWS.ALL_DB.ALL_DB_TOGGLE_GRAPH_VIEW,
        payload: isGraphView
    }
}

export function toggleShowLabels(showLabels) {
    return {
        type: ActionTypes.VIEWS.ALL_DB.ALL_DB_TOGGLE_SHOW_LABELS,
        payload: showLabels
    }
}

export function setStoredProcedureSelection(procIds) {
    return {
        type: ActionTypes.VIEWS.ALL_DB.ALL_DB_STORED_PROC_SELECTION_CHANGED,
        payload: procIds
    }
}

export function setTableSelection(tableIds) {
    return {
        type: ActionTypes.VIEWS.ALL_DB.ALL_DB_TABLE_SELECTION_CHANGED,
        payload: tableIds
    }
}

export function setRelationSelection(relations) {
    return {
        type: ActionTypes.VIEWS.ALL_DB.ALL_DB_RELATION_SELECTION_CHANGED,
        payload: relations
    }
}

export function setRelationTypesSelection(relationTypes) {
    return {
        type: ActionTypes.VIEWS.ALL_DB.ALL_DB_RELATION_TYPES_SELECTION_CHANGED,
        payload: relationTypes
    }
}

export function removeSelectedNodes(nodes) {
    return {
        type: ActionTypes.VIEWS.ALL_DB.ALL_DB_REMOVE_NODES_REQUESTED,
        payload: nodes
    }
}

export function setUsersSelection(users) {
    return {
        type: ActionTypes.VIEWS.ALL_DB.ALL_DB_USER_SELECTION_CHANGED,
        payload: users
    }
}

export function setTeamSelection(teams) {
    return {
        type: ActionTypes.VIEWS.ALL_DB.ALL_DB_TEAM_SELECTION_CHANGED,
        payload: teams
    }
}