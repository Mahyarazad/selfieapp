(async ()=>{
  const response = await fetch('/username',{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });

  const user = await response.json()
  const elem = document.createElement('a');
  elem.id = "lusername";
  elem.text = user.user;
  elem.href = "https://selfiefaceapi.herokuapp.com/logs/"
  $("body").append(elem);
})();
