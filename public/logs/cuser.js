
(async ()=>{
  const response = await fetch('/username',{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  const user = await response.json()
  const elem = document.createElement('div');
  elem.id = "lusername";
  elem.textContent = "Logged-in as " + user.user;
  document.body.appendChild(elem);

})();
