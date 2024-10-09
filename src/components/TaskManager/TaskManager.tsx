import React, {ReactElement } from 'react';
import { useImmer } from 'use-immer';
import {MemoizedCategories as Categories} from '../Categories/Categories';
import Tasks from '../Tasks/Tasks';
import styles from './taskManager.module.css'
import {ICategories } from '../../types/types';



//Note: есть массив-объектов категорий, в каждой категории есть массив задач этой категории, отрисовывать задачи будем по назаванию категории (при клике на нужную категорию ищем объект с названием этой категории и отрисовываем массив задач)


const TaskManager = (): ReactElement => {
	// const [categories, setCategories] = React.useState<ICategories[]>([])
	const [categories, updateCategories] = useImmer<ICategories[]>([{id: 0, name: 'Completed', tasks:[]}])
	const [nameCategory, setNameCategory] = React.useState<string>('')

	return (
		<div className={styles.taskManager}>
			<Categories categories = {categories} setCategory = {updateCategories} setNameOfCategory={setNameCategory}/>
			<Tasks category = {nameCategory} categories = {categories} setCategory = {updateCategories} />
		</div>
	);
}
 
export default TaskManager;