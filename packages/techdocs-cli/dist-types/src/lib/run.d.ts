/// <reference types="node" />
import { SpawnOptions, ChildProcess } from "child_process";
export declare type LogFunc = (data: Buffer | string) => void;
declare type SpawnOptionsPartialEnv = Omit<SpawnOptions, "env"> & {
    env?: Partial<NodeJS.ProcessEnv>;
    stdoutLogFunc?: LogFunc;
    stderrLogFunc?: LogFunc;
};
export declare const run: (name: string, args?: string[], options?: SpawnOptionsPartialEnv) => Promise<ChildProcess>;
export declare function waitForSignal(childProcesses: Array<ChildProcess>): Promise<void>;
export {};
