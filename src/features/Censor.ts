import {PackFeature} from "./PackFeature";
import {makeParameter, PackDefinitionBuilder, ParameterType, ValueType} from "@codahq/packs-sdk";
import {FormulaName} from "../FormulaName";
import {TEXTS} from "../../pack";

export class Censor extends PackFeature {
    static DEFAULT_REPLACEMENT: string = "█";
    static COMMON_REPLACEMENT = [
        Censor.DEFAULT_REPLACEMENT,
        "•",
        "❤",
        "♦",
        "✪",
        "*"
    ].sort();

    register(pack: PackDefinitionBuilder) {
        pack.addFormula({
            name: FormulaName.CENSOR,
            description: `Censors a text. \n\n${TEXTS.censor.warning}`,
            resultType: ValueType.String,
            parameters: [
                makeParameter({
                    name: "text",
                    description: "The text to censor.",
                    type: ParameterType.String,
                    optional: false,
                }),
                makeParameter({
                    name: "replacement",
                    description: `The text used to replace each character of censored parts. Default is ${Censor.DEFAULT_REPLACEMENT}.`,
                    type: ParameterType.String,
                    autocomplete: Censor.COMMON_REPLACEMENT,
                    optional: true,
                }),
                makeParameter({
                    name: "replacementCount",
                    description: `The number of times the replacement is repeated for each censored part. By default, and if this value is negative, the length of the censored part is used.`,
                    type: ParameterType.Number,
                    optional: true,
                }),
                makeParameter({
                    name: "pattern",
                    description: "The RegEx pattern used to filter the censored parts. If not provided, the whole value is censored.",
                    type: ParameterType.String,
                    optional: true,
                }),
                makeParameter({
                    name: "keepSpaces",
                    description: `Keep the spaces or replace them with the replacement. Default to true.`,
                    type: ParameterType.Boolean,
                    optional: true,
                }),
            ],

            execute: async ([text, replacement = Censor.DEFAULT_REPLACEMENT, replacementCount = -1, pattern, keepSpaces = true]) => {
                if (!pattern) return this.censor(text, replacement, replacementCount, keepSpaces);

                const regexp = new RegExp(pattern, 'g');

                let match;
                while ((match = regexp.exec(text)) !== null) {
                    const censoredMatch = this.censor(match[0], replacement, replacementCount, keepSpaces);
                    text = text.substring(0, match.index) + censoredMatch + text.substring(match.index + match[0].length);
                }

                return text;
            },
        });

        pack.addColumnFormat({
            name: "Censor text",
            instructions: `Censors the values in the column. ${TEXTS.censor.warning}`,
            formulaName: FormulaName.CENSOR
        });
    }

    private censor(value: string, replacement: string, replacementCount: number, keepSpaces: boolean) {
        if(replacementCount >= 0) return replacement.repeat(replacementCount);
        return value.split(' ').map(p => replacement.repeat(p.length)).join(keepSpaces ? ' ' : replacement);
    }
}