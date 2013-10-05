window.Sprite = {};
Sprite.Img = Backbone.Model.extend({
    default: {
        dataUrl: undefined,
        nameFile: "default name file",
        nameClass: "default name class",
        img: new Image,
        height: 0,
        width: 0,
        sy: 0,
        sx: 0
    }
});

Sprite.ImgCol = Backbone.Collection.extend({
    model: Sprite.Img,
    initialize: function () {
        this.on("add", function () {
            console.log(this);
        });
    },
    dropFiles: function (files) {
        var imageType = /image.*/;
        var num = 0;
        var $this = this;
        $.each(files, function (i, file) {
//            console.log(files);
//            console.log(i);
            /*в ФФ возникает проблема при выгрузке файлов кириллицей, так что проверяем есть ли кириллические символы*/

            if (/[а-я]/i.test(file.name)) {
                // TODO: забиндить ошибку
                console.log('Название файлов должно быть только латинницей');
                lc
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
            reader.onload = function (e) {
                var img = new Image()
                img.src = e.target.result;
                img.onload = function () {
                    console.log(img.width);
                    $this.add({
                        dataUrl: img.src,
                        width: img.width,
                        height: img.height,
                        nameFile: file.name,
                        nameClass: file.name.split(".")[0]
                    });
                }
                return true;
            }

        });
    }
});


Sprite.PreviewItem = Backbone.View.extend({
    tagName: "li",
    className: "col-sm-2 col-md-2 col-lg-2 ",
    template: _.template($("#previewItemTpl").html()),
    render: function () {

        this.$el.html(this.template(this.model.toJSON()));
        this.afterRender()
        return this
    },
    afterRender: function(){
        var that = this, $el = this.$el

        this.$el.find('.nameClass').click(function(){
            $el.find('.nameClassEdit').focus()
            $(this).fadeOut()
        });

        this.$el.find('.nameClassEdit').blur(function(){
            var $this = $(this);
            var val = $this.val();
            if (val) {
                that.model.set(val);
                $el.find('.nameClass').text(val).fadeIn();
            } else {
                $this.focus()

            }
        }).on("keyup",function(){
                var $this = $(this);
                var val = $this.val();
                if (val) {
                    $el.removeClass("has-error");
                } else {
                    $this.focus();
                    $el.addClass("has-error");
                }
        });


    }
});


Sprite.App = Backbone.View.extend({
    ui: {
        imgConainer: $('#img-container'),
        imgList: $('#img-list'),
        allActivElement: $('#downloadStyle,#downloadSprit,#copiedMemory')
    },
    initialize: function () {
        var that = this
        Sprite.imgCol = new Sprite.ImgCol;
        // test data


        Sprite.imgCol.on('add',function(model){
           that.addItemPreview(model);
        });
    },
    addItemPreview: function(model){
        this.ui.imgConainer.addClass('img-in-box');
        this.ui.allActivElement.removeAttr('disabled');

        this.ui.imgList.append(function(){
            var img = new Sprite.PreviewItem({model:model});
            return img.render().$el;
        });
    },
    render: function(){

    }
});
new Sprite.App();

Sprite.imgCol.add(JSON.parse('[{"dataUrl":"data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABVAAD/4QPBaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjUtYzAxNCA3OS4xNTE0ODEsIDIwMTMvMDMvMTMtMTI6MDk6MTUgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcFJpZ2h0cz0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3JpZ2h0cy8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBSaWdodHM6TWFya2VkPSJGYWxzZSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjAxODAxMTc0MDcyMDY4MTE4MjJBRTExQkIzQjZCMkQ1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk0Q0M1N0FERUY3RDExRTJCNTkxQUQ3NDE0NUZERTBDIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk0Q0M1N0FDRUY3RDExRTJCNTkxQUQ3NDE0NUZERTBDIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0NGM3ZjdjMS0xNzlhLThlNDItODUyYi01ZDcxMWUxMGM1YmYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMTgyMkFFMTFCQjNCNkIyRDUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAACAQEBAQECAQECAwIBAgMDAgICAgMDAwMDAwMDBQMEBAQEAwUFBQYGBgUFBwcICAcHCgoKCgoMDAwMDAwMDAwMAQICAgQDBAcFBQcKCAcICgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAoACgDAREAAhEBAxEB/8QAaAABAQEBAAAAAAAAAAAAAAAACAkKBQEBAAAAAAAAAAAAAAAAAAAAABAAAgIBAwIFAgUFAQAAAAAAAQIDBAURBggHCSESIhMKADIxQUIjFVEUFhcYMxEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AUXyMe7fd4+bUscE+Pd963WnclNZN7ZuqzJJhsNcj1SpA66EWbcZ1Zh4pEfD1OpUJ0dl3uvbo7dHX0Yrf9qxe4tbvmhq7wxuskxx8v/nFl6sfifchB0kVR+5HqNCyoVDTRhsxi9w4irn8HYS3hL0MVynagYPHNBMgkjkRh4FWUgg/0+gzvd/bu6ZLmb1el419CsjLDxd2VceOazWd4xuPM1yYZLb6aa1oT5krr+DeMh18yhQQHxu+7jf/AJDHdujkRkJLEM/uL0tzltmkeNlVppMJNI2p8hAL1ift8Y9dDGoBZd9LtLY/uCdF/wDa/SOnHHy22XWkbCuoVDnschM0mJmc6evUl6zMdFclTorswCdXYE7OmS5QdVDyj5NYSSDj3sm+9bHYLKwNH/kGfpS+V4ZYZgCatSRf3gw0eQCPxAkAChvVX5AnGDpZ3HMdwru+zJ0ng9zb+6eoQn0qYvc0kqJDW8PQa0JDRWJSfRI35LG5YB38jbtDLs3KZDuG8a8YDs3Iyifqbg6Efpp252AGahSMae1MxAsAfbIRJ4h3Kggvj09oX/lvYdfmbyIxft8jN0VNds4m9HpLtvDWk+90capctIfX+qOMhPBmkX6CoX0Bd7qG/eRu2O3nv/d3AaOrf6kQR3I7VvDyq9unRSzLFm7OOWsGV70DLJquoZWDsNZFCsGVuWWSaRppmLzOSzMxJJJOpJJ/En6DSr2F+oPJHcXbJxmd5qrWrdOqEc1fZuZ3BMEsW9nw1wscuRFoCMQIA6QyO3rhAJHlCu4PH6CeHfr7uVfgp0kPQHofkF/6y3lUf2bEDAvtvEy6xPkX0/CxJoyVh+RBkPgoDBOXsI9367ww6tnjvyEyrycXd7Xfc/kb0rMNuZuywT++LuTpWnOi2AfBTpL4aOGBxdVvjbdFOpPcdx3IrC2KtPhtlPc3TujY9XzI8mZSZJBSqe2PIlC2zGV/K2qAOiaBkKAYvkPd2rH9S8tP28OLV2Ov0T21JHT3zksSVjr5K9RYLHia/s6L/aU2QefTweVQAPLGC4Ij46/d6/3ztGnwS5G5Tz9a9v1Smxc1ek/czuJqx6mlI7/daqRrqp11kiGp9SMzB2fkNdoh+UmxJ+aHHnGmXkTtaoBufEU01l3FhaqeDoi/fbqIPQB6pIx5PErGv0E5Ox52nMt3EOuH+fdTqssHEzZlmKTcln1x/wAzdUCaLD15BofUCGnZTqkZA1VnQ/QaV8Vi8Zg8ZWwmFrx1MNTijq1KlZFihhhiQRxxxogCqqqAAANAPoM+PyDO0Q/EbqPPy54/Y0rxm3bbJzWNpp+3trNWXLFAq/ZUsuSYj9qPrH4Axgggfjg9oh8DWx3cT5HY0rmLMZm6WYK6mhhglUoc5NG36pFJFUEeCky+PmjYB//Z","width":40,"height":40,"nameFile":"type-2.jpg","nameClass":"type-2"},{"dataUrl":"data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABVAAD/4QPBaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjUtYzAxNCA3OS4xNTE0ODEsIDIwMTMvMDMvMTMtMTI6MDk6MTUgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcFJpZ2h0cz0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3JpZ2h0cy8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBSaWdodHM6TWFya2VkPSJGYWxzZSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjAxODAxMTc0MDcyMDY4MTE4MjJBRTExQkIzQjZCMkQ1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk0RDQxRkYzRUY3RDExRTJCNTkxQUQ3NDE0NUZERTBDIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk0RDQxRkYyRUY3RDExRTJCNTkxQUQ3NDE0NUZERTBDIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0NGM3ZjdjMS0xNzlhLThlNDItODUyYi01ZDcxMWUxMGM1YmYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMTgyMkFFMTFCQjNCNkIyRDUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAACAQEBAQECAQECAwIBAgMDAgICAgMDAwMDAwMDBQMEBAQEAwUFBQYGBgUFBwcICAcHCgoKCgoMDAwMDAwMDAwMAQICAgQDBAcFBQcKCAcICgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAoACgDAREAAhEBAxEB/8QAXQABAAMAAAAAAAAAAAAAAAAAAAMEBwEBAAAAAAAAAAAAAAAAAAAAABAAAAIJBQEAAAAAAAAAAAAAAAcFVZXVBlbWlxrlphgJCmgRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKuKn2Sz2XzaihyAGKn2Sz2XzaihyAGKn2Sz2XzaihyAGKn2Sz2XzaihyAGKn2Sz2XzaihyAIOBHqWXpjXhR9QgHAj1LL0xrwo+oQDgR6ll6Y14UfUIBwI9Sy9Ma8KPqEA4EepZemNeFH1CAc9/UsojGs8j6eAOe/qWURjWeR9PAHPf1LKIxrPI+ngDnv6llEY1nkfTwBz39SyiMazyPp4Ayv+xKTC5ZETPwAyv+xKTC5ZETPwAyv+xKTC5ZETPwAyv+xKTC5ZETPwAyv+xKTC5ZETPwBtOXz88780EAy+fnnfmggGXz88780EAy+fnnfmggGXz88780EB//2Q==","width":40,"height":40,"nameFile":"type-3.jpg","nameClass":"type-3"},{"dataUrl":"data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABVAAD/4QPBaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjUtYzAxNCA3OS4xNTE0ODEsIDIwMTMvMDMvMTMtMTI6MDk6MTUgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcFJpZ2h0cz0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3JpZ2h0cy8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBSaWdodHM6TWFya2VkPSJGYWxzZSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjAxODAxMTc0MDcyMDY4MTE4MjJBRTExQkIzQjZCMkQ1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk0RDQxRkY3RUY3RDExRTJCNTkxQUQ3NDE0NUZERTBDIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk0RDQxRkY2RUY3RDExRTJCNTkxQUQ3NDE0NUZERTBDIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0NGM3ZjdjMS0xNzlhLThlNDItODUyYi01ZDcxMWUxMGM1YmYiIHN0UmVmOmRvY3VtZW50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","width":40,"height":40,"nameFile":"type-4.jpg","nameClass":"type-4"},{"dataUrl":"data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABVAAD/4QPBaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjUtYzAxNCA3OS4xNTE0ODEsIDIwMTMvMDMvMTMtMTI6MDk6MTUgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcFJpZ2h0cz0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3JpZ2h0cy8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBSaWdodHM6TWFya2VkPSJGYWxzZSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjAxODAxMTc0MDcyMDY4MTE4MjJBRTExQkIzQjZCMkQ1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk0RDQxRkZCRUY3RDExRTJCNTkxQUQ3NDE0NUZERTBDIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk0RDQxRkZBRUY3RDExRTJCNTkxQUQ3NDE0NUZERTBDIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0NGM3ZjdjMS0xNzlhLThlNDItODUyYi01ZDcxMWUxMGM1YmYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMTgyMkFFMTFCQjNCNkIyRDUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAACAQEBAQECAQECAwIBAgMDAgICAgMDAwMDAwMDBQMEBAQEAwUFBQYGBgUFBwcICAcHCgoKCgoMDAwMDAwMDAwMAQICAgQDBAcFBQcKCAcICgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAoACgDAREAAhEBAxEB/8QAdwABAQAAAAAAAAAAAAAAAAAACAkBAQAAAAAAAAAAAAAAAAAAAAAQAAABCgIFCAYKAwAAAAAAAAYBEQISAxMEFAUVBwgAMRYXCSEiYiMzGBkKQTI0NTZWQlKCUyR0JzcpGoPjdhEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Apjwj+Ed4WO8H9RGo+27sXbUa0SNln9X46MePZ3oqq+k/IBnzG+V57wGYUeY8794ij7bCKti60ohOZRgrxUm1RliNrwyeEZvVFlETmOYmrQEx4R38RHhVbxGv/f2brPjTa/3dPf4PadXO6OgGfLl5Xnu/5hQHjzv3iKxsSIqILrSkE5ZGNs9SY1GWK2vDV2Ro6UWUSMc5i6tATHFw4R3inbvv1EagHYS+9jRrvPXqQ1/joN26kukst6DcoFfyr+YjMBj3v236DoQjS07FWvaytVKryc1e38vcGrV28dILqmWVIfUTQJ08QHPdngCGfLG0JhPGUc0sK0sfDGnUymU4W1+GhISEhhDFMWLBgxYxKKDNmzQRIiiiiQhESEIQhDaBRbvEZgP6qW/7boQ79vnW9VK/fu/bveT2a9l6ntOz5vq8mgTp4f2e7PAL8+WCQTFmMo5qgVqg+B1OqdMqItr8TCRcJEiGFYtmDdi2iUkGjNogkVFJFIhSJEKUhSG0Ci3moMxGYDATcTuLHQhBd221umydaqVInJWyOJi3tWTx29TUWOqsU2sugKHhBR3CDjN4fhTMXSth295gvROeftfxWX812P2/o6AYcyVY8rKyzEj5nmEhVsfERHW0Rwk6xTKcQEqbYlTKenllvannY9X9Xmm0BPT3CD8Hudc/xQfdKC/52V9U969+8v8Aq0Aw5bax5WVrmJALPL3Cq4+JCOiIgdJ1imQwgLU2JKYU9QLLe1O+26v63NPoCe4vsdwg4Pd54rLF6tftguYL0jGkLp8KF/K9t9j6WgGXyteWXMbl036d4ABCEEXjYu07WUeoUmdlL0/l55kzeO3zNdU6qxD6yaBO7P5w8s+41z3Y1jIHYKjmqhGrj0YVOlVSnBWuREJGQcUIYpuwiGDZjDpINGbRmkRJFJEpSFIUhScmgUR7suY3+q93cdghD3gvkez1C/fu7dPdzqZ9k6/1Oz53q8ugTuyB8PLPuCs92CgyGOCo5pQRpA9B9TqtUqIVrkPCQcHCiGFbt4hu2bQ6KDNmzZolSSSSKQhCEKUvJoFEfNKZZcxuYvcX3fwEIRvZ9tLtsnR6hVpKbsriYkWTR28ctFFjLKlNqLoCW4PnF7ieKvvEmMP0QLsHYTKVstYnr3P6zwUG7dSPSWW9BuUC/mU80vUMvmYsf4BoYHs6sgBxJXAgSqlF6UMWNJRqm2p0wVhaGrt46WUXSVOY5degKDxe4nwdfFe3fozHyJeyq/G2x/vOSPq6/wBm6HS0Av5a/NL1DMHmLAGAaeB7OkoDgSUMIFqpBelElgiVmpsadMEYWhk8dvVlF0VjGOTXoCg4wfF7ieFRu7l8P0R1t5fjr1stHkbJIajQUY8ez3RVV9J+QP/Z","width":40,"height":40,"nameFile":"type-5.jpg","nameClass":"type-5"}]'));

$(function () {


// Contender for  drag and drop
    var dropBox = $('#img-container');
    dropBox.on({
        dragenter: function () {
            $(this).addClass('img-drag-over');
            return false;
        },
        dragover: function () {
            $(this).addClass('img-drag-over');
            return false;
        },
        dragleave: function () {
            $(this).removeClass('img-drag-over');
            return false;
        },
        drop: function (e) {
            var dt = e.originalEvent.dataTransfer;
            window.a = dt.files;
            Sprite.imgCol.dropFiles(dt.files)
//            setTimeout(restPorametry,500);
            $(this).removeClass('img-drag-over');
            return false;
        }
    });
});
