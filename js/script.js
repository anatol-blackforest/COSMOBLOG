const Cosmomodule = {};

Cosmomodule.render = function(){
	
	// DOM generating
	
	const filter = document.getElementById('filter');
	const addButton = document.getElementById('addbutton');
	const addPostSubmit = document.getElementById('submit');
	const addBlock = document.getElementById('addblock');
	const posts = document.getElementById('posts');
	const reset = document.getElementById('reset');
	const modal = document.getElementById('modal');
	const datalist = document.getElementById('datalist');
	const categoriesListRender = document.getElementById('category-list-render');
	
	const formPush = document.querySelectorAll("[data-pushing]");
	const formFilters = document.querySelectorAll("[data-info]");
	
	const post = document.createElement("li");
	const postWrapper = document.createElement("div");
	const postImageLink = document.createElement("a");
	const postImage = document.createElement("img");
	const postHeader = document.createElement("h1");
	const postDate = document.createElement("span");
	const postParagraph = document.createElement("p");
	const postDelete = document.createElement("a");
	const postEdit = document.createElement("a");
	const formEdit = document.createElement("form");
	const titleEdit = document.createElement("input");
	const textEdit = document.createElement("textarea");
	const categoryEdit = document.createElement("input");
	const buttonEdit = document.createElement("button");
	const datalistOption = document.createElement("option");
	const catListItem = document.createElement("li");
	const catListText = document.createElement("h2");
	
	let filteredArray = data.slice().reverse(), parameters, itemValue, itemObjKey, monthes, pushedElem, validatedPushingElem, categoriesArr;
	
	// Создаем шаблон новости
	
	postImageLink.className = "postimagelink";
	postImage.className = "postimage";
	postDelete.className = "delete";
	postEdit.className = "edit";
	buttonEdit.className = "edit-button";
	formEdit.className = "hidden";
	postWrapper.className = "post-wrapper";
	
	titleEdit.name = "title-edit";
	textEdit.name = "text-edit";
	categoryEdit.name = "category-edit";
	
	buttonEdit.textContent = "submit";
	postEdit.textContent = "edit";
	postDelete.textContent = "x";
	
	post.appendChild(postImageLink);
	post.appendChild(postWrapper);
	postImageLink.appendChild(postImage);
	postWrapper.appendChild(postHeader);
	postWrapper.appendChild(postDate);
	postWrapper.appendChild(postParagraph);
	postWrapper.appendChild(postDelete);
	postWrapper.appendChild(postEdit);
	formEdit.appendChild(titleEdit);
	formEdit.appendChild(textEdit);
	formEdit.appendChild(categoryEdit);
	formEdit.appendChild(buttonEdit);
	post.appendChild(formEdit);
	catListItem.appendChild(catListText);
	
	// список категорий
	
	let categoriesList = function(){
		categoriesArr = [];
		data.forEach(item => {
			item.categories.forEach(i => {
				if(categoriesArr.indexOf(i) == -1 ){
					categoriesArr.push(i.toLowerCase())
				}
			})
		});
		categoriesListRender.innerHTML = "";
		datalist.innerHTML = "";
		categoriesArr.forEach((i, iter) => {
			let catItem = catListItem.cloneNode(true);
			let datalistItem = datalistOption.cloneNode(true);
			catItem.querySelector("h2").textContent = i;
			categoriesListRender.appendChild(catItem);
			datalistItem.textContent = i;
			datalistItem.value = i;
			datalist.appendChild(datalistItem);
		});
	}
	
	// Фильтруем новости. Модуль обходит и фильтрует как строки, так вложенные массивы и объекты в дате, выводя результат. 
	
	let filtering = function(propertyElem, property){
		if(propertyElem.value.trim().length > 0){
			filteredArray = filteredArray.filter(item => {
				itemValue = false
				if(typeof item[property] == 'string'){
					if(item[property].toLowerCase().indexOf(parameters[property]) !== -1){
						itemValue = true;
					}
				}else if(item[property] instanceof Array){
					item[property].map(i => {
						if(i.toLowerCase().indexOf(parameters[property]) !== -1){
							itemValue = true
						}
					});
				}else if(typeof item[property] == 'object'){
					for(itemObjKey in item[property]){
						if(item[property][itemObjKey].toLowerCase().indexOf(parameters[property]) !== -1){
							itemValue = true
						}
					}
				}
				return itemValue;
			});
			renderData();
		}
	}
	
	// рендер новостей
	
	let renderData = function(){
		
		posts.innerHTML = "";
		
		if(filteredArray.length > 0){
			filteredArray.forEach(item => {
				
				// слепок с шаблона новости
				
				let node = post.cloneNode(true);
				node.id = item.ID;
				posts.appendChild(node);
				if(item.image.thumbnail !== ""){
					node.querySelector(".postimage").setAttribute("src", item.image.thumbnail);
				}else{
					node.removeChild(node.querySelector(".postimagelink"))
				}
				node.querySelector("h1").textContent = item.title;
				node.querySelector("span").textContent = item.date;
				node.querySelector("p").textContent = item.text;
				node.querySelector("[name='title-edit']").value = item.title
				node.querySelector("[name='text-edit']").value = item.text
				node.querySelector("[name='category-edit']").value = item.categories.join()
				
				if(item.categories.length > 0){
					item.categories.forEach(category => {
						let postReadmore = document.createElement("a");
						postReadmore.className = "more";
						postReadmore.textContent = category; 
						node.querySelector(".post-wrapper").appendChild(postReadmore);
					})
				}
			});
		}else{
			posts.innerHTML = "Nothing found";
		}
		
	}
	
	// вывод отрендеренных новостей при первой загрузке и добавлении
	
	let renderNews = function(){
		filteredArray = data.slice().reverse();
		renderData();
		categoriesList();
	}
	
	// добавление новой новости в модель (с последующим рендером на странице)
	
	let addPost = function(){
		
		validatedPushingElem = true;
		
		// Установка человеческих дней недели
		
		monthes=['January','Fabruary','Marth','April','May','June','July','August','September','October', 'November','December'];
		
		// строим первичный объект новости для модели
		
		pushedElem = {
		    "ID": (data[data.length - 1].ID) + 1,
			"title": "",
			"date": `${monthes[(new Date()).getMonth()]} ${(new Date()).getDate()}, ${(new Date()).getFullYear()}`,
			"text": "",
			"image": {"thumbnail": "", "big-image": ""},
			"categories": []
		};
		
		// забиваем объект значениями с формы
		
		[...formPush].forEach(item => {
			if(item.dataset.pushing == "title" || item.dataset.pushing == "text"){
				pushedElem[item.dataset.pushing] = item.value.trim();
			}else if(item.dataset.pushing == "thumbnail" || item.dataset.pushing == "big-image"){
				pushedElem.image[item.dataset.pushing]  = item.value.trim();
			}else if(item.dataset.pushing == "categories" ){
				// предотвращаем дублирование категорий
				pushedElem[item.dataset.pushing] = item.value.toLowerCase().split(",").map(i => i.trim()).filter((value, index, arr) => arr.indexOf(value) == index);
			}
		});
		
		// валидируем отправку объекта в модель
		
		[...formPush].forEach(item => {
		    if(item.dataset.pushing !== "thumbnail" && item.dataset.pushing !== "big-image" && item.value.length == 0){
				validatedPushingElem = false
			};
		});
		
		if(validatedPushingElem){
		    data.push(pushedElem);
			addBlock.style.backgroundColor = "black";
			renderNews();
			addBlock.classList.toggle("hidden");
			addButton.classList.toggle("opened");
			[...formPush].forEach(item => {item.value = ""});
		}else{
			addBlock.style.backgroundColor = "#2B0206";
			alert("Заполните все поля формы!")
		}
		
	}
	
	// первый вывод
	
    renderNews();
	
	// фильтр
	
	filter.addEventListener("click",function(e){
		e.preventDefault();
		
		parameters = {};
		[...formFilters].map(item => {
			if(item.dataset.info){
				parameters[item.dataset.info] = item.value.trim().toLowerCase();
				filtering(item, item.dataset.info);
			}
		})
			
	});
	
	// поведение формы добавления новости
	
	addButton.addEventListener("click", function(e){
		e.preventDefault();
		addBlock.classList.toggle("hidden");
		this.classList.toggle("opened")
	});
	
	addPostSubmit.addEventListener("click", function(e){
		e.preventDefault();
		addPost();
	});
	
	reset.addEventListener("click", function(e){
		renderNews();
	});
	
	// манипуляции со статьями
	
	document.addEventListener("click",function(e){
		
		// удаление статей
		
		if(e.target.className == "delete"){
			data.forEach((item, index) => {
				if(item.ID == e.target.closest("li").id){
					data.splice(index, 1);
				}
			});
			renderNews();
		}
		
		// редактирование статей

		if(e.target.className == "edit"){
			e.target.parentNode.classList.toggle("hidden");
			e.target.closest("li").querySelector("form").classList.toggle("hidden");
		}	
		
		if(e.target.className == "edit-button"){
			e.preventDefault();
			
			data.forEach((item, index) => {
				if(item.ID == e.target.closest("li").id){
					data[index].title = e.target.closest("form").querySelector("[name='title-edit']").value;
					data[index].text = e.target.closest("form").querySelector("[name='text-edit']").value;
					if(e.target.closest("form").querySelector("[name='category-edit']").value.trim().length > 0){
						data[index].categories = e.target.closest("form").querySelector("[name='category-edit']").value.toLowerCase().split(",").map(i => i.trim()).filter((value, index, arr) => arr.indexOf(value) == index);
					}else{
						data[index].categories = []
					}
					
				}
			});
			
			renderNews();
			e.target.closest("form").classList.toggle("hidden");
			e.target.closest("li").querySelector(".post-wrapper").classList.toggle("hidden");
			
		}
		
		// большое изображение по клику
		
		if(e.target.className == "postimage"){
			modal.classList.toggle("hidden");
			data.forEach(item => {
				if(item.ID == e.target.closest("li").id){
					modal.querySelector("div img").setAttribute("src", item.image["big-image"]);
				}
			})
		}
		
	});
	
	// модальное окно
	
	modal.addEventListener("click",function(){
		modal.classList.toggle("hidden");
	});
	
	modal.querySelector("div > img").addEventListener("click",function(e){
		e.stopPropagation();
	}, true);
	
}