$('#btn1').on('click', ()=>{
  $('div.list div#geolocation').toggle();
});

$('#btn1').on('click', ()=>{
  $('div.list img#capturedImage').toggle();
});

$("#hide").click(()=>{
    $(":checkbox").toggle(()=>{
      // $(":checkbox").attr('checked','checked');
      $(this).val('uncheck all');
  });
});

$("#all").click(()=>{
  $('input:checkbox').each(function () { this.checked = !this.checked; });
});


let {uid} = $.ajax({ url: '/uid' ,type: 'GET',async: false}).responseJSON;

function recordloop(x){
  let rlist = []
  for (let i = 0 ;  i < x.length ; i++ ){
    rlist.push($(x[i]).attr('class').toString());
  };
  return rlist
}

function userloop(x){
  let ulist = [];
  x.forEach(elm =>ulist.push(parseInt($("." + elm ).next().attr('class'))));
  return ulist
}

let checkuser = [];
let dellist = [];

$(document).on("change", "input:checkbox", function () {
  const checked = recordloop($("input:checkbox"));
  const unchecked = recordloop($("input:checkbox:not(:checked)"));
  dellist = checked.filter(value => !unchecked.includes(value))
  checkuser = userloop(dellist);

});

$(document).ready(()=>{

  setTimeout(()=>{

    function deleteRecord(record){
      $.ajax({
        type:'DELETE',
        url: '/api/'+ record,
        dataType:'json',
        data: {id : record},
        success: function(response){
            window.location.href='https://selfiefaceapi.herokuapp.com/logs/';
        },
        error: function(err){
          console.log(err);
        }
      });
    }

    $("#del").click(()=>{

      checkuser = checkuser.filter( e => e !== uid);

      if (dellist.length == 0) {
        alert('Noting Selected!');
        return
      } else {
        if (checkuser.length == 0) {
          let r = confirm("Confrim Delete!");
            if (r == true) {
              dellist.forEach(deleteRecord);
            } else {
              return
            }
          $("input:checkbox").prop('checked', false);
          if (dellist.length == 1){
            alert('Post Deleted!');
          } else {
            alert('Posts Deleted!');
          }
          dellist = [];
          checkuser = [];
        } else {
          alert('You can only Detele Your Posts!');
          $("input:checkbox").prop('checked', false);
          dellist = [];
          checkuser = [];
        }
      }
    });
  },
  500);
  return

});
