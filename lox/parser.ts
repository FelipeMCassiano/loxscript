import { createBinary, type Expr, createUnary, createLiteral, createGrouping } from "./expressions";
import { createExpressionStmt, createPrintStmt, type Stmt } from "./stmt";
import { TokenType, type Token } from "./token";

interface ParserContext {
    current: number;
    tokens: Token[];
}
export function parse(context: ParserContext): Stmt[] {
    try {
        const statements: Stmt[] = [];
        while (!isAtEnd(context)) {
            statements.push(statement(context));
        }
        return statements;
    } catch (e: any) {
        throw Error(`(ParserError) ${e.message}`);
    }
}

export const initParserContext = (tokens: Token[]): ParserContext => {
    return { current: 0, tokens: tokens };
};

const expression = (context: ParserContext): Expr => equality(context);

const statement = (context: ParserContext): Stmt => {
    if (match(context, TokenType.PRINT)) return printStatement(context);
    return expressionStatement(context);
};

const printStatement = (context: ParserContext): Stmt => {
    const value = expression(context);
    consume(TokenType.SEMICOLON, "Expect ';' after value", context);
    return createPrintStmt(value);
};
const expressionStatement = (context: ParserContext): Stmt => {
    const expr = expression(context);
    consume(TokenType.SEMICOLON, "Expect ';' after expression", context);
    return createExpressionStmt(expr);
};

const equality = (context: ParserContext): Expr => {
    let expr = comparison(context);
    while (match(context, TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
        const operator = previous(context);
        const right = comparison(context);

        expr = createBinary(expr, operator, right);
    }
    return expr;
};

const comparison = (context: ParserContext): Expr => {
    let expr = term(context);
    while (
        match(
            context,
            TokenType.GREATER,
            TokenType.GREATER_EQUAL,
            TokenType.LESS,
            TokenType.LESS_EQUAL,
        )
    ) {
        const operator = previous(context);
        const right = term(context);
        expr = createBinary(expr, operator, right);
    }

    return expr;
};

const term = (context: ParserContext): Expr => {
    let expr = factor(context);
    while (match(context, TokenType.MINUS, TokenType.PLUS)) {
        const operator = previous(context);
        const right = factor(context);
        expr = createBinary(expr, operator, right);
    }

    return expr;
};

const factor = (context: ParserContext): Expr => {
    let expr = unary(context);
    while (match(context, TokenType.SLASH, TokenType.STAR)) {
        const operator = previous(context);
        const right = unary(context);
        expr = createBinary(expr, operator, right);
    }

    return expr;
};

const unary = (context: ParserContext): Expr => {
    if (match(context, TokenType.BANG, TokenType.MINUS)) {
        const operator = previous(context);
        const right = unary(context);
        return createUnary(operator, right);
    }

    return primary(context);
};
const primary = (context: ParserContext): Expr => {
    if (match(context, TokenType.FALSE)) return createLiteral(false);
    if (match(context, TokenType.TRUE)) return createLiteral(true);
    if (match(context, TokenType.NIL)) return createLiteral(null);

    if (match(context, TokenType.NUMBER, TokenType.STRING)) {
        return createLiteral(previous(context).literal);
    }

    if (match(context, TokenType.LEFT_PAREN)) {
        const expr = expression(context);
        consume(TokenType.RIGHT_PAREN, "Expect ') after expression", context);
        return createGrouping(expr);
    }

    throw Error(`${peek(context)}: "Expect expression `);
};

const match = (context: ParserContext, ...types: TokenType[]): boolean => {
    for (let type of types) {
        if (check(type, context)) {
            advance(context);
            return true;
        }
    }

    return false;
};

const consume = (typeT: TokenType, message: string, context: ParserContext) => {
    if (check(typeT, context)) return advance(context);
    throw Error(`line: ${peek(context).line} ${message}`);
};

const check = (typeT: TokenType, context: ParserContext): boolean => {
    if (isAtEnd(context)) return false;

    return peek(context).tokenType === typeT;
};
const peek = (context: ParserContext): Token => context.tokens.at(context.current)!;

const previous = (context: ParserContext): Token => context.tokens.at(context.current - 1)!;

const isAtEnd = (context: ParserContext): boolean => peek(context).tokenType === TokenType.EOF;

const advance = (context: ParserContext): Token => {
    if (!isAtEnd(context)) context.current++;
    return previous(context);
};

const synchornize = (context: ParserContext) => {
    advance(context);
    while (!isAtEnd(context)) {
        if (previous(context).tokenType === TokenType.SEMICOLON) return;
        switch (peek(context).tokenType) {
            case TokenType.CLASS:
            case TokenType.FUN:
            case TokenType.VAR:
            case TokenType.FOR:
            case TokenType.IF:
            case TokenType.WHILE:
            case TokenType.PRINT:
            case TokenType.RETURN:
                return;
        }
        advance(context);
    }
};
