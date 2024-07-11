import { TokenType, type Token } from "./token";

interface ScannerContext {
    source: string;
    tokens: Token[];
    start: number;
    current: number;
    line: number;
    keywords: Map<string, TokenType>;
}

function initScannerContext(source: string): ScannerContext {
    const keywords = new Map([
        ["and", TokenType.AND],
        ["class", TokenType.CLASS],
        ["else", TokenType.ELSE],
        ["false", TokenType.FALSE],
        ["for", TokenType.FOR],
        ["fun", TokenType.FUN],
        ["if", TokenType.IF],
        ["nil", TokenType.NIL],
        ["or", TokenType.OR],
        ["print", TokenType.PRINT],
        ["return", TokenType.RETURN],
        ["super", TokenType.SUPER],
        ["this", TokenType.THIS],
        ["true", TokenType.TRUE],
        ["var", TokenType.VAR],
        ["while", TokenType.WHILE],
    ]);

    return {
        source: source,
        tokens: [],
        start: 0,
        line: 1,
        current: 0,
        keywords: keywords,
    };
}
export function scanner(source: string) {
    const context = initScannerContext(source);

    scanTokens(context);
}

function scanTokens(context: ScannerContext): Token[] {
    while (!isAtEnd(context)) {
        context.start = context.current;
        scanToken(context);
    }
    return 1 as never;
}

function scanToken(context: ScannerContext): any {
    const c = advance(context);

    switch (c) {
        case "(":
            addToken(TokenType.LEFT_PAREN, context);
            break;
        case ")":
            addToken(TokenType.RIGHT_PAREN, context);
            break;
        case "{":
            addToken(TokenType.LEFT_BRACE, context);
            break;
        case "}":
            addToken(TokenType.LEFT_BRACE, context);
            break;
    }
}
const isAtEnd = (context: ScannerContext): boolean => context.current >= context.source.length;

function advance(context: ScannerContext): string {
    return context.source.charAt(context.current++);
}

function addToken(type: TokenType, context: ScannerContext, literal: Object = {}) {
    const text = context.source.substring(context.start, context.current);
    const token: Token = { tokenType: type, lexeme: text, literal: literal, line: context.line };
    context.tokens.push(token);
}
