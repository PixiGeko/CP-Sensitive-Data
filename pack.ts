import * as coda from "@codahq/packs-sdk";
import {PackFeature} from "./src/features/PackFeature";
import {Censor} from "./src/features/Censor";
import texts from "./src/assets/texts.json";

export const TEXTS = texts;
export const pack = coda.newPack();

registerFeatures(
    new Censor()
);

function registerFeatures(...features: PackFeature[]) {
    features.forEach(feature => feature.register(pack));
}
