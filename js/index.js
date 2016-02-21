document.addEventListener('DOMContentLoaded', function(event){
	var model = {
		init: function(){
			if(!localStorage.cats){
				var imgList = [];
				var imgNames = ['Fluffy', 'Wuffy', 'Stuffy', 'Puffy', 'Buffy'];
				for(var i = 0; i < 5; i++){
					var clicks = 0;
					var src = 'images/' + (i + 1) + '.jpg';

					imgListObj = {
						imageSrc: src,
						name: imgNames[i],
						clicks: 0
					};
					imgList.push(imgListObj);
				}

				var modelData = {
					imgList: imgList, 
					selected: 0,
					adminOn: false
				};
				localStorage.cats = JSON.stringify(modelData);
			}
		},
        getCatlist: function() {
            return JSON.parse(localStorage.cats).imgList;
        },
		getSelected: function(){
			return JSON.parse(localStorage.cats).selected;
		},
		addClick: function(index){
			var data = JSON.parse(localStorage.cats);
			data.imgList[index].clicks++;
			localStorage.cats = JSON.stringify(data);
		},
		setSelected: function(index){
			var data = JSON.parse(localStorage.cats);
			data.selected = index;
			localStorage.cats = JSON.stringify(data);
		},
		isAdminOn: function(){
			var data = JSON.parse(localStorage.cats);
			return data.adminOn;
		},
		toggleAdmin: function(toggle){
			var data = JSON.parse(localStorage.cats);
			
			if(toggle !== undefined){
				data.adminOn = !!toggle;
			} else {
				data.adminOn = !data.adminOn;
			}
			localStorage.cats = JSON.stringify(data);
			return data.adminOn;
		},
		saveCat: function(index, newCat){
			var data = JSON.parse(localStorage.cats);			
			var cat = data.imgList[index];
			cat.name = newCat.name;
			cat.imageSrc = newCat.imageSrc;
			cat.clicks = newCat.clicks;
			data.imgList[index] = cat;
			
			localStorage.cats = JSON.stringify(data);
			return cat;
		}
	};
	
	var octopus = {
        getCats: function() {
            return model.getCatlist();
        },
		addClick: function(catIndex){
			model.addClick(catIndex);
			detailsView.render();
		},
		getClicks: function(catIndex){
			return model.getCatlist()[catIndex].clicks;
		},
		getSelected: function(){
			return model.getSelected();
		},
		setSelected: function(index){
			return model.setSelected(index);
		},
		toggleAdmin: function(toggle){
			return model.toggleAdmin(toggle);
		},
		isAdminOn: function(){
			return model.isAdminOn();
		},
		saveCat: function(index, cat){
			return model.saveCat(index, cat);
		},
        init: function() {
            model.init();
            listView.init();
			detailsView.init();
			adminView.init();
        }
	};
	
	var listView = {
		init: function(){
			this.catlist = document.querySelector('#catlist');	
			this.render();
		},
		render: function(){
			// Clear the list of cats
			while(this.catlist.firstChild){
				this.catlist.removeChild(this.catlist.firstChild);
			}
						
			octopus.getCats().forEach(function(cat, index){
				var catlistItem = document.createElement('li');
				catlistItem.textContent = cat.name;
				
				catlistItem.addEventListener('click', function(event){
					octopus.setSelected(index);
					detailsView.render();
				});

				this.catlist.appendChild(catlistItem);
			});
		}
	};
	
	var detailsView = {
		init: function(){			
			this.catdetails = document.querySelector('#catdetails');
			this.catname = document.querySelector('#catname');
			this.catclicks = document.querySelector('#catclicks');
			this.catimage = new Image();
			
			this.catimage.addEventListener('click', function(event){
				octopus.addClick(octopus.getSelected());
			});
			
			this.render();
		},
		render: function(){
			var selectedIndex = octopus.getSelected();
			this.selectedCat = octopus.getCats()[selectedIndex];
			
			this.catimage.id = 'catimage-' + selectedIndex;
			this.catimage.className = 'catimage';
			this.catname.textContent = this.selectedCat.name;
			this.catimage.src = this.selectedCat.imageSrc;
			
			this.catclicks.textContent = octopus.getClicks(selectedIndex);

			var currentImage = document.querySelector('#catdetails > img');

			if(currentImage){
				this.catdetails.replaceChild(this.catimage, currentImage);
			} else {
				this.catdetails.appendChild(this.catimage);
			}
			
			adminView.render();
		}
	};
	
	var adminView = {
		init: function(){
			var selectedIndex = octopus.getSelected();
			var selectedCat = octopus.getCats()[selectedIndex];
			
			this.adminform = document.querySelector('#adminform');
			this.adminButton = document.querySelector('#adminButton');
			
			this.nameinput = document.querySelector('#nameinput');
			this.urlinput = document.querySelector('#urlinput');
			this.clicksinput = document.querySelector('#clicksinput');
			
			this.save = document.querySelector('#save');
			this.cancel = document.querySelector('#cancel');
			
			this.save.addEventListener('click', function(event){
				event.preventDefault();

				var newCat = {
					name: adminView.nameinput.value,
					imageSrc: adminView.urlinput.value,
					clicks: adminView.clicksinput.value
				};
				
				octopus.saveCat(octopus.getSelected(), newCat);
				listView.render();
				detailsView.render();
				adminView.render();
			});
			
			this.cancel.addEventListener('click', function(event){
				event.preventDefault();
				
				octopus.toggleAdmin(false);
				adminView.render();
			});
			
			this.adminButton.addEventListener('click', function(event){
				octopus.toggleAdmin();
				adminView.render();
			});
			
			this.render();
		},
		render: function(){
			var selectedIndex = octopus.getSelected();
			var selectedCat = octopus.getCats()[selectedIndex];
			
			this.nameinput = document.querySelector('#nameinput');
			this.urlinput = document.querySelector('#urlinput');
			this.clicksinput = document.querySelector('#clicksinput');
			
			if(octopus.isAdminOn()){
				adminform.style.display = 'block';
				
				this.nameinput.value = selectedCat.name;
				this.urlinput.value = selectedCat.imageSrc;
				this.clicksinput.value = selectedCat.clicks;
				
			} else{
				adminform.removeAttribute('style');
			}
		}
	};
	
	octopus.init();
});