import {PackFeature} from "./PackFeature";
import {makeParameter, PackDefinitionBuilder, ParameterType, ValueType} from "@codahq/packs-sdk";
import { LoremIpsum as LI } from "lorem-ipsum";
import {FormulaName} from "../FormulaName";

export class LoremIpsum extends PackFeature {
    static LOREM = new LI();

    register(pack: PackDefinitionBuilder) {
        pack.addFormula({
            name: FormulaName.LOREM_IPSUM,
            description: `Replaces text with lorem ipsum.`,
            resultType: ValueType.String,
            parameters: [
                makeParameter({
                    name: "value",
                    description: "The value to replace.",
                    type: ParameterType.String,
                    optional: false,
                }),
            ],

            execute: async ([value]) => {
                return value.split(" ").map(() => LoremIpsum.LOREM.generateWords(1)).join(" ");
            },
        });

        pack.addColumnFormat({
            name: "Replace with Lorem Ipsum",
            instructions: `Replaces the values in the column with Lorem Ipsum.`,
            formulaName: FormulaName.LOREM_IPSUM
        });
    }
}