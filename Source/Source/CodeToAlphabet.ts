export namespace CodeToAlphabet
{
	export type Type_Number = number
	export type Type_Alphabet = string
	export type Type_Base = number



	export function Get(Number: Type_Number, Alphabet: Type_Alphabet): Type_Alphabet
	{
		const Base: Type_Base = Alphabet.length



		let Output: Type_Alphabet = ''

		while (Number !== 0)
		{
			Output = Alphabet[Number % Base] + Output
			Number = ~~(Number / Base)
		}

		return Output || Alphabet[0]
	}
}