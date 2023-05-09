import {PackFeature} from './PackFeature';
import {makeParameter, PackDefinitionBuilder, ParameterType, ValueType} from '@codahq/packs-sdk';
import {FormulaName} from '../FormulaName';

export class RandomizeNumbers extends PackFeature {
	static DEFAULT_MAX = 999;
	static DEFAULT_DECIMALS = -1;

	register(pack: PackDefinitionBuilder) {
		pack.addFormula({
			name: FormulaName.RANDOMIZE_NUMBERS,
			description: 'Randomizes all numbers in the text.',
			resultType: ValueType.String,
			parameters: [
				makeParameter({
					name: 'text',
					description: 'The text that contains the numbers to randomize.',
					type: ParameterType.String,
					optional: false,
				}),
				makeParameter({
					name: 'max',
					description: `The maximum value for the random numbers. If negative, the number in the randomized number is the number of numbers in the replaced number. Default is ${RandomizeNumbers.DEFAULT_MAX}.`,
					type: ParameterType.Number,
					optional: true,
				}),
				makeParameter({
					name: 'decimals',
					description: `The number of decimals in the randomized number when the replaced number contains decimal. If negative, the number of decimals in the randomized number is the number of decimals in the replaced number. Default is ${RandomizeNumbers.DEFAULT_DECIMALS}.`,
					type: ParameterType.Number,
					optional: true,
				}),
			],

			execute: async ([text, max = RandomizeNumbers.DEFAULT_MAX, decimals = RandomizeNumbers.DEFAULT_DECIMALS]) => {

				return text.replace(
					new RegExp(/[+-]?\d+(,\d+)*(\.\d+(e\d+)?)?/, 'g'),
					(number) => {
						let newNumber = Math.floor(Math.random() * (max < 0 ? Math.pow(10, number.split('.')[0].length) : max));
						if (number.includes('.')) {
							const decimalMax = Math.pow(10, decimals < 0 ? number.split('.')[1].length : decimals);
							newNumber += Math.floor(Math.random() * (decimalMax - 1)) / decimalMax;
						}
						return String(newNumber * (Math.random() > 0.8 ? -1 : 1));
					},
				);
			},
		});

		pack.addColumnFormat({
			name: 'Randomize all numbers',
			instructions: 'Replaces all the number in the text in the column.',
			formulaName: FormulaName.RANDOMIZE_NUMBERS
		});
	}
}