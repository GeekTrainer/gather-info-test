"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder = require("botbuilder");
var PromptType;
(function (PromptType) {
    PromptType[PromptType["text"] = 0] = "text";
    PromptType[PromptType["confirm"] = 1] = "confirm";
    PromptType[PromptType["number"] = 2] = "number";
    PromptType[PromptType["time"] = 3] = "time";
    PromptType[PromptType["choice"] = 4] = "choice";
})(PromptType = exports.PromptType || (exports.PromptType = {}));
class GatherInfoDialog {
    constructor() {
        this.id = 'gather-info';
        this.name = 'gather-info';
        this.waterfall = [
            (session, args, next) => {
                if (!args || !args.schemas || args.schemas.length === 0)
                    throw 'GatherArgs must have a schema';
                if (args.index > -1) {
                    args.index++;
                }
                else {
                    args.index = 0;
                }
                if (!args.values)
                    args.values = {};
                session.dialogData.gatherArgs = args;
                const schema = args.schemas[args.index];
                let value = null;
                for (let locationIndex = 0; locationIndex < valueLocations.length; locationIndex++) {
                    value = valueLocations[locationIndex](session, schema, args.entities);
                    if (value)
                        break;
                }
                if (value) {
                    next({ response: value });
                }
                else if (schema.type === PromptType.choice) {
                    builder.Prompts.choice(session, schema.prompt, schema.choices, { listStyle: builder.ListStyle.button });
                }
                else {
                    builder.Prompts[PromptType[schema.type]](session, schema.prompt);
                }
            },
            (session, results, next) => {
                let args = session.dialogData.gatherArgs;
                if (results.response.entity)
                    results.response = results.response.entity;
                args.values[args.schemas[args.index].name] = results.response;
                if (args.index === args.schemas.length - 1) {
                    session.endDialogWithResult({ response: args.values });
                }
                else {
                    session.replaceDialog(this.name, args);
                }
            }
        ];
    }
}
exports.GatherInfoDialog = GatherInfoDialog;
const valueLocations = [
    (session, schema) => {
        if (schema.defaultValue)
            return schema.defaultValue();
    },
    (session, schema) => {
        if (session.userData[schema.name])
            return session.userData[schema.name];
    },
    (session, schema) => {
        if (session.privateConversationData[schema.name])
            return session.privateConversationData[schema.name];
    },
    (session, schema) => {
        if (session.conversationData[schema.name])
            return session.conversationData[schema.name];
    },
    (session, schema, entities) => {
        let entity = builder.EntityRecognizer.findEntity(entities, schema.name);
        if (entity)
            return entity.entity;
    }
];
