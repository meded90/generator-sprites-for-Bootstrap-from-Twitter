$(document).ready(function(){

//    ZeroClipboard.setMoviePath('./js/zeroclipboard/ZeroClipboard.swf');
//    var clip = new ZeroClipboard.Client();
//    clip.setText('Этот теSDFAкст окажется в буфере');
//    clip.glue('copiedMemory');
//    clip.setHandCursor(true);
    $("#copiedMemory").zclip({
        path: "./js/zclip/ZeroClipboard.swf",
        copy:function(){
            return  $('#styleCode-box').html()
        },
        afterCopy:function(){
            $.jGrowl("Стили скопированы");
        }
    });
    $("#copiedMemory").zclip('hide')
    prettyPrint()

    $(".text span").fitText(2, { minFontSize: '15px'})

//    $("#nameStyle").valid8({
//        'regularExpressions': [
//            { expression: /\s/g, errormessage: function(){
//                $.jGrowl("Название файлов должно быть только латинницей");
//            }}
//            ]
//});

//    var blob = new Blob(['body { color: red; }'], {type: 'text/css'});
//    $('#downloadStyle').attr('href',blob)
//    console.log(window.URL.createObjectURL('fsfd') );

    // ресаз иоброжени
//    resizeImgInBoxPicture = function(){
//        obj= $(".box-picture")
//            if (!obj.hasClass('on-resize')){
//            if (obj.width()<obj.find('#resultImg').width()||200<obj.find('#resultImg').height()){
//                console.log('box-picture привет');
//                console.log();
//                $('.btn-resaz').fadeIn()
//            }else{
//                console.log('box-picture пока');
//                console.log($('.btn-resaz'));
//                $('.btn-resaz').fadeOut()
//            }
//        }
//    }
//    resizeImgInBoxPicture()
//    $('.btn-resaz').click(function(){
//        $(this).prev().addClass('on-resize')
//        $(this).fadeOut()
//    })
//
//    $('#optionsImg').on('shown', function () {
//        $(".box-picture").css('max-height',$(this).parent().height())
//    })
//
//    $('#optionsImg').on('show', function () {
//        maxHeightBoxPicture =$(this).parent().height()
//    })
//
//    $('#optionsImg').on('hide', function () {
//        $(".box-picture").css('max-height',maxHeightBoxPicture)
//    })
    // tooltips
//    $('[rel="tooltip"]').tooltip({})
    //два скрола
    document.getElementById("topfake").style.width = 1+"px";
    document.getElementById("topscrl").style.display = "block";
    document.getElementById("topscrl").onscroll = topsclr;
    document.getElementById("content").onscroll = bottomsclr;
    function topsclr() {
        document.getElementById("content").scrollLeft = document.getElementById("topscrl").scrollLeft;
    }
    function bottomsclr() {
        document.getElementById("topscrl").scrollLeft = document.getElementById("content").scrollLeft;
    }

    if($.cookie('folderStyle')) {$("#folderStyle").val($.cookie('folderStyle'))}
    if($.cookie('nameStyle')){$("#nameStyle").val($.cookie('nameStyle'))}
    if($.cookie('folderImg')){$("#folderImg").val($.cookie('folderImg'))}
    if($.cookie('jnameImg')){$("#nameImg").val($.cookie('nameImg'))}
    if($.cookie('prefix')){ $("#prefix").val($.cookie('prefix'))}
   if( !($.cookie('styleLess')==null)){
       if($.cookie('styleLess')=='true'){
           $("#styleThose .btn:first-child").removeClass('active')
           $("#styleThose .btn:last-child").addClass('active')
       }else{
           $("#styleThose .btn:first-child").addClass('active')
           $("#styleThose .btn:last-child").removeClass('active')
       }
   }
   if( !($.cookie('number4Spaces')==null)){
       if($.cookie('number4Spaces')=='true'){
           $("#numberSpaces .btn:first-child").removeClass('active')
           $("#numberSpaces .btn:last-child").addClass('active')
       }else{
           $("#numberSpaces .btn:first-child").addClass('active')
           $("#numberSpaces .btn:last-child").removeClass('active')
       }
   }
   if( !($.cookie('addDataURL')==null)){
       console.log($.cookie('addDataURL'))
       if($.cookie('addDataURL')=='true'){
           $("#addDataURL").addClass('active')
       }else{
           $("#addDataURL").removeClass('active')

       }
   }

});


