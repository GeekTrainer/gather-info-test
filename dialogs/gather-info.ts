import * as builder from 'botbuilder';
import { IDialog } from './idialog';

export enum PromptType {
    text,
    confirm,
    number,
    time,
    choice
}

export interface GatherSchema {
    name: string,
    defaultValue?: () => any | string,
    prompt: string,
    confirmPrompt?: string,
    type: PromptType,
    choices?: string[]
}

export interface GatherArgs {
    schemas: GatherSchema[],
    entities?: any[],
}

interface InternalGatherArgs extends GatherArgs {
    values?: {},
    index?: number,
}

interface ResponseResults {
    response: string
}

export class  GatherInfoDialog implements IDialog
{
    id= 'gather-info';
    name= 'gather-info';
    waterfall= [
        (session: builder.Session, args: InternalGatherArgs, next) => {
            if(!args || !args.schemas || args.schemas.length === 0) throw 'GatherArgs must have a schema';

            if(args.index > -1) {
                args.index++;
            } else {
                args.index = 0;
            }
            if(!args.values) args.values = {};
            session.dialogData.gatherArgs = args;

            const schema = args.schemas[args.index];

            let value = null;
            for(let locationIndex = 0; locationIndex < valueLocations.length; locationIndex++) {
                value = valueLocations[locationIndex](session, schema, args.entities);
                if(value) break;
            }

            if(value) {
                next({ response: value });
            } else if(schema.type === PromptType.choice) {
                builder.Prompts.choice(session, schema.prompt, schema.choices, { listStyle: builder.ListStyle.button });
            } else {
                builder.Prompts[PromptType[schema.type]](session, schema.prompt);
            }
        },
        (session: builder.Session, results, next) => {
            let args: InternalGatherArgs = session.dialogData.gatherArgs;

            if(results.response.entity) results.response = results.response.entity;

            args.values[args.schemas[args.index].name] = results.response;
            if(args.index === args.schemas.length - 1) {
                session.endDialogWithResult({ response: args.values });
            } else {
                session.replaceDialog(this.name, args);
            }
        }
    ];
}

const valueLocations = [
    (session: builder.Session, schema: GatherSchema) => {
        if(schema.defaultValue) return schema.defaultValue();
    },
    (session: builder.Session, schema: GatherSchema) => {
        if(session.userData[schema.name]) return session.userData[schema.name];
    },
    (session: builder.Session, schema: GatherSchema) => {
        if(session.privateConversationData[schema.name]) return session.privateConversationData[schema.name];
    },
    (session: builder.Session, schema: GatherSchema) => {
        if(session.conversationData[schema.name]) return session.conversationData[schema.name];
    },
    (session: builder.Session, schema: GatherSchema, entities: any[]) => {
        let entity = builder.EntityRecognizer.findEntity(entities, schema.name);
        if(entity) return entity.entity;
    }
]