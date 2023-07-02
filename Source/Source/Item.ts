import { Type_FilenameExtension } from '../../Library/Code/Node.js/Source/FileSystem'



export namespace Item
{
	export type Type_Index = number
	export type Type_Hash = string
	export type Type_Extension = Type_FilenameExtension
	export type Type_GenerationTime = Date



	export interface Interface
	{
		'Index': Type_Index
		'Hash': Type_Hash
		'Extension': Type_Extension
		'GenerationTime': Type_GenerationTime
	}
}