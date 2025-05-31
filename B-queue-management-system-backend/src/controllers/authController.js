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
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = exports.loginUser = void 0;
const authService_1 = require("../services/authService");
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const authResponse = yield (0, authService_1.login)(email, password);
        // Pass the complete response (user and token) to the client
        res.json(authResponse);
    } catch (error) {
        res.status(401).json({ message: error.message || 'Authentication failed' });
    }
});
exports.loginUser = loginUser;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, role, fullName } = req.body;
        const user = yield (0, authService_1.register)(email, password, role, fullName);
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message || 'Registration failed' });
    }
});
exports.registerUser = registerUser;
