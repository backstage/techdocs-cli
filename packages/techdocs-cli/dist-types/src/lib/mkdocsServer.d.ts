import { ChildProcess } from "child_process";
import { LogFunc } from "./run";
export declare const runMkdocsServer: (options: {
    port?: string;
    useDocker?: boolean;
    stdoutLogFunc?: LogFunc;
    stderrLogFunc?: LogFunc;
}) => Promise<ChildProcess>;
