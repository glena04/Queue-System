"use strict";
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
exports.register = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../models/userModel");
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.User.findOne({ where: { email } });
    if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
        throw new Error('Invalid credentials');
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
    // Return both user (without password) and token
    const userWithoutPassword = {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName
    };
    return { user: userWithoutPassword, token };
});
exports.login = login;
const register = (email, password, role, fullName) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const user = new userModel_1.User({ email, password: hashedPassword, role, fullName });
    return user.save();
});
exports.register = register;
