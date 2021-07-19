import { ChildProcess } from "child_process";
import { LogFunc } from "./run";
export declare const runMkdocsServer: (options: {
    port?: string;
    useDocker?: boolean;
    dockerImage?: string;
    stdoutLogFunc?: LogFunc;
    stderrLogFunc?: LogFunc;
}) => Promise<ChildProcess>;
