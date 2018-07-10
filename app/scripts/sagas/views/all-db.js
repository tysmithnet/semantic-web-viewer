import {delay} from 'redux-saga'
import {all, call, put, takeLatest} from 'redux-saga/effects';
import {ActionTypes} from 'constants/index';
import { Action } from 'rxjs/scheduler/Action';

function * loadDataAsync() {
    try
    {
        yield delay(1000);
        const allProcs = {
            "head": {
                "vars": ["sp", "title"]
            },
            "results": {
                "bindings": [
                 
                ]
            }
        };
    
        const allTables = {
            "head": {
                "vars": ["tb", "title"]
            },
            "results": {
                "bindings": [
                ]
            }
        };
    
        const procTableRelationships = {
            "head": {
                "vars": ["sp", "rel", "tb"]
            },
            "results": {
                "bindings": [
                ]
            }
        };

        const numProcs = 200;
        const numTables = 500;
        const numRelations = 600;

        for(let i = 0; i < numProcs; i++) {
            const sp = {
                "sp": {
                    "type": "uri",
                    "value": "http://example.org/sp/sp_" + i
                },
                "title": {
                    "type": "literal",
                    "value": "Proc " + i
                }
            };
            allProcs.results.bindings.push(sp);
        }

        for(let i = 0; i < numTables; i++) {
            const tb = {
                "tb": {
                    "type": "uri",
                    "value": "http://example.org/tb/tb_" + i
                },
                "title": {
                    "type": "literal",
                    "value": "Table " + i
                }
            };
            allTables.results.bindings.push(tb);
        }

        const operations = ['insert', 'update', 'delete', 'select']
        const map = {};
        for(let i = 0; i < numRelations; i++) {
            const a = Math.floor(Math.random() * numProcs);
            const b = operations[i % operations.length];
            const c = Math.floor(Math.random() * numTables);


            if(!map[`sp_${a}`] == null)
                map[`sp_${a}`] = 0;

            if(++map[`sp_${a}`] > 10){
                i--;
                continue;
            }

            if(map[`tb_${c}}`] == null)
                map[`tb_${c}}`] = 0;
            
            if(++map[`tb_${c}}`] > 50) {
                i--;
                continue;
            }

            const rel = {
                "sp": {
                    "type": "uri",
                    "value": "http://example.org/sp/sp_" + a
                },
                "rel": {
                    "type": "uri",
                    "value": "http://example.org/rel/" + b
                },
                "tb": {
                    "type": "uri",
                    "value": "http://example.org/tb/tb_" + c
                }
            }
            procTableRelationships.results.bindings.push(rel);
        }

        yield put({
            type: ActionTypes.VIEWS.ALL_DB.ALL_DB_LOAD_SUCESS,
            payload: {
                storedProcs: allProcs.results.bindings,
                relations: procTableRelationships.results.bindings,
                tables: allTables.results.bindings
            }
        });
    }
    catch(error) {
        yield put({type: ActionTypes.VIEWS.ALL_DB.ALL_DB_LOAD_FAILURE})
    }
}

export default function * root() {
    yield all([takeLatest(ActionTypes.VIEWS.ALL_DB.ALL_DB_LOAD_REQUEST, loadDataAsync)])
}