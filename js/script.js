const module = {};

module.render = function(){
	
	// DOM generating
	
	const filter = document.getElementById('filter');
	const addButton = document.getElementById('addbutton');
	const addPostSubmit = document.getElementById('submit');
	const addBlock = document.getElementById('addblock');
	const posts = document.getElementById('posts');
	const reset = document.getElementById('reset');
	
	const formPush = document.querySelectorAll("[data-pushing]");
	const formFilters = document.querySelectorAll("[data-info]");
	
	let filteredArray = data.slice().reverse(), parameters, itemValue, itemObjKey, post, postImageLink, postImage, postHeader, postDate, postParagraph, monthes, pushedElem, validatedPushingElem;
	
	// Создаем шаблон новости
	
	post = document.createElement("li");
	postImageLink = document.createElement("a");
	postImage = document.createElement("img");
	postHeader = document.createElement("h1");
	postDate = document.createElement("span");
	postParagraph = document.createElement("p");
	
	postImageLink.className = "postimagelink"
	postImage.className = "postimage"
	
	post.appendChild(postImageLink);
	postImageLink.appendChild(postImage);
	post.appendChild(postHeader);
	post.appendChild(postDate);
	post.appendChild(postParagraph);
	
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
				
				posts.appendChild(node);
				if(item.image.thumbnail !== ""){
					node.querySelector(".postimage").setAttribute("src", item.image.thumbnail);
				}else{
					node.removeChild(node.querySelector(".postimagelink"))
				}
				
				node.querySelector("h1").textContent = item.title;
				node.querySelector("span").textContent = item.date;
				node.querySelector("p").textContent = item.text;
				
				item.categories.forEach(category => {
					let postReadmore = document.createElement("a");
					postReadmore.className = "more";
					postReadmore.textContent = category; 
					node.appendChild(postReadmore);
				})
				
			});
			
		}else{
			posts.innerHTML = "Nothing found";
		}
	}
	
	// вывод отрендеренных новостей при первой загрузке и добавлении
	
	let renderNews = function(){
		
		filteredArray = data.slice().reverse();
		renderData();
		
	}
	
	// добавление новой новости в модель (с последующим рендером на странице)
	
	let addPost = function(){
		
		validatedPushingElem = true;
		
		// Установка человеческих дней недели
		
		monthes=['January','Fabruary','Marth','April','May','June','July','August','September','October', 'November','December'];
		
		// строим первичный объект новости для модели
		
		pushedElem = {
		    "ID": (data.length+1).toString(),
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
				pushedElem[item.dataset.pushing] = item.value.toLowerCase().split(",").map(i => i.trim());
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
			addBlock.style.backgroundColor = "#8b0000";
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
	
	addButton.addEventListener("click", function(){
		addBlock.classList.toggle("hidden");
		this.classList.toggle("opened")
	});
	
	addPostSubmit.addEventListener("click", function(e){
		e.preventDefault();
		addPost();
	});
	
	reset.addEventListener("click", function(){
		renderNews()
	});
	
}