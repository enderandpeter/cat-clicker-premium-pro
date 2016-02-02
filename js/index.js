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
				localStorage.cats = JSON.stringify({imgList: imgList, selected: 0});
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
        init: function() {
            model.init();
            listView.init();
			detailsView.init();
        }
	};
	
	var listView = {
		init: function(){
			this.catlist = document.querySelector('#catlist');	
			this.render();
		},
		render: function(){
			// Clear the list of cats
			for(var node = this.catlist.firstChild; node.nextSibling !== null; node = node.nextSibling){
				node.parent.removeChild(node);
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
		}
	};
	
	octopus.init();
});