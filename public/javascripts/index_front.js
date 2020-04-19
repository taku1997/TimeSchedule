'use strict';
/*
function changeImg1(user,creater){
  console.log(user)
  if (user === creater || creater === '' ){
    $('#testModal').modal('show');
  }
}*/

$("#testModal").on('show.bs.modal',function(event){
  var link = $(event.relatedTarget);
  var vertical = link.data("vertical");
  var side = link.data("side");
  var x = link.data("infox");
  var y = link.data("infoy");
  var band = link.data("band");
  var person = link.data("person");

  var modal = $(this);
  modal.find('.modal-title').text(`コマ投稿フォーム ${vertical}：${side}`);
  $("#x").val(x);
  $("#y").val(y);
  modal.find('.modal-body input#band_name').val(band); //inputタグにも表示
  modal.find('.modal-body input#responsible_person').val(person);
  if(!band || !person){
    $("#decision").val("empty");
  }else{
    $("#decision").val("full");
  }
});

$('#form').submit(function() {
  var r = $('input[name="select"]:checked').val();
    if (!r) {alert('空白で入力されていますよ'); return false;}
    if (r == 'send'){
      if ($.trim($("#band_name").val()) === "" || $.trim($("#responsible_person").val()) === "") {
        alert('空白で入力されていますよ');
        return false;
      }
    }else if(r == 'pass'){
      if($("#decision").val() === "empty"){
        alert('もともとコマが空いています');
        return false;
      }
    }
});