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
var MongoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoService = void 0;
const mongodb_1 = require("mongodb");
const _ = require("lodash");
const config_1 = __importDefault(require("../config"));
const constants_1 = require("../constants");
const singleton_1 = require("../decorators/singleton");
let MongoService = MongoService_1 = class MongoService {
    constructor() {
        this.mongo = null;
        this.mongoClient = new mongodb_1.MongoClient(`mongodb://${config_1.default.server.ip}:27017`);
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (MongoService_1.isConnectingToDBProcess)
                    return false;
                MongoService_1.isConnectingToDBProcess = true;
                const mongoDbName = process.env.MONGO_URI || `${this.mongoClient}/${config_1.default.server.dbName}`;
                console.error("mongoDbName", mongoDbName);
                yield this.mongoClient.connect();
                this.mongo = this.mongoClient.connection;
                console.log('mongo is connected');
            }
            catch (e) {
                // console.log('connect - could not connect to db', e);
                // MongoService.isConnectingToDBProcess = false;
                console.log('mongo existing app 2');
                process.exit(1);
            }
            console.log('mongo isConnectingToDBProcess free');
            MongoService_1.isConnectingToDBProcess = false;
            return true;
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            clearInterval(this.jobInterval);
            setTimeout(() => {
                console.log('disconnect');
                this.mongo.close();
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
        }
        return op;
    }
    get(collectionName, docId, where, orderBy, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            let query;
            if (docId) {
                query = yield this.mongo.collection(collectionName).findOne({ id: docId });
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
                    }
                }
                if (orderBy) {
                    switch (orderBy.direction) {
                        case constants_1.ORDER_BY_DIRECTION.DESC:
                            {
                                orderBy.direction = -1;
                            }
                            break;
                        default:
                            {
                                orderBy.direction = 1;
                            }
                            break;
                    }
                }
                let orderByCondition;
                if (!orderBy) {
                    orderByCondition = { "id": 1 };
                }
                else if (orderBy && orderBy.fieldName && orderBy.direction) {
                    orderByCondition = { [orderBy.fieldName]: orderBy.direction };
                }
                else {
                    orderByCondition = { [orderBy.fieldName]: 1 };
                }
                const limitCondition = limit ? limit : 0;
                let results;
                try {
                    results = yield this.mongo.collection(collectionName)
                        .find(condition)
                        .sort(orderByCondition)
                        .limit(limitCondition)
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
                const limitCondition = limit ? limit : 0; // if there is limit, use the limit, otherwise no limit = 0
                if (orderBy || limitCondition) {
                    switch (orderBy.direction) {
                        case constants_1.ORDER_BY_DIRECTION.DESC:
                            {
                                orderBy.direction = -1;
                            }
                            break;
                        case constants_1.ORDER_BY_DIRECTION.ASC:
                            {
                                orderBy.direction = 1;
                            }
                            break;
                    }
                }
                let orderByCondition;
                if (!orderBy) {
                    orderByCondition = { "id": 1 };
                }
                else if (orderBy && orderBy.fieldName && orderBy.direction) {
                    orderByCondition = { [orderBy.fieldName]: orderBy.direction };
                }
                else {
                    orderByCondition = { [orderBy.fieldName]: 1 };
                }
                try {
                    results = yield this.mongo.collection(collectionName)
                        .find({})
                        .sort(orderByCondition)
                        .limit(limitCondition)
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
                const doc = yield this.mongo.collection(collectionName).insertOne(Object.assign({}, data));
                data.id = doc.insertedId.toString();
                yield this.mongo.collection(collectionName).updateOne({ _id: doc.insertedId }, { $set: data }, { upsert: false });
                const addedDoc = yield this.mongo.collection(collectionName).findOne({ _id: doc.insertedId });
                console.log('MongoService add addedDoc', addedDoc);
                return addedDoc;
            }
            catch (e) {
                console.log("MongoService add - cannot add doc", e);
            }
        });
    }
    set(collectionName, docId, dataArg, shouldMerge, subCollectionOptions, shouldNotTriggerEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            let collectionNameLocal = collectionName;
            let docIdLocal = docId;
            const data = _.cloneDeep(dataArg);
            try {
                const doc = yield this.mongo.collection(collectionNameLocal).findOne({ id: docIdLocal });
                if (doc !== null) { // update document
                    data.id = docIdLocal;
                    if (shouldMerge) {
                        const mergedData = _.merge({}, doc, data); // merge partly data with existing doc
                        delete mergedData._id;
                        yield this.mongo.collection(collectionNameLocal).updateOne({ _id: doc._id }, { $set: Object.assign({}, mergedData) }, { upsert: false });
                    }
                    else {
                        yield this.mongo.collection(collectionNameLocal).updateOne({ _id: doc._id }, { $set: Object.assign({}, data) }, { upsert: false });
                    }
                    const updatedDoc = yield this.mongo.collection(collectionNameLocal).findOne({ id: docIdLocal });
                    return updatedDoc;
                }
                else {
                    data.id = docIdLocal; // set new document with custom id
                    delete data._id;
                    yield this.mongo.collection(collectionNameLocal).insertOne(Object.assign({}, data)); // returns acknolodege
                    const newDocUpdated = yield this.mongo.collection(collectionNameLocal).findOne({ id: docIdLocal });
                    return newDocUpdated;
                }
            }
            catch (e) {
                console.log('MongoService set - could not set data', collectionNameLocal, docId, JSON.stringify(e));
            }
        });
    }
    delete(collectionName, docId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (docId) {
                try {
                    yield this.mongo.collection(collectionName).deleteOne({ id: docId });
                }
                catch (e) {
                    console.log('cannot delete specific doc ', e);
                }
            }
            else {
                try {
                    yield this.mongo.collection(collectionName).deleteMany({});
                }
                catch (e) {
                    console.log('cannot delete docs ', e);
                }
            }
            return false;
        });
    }
};
MongoService = MongoService_1 = __decorate([
    singleton_1.singleton
], MongoService);
exports.MongoService = MongoService;
