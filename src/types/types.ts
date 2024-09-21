export interface ITasks {
	id: number
	title: string
	isCompleted: boolean
}

export interface ICategories {
	id: number
	name: string
	tasks: ITasks[]
}