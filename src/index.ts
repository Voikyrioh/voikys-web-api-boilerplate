import Server from "./server";
import * as process from "node:process";
import Logger, {LoggerLevel} from "@logger";

async function graceFullStart() {
    await Server.start().catch(graceFullStop);
}

function graceFullStop(errorCode: number): Promise<void> {
    return new Promise( async (resolve) => {
        await Server.stop();

        resolve(process.exit(errorCode));
    })
}

graceFullStart().then(() => Logger.log(LoggerLevel.INFO, 'Server started')).catch(graceFullStop);
process.on('SIGINT', graceFullStop);
