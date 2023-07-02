import { ReadFile, Type_AbsoluteFolderPath, Type_Filename, Type_FilenameExtension, Type_FilenameName, Type_Path, WriteFile } from '../../../Library/Code/Node.js/Source/FileSystem'
import { Item } from './Item'
import { Map } from './Map'



export namespace FilenamesMinimizer
{
	interface Interface
	{
		'Directory': Type_AbsoluteFolderPath
		'Alphabet'?: Map.Type_Alphabet
	}



	export class Class
	{
		private Map: Map.Class
		private Directory: Type_AbsoluteFolderPath



		constructor(Argument: Interface)
		{
			this.Directory = Argument.Directory
			this.Init(Argument.Alphabet)
		}



		private async Init(Alphabet?: Map.Type_Alphabet): Promise<void>
		{
			const Items: Item.Interface[] = await this.Get()

			this.Map = new Map.Class
			({
				'Items': Items,
				'OnChange': () => { this.Set() },
				'Alphabet': Alphabet
			})
		}



		GetFilename(ItemHash: Item.Type_Hash, FilenameExtension: Type_FilenameExtension): Type_Filename
		{
			return this.Map.GetFilename(ItemHash, FilenameExtension)
		}



		private async Get(): Promise<Item.Interface[]>
		{
			const Fallback: Item.Interface[] = []

			const File: string | undefined = await ReadFile(this.GetPath())



			if (File)
			{
				try
				{
					return JSON.parse(File)
				}
				catch (Error)
				{
					return Fallback
				}
			}
			else
			{
				return Fallback
			}

		}

		private Set(): void
		{
			const Value = this.Map.GetItems()

			const Text = JSON.stringify(Value)

			WriteFile(this.GetPath(), Text)
		}



		private GetPath(): Type_Path
		{
			const FilenameName: Type_FilenameName = 'FilenameMinimizerMap'
			const Filename: Type_Filename = FilenameName + '.json'

			const Path: Type_Path = this.Directory + Filename

			return Path
		}
	}
}