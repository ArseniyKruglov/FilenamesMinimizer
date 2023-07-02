import { Type_Filename, Type_FilenameExtension, Type_FilenameName } from '../../Library/Code/Node.js/Source/FileSystem'
import { PassArgumentToClass } from '../../Library/Code/TypeScript/Source/PassArgumentToClass'
import { CodeToAlphabet } from './CodeToAlphabet'
import { Item } from './Item'



export namespace Map
{
	export type Type_Alphabet = string
	export type Type_CacheLifetimeInSeconds = Type_Seconds
	export type Type_Seconds = number



	export interface Interface
	{
		'Items': Item.Interface[]
		'OnChange': Function
		'Alphabet'?: Type_Alphabet
		'CacheLifetimeInSeconds'?: Type_CacheLifetimeInSeconds
	}



	export class Class
	{
		private Items: Item.Interface[]
		private OnChange: Function
		private Alphabet: Type_Alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
		private CacheLifetimeInSeconds?: Type_CacheLifetimeInSeconds



		constructor(Argument: Interface)
		{
			PassArgumentToClass(Argument, this)
		}



		GetFilename(ItemHash: Item.Type_Hash, FilenameExtension: Type_FilenameExtension): Type_Filename
		{
			return this.GetFilenameName(ItemHash, FilenameExtension) + '.' + FilenameExtension
		}

		GetItems(): Item.Interface[]
		{
			return this.Items
		}



		private GetFilenameName(Hash: Item.Type_Hash, Extension: Type_FilenameExtension): Type_FilenameName
		{
			this.RemoveRecordsWithExpiredCache()

			const PreviousEnteranceOfThisHash: Item.Interface | null = this.GetLastEnterance_ByHash(Hash, Extension)

			if (PreviousEnteranceOfThisHash)
			{
				this.OnChange()

				return this.Index_GetFilenameName(PreviousEnteranceOfThisHash.Index)
			}
			else
			{
				const PreviousEnteranceOfExtension: Item.Interface | null = this.GetLastEnterance_ByExtension(Extension)
				const NewIndex: Item.Type_Index = this.Index_GetNext(PreviousEnteranceOfExtension?.Index)
				this.AddRecord(Hash, Extension, NewIndex)

				this.OnChange()

				return this.Index_GetFilenameName(NewIndex)
			}
		}



		private AddRecord(Hash: Item.Type_Hash, Extension: Type_FilenameExtension, Index: Item.Type_Index): void
		{
			const Item: Item.Interface =
			{
				'Index': Index,
				'Hash': Hash,
				'Extension': Extension,
				'GenerationTime': new Date()
			}

			this.Items.unshift(Item)
		}



		private GetLastEnterance_ByHash(Hash: Item.Type_Hash, Extension: Type_FilenameExtension): Item.Interface | null
		{
			return this.Items.find((Item) => Item.Extension.toLowerCase() === Extension.toLowerCase() && Item.Hash === Hash)
		}

		private GetLastEnterance_ByExtension(Extension: Type_FilenameExtension): Item.Interface | null
		{
			return this.Items.find((Item) => Item.Extension === Extension)
		}



		private Index_GetNext(PreviousIndex?: Item.Type_Index): Item.Type_Index
		{
			return PreviousIndex === undefined ? 0 : PreviousIndex + 1
		}

		private Index_GetFilenameName(Index: Item.Type_Index): Type_FilenameName
		{
			return CodeToAlphabet.Get(Index, this.Alphabet)
		}



		private RemoveRecordsWithExpiredCache(): void
		{
			this.Items = this.GetRecordsWithValidCache()
		}

		private GetRecordsWithValidCache(): Item.Interface[]
		{
			if (this.CacheLifetimeInSeconds === undefined)
				return this.Items
			else
				return this.Items.filter((Item) => new Date().getTime() - Item.GenerationTime.getTime() < this.CacheLifetimeInSeconds)
		}
	}
}