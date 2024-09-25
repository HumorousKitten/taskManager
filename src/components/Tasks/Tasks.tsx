import React, { FC } from 'react'
import { ICategories, ITasks } from '../../types/types'
import { ModalTasks } from '../Modal/ModalTasks'
import styles from './tasks.module.css'
import { Button } from '../button/Button'



interface ITasksProps {
	category: string
	categories: ICategories[]
	setCategory: React.Dispatch<React.SetStateAction<ICategories[]>>
}


const Tasks: FC<ITasksProps> = ({ category, categories, setCategory }) => {
	const [isModal, setIsModal] = React.useState<boolean>(false)

	const TASK_ID = React.useRef<number>(0)
	const taskTextContent = React.useRef<HTMLSpanElement | null>(null)


	function searchTaskById(id: number, task: ITasks[]) {
		return task.find(task => task.id === id)
	}

	function searchCategory(name: string, categories: ICategories[]) {
		return categories.find((item) => item.name === name)
	}

	function removeTask(e: React.MouseEvent<HTMLImageElement>) {
		const target = e.target as HTMLImageElement;
 		const parentLi = target.closest('li');

		if (!parentLi) return
	
		const idTask = parentLi.querySelector('span:first-child')?.textContent ?? ''

		const necessaryCategory = searchCategory(category, categories) as ICategories

		const deletedTask = searchTaskById(+idTask, necessaryCategory.tasks)

		setCategory((prev) => {
			const allNecessaryTask = necessaryCategory.tasks.filter((item) => item.id !== deletedTask?.id)
			necessaryCategory.tasks = allNecessaryTask
			return prev.filter((item) => {
				if(item.id === necessaryCategory.id)
					return necessaryCategory
				return item
			})
		})
	}

	function nameTaskValidate(value: string): boolean {
		const taskName: RegExp =  /^(?=.{3,30}$).+$/
		return taskName.test(value)
	}


	function editTask(e: React.MouseEvent<HTMLImageElement> ) {
		const taskName = taskTextContent.current
		taskName?.setAttribute('contenteditable', 'true')

		function handleEdit(e: KeyboardEvent) {
			if (e.key === 'Enter') {
				
			}
		};
	
		taskName?.addEventListener('keydown', handleEdit)


		// Добавляем обработчик событий
		// const necessaryCategory = searchCategory(category, categories) as ICategories

		// const editedTask = searchTaskById(+idTask, necessaryCategory.tasks)



		// setCategory((prev) => {
		// 	const allNecessaryTask = necessaryCategory.tasks.filter((item) => item.id !== editedTask?.id)
		// 	necessaryCategory.tasks = allNecessaryTask
		// 	return prev.filter((item) => {
		// 		if(item.id === necessaryCategory.id)
		// 			return necessaryCategory
		// 		return item
		// 	})
		// })
	}



	return (
		<div className={styles.tasks}>
			{category ? <h1>Ваши задачи в категории: {category}</h1> : <h1>Выберите категорию!</h1>}

			<ul className={styles.list}>
				{category
					? categories
							.find(item => item.name === category)
							?.tasks.map(item => 
							<li key={item.id}>
								<div className={styles.titleInList} >
									<span className={styles.invisible}>{item.id}</span>
									<input type="checkbox" />
									<span ref={taskTextContent}>{item.title}</span>
								</div>
								<div className={styles.useFullIcons}>
									<img 
										src="/deleteIcon.svg" 
										alt="deleteIcon" 
										width='24' 
										height='24'
										onClick={removeTask}
									/>
									<img 
										src="/editIcon.svg" 
										alt="editIcon" 
										width={24} 
										height={24}
										onClick = {editTask}
									/>
								</div>
							</li>)
					: null}
			</ul>

			<div className={styles.addCategory}>
				{isModal ? (
					<ModalTasks
						categoryName = {category}
						setCategory={setCategory}
						isModal={setIsModal}
						taskId={TASK_ID}
					/>
				) : null}

				{category ? <Button 
					type='button' 
					onClickFunc={setIsModal} 
					valueFunc = {true}
					>
						Добавить задачу
				</Button> : null}
			</div>
		</div>
	)
}

export default Tasks
