$(document).ready(function() {
//http://www.xiper.net/collect/js-plugins/ui/html5-drag-n-drop-file-upload.html

    // Стандарный input для файлов
    var fileInput = $('#fileUpload0');


    // Проверка поддержки File API в браузере  и DnD
    if(window.FileReader == null || !('draggable' in document.createElement('span')))

    /* если file api не поддерживается, реализуем загрузку файлов постаринке */
    {
        var	result = true; // флаг, который нам поможет засубмитить форму после того как все фотки будут отправленны (используем этот флаг чтобы не вводить дополнителную переменную)

        /*делаем действия для "отставших браузеров"*/
        fileInput
            .attr("name","fileUpload0")
            .after('<div><input type="button" id="addFile" value="+"></div>');

        var fileCounter = 0;

        $("#addFile").click(
            function() {
                var newInput = $("#fileUpload"+fileCounter);

                fileCounter++;
                $("#addFile").parent().before('<div><input type="file" name="fileUpload"'+fileCounter+' id="fileUpload"'+fileCounter+'/></div>');
            });


    }
    /* end если file api не поддерживается */


    /* если поддерживется file api и DnD */
    else {
     /* динамически создаем компоненты для drag and drop */
        fileInput.after('<div id="img-container"><div class="text"><span>Перетащите сюда изоброжения</span></div><ul id="img-list" class="thumbnails"></ul></div>');


        // ul-список, содержащий миниатюрки выбранных файлов
        var imgList = $('ul#img-list'),

        // Контейнер, куда можно помещать файлы методом drag and drop
            dropBox = $('#img-container'),

        // Счетчик всех выбранных файлов и их размера
            imgCount = 0,
            imgSize = 0,
            uploadedCount = 0,

        // МАСИВ  С НАЗВАНИЯМИ
            imgBox = [],
            imgInfo = {
                dataUrl:" ",
                nameFaile:" ",
                nameClass:" ",
                img:Image,sy:0,sx:0
            },

        //отступ для спайта
            spritesMarginBottom = " ",
            spritesMarginRight = " ",
        //количестов  элементов в столбце
            numberColumn = " ",

            sprit ={
                dataUrl:" ",
                width:0,
                height:0
            },
            stylesPorametry = {
                "folderStyle":" ",
                "nameStyle":" ",
                "folderImg":" ",
                "nameImg":" ",
                "prefix":" ",
                "styleLess":" ",
                "number4Spaces":" ",
                "addDataURL":" "
            },


        result = false;

        //обновление пораметров
        function restPorametry(){
            spritesMarginBottom =Number( $("#spritesMarginBottomInput").val()),
            spritesMarginRight = Number($("#spritesMarginRightInput").val()),
            //количестов  элементов в столбце
            numberColumn = Number($("#numberColumnInput").val()),
            stylesPorametry = {

                "folderStyle":$("#folderStyle").val(),
                "nameStyle":$("#nameStyle").val(),
                "folderImg":$("#folderImg").val(),
                "nameImg":$("#nameImg").val(),
                "prefix":$("#prefix").val(),
                "styleLess":$("#styleThose .btn-item").hasClass("active"),
                "number4Spaces":$("#numberSpaces .btn-item").hasClass("active"),
                "addDataURL":$("#addDataURL").hasClass("active")
            }
               //закидваем в куки
            $.cookie('folderStyle',stylesPorametry.folderStyle)
            $.cookie('nameStyle',stylesPorametry.nameStyle)
            $.cookie('folderImg',stylesPorametry.folderImg)
            $.cookie('nameImg',stylesPorametry.nameImg)
            $.cookie('prefix',stylesPorametry.prefix)
            $.cookie('styleLess',stylesPorametry.styleLess)
            $.cookie('number4Spaces',stylesPorametry.number4Spaces)
            $.cookie('addDataURL',stylesPorametry.addDataURL)


               //обовим имя для скачивания фала
            $('#downloadSprit').attr('download',stylesPorametry.nameImg)
            if (stylesPorametry.styleLess){
                $('#downloadStyle').attr('download',stylesPorametry.nameStyle+'.less')
                $("#addDataURL span").html('less')
                $("#nameStyle + .help-block").html('.less')
            }else{
                $('#downloadStyle').attr('download',stylesPorametry.nameStyle)
                $("#addDataURL span").html('CSS')
                $("#nameStyle + .help-block").html('.css')
            }
//            console.log(spritesMarginBottom);
//            console.log(spritesMarginRight);
//            console.log(numberColumn);
//            console.log(stylesPorametry);
            if(!imgBox.length){
                return false
            };
            sizenSprit();
        }

        $("input").blur(function(){
            restPorametry();
        });
        $(".btn-group .btn").click(function(){
            setTimeout(restPorametry,500);

        });


        /*
         обработчики событий интрфейса
         */

        // добавить data url
        $("#addDataURL").click(function(){

            stylesPorametry.addDataURL=!$(this).hasClass('active')
            $.cookie('addDataURL',stylesPorametry.addDataURL)
//            console.log($(this).hasClass('active'));
            toSyleCode()
        })
        // удаление выбранного фото
        $(".delpreview").live("click", function () {
            var indexElment = $(this).parent().index();
//            console.log(indexElment);
            for (var i = 0; i < imgBox.length; i++) {
                var obj = imgBox[i];
//                console.log(obj.nameFaile+' '+i);
            } imgBox.splice(indexElment, 1);
            for (var i = 0; i < imgBox.length; i++) {
                var obj = imgBox[i];
//                console.log(obj.nameFaile+' '+i);
            }
            $(this).parent().remove();
            imgCount=imgBox.length;
//            console.log(imgBox);

            if(!imgBox.length){
                console.log(2);
                $("#img-container").removeClass('img-in-box');
                $('#downloadStyle,#downloadSprit,#copiedMemory').attr('disabled','disabled');
                $("#copiedMemory").zclip('hide');

            };
            sizenSprit();
        });



        // Отображение выбраных файлов и создание миниатюр
        function displayFiles(files) {
            var imageType = /image.*/;
            var num = 0;

            $.each(files, function (i, file) {

                /*в ФФ возникает проблема при выгрузке файлов кириллицей, так что проверяем есть ли кириллические символы*/

                if (/[а-я]/i.test(file.name)) {

                    $.jGrowl('Название файлов должно быть только латинницей');
                    /* или можно заменbnm русcкие буквы транслитом */
                }
                else {
                    // Отсеиваем не картинки
                    if (!file.type.match(imageType)) {
                        $.jGrowl('Загрузить можно только изображения');
                        return true;
                    }
                    $('#img-container').addClass('img-in-box');
                    $('#downloadStyle,#downloadSprit,#copiedMemory').removeAttr('disabled');
                    num++;
                    // Создаем элемент li и помещаем в него название, миниатюру и progress bar,
                    // а также создаем ему свойство file, куда помещаем объект File (при загрузке понадобится)
                    var li = $('<li />').appendTo(imgList);
                    li.addClass("span2 thumbnail")
                    $('<span  class="close delpreview" type="button">×</span>').appendTo(li);
                    $('<div class="photoName"/>').text(file.name).appendTo(li);
                    $('<div class="imgBox"/>').appendTo(li);
                    var img = $('<img/>').appendTo(li.find('.imgBox'));
                    var canvas = document.getElementById("picture");

                    li.get(0).file = file;
                    // Создаем объект FileReader и по завершении чтения файла, отображаем миниатюру и обновляем
                    // инфу обо всех файлах

                    var reader = new FileReader();
                    reader.onload = (function (aImg) {
                        return function(e) {

                            var imgInfo = {dataUrl:" ", nameFaile:" ", img: new Image()};
                            imgInfo.img.src = e.target.result;
                            imgInfo.dataUrl= e.target.result;
                            imgInfo.nameFaile =file.name;
                            imgInfo.nameClass =file.name.split(".")[0];
                            aImg.attr('src', e.target.result);
                            imgBox[imgCount]=imgInfo;
                            imgCount++;
                            imgSize += file.size;


                        };
                    })(img);
                    reader.readAsDataURL(file);
                }

            });
        }


        ////////////////////////////////////////////////////////////////////////////
        // перешет размера спайта
        function sizenSprit(){
            var heightSprit = 0,heightColon = 0,widthSprit =0,widthColon =0;
            var j=1;
//            console.log('--------------- '+ (imgBox.length));
//            console.log(imgBox);
            for (var i = 0; i < imgBox.length ; i++) {
//                console.log( imgBox[i].nameFaile);
                imgBox[i].sx = widthColon;
                imgBox[i].sy = heightColon;

           //console.log(" heightColon="+heightColon+" widthColon="+widthColon+" numberColumn="+numberColumn+" spritesMarginBottom="+spritesMarginBottom);
                if (widthSprit < imgBox[i].img.width + widthColon){
                    widthSprit =imgBox[i].img.width+ widthColon;
                }
                if (heightSprit < imgBox[i].img.height + heightColon){
                    heightSprit =imgBox[i].img.height + heightColon;
                }
                if  (j < numberColumn){
                    heightColon  = heightColon + spritesMarginBottom + imgBox[i].img.height;
                }else{
                    widthColon=widthSprit+spritesMarginRight;
                    heightColon=0;
                    j=1;
                }


                j++;
            }
            sprit.height = heightSprit + spritesMarginBottom;
            sprit.width = widthSprit ;
            document.getElementById("picture").height=(sprit.height);
            document.getElementById("picture").width=(sprit.width);
            toSprit()
        }
        //чтение из и загрузка в фаил
        function toSprit() {
            var canvas = document.getElementById("picture");

            var ctx = canvas.getContext('2d');
            ctx.clearRect(0,0,100000,1000000)

            for (var i = 0; i <= imgBox.length - 1; i++) {
                var imgInfoObg = imgBox[i];

                ctx.drawImage(imgInfoObg.img, imgInfoObg.sx, imgInfoObg.sy,imgInfoObg.img.width,imgInfoObg.img.height);

            }
            toImg()
        }


        // приоброзование в картинку
        function toImg(){

            var canvas = document.getElementById("picture");
            sprit.dataUrl = canvas.toDataURL();
            $("#resultImg").css({
               "background-image": "url("+sprit.dataUrl +")",
                "width":sprit.width,
                "height":sprit.height
            });
            $("#resultImg .border-img").remove();
            for (var i = 0; i <= imgBox.length - 1; i++) {
                $("#resultImg").append("<div class='border-img' style='" +
                    "top:"+(imgBox[i].sy-1)+"px;" +
                    "left:"+(imgBox[i].sx-1)+"px;" +
                    "width:"+(imgBox[i].img.width-1)+"px;"+
                    "height:"+imgBox[i].img.height+"px;"+
                    "'><span>."+imgBox[i].nameClass+"</span></div>");


            }
            $("#downloadSprit").attr('href',sprit.dataUrl)
//            console.log($(".border-img:last-child span").outerWidth());
            var lastBoxHorderImgWidth=$(".border-img:last-child ").outerWidth()
            var lastTextHorderImgWidth=$(".border-img:last-child span").outerWidth()
            if(lastBoxHorderImgWidth<lastTextHorderImgWidth)
            $("#topfake").css('width',sprit.width+(lastTextHorderImgWidth-lastBoxHorderImgWidth)+2);
            else
            $("#topfake").css('width',sprit.width+2);

            toSyleCode();
        }
       function toSyleCode(){
           $("#styleCode").html("")
           $("#styleCode-box").remove()
          $("#styleCode").after('<pre id="styleCode-box" style="display:none;">/*\n  Тут будет ваш код\n*/</pre>');
           var placeCode = $("#styleCode-box"),
               numberSpaces = "  ",
               cssSlector="",
               inlineBlock,
               restoreRightWhitespace,
               urlBackgroundImage;

            //клдичество пробелов
           if (stylesPorametry.number4Spaces)
               numberSpaces = "    ";
           //наличие префиксов
           if (stylesPorametry.prefix)

               cssSlector ="[class^="+stylesPorametry.prefix+"],\n[class*="+stylesPorametry.prefix+"] {\n"
           else{
               for (var i = 0; i <= imgBox.length - 1; i++) {
                   if ( i < imgBox.length - 1){
                       cssSlector=cssSlector+"."+imgBox[i].nameClass+",\n"
                   }else{
                       cssSlector=cssSlector+"."+imgBox[i].nameClass+" {\n"
                   }
//                   console.log(imgBox[i]);
               }
           }
           //наличие бутстрапа и less
           if (stylesPorametry.styleLess){
               inlineBlock=numberSpaces+".ie7-inline-block(); \n"+numberSpaces+"display: inline-block;\n";
               restoreRightWhitespace=numberSpaces+".ie7-restore-right-whitespace();\n";
           }else{
               inlineBlock=numberSpaces+"display: inline-block;\n"+numberSpaces+"*display: inline;\n"+numberSpaces+"*zoom: 1;\n";
               restoreRightWhitespace=numberSpaces+"*margin-right: .3em;\n";
           }
//           console.log(stylesPorametry.addDataURL);
           if(stylesPorametry.addDataURL){
               urlBackgroundImage=numberSpaces+"background-image: url("+sprit.dataUrl +");\n";
           }else{
               urlBackgroundImage=numberSpaces+"background-image: url("
               if(stylesPorametry.folderStyle){
                   urlBackgroundImage=urlBackgroundImage+"../";
               }
               if (stylesPorametry.folderImg){
                   urlBackgroundImage=urlBackgroundImage+stylesPorametry.folderImg+"/";
               }
               urlBackgroundImage=urlBackgroundImage+stylesPorametry.nameImg;
               if (stylesPorametry.styleLess){
                   urlBackgroundImage=urlBackgroundImage+".less);\n";
               }else{
                   urlBackgroundImage=urlBackgroundImage+".css);\n";
               }

           }

           //наченавм выводить оверхед
           if (imgBox.length){
               placeCode.html("");//клирем блок

               placeCode.append(cssSlector)
               placeCode.append(inlineBlock)
               placeCode.append(restoreRightWhitespace)
               placeCode.append(numberSpaces+"vertical-align: text-top;\n")
               placeCode.append(urlBackgroundImage)
               placeCode.append(numberSpaces+"background-repeat: no-repeat;\n")
               placeCode.append("}\n\n")

               //выводим свойства
               for (var i = 0; i <= imgBox.length - 1; i++) {
                   placeCode.append("."+stylesPorametry.prefix+imgBox[i].nameClass+" {\n")
                   placeCode.append(numberSpaces+"background-position:-"+imgBox[i].sx+"px -"+imgBox[i].sy+"px ;\n")
                   placeCode.append(numberSpaces+"width:"+imgBox[i].img.width+"px;\n")
                   placeCode.append(numberSpaces+"height:"+imgBox[i].img.height+"px;\n")
                   placeCode.append("}\n")
               }
           }
           $('#styleCode').append('<code class="language-css"></code>');
           $('#styleCode code').append(placeCode.html());
           $("#copiedMemory").zclip('show');

           downloadFile();
           prettyPrint()

       }
        var downloadFile = function() {

            window.URL = window.webkitURL || window.URL;
            window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder ||
                window.MozBlobBuilder;

            var MIME_TYPE = 'text/';
            if (stylesPorametry.styleLess){
                MIME_TYPE+='less';
            }else{
                MIME_TYPE+='css';
            }
            var bb = new BlobBuilder();
            bb.append($('#styleCode-box').html());
            var blobUrl =window.URL.createObjectURL(bb.getBlob(MIME_TYPE))
            $('#downloadStyle').attr('href',blobUrl)  ;

        };
        //собшения
        $('#downloadStyle,#downloadSprit,#copiedMemory').on('click',function(){
            if(!imgBox.length){
                $.jGrowl("Добавте изоброжения");
                return false
            };
            return true
        });
        //


        ////////////////////////////////////////////////////////////////////////////


        // Обработка события выбора файлов через стандартный input
        // (при вызове обработчика в свойстве files элемента input содержится объект FileList,
        //  содержащий выбранные файлы)
        fileInput.bind({
            change:function () {
                displayFiles(this.files);
                restPorametry();
            }
        });

        // Обработка событий drag and drop при перетаскивании файлов на элемент dropBox
        // (когда файлы бросят на принимающий элемент событию drop передается объект Event,
        //  который содержит информацию о файлах в свойстве dataTransfer.files. В jQuery "оригинал"
        //  объекта-события передается в св-ве originalEvent)
        dropBox.bind({
            dragenter:function () {
                $(this).addClass('img-drag-over');
//                console.log('enter 1');
                return false;
            },
            dragover:function () {
                $(this).addClass('img-drag-over');
//                console.log('over 1');
                return false;
            },
            dragleave:function () {

                $(this).removeClass('img-drag-over');
//                console.log('leave 1')
                return false;
            },
            drop:function (e) {
//                console.log('drop');

                var dt = e.originalEvent.dataTransfer;
                displayFiles(dt.files);
                setTimeout(restPorametry,500);
                $(this).removeClass('img-drag-over');

                return false;
            }
        });

    }/* end если поддерживется file api */

});

