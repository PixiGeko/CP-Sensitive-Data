import {PackDefinitionBuilder} from '@codahq/packs-sdk';

export abstract class PackFeature {
    abstract register(pack: PackDefinitionBuilder);
}