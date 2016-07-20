/**
 * Created by Igor on 24.04.16.
 */
var Slider = function(container, mode, swipeSpeed, swipeDelay, type, imagesUrl){
    this.container = container;
    this.mode = mode;
    this.swipeSpeed = swipeSpeed;
    this.swipeDelay = swipeDelay;
    this.type = type;
    this.images = imagesUrl;
};

var slider2 = new Slider(
/*     container: */document.getElementsByTagName('body')[0], //область в которую слайдер рендерить
  /*  mode: */'automanual',
   /* swipeSpeed:*/ 500,
   /* swipeDelay:*/ 3000,
  /*  type:*/ 'fade',
  /*  images:*/ [ 'http://dedushka.org/demo/slider/i/1.jpg',
        'http://dedushka.org/demo/slider/i/2.jpg',
        'http://dedushka.org/demo/slider/i/3.jpg',
        'http://dedushka.org/demo/slider/i/4.jpg',
        'http://dedushka.org/demo/slider/i/5.jpg']);
var slider1 = new Slider(
    /*     container: */document.getElementsByTagName('div')[0], //область в которую слайдер рендерить
    /*  mode: */'automanual',
    /* swipeSpeed:*/ 500,
    /* swipeDelay:*/ 3000,
    /*  type:*/ 'fade',
    /*  images:*/ [ 'http://dedushka.org/demo/slider/i/1.jpg',
        'http://dedushka.org/demo/slider/i/2.jpg',
        /*'http://dedushka.org/demo/slider/i/3.jpg',*/
        './img/1.jpg',
        'http://dedushka.org/demo/slider/i/4.jpg',
        'http://dedushka.org/demo/slider/i/5.jpg']);







var slideObj = Object.create(slider1);
var fadeObj = Object.create(slider1);
var getWrapper;


slider1.createDomElement = function(type, className, link){
    var element =  document.createElement(type);
    if (className)
        element.className = className;
    if (link)
        element.setAttribute('src', link);
    return element;
};

var maxWidth, maxHeight;
var counter = 0;
var validImgs = [];
slider1.generateSlider = function (){

    getWrapper = slider1.container.appendChild(slider1.createDomElement('div', 'slider'));
    // узнаем макс ширину и высоту обертки слайдера и устанавливаем ее

    (function(){
        for(var i = 0; i < slider1.images.length; i++){
            var newImg = slider1.createDomElement('img', 'slides', slider1.images[i]);
            validImgs.push(newImg);

            function checkImg(newElement, i){

                newElement.onload = function(){
                    counter++;
                    if(counter == slider1.images.length)
                        deleteBrokenImgs();
                };

                newElement.onerror = function(){
                    counter++;
                    delete validImgs[i];
                    if(counter == slider1.images.length)
                        deleteBrokenImgs();
                };
            }
            checkImg(newImg, i);

            function deleteBrokenImgs(){
                var newArr = [];
                for (var i = 0; i < validImgs.length; i++ ){
                    if(validImgs[i] != undefined)
                        newArr.push(validImgs[i]);
                }
                validImgs = newArr;
                buildSlider();
            }

            function buildSlider(){
                for(var i = 0; i < validImgs.length; i++){

                    getWrapper.appendChild(validImgs[i]);
                    if(maxHeight < validImgs[i].naturalHeight || !maxHeight ){
                        maxHeight = validImgs[i].naturalHeight;
                        getWrapper.style.height = maxHeight + 'px';
                    }
                    if(maxWidth < validImgs[i].naturalWidth || !maxWidth ){
                        maxWidth = validImgs[i].naturalWidth;
                        getWrapper.style.width = maxWidth + 'px';
                    }
                }
                // находим начальное положение изображений
                if(slider1.type == 'slide'){
                    for (i = 0; i < validImgs.length; i++){
                        if(i == 0)
                            validImgs[i].style.left = 0 + 'px';
                        else
                            validImgs[i].style.left = maxWidth + 'px';
                    }
                } else if(slider1.type == 'fade'){
                    for (i = 0; i < validImgs.length; i++){
                        validImgs[i].style.transition = 'opacity ' + slider1.swipeSpeed + 'ms linear';
                        validImgs[i].style.opacity = 0;
                        if(i == 0){
                            validImgs[i].style.left = 0 + 'px';
                            validImgs[i].style.zIndex = 100;
                            validImgs[i].style.opacity = 1;
                        } else if( i == 1)
                            validImgs[i].style.zIndex = 50;
                        else
                            validImgs[i].style.zIndex = -100;
                    }
                }
            }
        }
    })();

    return document.body.getElementsByClassName('slides');
};



