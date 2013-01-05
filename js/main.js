var Img = Backbone.Model.extend({
    default : {
        dataUrl: undefined,
        nameFile: "default name file",
        nameClass: "default name class",
        img: new Image,
        height:0,
        width:0,
        sy:0,
        sx:0
    }
});

var ImgCol = Backbone.Collection.extend({
    model: Img,
    initialize: function(){
        $(this).on("add", function() {
            console.log(this);
        });
    },
    dropFiles:function (files){
        var imageType = /image.*/;
        var num = 0;
        var $this = this;
        $.each(files, function (i, file) {
//            console.log(files);
//            console.log(i);
            /*в ФФ возникает проблема при выгрузке файлов кириллицей, так что проверяем есть ли кириллические символы*/

            if (/[а-я]/i.test(file.name)) {
                // TODO: забиндить ошибку
                console.log('Название файлов должно быть только латинницей');lc
//                $.jGrowl('Название файлов должно быть только латинницей');
                /* или можно заменbnm русcкие буквы транслитом */
                return true;
            }
            if (!file.type.match(imageType)) {
                // TODO: забиндить ошибку
                console.log('Загрузить можно только изображения');
//                    $.jGrowl('Загрузить можно только изображения');
                return true;
            }

            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload =function(e){
                var img = new Image()
                img.src = e.target.result;
                img.onload = function(){
                    console.log(img.width);
                    $this.add({
                        dataUrl: img.src,
                        width: img.width,
                        height: img.height,
                        nameFile: file.name,
                        nameClass: file.name.split(".")[0],
                        img: img
                    });
                }
                return true;
            }

        });
    }

});
var imgCol = new ImgCol;
var PreviewItem = Backbone.View.extend({
    initialize: function(){
        imgCol.on(add, this.render())
    },
    tagName: "li",
    className: "span2 thumbnail",
    template: _.template($("#previewItemTpl").html()),
    render: function(){
        $el.html(this.template(this.model.toJSON()));
        return this
    }
});


$(function(){


// Контейнер, куда можно помещать файлы методом drag and drop
    var dropBox = $('#img-container');
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
//            displayFiles(dt.files);
            imgCol.dropFiles(dt.files)
            console.log(imgCol);
//            setTimeout(restPorametry,500);
            $(this).removeClass('img-drag-over');

            return false;
        }
    });
});