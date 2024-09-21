import React, { FC } from 'react';
import styles from './modal.module.css'
import { ICategories } from '../../types/types';

type TErrorMessage = 'Длина задачи должна быть 3-150 символов'

interface IError {
	message: TErrorMessage | ''
	isError: boolean
}


interface IModalTasksProps {
	categoryName: string
	setCategory: React.Dispatch<React.SetStateAction<[] | ICategories[]>>
	isModal: React.Dispatch<React.SetStateAction<boolean>>
	taskId: React.MutableRefObject<number>
}

export const ModalTasks: FC<IModalTasksProps> = ({categoryName, setCategory, isModal, taskId}) => {
	const modalInput = React.useRef<HTMLInputElement | null>(null)
	const [error, setIsError] = React.useState<IError>({
		message: '',
		isError: false
	})


	function nameValidate(value: string): boolean {
		const taskName: RegExp =  /^(?=.{3,150}$).+$/
		return taskName.test(value)
	}



	function addTask(task: string) {
		setCategory(prevState => {
			const selectedCategory = prevState.find(item => item.name === categoryName)
			const updatedCategories = prevState.map(item => {
				if (item.id === selectedCategory?.id) {
					return {
						...item,
						tasks: [
							...item.tasks,
							{
								id: taskId.current++,
								title: task,
								isCompleted: false,
							},
						],
					}
				}
				return item
			})
			return updatedCategories
		})
	}


	function handleClick() {
		const taskName: string = modalInput.current?.value ?? ''

		if(!nameValidate(taskName)){
			setIsError({
				message: 'Длина задачи должна быть 3-150 символов',
				isError: true
			})
			return
		}

		addTask(taskName)
		isModal(false) 
	}


	return (
		<form className={styles.modal}>
			<label className={styles.title} htmlFor='task'>Введите задачу: </label>
			<input type="text" 
				placeholder = 'Название задачи: ' 
				name='task' 
				required
				ref = {modalInput}
			/>
			{error.isError ? <p className={styles.incorrectValue}>{error.message}</p> : null}
			<button type='button' onClick={handleClick}>save</button>
		</form>
	);
}

