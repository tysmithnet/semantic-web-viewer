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

        const modifications = {
            "head": {
                "vars": ["sp", "mod", "user"]
            },
            "results": {
                "bindings": [
                    {
                        "sp": {
                            "type": "uri",
                            "value": "http://example.org/sp/sp_0"
                        },
                        "user": {
                            "type": "uri",
                            "value": "http://example.org/user/tsmith"
                        }
                    },
                    {
                        "sp": {
                            "type": "uri",
                            "value": "http://example.org/sp/sp_1"
                        },
                        "user": {
                            "type": "uri",
                            "value": "http://example.org/user/tsmith"
                        }
                    },
                    {
                        "sp": {
                            "type": "uri",
                            "value": "http://example.org/sp/sp_1"
                        },
                        "user": {
                            "type": "uri",
                            "value": "http://example.org/user/sbrown"
                        }
                    },
                ]
            }
        };
    
        const teams = {
            "head": {
                "vars": ["user", "username", "team", "teamname"]
            },
            "results": {
                "bindings": [
                    {
                        "user": {
                            "type": "uri",
                            "value": "http://example.org/user/tsmith"
                        },
                        "username": {
                            "type": "literal",
                            "value": "tsmith"
                        },
                        "team": {
                            "type": "uri",
                            "value": "http://example.org/teams/techprojects"
                        },
                        "teamname": {
                            "type": "literal",
                            "value": "Tech Projects"
                        }
                    },
                    {
                        "user": {
                            "type": "uri",
                            "value": "http://example.org/user/tsmith"
                        },
                        "username": {
                            "type": "literal",
                            "value": "tsmith"
                        },
                        "team": {
                            "type": "uri",
                            "value": "http://example.org/team/lms"
                        },
                        "teamname": {
                            "type": "literal",
                            "value": "LMS"
                        }
                    },
                    {
                        "user": {
                            "type": "uri",
                            "value": "http://example.org/user/sbrown"
                        },
                        "username": {
                            "type": "literal",
                            "value": "sbrown"
                        },
                        "team": {
                            "type": "uri",
                            "value": "http://example.org/team/techprojects"
                        },
                        "teamname": {
                            "type": "literal",
                            "value": "Tech Projects"
                        }
                    },
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

        const numProcs = 3;
        const numTables = 2;
        const numRelations = 5;

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
            const b = operations[Math.floor(Math.random() * operations.length)];
            const c = Math.floor(Math.random() * numTables);

            const rel = {
                "sp": {
                    "type": "uri",
                    "value": "http://example.org/sp/sp_" + a
                },
                "rel": {
                    "type": "uri",
                    "value": "http://example.org/rel/" + b
                },
                "relType": {
                    "type": "literal",
                    "value": b
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
                tables: allTables.results.bindings,
                teams: teams.results.bindings,
                modifications: modifications.results.bindings
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