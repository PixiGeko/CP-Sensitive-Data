import * as coda from "@codahq/packs-sdk";
import {PackFeature} from "./src/features/PackFeature";
import {Censor} from "./src/features/Censor";

export const pack = coda.newPack();

registerFeatures(
    new Censor()
);

function registerFeatures(...features: PackFeature[]) {
    features.forEach(feature => feature.register(pack));
}
