#!/usr/bin/env node

/**
 * CLI entry point.
 * Delegates to the Commander-based client to register and run commands.
 */
import { runClient } from './client.js';

await runClient();
