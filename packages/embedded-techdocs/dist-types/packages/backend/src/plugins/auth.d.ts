import { PluginEnvironment } from '../types';
export default function createPlugin({ logger, database, config, discovery, }: PluginEnvironment): Promise<import("express").Router>;
