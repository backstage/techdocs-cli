import { PluginEnvironment } from '../types';
export default function createPlugin(env: PluginEnvironment): Promise<import("express").Router>;
