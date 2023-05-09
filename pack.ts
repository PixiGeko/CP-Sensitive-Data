import * as coda from "@codahq/packs-sdk";
import {PackFeature} from "./src/features/PackFeature";

const pack = coda.newPack();

registerFeatures();

function registerFeatures(...features: PackFeature[]) {
    features.forEach(feature => feature.register(pack));
}
