/* ----------------------------------------------------------------
*   Bot created with botbuilder Yeoman Generator
*   https://github.com/microsoftdx/generator-botbuilder
*
*   All default dialogs are located in ./dialogs
*   You can add additional dialogs below as needed
---------------------------------------------------------------- */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder = require("botbuilder");
const gather_info_1 = require("./dialogs/gather-info");
const schemas = [
    {
        name: 'Name',
        prompt: 'What is your name?',
        defaultValue: () => 'Christopher',
        type: gather_info_1.PromptType.text,
    },
    {
        name: 'PartySize',
        prompt: 'How many people in your party?',
        type: gather_info_1.PromptType.number,
    },
    {
        name: 'SeatingType',
        prompt: 'Where would you like to sit?',
        type: gather_info_1.PromptType.choice,
        choices: ['Inside', 'Bar', 'Patio'],
    }
];
const gatherInfoDialog = new gather_info_1.GatherInfoDialog();
const bot = new builder.UniversalBot(new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
}), [
    (session) => {
        session.endConversation(`Say "I'd like to sit at the bar" to test the flow.`);
    },
]);
bot.dialog('MakeReservation', [
    (session, args) => {
        session.beginDialog(gatherInfoDialog.name, { schemas, entities: args.intent.entities });
    },
    (session, results) => {
        session.endConversation(`Reservation made for ${results.response.Name} for a party of ${results.response.PartySize} at the ${results.response.SeatingType}`);
    }
]).triggerAction({ matches: 'MakeReservation' });
bot.recognizer(new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/1945d652-0636-4112-b18f-fd878fb23219?subscription-key=87c43bd5f3b24ec2b5d08757039da547&verbose=true&timezoneOffset=0&q='));
bot.dialog(gatherInfoDialog.id, gatherInfoDialog.waterfall);
exports.default = bot;