var arrayOfSlides = slider1.generateSlider();

var mouseX0;
var mouseX1;
var timerMove;
var timerMovee;

slideObj.funcMouseMove = function(e) {
    mouseX1 = e.clientX;
    getWrapper.removeEventListener('mousedown', slider1.funсMouseDown);
    getWrapper.removeEventListener('mousemove', slideObj.funcMouseMove);
    getWrapper.removeEventListener('mouseup', slideObj.funcMouseUp);

    if(mouseX0 - mouseX1 < 0){
        arrayOfSlides[arrayOfSlides.length -1].style.transition = 'none';
        arrayOfSlides[arrayOfSlides.length -1].style.zIndex = -100;
        arrayOfSlides[arrayOfSlides.length -1].style.left = -maxWidth + 'px';
        setTimeout(function(){
            slideObj.animationSlide(mouseX0 - mouseX1);
        }, 10);
    } else
        slideObj.animationSlide(mouseX0 - mouseX1);
    if(slider1.mode == 'auto' || slider1.mode == 'automanual'){
        clearInterval(interval);
        interval = setInterval(slideObj.animationSlide, slider1.swipeDelay);
    }

};

slideObj.funcMouseUp = function(){
    clearTimeout(timerMove);
    getWrapper.removeEventListener('mousedown', slider1.funсMouseDown);
    getWrapper.removeEventListener('mousemove', slideObj.funcMouseMove);
    getWrapper.removeEventListener('mouseup', slideObj.funcMouseUp);
    if(slider1.mode == 'auto' || slider1.mode == 'automanual'){
        clearInterval(interval);
        interval = setInterval(slideObj.animationSlide, slider1.swipeDelay);
    }
    slideObj.animationSlide(0);

};

slider1.funсMouseDown = function(e){
    getWrapper.ondragstart = function() {
        return false;
    };
    if (slider1.type == 'slide'){
        mouseX0 = e.clientX;
        getWrapper.addEventListener('mouseup', slideObj.funcMouseUp);
        timerMove = setTimeout(function(){
            getWrapper.addEventListener('mousemove', slideObj.funcMouseMove);

        },100);
    } else if(slider1.type == 'fade'){
        fadeObj.animationSlide();
        if(slider1.mode == 'auto' || slider1.mode == 'automanual'){
            clearInterval(interval);
            interval = setInterval(fadeObj.animationSlide, slider1.swipeDelay);
        }
    }
};

