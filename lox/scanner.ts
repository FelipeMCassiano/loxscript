import { TokenType, type Token } from "./token";

interface ScannerContext {
    source: string;
    tokens: Token[];
    start: number;
    current: number;
    line: number;
    keywords: Map<string, TokenType>;
}

export function initScannerContext(source: string): ScannerContext {
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
export function scanner(context: ScannerContext): Token[] {
    return scanTokens(context);
}

function scanTokens(context: ScannerContext): Token[] {
    while (!isAtEnd(context)) {
        context.start = context.current;
        scanToken(context);
    }
    const token: Token = {
        tokenType: TokenType.EOF,
        lexeme: "",
        literal: null,
        line: context.line,
    };
    context.tokens.push(token);
    return context.tokens;
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
        case ",":
            addToken(TokenType.COMMA, context);
            break;
        case ".":
            addToken(TokenType.DOT, context);
            break;
        case "-":
            addToken(TokenType.MINUS, context);
            break;
        case "+":
            addToken(TokenType.PLUS, context);
            break;
        case ";":
            addToken(TokenType.SEMICOLON, context);
            break;
        case "*":
            addToken(TokenType.STAR, context);
            break;
        case "!":
            addToken(match(context, "=") ? TokenType.BANG_EQUAL : TokenType.BANG, context);
            break;
        case "=":
            addToken(match(context, "=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL, context);
            break;
        case "<":
            addToken(match(context, "=") ? TokenType.LESS_EQUAL : TokenType.LESS, context);
            break;
        case ">":
            addToken(match(context, "=") ? TokenType.LESS_EQUAL : TokenType.LESS, context);
            break;
        case "/":
            if (match(context, "/")) {
                while (peek(context) != "\n" && !isAtEnd(context)) advance(context);
            } else {
                addToken(TokenType.SLASH, context);
            }
            break;
        case " ":
        case "\r":
        case "\t":
            break;
        case "\n":
            context.line++;
            break;
        case '"':
            string(context);
            break;
        case "o":
            if (match(context, "r")) {
                addToken(TokenType.OR, context);
            }
            break;
        default:
            if (isDigit(c)) {
                number(context);
            } else if (isAlpha(c)) {
                identifier(context);
            } else {
                const token = context.tokens[context.line];
                throw Error(`${token} Unexpected character`);
            }
            break;
    }
}
const identifier = (context: ScannerContext) => {
    while (isAlphaNumeric(peek(context))) advance(context);
    const text = context.source.substring(context.start, context.current);
    let typeK = context.keywords.get(text);
    if (typeK === null) typeK = TokenType.IDENTIFIER;

    addToken(typeK!, context);
};

const isAlpha = (c: string): boolean =>
    (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_";
const isAlphaNumeric = (c: string) => isAlpha(c) || isDigit(c);

const number = (context: ScannerContext) => {
    while (isDigit(peek(context))) advance(context);

    if (peek(context) === "." && isDigit(peekNext(context))) {
        advance(context);
    }

    while (isDigit(peek(context))) advance(context);

    addToken(
        TokenType.NUMBER,
        context,
        parseFloat(context.source.substring(context.start, context.current)),
    );
};

const isDigit = (c: string): boolean => c >= "0" && c <= "9";

const string = (context: ScannerContext) => {
    while (peek(context) != '"' && !isAtEnd(context)) {
        if (peek(context) === "\n") context.line++;
        advance(context);
    }
    advance(context);
    const value = context.source.substring(context.start + 1, context.current - 1);
    addToken(TokenType.STRING, context, value);
};

const peek = (context: ScannerContext): string => {
    if (isAtEnd(context)) return "\0";
    return context.source.charAt(context.current);
};

const peekNext = (context: ScannerContext): string => {
    if (context.current + 1 >= context.source.length) return "\0";
    return context.source.charAt(context.current + 1);
};

const match = (context: ScannerContext, expected: String): boolean => {
    if (isAtEnd(context)) return false;
    if (context.source.charAt(context.current) != expected) return false;

    context.current++;

    return true;
};

const isAtEnd = (context: ScannerContext): boolean => context.current >= context.source.length;

const advance = (context: ScannerContext): string => context.source.charAt(context.current++);

const addToken = (type: TokenType, context: ScannerContext, literal: any = null) => {
    const text = context.source.substring(context.start, context.current);
    const token: Token = { tokenType: type, lexeme: text, literal: literal, line: context.line };
    context.tokens.push(token);
};
