import { ActionTypes } from 'constants/index';

export function toggleGraphView(isGraphView) {
    return {
        type: ActionTypes.VIEWS.ALL_DB.ALL_DB_TOGGLE_GRAPH_VIEW,
        payload: isGraphView
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