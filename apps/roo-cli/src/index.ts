#!/usr/bin/env node
import { program } from 'commander';

program
  .version('0.0.1')
  .description('A CLI for interacting with the Roo-Code daemon');

program
  .command('daemon')
  .description('Start the Roo-Code daemon')
  .action(() => {
    console.log('Starting daemon...');
  });

program
    .command('logs <sessionId>')
    .description('Stream logs for a specific session')
    .action((sessionId) => {
        console.log(`Streaming logs for session ${sessionId}...`);
    });

program
    .command('readline <sessionId>')
    .description('Attach to a session with an interactive readline prompt')
    .action((sessionId) => {
        console.log(`Attaching to session ${sessionId} with readline...`);
    });

program.parse(process.argv);
