import { ActionTypes } from 'constants/index';

export function toggleGraphView(isGraphView) {
    return {
        type: ActionTypes.VIEWS.ALL_DB.ALL_DB_TOGGLE_GRAPH_VIEW,
        payload: isGraphView
    }
}