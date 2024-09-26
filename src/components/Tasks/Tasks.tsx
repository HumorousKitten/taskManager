import React, { FC } from 'react'
import { ICategories, ITasks } from '../../types/types'
import { Button } from '../button/Button'
import { ModalTasks } from '../Modal/ModalTasks'
import styles from './tasks.module.css'

interface ITasksProps {
	category: string
	categories: ICategories[]
	setCategory: React.Dispatch<React.SetStateAction<ICategories[]>>
}

const Tasks: FC<ITasksProps> = React.memo(({ category, categories, setCategory }) => {
	const [isModal, setIsModal] = React.useState<boolean>(false)
	const TASK_ID = React.useRef<number>(0)
	const completeTask = React.useRef<ITasks[]>([])

	function searchTaskById(id: number, task: ITasks[]) {
		return task.find(task => task.id === id)
	}

	function searchCategory(name: string, categories: ICategories[]) {
		return categories.find(item => item.name === name)
	}

	function removeTask(e: React.MouseEvent<HTMLImageElement>) {
		const target = e.target as HTMLImageElement
		const parentLi = target.closest('li')

		if (!parentLi) return

		const idTask = parentLi.querySelector('span:first-child')?.textContent ?? ''

		const necessaryCategory = searchCategory(
			category,
			categories
		) as ICategories

		const deletedTask = searchTaskById(+idTask, necessaryCategory.tasks)

		setCategory(prev => {
			const allNecessaryTask = necessaryCategory.tasks.filter(
				item => item.id !== deletedTask?.id
			)
			necessaryCategory.tasks = allNecessaryTask
			return prev.filter(item => {
				if (item.id === necessaryCategory.id) return necessaryCategory
				return item
			})
		})
	}

	function nameTaskValidate(value: string): boolean {
		const taskName: RegExp = /^(?=.{3,30}$).+$/
		return taskName.test(value)
	}

	function editTask(e: React.MouseEvent<HTMLImageElement>) {
		const target = e.target as HTMLImageElement
		const parentLi = target.closest('li')

		if (!parentLi) return

		const idTask = parentLi.querySelector('span:first-child')?.textContent ?? ''
		const taskName = parentLi.querySelector(
			'span:last-child'
		) as HTMLSpanElement
		taskName?.setAttribute('contenteditable', 'true')
		const necessaryCategory = searchCategory(
			category,
			categories
		) as ICategories
		const editedTask = searchTaskById(+idTask, necessaryCategory.tasks)
		if (!editedTask) return

		function handleEdit(e: KeyboardEvent) {
			if (e.key === 'Enter') {
				if (nameTaskValidate(taskName.textContent ?? '')){
					if (editedTask) editedTask.title = taskName.textContent as string
					let index = necessaryCategory.tasks.findIndex(
						item => item.id === editedTask?.id
					)
					necessaryCategory.tasks[index] = editedTask as ITasks
					setCategory(prev => {
						index = prev.findIndex(item => item.id === necessaryCategory.id)
						prev[index] = necessaryCategory
						return Array.from(prev)
					})
					taskName?.setAttribute('contenteditable', 'false')
				}
			}
		}

		taskName?.addEventListener('keydown', handleEdit)
	}

	function taskCompleted(e: React.MouseEvent) {
		const target = e.target as HTMLImageElement
		const parentLi = target.closest('li')
		if (!parentLi) return

		const idTask = parentLi.querySelector('span:first-child')?.textContent ?? ''
		const necessaryCategory = searchCategory(
			category,
			categories
		) as ICategories
		const completedTask = searchTaskById(+idTask, necessaryCategory.tasks)
		if (!completedTask) return
		completedTask.isCompleted = true
		completeTask.current.push(completedTask)
		let index = necessaryCategory.tasks.findIndex(
			item => item.id === completedTask.id
		)
		necessaryCategory.tasks[index] = completedTask

		setCategory(prev => {
			index = prev.findIndex(item => item.id === necessaryCategory.id)
			prev[index] = necessaryCategory
			return Array.from(prev)
		})
	}

	return (
		<div className={styles.tasks}>
			{category ? (
				<h1>Ваши задачи в категории: {category}</h1>
			) : (
				<h1>Выберите категорию!</h1>
			)}

			<ul className={styles.list}>
				{category && category !== 'Completed'
					? categories
							.find(item => item.name === category)
							?.tasks.map(item =>
								!item.isCompleted ? (
									<li key={item.id}>
										<div className={styles.titleInList}>
											<span className={styles.invisible}>{item.id}</span>
											<input type='checkbox' onClick={taskCompleted} />
											<span>{item.title}</span>
										</div>
										<div className={styles.useFullIcons}>
											<img
												src='/deleteIcon.svg'
												alt='deleteIcon'
												width='24'
												height='24'
												onClick={removeTask}
											/>
											<img
												src='/editIcon.svg'
												alt='editIcon'
												width={24}
												height={24}
												onClick={editTask}
											/>
										</div>
									</li>
								) : null
							)
					: completeTask.current ? completeTask.current.map((completedTask) => <li key={completedTask.id}>{completedTask.title}</li>) : null}
			</ul>

			<div className={styles.addCategory}>
				{isModal ? (
					<ModalTasks
						categoryName={category}
						setCategory={setCategory}
						isModal={setIsModal}
						taskId={TASK_ID}
					/>
				) : null}

				{category ? (
					<Button type='button' onClickFunc={setIsModal} valueFunc={true}>
						Добавить задачу
					</Button>
				) : null}
			</div>
		</div>
	)
})

export default Tasks
