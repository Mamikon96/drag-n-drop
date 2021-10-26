
function DragDrop() {
	const START = 'start';
	const PROGRESS = 'progress';
	const DONE = 'done';

	let $container
	let index = 1;


	init();



	function init() {
		$container = createDOMContainer();
		
		const $header = getHeaderTemplate();
		appendToContainer($header);
	}

	function createDOMContainer() {
		const container = document.createElement('div');
		container.className = 'dragdrop';
		document.querySelector('.container').appendChild(container);
		return container;
	}

	function getHeaderTemplate() {
		const html = `
			<div class="col-header start w33">Начать</div>
			<div class="col-header progress w33">В процессе</div>
			<div class="col-header done w33">Готовы</div>
		`;
		const header = document.createElement('div');
		header.className = 'row';
		header.insertAdjacentHTML('afterbegin', html);

		return header;
	}

	function getItemTemplate(title, status = 'start', id = index) {
		title = title || `Task#${id}`;
		let html = `
			<div class="placeholder placeholder_start">
				${status === START
				? `<div class="item" data-item="${id}" draggable="true">${title}</div>`
				: ''
			}
			</div>
			<div class="placeholder placeholder_progress">
				${status === PROGRESS
				? `<div class="item" data-item="${id}" draggable="true">${title}</div>`
				: ''
			}
			</div>
			<div class="placeholder placeholder_done">
				${status === DONE
				? `<div class="item" data-item="${id}" draggable="true">${title}</div>`
				: ''
			}
			</div>
		`;
		let task = document.createElement('div');
		task.className = 'row';
		task.dataset.row = id;
		task.insertAdjacentHTML('afterbegin', html);

		return task;
	}

	function generateItem(template) {

		const item = template.querySelector('.item');
		const placeholders = item.parentElement.parentElement.querySelectorAll('.placeholder');
		let grabbedItem = null;

		item.addEventListener('dragstart', dragstart);
		item.addEventListener('dragend', dragend);

		for (const placeholder of placeholders) {
			placeholder.addEventListener('dragover', dragover);
			placeholder.addEventListener('dragenter', dragenter);
			placeholder.addEventListener('dragleave', dragleave);
			placeholder.addEventListener('drop', dragdrop);
		}

		function dragstart(event) {
			grabbedItem = event.target.dataset.item;
			event.target.classList.add('hold');
			setTimeout(() => event.target.classList.add('hide'), 0);
		}

		function dragend(event) {
			grabbedItem = null;
			event.target.classList.remove('hold');
			event.target.classList.remove('hide');
		}

		function dragover(event) {
			event.preventDefault();
		}

		function dragenter(event) {
			if (template.dataset.row === grabbedItem) {
				event.target.classList.add('hovered');
			} else {
				event.target.classList.add('hovered_deny');
			}
		}

		function dragleave(event) {
			if (template.dataset.row === grabbedItem) {
				event.target.classList.remove('hovered');
			} else {
				event.target.classList.remove('hovered_deny');
			}
		}

		function dragdrop(event) {
			if (template.dataset.row === grabbedItem) {
				event.target.classList.remove('hovered');
				event.target.append(item);
			} else {
				event.target.classList.remove('hovered_deny');
			}
		}
	}

	function appendToContainer(template) {
		$container.appendChild(template);
	}


	function createTaskElement(title, status) {
		let template = getItemTemplate(title, status, index++);
		generateItem(template);
		appendToContainer(template);
	}


	return {
		createTasks: function (tasks) {
			tasks = tasks || [];
			if (tasks instanceof Array) {
				for (let i = 0; i < tasks.length; i++) {
					createTaskElement(tasks[i]);
				}
			} else {
				createTaskElement(tasks);
			}
		}
	};
}

