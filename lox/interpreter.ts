import { type Binary, type Expr, type Grouping, type Literal, type Unary } from "./expressions";
import type { Expression, Print, Stmt } from "./stmt";
import { TokenType, type Token } from "./token";

export function interpret(statements: Stmt[]) {
    try {
        for (const stmt of statements) {
            execute(stmt);
        }
    } catch (e: any) {
        throw Error(`(RuntimeError) ${e.message}`);
    }
}

function evaluate(expr: Expr): Object {
    switch (expr.type) {
        case "Literal":
            return visitLiteralExpr(expr);
        case "Grouping":
            return visitGrouping(expr);
        case "Unary":
            return visitUnary(expr);
        case "Binary":
            return visitBinary(expr);
    }
}

function execute(stmt: Stmt): void {
    switch (stmt.type) {
        case "Expression":
            return visitExpressionStmt(stmt);
        case "Print":
            return visitPrintStmt(stmt);
        case "Block":
        case "Class":
        case "Function":
        case "If":
        case "Return":
        case "Var":
        case "While":
    }
}
const visitExpressionStmt = (stmt: Expression): void => {
    evaluate(stmt.expression);
    return;
};
const visitPrintStmt = (stmt: Print): void => {
    const value = evaluate(stmt.expression);
    console.log(stringfy(value));
    return;
};

const visitLiteralExpr = (expr: Literal): Object => {
    return expr.value;
};

const visitGrouping = (expr: Grouping): Object => {
    return evaluate(expr.expression);
};

function visitUnary(expr: Unary): Object {
    const right = evaluate(expr.right);
    switch (expr.operator.tokenType) {
        case "MINUS":
            checkNumberOperand(expr.operator, right);
            return -right;
        case "BANG":
            return !isTruthy(right);
    }
    return {};
}
const visitBinary = (expr: Binary): Object => {
    const left = evaluate(expr.left);
    const right = evaluate(expr.right);

    switch (expr.operator.tokenType) {
        case TokenType.MINUS:
            checkNumberOperands(expr.operator, left, right);
            return Number(left) - Number(right);
        case TokenType.PLUS:
            if (typeof left === "number" && typeof right === "number") {
                return left + right;
            }
            if (typeof left === "string" && typeof right === "string") {
                return left + right;
            }
            throw new Error("operands must be two numbers or two strings");
        case TokenType.SLASH:
            checkNumberOperands(expr.operator, left, right);
            return Number(left) / Number(right);
        case TokenType.STAR:
            checkNumberOperands(expr.operator, left, right);
            return Number(left) + Number(right);
        case TokenType.BANG_EQUAL:
            return !isEqual(left, right);
        case TokenType.EQUAL_EQUAL:
            return isEqual(left, right);
        case TokenType.GREATER:
            checkNumberOperands(expr.operator, left, right);
            return Number(left) > Number(right);
        case TokenType.GREATER_EQUAL:
            checkNumberOperands(expr.operator, left, right);
            return Number(left) >= Number(right);
        case TokenType.LESS:
            checkNumberOperands(expr.operator, left, right);
            return Number(left) < Number(right);
        case TokenType.LESS_EQUAL:
            checkNumberOperands(expr.operator, left, right);
            return Number(left) <= Number(right);
    }
    return {};
};

const checkNumberOperand = (operator: Token, operand: Object): void => {
    if (typeof operand === "number") return;
    throw new Error(`${operator.tokenType}: operand must be a number`);
};
const checkNumberOperands = (operator: Token, left: Object, right: Object): void => {
    if (typeof left === "number" && typeof right === "number") return;
    throw new Error(`(${operator.tokenType}) operands must be number`);
};
const isTruthy = (object: Object): boolean => {
    if (object === null) return false;
    if (typeof object === "boolean") return object;
    return true;
};
const isEqual = (a: Object, b: Object): boolean => {
    if (a === null && b === null) return true;
    if (a === null) return false;
    return a === b;
};
const stringfy = (obj: Object): string => {
    if (obj === null) return "nil";
    if (typeof obj === "number") {
        const text = obj.toString();
        if (text.endsWith(".0")) {
            return text.slice(0, -2);
        }
        return text;
    }
    return obj.toString();
};
