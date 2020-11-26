import { PluginEnvironment } from '../types';
export default function createPlugin({ logger, config, discovery, }: PluginEnvironment): Promise<import("express").Router>;
