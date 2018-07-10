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