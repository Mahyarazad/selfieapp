
(async ()=>{
  const response = await fetch('/username',{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });

  const user = await response.json()
  const elem = document.createElement('button');
  const sw = document.createElement('button');
  elem.id = "lusername";
  elem.textContent = user.user;
  sw.id = "switch";
  sw.textContent = "Show All"
  $("body").append(elem,sw);

  $.getScript('log.js', function()
    {
        // script is now loaded and executed.
    });
  $("#lusername").click(()=>{
    $.getScript('ulog.js', function()
      {
          // script is now loaded and executed.

      });
    });
  $("#switch").click(()=>{
    $.getScript('log.js', function()
      {
          // script is now loaded and executed.

      });
    });
})();
