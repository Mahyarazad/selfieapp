async function getData(){


  const response = await fetch('/api/:uname');

  const data = await response.json();
  const list_items = data;

  const list_element = document.getElementById('list');
  const pagination_element = document.getElementById('pagination');
  let current_page = 1;
  let rows = 5;

  console.log(list_items);
  async function DisplayList (items, wrapper, rows_per_page, page) {
  	wrapper.innerHTML = "";
  	page--;

  	let start = rows_per_page * page;
  	let end = start + rows_per_page;

  	let paginatedItems = items.slice(start, end);

    for (let i = 0; i < paginatedItems.length; i++) {
  		let item = paginatedItems[i];

      const uname = document.createElement('div');
      uname.className = item.user_id;
      uname.id = "uname";
      uname.textContent = "Created by: " + item.uname;
      const root = document.createElement('div');
      root.id = "container";
      const checkbox = document.createElement('input')
      checkbox.id = "box" ;
      checkbox.type = "checkbox";
      checkbox.className = item.id;
      // checkbox.setAttribute("name",item.id);
      const mod = document.createElement('div');
      mod.className = "mod";
      const geolocation = document.createElement('div');
      geolocation.id = "geolocation";
      const date = document.createElement('div');
      date.id = "date";
      const image = document.createElement('img');
      image.id = "capturedImage";
      const space = document.createElement('br');
      space.id = "emptySpace";
      mod.textContent = item.mod;
      geolocation.textContent = item.lat + '° , ' + item.lon + '°';
      const datetostring = new Date(item.createdat).toLocaleString();
      date.textContent = 'Date: '+ datetostring;
      // const link = await fetch('/api/image/' + item.id);
      // const ImageBlob = await link.blob();
      // const objectURL = URL.createObjectURL(ImageBlob);
      // image.src = objectURL;
      // //image.src = "data:image/jpeg;base64," + image;
      // image.alt = "Picture to show the Mode";
      // wrapper.append(checkbox,uname,mod,geolocation,date,image,space);
      wrapper.append(checkbox,uname,mod,geolocation,date,space);
  	}
  };


  function SetupPagination (items, wrapper, rows_per_page) {
  	wrapper.innerHTML = "";

  	let page_count = Math.ceil(items.length / rows_per_page);

  	for (let i = 1; i < page_count + 1; i++) {

  		let btn = PaginationButton(i, items);
  		wrapper.appendChild(btn);

  	}


    let next = document.createElement('button');
    next.id = "next";
    let prev = document.createElement('button');
    prev.id = "prev"
    var s = document.getElementsByTagName('button')[0]
    prev.innerText = 'Previous';
    next.innerText = 'Next';
    wrapper.insertBefore(prev,s);
    wrapper.appendChild(next);

  }

  function PaginationButton (page, items) {
  	let button = document.createElement('button');
  	button.innerText = page;
    button.id = page;
  	if (current_page == page) button.classList.add('active');

  	button.addEventListener('click', function () {
  		current_page = page;
  		DisplayList(items, list_element, rows, current_page);

  		let current_btn = document.querySelector('.pagenumbers button.active');
  		current_btn.classList.remove('active');

  		button.classList.add('active');
  	});

  	return button;

  }

  function nextp (page,items,rows){
   let page_count = Math.ceil(items.length/rows);
   document.getElementById("next").addEventListener('click', () => {
     let page = document.querySelector(".active");
     if(parseInt(page.id) === page_count ){
     } else {
       current_page = parseInt(page.id) + 1;
   		 DisplayList(items, list_element, rows, current_page);
       page.classList.remove('active');
       let pop = document.getElementById(current_page);
       pop.classList.add('active');
      }
    });
  }

  function prevp (page,items){
    document.getElementById("prev").addEventListener('click', ()=> {
      let page = document.querySelector(".active");
      if (parseInt(page.id)===1){

      } else {
        current_page = parseInt(page.id) - 1;
        DisplayList(items, list_element, rows, current_page);
        page.classList.remove('active');
        let pop = document.getElementById(current_page);
        pop.classList.add('active');
       }
     });
  }

  DisplayList(list_items, list_element, rows, current_page);
  SetupPagination(list_items, pagination_element, rows);
  nextp(current_page,list_items,rows);
  prevp(current_page,list_items);
};
getData();