slideObj.animationSlide = function(arg){
    console.log(arg);
    var newArrayOfSlides = [];
    /*анимируем слайдер, создаем новый массив на следующий шаг анимации
     зависимости от arg работает разная ветка в иф и новый массив создается по разной логике
     если arg отрицательный, то слайдер крутится в обратную сторону, если 0 и больше, то все ок*/

    if(arg >= 0 || arg == undefined){
        setTimeout(function(){
            arrayOfSlides[arrayOfSlides.length -1].style.transition = 'none';
            arrayOfSlides[arrayOfSlides.length -1].style.zIndex = -100;
            arrayOfSlides[arrayOfSlides.length -1].style.left = maxWidth + 'px';
        }, slider1.swipeSpeed);
    } else
        newArrayOfSlides.push(arrayOfSlides[arrayOfSlides.length -1]);

    for (var i = 0; i < arrayOfSlides.length; i++){
        if(i == 0){
            arrayOfSlides[i].style.transition = 'left ' + slider1.swipeSpeed + 'ms linear';
            if(arg >= 0 || arg == undefined)
                arrayOfSlides[i].style.left = -maxWidth + 'px';
            else {
                arrayOfSlides[i].style.left = maxWidth + 'px';
                newArrayOfSlides.push(arrayOfSlides[i]);
            }
        } else if ((i == arrayOfSlides.length -1 && arg < 0) || (i == 1 && (arg >= 0 || arg == undefined))){
            arrayOfSlides[i].style.left = 0 + 'px';
            arrayOfSlides[i].style.zIndex = 100;
            arrayOfSlides[i].style.transition = 'left ' + slider1.swipeSpeed + 'ms linear';
            if (i == 1 && (arg >= 0 || arg == undefined))
                newArrayOfSlides.push(arrayOfSlides[i]);
        } else
            newArrayOfSlides.push(arrayOfSlides[i]);
    }


    if(arg >= 0 || arg == undefined)
        newArrayOfSlides.push(arrayOfSlides[0]);

    arrayOfSlides = newArrayOfSlides;
    // удаляем, через время анимации устанавливаем ивент-лисенер
    if(slider1.mode == 'manual' || slider1.mode == 'automanual'){

        getWrapper.removeEventListener('mousedown', slider1.funсMouseDown);
        clearTimeout(timerMovee);
        timerMovee = setTimeout( function(){
            getWrapper.addEventListener('mousedown', slider1.funсMouseDown);
        }, slider1.swipeSpeed);
    }

};

fadeObj.animationSlide = function(){
    var newArrayOfSlides = [];
    /*анимируем слайдер, создаем новый массив на следующий шаг анимации
     зависимости от arg работает разная ветка в иф и новый массив создается по разной логике
     если arg отрицательный, то слайдер крутится в обратную сторону, если 0 и больше, то все ок*/
    setTimeout(function(){
        arrayOfSlides[0].style.transition = 'none';
        arrayOfSlides[0].style.opacity = 1;
        arrayOfSlides[0].style.zIndex = -100;
    }, slider1.swipeSpeed);

    for (var i = 0; i < arrayOfSlides.length; i++){
        if(i == 0){

            arrayOfSlides[i].style.transition = 'opacity ' + slider1.swipeSpeed + 'ms linear';
           /* alert(arrayOfSlides[i].style.transition);
            alert(arrayOfSlides[i].style.opacity);*/
            arrayOfSlides[i].style.opacity = 0;
        } else if (i == 1){
            arrayOfSlides[i].style.zIndex = 100;
            arrayOfSlides[i].style.opacity = 1;
            newArrayOfSlides.push(arrayOfSlides[i]);
        } else {
            newArrayOfSlides.push(arrayOfSlides[i]);
        }
    }


    newArrayOfSlides.push(arrayOfSlides[0]);

    arrayOfSlides = newArrayOfSlides;

    // удаляем, через время анимации устанавливаем ивент-лисенер
    if(slider1.mode == 'manual' || slider1.mode == 'automanual'){
        getWrapper.removeEventListener('mousedown', slider1.funсMouseDown);
        clearTimeout(timerMovee);
        timerMovee = setTimeout( function(){
            getWrapper.addEventListener('mousedown', slider1.funсMouseDown);
        }, slider1.swipeSpeed);
    }


};

var interval;
interval = setInterval(function(){
    if(arrayOfSlides.length > 1){
        clearInterval(interval);
        if (slider1.type == 'slide'){
            if(slider1.mode == 'auto' || slider1.mode == 'automanual')
                interval = setInterval(slideObj.animationSlide, slider1.swipeDelay);
            else if(slider1.mode == 'manual')
                getWrapper.addEventListener('mousedown', slider1.funсMouseDown);
      } else if(slider1.type == 'fade'){
            if(slider1.mode == 'auto' || slider1.mode == 'automanual')
                interval = setInterval(fadeObj.animationSlide, slider1.swipeDelay);
             else if(slider1.mode == 'manual')
                getWrapper.addEventListener('mousedown', slider1.funсMouseDown);

        }
    }
},100);
















