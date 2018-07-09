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
                    {
                        "sp": {
                            "type": "uri",
                            "value": "http://example.org/sp/sp_a"
                        },
                        "title": {
                            "type": "literal",
                            "value": "Proc A"
                        }
                    }, {
                        "sp": {
                            "type": "uri",
                            "value": "http://example.org/sp/sp_b"
                        },
                        "title": {
                            "type": "literal",
                            "value": "Proc B"
                        }
                    }, {
                        "sp": {
                            "type": "uri",
                            "value": "http://example.org/sp/sp_c"
                        },
                        "title": {
                            "type": "literal",
                            "value": "Proc C"
                        }
                    }, {
                        "sp": {
                            "type": "uri",
                            "value": "http://example.org/sp/sp_d"
                        },
                        "title": {
                            "type": "literal",
                            "value": "Proc D"
                        }
                    }, {
                        "sp": {
                            "type": "uri",
                            "value": "http://example.org/sp/sp_e"
                        },
                        "title": {
                            "type": "literal",
                            "value": "Proc E"
                        }
                    }, {
                        "sp": {
                            "type": "uri",
                            "value": "http://example.org/sp/sp_f"
                        },
                        "title": {
                            "type": "literal",
                            "value": "Proc F"
                        }
                    }
                ]
            }
        };
    
        const allTables = {
            "head": {
                "vars": ["tb", "title"]
            },
            "results": {
                "bindings": [
                    {
                        "tb": {
                            "type": "uri",
                            "value": "http://example.org/tb/tb_a"
                        },
                        "title": {
                            "type": "literal",
                            "value": "Table A"
                        }
                    }, {
                        "tb": {
                            "type": "uri",
                            "value": "http://example.org/tb/tb_b"
                        },
                        "title": {
                            "type": "literal",
                            "value": "Table B"
                        }
                    }, {
                        "tb": {
                            "type": "uri",
                            "value": "http://example.org/tb/tb_c"
                        },
                        "title": {
                            "type": "literal",
                            "value": "Table C"
                        }
                    }, {
                        "tb": {
                            "type": "uri",
                            "value": "http://example.org/tb/tb_d"
                        },
                        "title": {
                            "type": "literal",
                            "value": "Table D"
                        }
                    }, {
                        "tb": {
                            "type": "uri",
                            "value": "http://example.org/tb/tb_e"
                        },
                        "title": {
                            "type": "literal",
                            "value": "Table E"
                        }
                    }, {
                        "tb": {
                            "type": "uri",
                            "value": "http://example.org/tb/tb_f"
                        },
                        "title": {
                            "type": "literal",
                            "value": "Table F"
                        }
                    }
                ]
            }
        };
    
        const procTableRelationships = {
            "head": {
                "vars": ["sp", "rel", "tb"]
            },
            "results": {
                "bindings": [
                    {
                        "sp": {
                            "type": "uri",
                            "value": "http://example.org/sp/sp_a"
                        },
                        "rel": {
                            "type": "uri",
                            "value": "http://example.org/rel/write"
                        },
                        "tb": {
                            "type": "uri",
                            "value": "http://example.org/tb/tb_a"
                        }
                    }, {
                        "sp": {
                            "type": "uri",
                            "value": "http://example.org/sp/sp_a"
                        },
                        "rel": {
                            "type": "uri",
                            "value": "http://example.org/rel/read"
                        },
                        "tb": {
                            "type": "uri",
                            "value": "http://example.org/tb/tb_a"
                        }
                    }, {
                        "sp": {
                            "type": "uri",
                            "value": "http://example.org/sp/sp_b"
                        },
                        "rel": {
                            "type": "uri",
                            "value": "http://example.org/rel/write"
                        },
                        "tb": {
                            "type": "uri",
                            "value": "http://example.org/tb/tb_c"
                        }
                    }
                ]
            }
        };
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