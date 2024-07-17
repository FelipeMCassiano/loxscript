import type { Expr } from "./expressions";

export type Stmt = Block | Class | Expression | Func | If | Print | Return | Var | While;

interface Block {
    type: "Block";
}
interface Class {
    type: "Class";
}

export interface Expression {
    type: "Expression";
    expression: Expr;
}
export const createExpressionStmt = (value: any): Expression => {
    return { type: "Expression", expression: value };
};

interface Func {
    type: "Function";
}
interface If {
    type: "If";
}

export interface Print {
    type: "Print";
    expression: Expr;
}
export const createPrintStmt = (value: any): Print => {
    return { type: "Print", expression: value };
};

interface Return {
    type: "Return";
}
interface Var {
    type: "Var";
}
interface While {
    type: "While";
}
