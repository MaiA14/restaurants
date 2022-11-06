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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBService = void 0;
const singleton_1 = require("../decorators/singleton");
const mongoService_1 = require("./mongoService");
let DBService = class DBService {
    constructor(dbType) {
        this.dbType = '';
        switch (dbType) {
            default: {
                this.db = new mongoService_1.MongoService();
            }
        }
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.connect();
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.disconnect();
        });
    }
    add(collection, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.add(collection, data);
        });
    }
    get(collection, docId, where, orderBy, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.get(collection, docId, where, orderBy, limit);
        });
    }
    set(collection, docId, data, shouldMerge) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.set(collection, docId, data, shouldMerge);
        });
    }
    delete(collection, docId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.delete(collection, docId);
        });
    }
};
DBService = __decorate([
    singleton_1.singleton
], DBService);
exports.DBService = DBService;
