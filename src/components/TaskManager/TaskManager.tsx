import React, {ReactElement } from 'react';
import Categories from '../Categories/Categories';
import Tasks from '../Tasks/Tasks';
import styles from './taskManager.module.css'
import {ICategories } from '../../types/types';



//Note: есть массив-объектов категорий, в каждой категории есть массив задач этой категории, отрисовывать задачи будем по назаванию категории (при клике на нужную категорию ищем объект с названием этой категории и отрисовываем массив задач)


const TaskManager = (): ReactElement => {
	const [categories, setCategories] = React.useState<ICategories[]>([])

	const [nameCategory, setNameCategory] = React.useState<string>('')

	return (
		<div className={styles.taskManager}>
			<Categories categories = {categories} setCategory = {setCategories} setNameOfCategory={setNameCategory}/>
			<Tasks category = {nameCategory} categories = {categories} setCategory = {setCategories} />
		</div>
	);
}
 
export default TaskManager;