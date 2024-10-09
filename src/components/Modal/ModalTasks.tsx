import React, { FC } from 'react';
import styles from './modal.module.css'
import { ICategories } from '../../types/types';
import { Updater } from 'use-immer'

type TErrorMessage = 'Длина задачи должна быть 3-30 символов'

interface IError {
	message: TErrorMessage | ''
	isError: boolean
}


interface IModalTasksProps {
	categoryName: string
	setCategory: Updater<ICategories[]>
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
		const taskName: RegExp =  /^(?=.{3,30}$).+$/
		return taskName.test(value)
	}


	
	function addTask(task: string) {
		setCategory(draft => {
			const selectedCategory = draft.find(item => item.name === categoryName)
			selectedCategory?.tasks.push({
				id: taskId.current++,
				title: task,
				isCompleted: false
			})
		})
	}


	function handleClick() {
		const taskName: string = modalInput.current?.value ?? ''

		if(!nameValidate(taskName)){
			setIsError({
				message: 'Длина задачи должна быть 3-30 символов',
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

