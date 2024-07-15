import { file } from "bun";
import { initScannerContext, scanner } from "./scanner";
import { initParserContext, parse } from "./parser";
import { interpret } from "./interpreter";

export function runFile(path: string) {
    const content = file(path);
    run(content.toString());
}

export function runPrompt() {
    while (true) {
        const line = prompt(">");
        if (line == null) break;
        run(line);
    }
}

export function run(source: string) {
    const contextS = initScannerContext(source);
    const tokens = scanner(source, contextS);

    const contextP = initParserContext(tokens);
    try {
        const expression = parse(contextP);
        interpret(expression);
    } catch (e: any) {
        console.error(e.message);
        return;
    }
}
