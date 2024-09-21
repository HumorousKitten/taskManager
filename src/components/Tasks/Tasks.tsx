import React, { FC } from 'react'
import { ICategories } from '../../types/types'
import { ModalTasks } from '../Modal/ModalTasks'
import styles from './tasks.module.css'
import { Button } from '../button/button'

interface ITasksProps {
	category: string
	categories: ICategories[]
	setCategory: React.Dispatch<React.SetStateAction<ICategories[]>>
}

const Tasks: FC<ITasksProps> = ({ category, categories, setCategory }) => {
	const [isModal, setIsModal] = React.useState<boolean>(false)
	const TASK_ID = React.useRef<number>(0)

	return (
		<div className={styles.tasks}>
			<h1>Ваши задачи в категории: {category}</h1>
			<ul className={styles.list}>
				{category
					? categories
							.find(item => item.name === category)
							?.tasks.map(item => <li key={item.id}>{item.title}</li>)
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

				<Button 
					type='button' 
					onClickFunc={setIsModal} 
					valueFunc = {true}
					>
						Добавить задачу
				</Button>
			</div>
		</div>
	)
}

export default Tasks
