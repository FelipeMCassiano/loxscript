import { type Token } from "./token";
// Define the Expr types
export type Expr = Literal | Grouping | Unary | Binary;

export interface Literal {
    type: "Literal";
    value: Object;
}

export interface Grouping {
    type: "Grouping";
    expression: Expr;
}

export interface Unary {
    type: "Unary";
    operator: Token;
    right: Expr;
}

export interface Binary {
    type: "Binary";
    left: Expr;
    operator: Token;
    right: Expr;
}

export function createLiteral(value: any): Literal {
    return { type: "Literal", value };
}

export function createGrouping(expression: Expr): Grouping {
    return { type: "Grouping", expression };
}

export function createUnary(operator: Token, right: Expr): Unary {
    return { type: "Unary", operator, right };
}

export function createBinary(left: Expr, operator: Token, right: Expr): Binary {
    return { type: "Binary", left, operator, right };
}
