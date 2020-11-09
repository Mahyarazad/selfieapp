(async ()=>{
  const response = await fetch('/username',{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });

  const user = await response.json()
  const elem = document.createElement('button');
  elem.id = "lusername";
  $("body").append(elem);
})();
