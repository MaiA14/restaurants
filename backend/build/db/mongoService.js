"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoService = void 0;
const mongodb_1 = require("mongodb");
const _ = require("lodash");
const config_1 = __importDefault(require("../config"));
const constants_1 = require("../constants");
const singleton_1 = require("../decorators/singleton");
let MongoService = class MongoService {
    constructor() {
        this.mongoClient = new mongodb_1.MongoClient(`mongodb://${config_1.default.server.ip}:27017`);
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.mongoDb = this.mongoClient.db(config_1.default.server.dbName);
                yield this.mongoClient.connect();
                console.log('Mongo is connected');
            }
            catch (e) {
                console.log('connect - could not connect to db', e.stack);
                console.log('mongo existing app 2');
                process.exit(1);
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            clearInterval(this.jobInterval);
            setTimeout(() => {
                console.log('disconnect');
                this.mongoDb.close();
            }, 5000);
        });
    }
    getOperand(operand) {
        let op = null;
        switch (operand) {
            case constants_1.OPERANDS.GREATER_OR_EQUALS:
                {
                    op = '$gte';
                }
                break;
            case constants_1.OPERANDS.LOWER_OR_EQUALS:
                {
                    op = '$lte';
                }
                break;
            case constants_1.OPERANDS.EQUALS:
                {
                    op = '$eq';
                }
                break;
            case constants_1.OPERANDS.NOT_EQUALS: {
                op = '$ne';
            }
        }
        return op;
    }
    get(collectionName, docId, where, orderBy, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            let query;
            // for sure single document 
            if (docId) {
                query = yield this.mongoDb.collection(collectionName).findOne({ id: docId });
                console.log('query', query);
                const result = query;
                if (!result) {
                    return null;
                }
                else {
                    const data = result;
                    return Object.assign({ id: result.id }, data);
                }
            }
            // get by where
            else if (where && Object.keys(where).length > 0) {
                const terms = Object.keys(where);
                const condition = {};
                for (let i = 0; i < terms.length; i++) {
                    if (_.isArray(where[terms[i]])) {
                        for (let j = 0; j < where[terms[i]].length; j++) {
                            condition[terms[i]] = { [this.getOperand(where[terms[i]][j].operand)]: where[terms[i]][j].value };
                        }
                    }
                    else {
                        condition[terms[i]] = { [this.getOperand(where[terms[i]].operand)]: where[terms[i]].value };
                        console.log('conditions', condition);
                    }
                }
                let results;
                try {
                    results = yield this.mongoDb.collection(collectionName)
                        .find(condition)
                        .toArray();
                }
                catch (_a) { }
                if (!results) {
                    return [];
                }
                else {
                    const items = [];
                    let doc = null;
                    for (let i = 0; i < results.length; i++) {
                        doc = results[i];
                        const data = doc;
                        items.push(Object.assign({ id: doc.id }, data));
                    }
                    return items;
                }
            }
            else {
                // get all collection
                let results;
                try {
                    results = yield this.mongoDb.collection(collectionName)
                        .find({})
                        .toArray();
                }
                catch (_b) { }
                if (!results) {
                    return null;
                }
                else {
                    const items = [];
                    let doc = null;
                    for (let i = 0; i < results.length; i++) {
                        doc = results[i];
                        const data = doc;
                        items.push(Object.assign({ id: doc.id }, data));
                        ;
                    }
                    return items;
                }
            }
        });
    }
    add(collectionName, data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('add mongo', collectionName, data);
            if (!collectionName || !data) {
                console.log(`MongoService - did not find this collection or data ${collectionName}`);
                return null;
            }
            if (data._id) {
                delete data._id;
            }
            try {
                const doc = yield this.mongoDb.collection(collectionName).insertOne(Object.assign({}, data));
                data.id = doc.insertedId.toString();
                yield this.mongoDb.collection(collectionName).updateOne({ _id: doc.insertedId }, { $set: data }, { upsert: false });
                const addedDoc = yield this.mongoDb.collection(collectionName).findOne({ _id: doc.insertedId });
                console.log('MongoService add addedDoc', addedDoc);
                return addedDoc;
            }
            catch (e) {
                console.log("MongoService add - cannot add doc", e);
            }
        });
    }
    set(collectionName, docId, dataArg, shouldMerge) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = _.cloneDeep(dataArg);
            try {
                const doc = yield this.mongoDb.collection(collectionName).findOne({ id: docId });
                if (doc !== null) { // update document
                    data.id = docId;
                    if (shouldMerge) {
                        const mergedData = _.merge({}, doc, data); // merge partly data with existing doc
                        delete mergedData._id;
                        yield this.mongoDb.collection(collectionName).updateOne({ _id: doc._id }, { $set: Object.assign({}, mergedData) }, { upsert: false });
                    }
                    else {
                        yield this.mongoDb.collection(collectionName).updateOne({ _id: doc._id }, { $set: Object.assign({}, data) }, { upsert: false });
                    }
                    const updatedDoc = yield this.mongoDb.collection(collectionName).findOne({ id: docId });
                    return updatedDoc;
                }
                else {
                    data.id = docId; // set new document with custom id
                    delete data._id;
                    yield this.mongoDb.collection(collectionName).insertOne(Object.assign({}, data)); // returns acknolodege
                    const newDocUpdated = yield this.mongoDb.collection(collectionName).findOne({ id: docId });
                    return newDocUpdated;
                }
            }
            catch (e) {
                console.log('MongoService set - could not set data', collectionName, docId, JSON.stringify(e));
            }
        });
    }
    delete(collectionName, docId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (docId) {
                try {
                    yield this.mongoDb.collection(collectionName).deleteOne({ id: docId });
                }
                catch (e) {
                    console.log('cannot delete specific doc ', e);
                }
            }
            else {
                try {
                    yield this.mongoDb.collection(collectionName).deleteMany({});
                }
                catch (e) {
                    console.log('cannot delete docs ', e);
                }
            }
            return false;
        });
    }
};
MongoService = __decorate([
    singleton_1.singleton
], MongoService);
exports.MongoService = MongoService;
