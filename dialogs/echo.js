/* ----------------------------------------------------------------------------------
*   Echo Dialog
*   Sample dialog to use as a starting spot for creating bots
*   Or for creating a demo bot
---------------------------------------------------------------------------------- */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder = require("botbuilder");
const dialog = {
    id: 'echo',
    name: 'echo',
    waterfall: [
        (session, args, next) => {
            const botName = 'gather-info-test';
            const description = `A sample bot using the Gather Info package`;
            session.send(`Hi there! I'm ${botName}`);
            session.send(`In a nutshell, here's what I can do:\n\n${description}`);
            builder.Prompts.text(session, `What's your name?`);
        },
        (session, results, next) => {
            session.endConversation(`Welcome, ${results.response}`);
        },
    ]
};
exports.default = dialog;
