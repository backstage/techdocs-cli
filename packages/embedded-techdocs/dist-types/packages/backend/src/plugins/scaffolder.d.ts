import type { PluginEnvironment } from '../types';
export default function createPlugin({ logger, config, }: PluginEnvironment): Promise<import("express").Router>;
