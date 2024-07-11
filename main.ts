import { file } from "bun";
function main() {
    const args = process.argv.slice(2);

    if (args.length > 1) {
        console.log("Usage: jlox [script]");
        process.exit(64);
    } else if (args.length == 1) {
        runFile(args[0]);
    } else {
        runPrompt();
    }
}
main();

function runFile(path: string) {
    const content = file(path);
    run(content.toString());
}

function runPrompt() {
    while (true) {
        const line = prompt(">");
        if (line == null) break;
        run(line);
    }
}

function run(source: string) {}
