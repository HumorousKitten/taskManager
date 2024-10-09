import React, { FC } from 'react'
import { ICategories, ITasks } from '../../types/types'
import { Button } from '../button/Button'
import { ModalTasks } from '../Modal/ModalTasks'
import styles from './tasks.module.css'
import { Updater } from 'use-immer'

interface ITasksProps {
	category: string
	categories: ICategories[]
	setCategory: Updater<ICategories[]>
}

const Tasks: FC<ITasksProps> = React.memo(({ category, categories, setCategory }) => {
	const [isModal, setIsModal] = React.useState<boolean>(false)
	const TASK_ID = React.useRef<number>(0)

	console.log(categories)
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
		const allNecessaryTask = necessaryCategory.tasks.filter(
			item => item.id !== deletedTask?.id
		)

		setCategory(draft => {
				const tmpCategory = draft.find(item => item.id === necessaryCategory.id)
				if(tmpCategory) {
					tmpCategory.tasks = allNecessaryTask
				}
			}
		)
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

		const necessaryCategory = searchCategory(category, categories) as ICategories

		function handleEdit(e: KeyboardEvent) {
			if (e.key === 'Enter') {
				if (nameTaskValidate(taskName.textContent ?? '')){
					setCategory(draft => {
						const category = draft.find(item => item.id === necessaryCategory.id)
						if(category){
							const willEditedTask = searchTaskById(+idTask, category.tasks as ITasks[])
							if(willEditedTask) willEditedTask.title = taskName.textContent as string
							category.tasks = category.tasks.map((item) => item.id === willEditedTask?.id ? willEditedTask : item)
						}
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
		const necessaryCategory = searchCategory(category, categories) as ICategories

		setCategory(draft => {
			const category = draft.find(item => item.id === necessaryCategory.id)
			const willCompletedTask = searchTaskById(+idTask, category?.tasks as ITasks[])
			if(willCompletedTask) {
				willCompletedTask.isCompleted = true
			}
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
					: category ? categories.map((categoryItem) => (
						categoryItem.tasks.map(tasks => tasks.isCompleted ? <li key={tasks.id}>{tasks.title}</li> : null)
					)) : null}
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
}, memoizedTasks)

function memoizedTasks(prevProps: ITasksProps, nextProps: ITasksProps): boolean{
	if(prevProps.category !== nextProps.category)
		return false
	if((prevProps.categories.length < nextProps.categories.length || prevProps.categories.length > nextProps.categories.length))
		return false
	if(JSON.stringify(prevProps.categories) !== JSON.stringify(nextProps.categories))
		return false
	return true
}


export default Tasks
