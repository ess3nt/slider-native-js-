/**
 * Created by Igor on 24.04.16.
 */

var mainObj = {
    config: {
        // arbitrary number of images
        images: [
            'http://dedushka.org/demo/slider/i/1.jpg',
            'http://dedushka.org/demo/slider/i/2.jpg',
            'http://dedushka.org/demo/slider/i/3.jpg',
            'http://dedushka.org/demo/slider/i/4.jpg',
            'http://dedushka.org/demo/slider/i/5.jpg'
        ],
        // possible values: 'auto', 'manual', 'automanual'
        mode: 'manual',
        // arbitrary interger (miliseconds)
        swipeSpeed: 500,
        // arbitrary interger (miliseconds). This is used in 'auto' and 'automanual' modes
        swipeDelay: 3000,
        // 'slide' or 'fade'
        type: 'slide'
    }


};

var slideObj = Object.create(mainObj);
var fadeObj = Object.create(mainObj);
var getWrapper;


mainObj.createDomElement = function(type, className, link){
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
mainObj.generateSlider = function (){

    getWrapper = document.body.appendChild(mainObj.createDomElement('div', 'slider'));
    // узнаем макс ширину и высоту обертки слайдера и устанавливаем ее

    (function(){
        for(var i = 0; i < mainObj.config.images.length; i++){
            var newImg = mainObj.createDomElement('img', 'slides', mainObj.config.images[i]);
            validImgs.push(newImg);

            function checkImg(newElement, i){

                newElement.onload = function(){
                    counter++;
                    if(counter == mainObj.config.images.length)
                        deleteBrokenImgs();
                };

                newElement.onerror = function(){
                    counter++;
                    delete validImgs[i];
                    if(counter == mainObj.config.images.length)
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
                if(mainObj.config.type == 'slide'){
                    for (i = 0; i < validImgs.length; i++){
                        if(i == 0)
                            validImgs[i].style.left = 0 + 'px';
                        else
                            validImgs[i].style.left = maxWidth + 'px';
                    }
                } else if(mainObj.config.type == 'fade'){
                    for (i = 0; i < validImgs.length; i++){
                        validImgs[i].style.transition = 'opacity ' + mainObj.config.swipeSpeed + 'ms linear';
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



var arrayOfSlides = mainObj.generateSlider();

var mouseX0;
var mouseX1;
var timerMove;
var timerMovee;

slideObj.funcMouseMove = function(e) {
    mouseX1 = e.clientX;
    getWrapper.removeEventListener('mousedown', mainObj.funсMouseDown);
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
    if(mainObj.config.mode == 'auto' || mainObj.config.mode == 'automanual'){
        clearInterval(interval);
        interval = setInterval(slideObj.animationSlide, mainObj.config.swipeDelay);
    }

};

slideObj.funcMouseUp = function(){
    clearTimeout(timerMove);
    getWrapper.removeEventListener('mousedown', mainObj.funсMouseDown);
    getWrapper.removeEventListener('mousemove', slideObj.funcMouseMove);
    getWrapper.removeEventListener('mouseup', slideObj.funcMouseUp);
    if(mainObj.config.mode == 'auto' || mainObj.config.mode == 'automanual'){
        clearInterval(interval);
        interval = setInterval(slideObj.animationSlide, mainObj.config.swipeDelay);
    }
    slideObj.animationSlide(0);

};

mainObj.funсMouseDown = function(e){
    getWrapper.ondragstart = function() {
        return false;
    };
    if (mainObj.config.type == 'slide'){
        mouseX0 = e.clientX;
        getWrapper.addEventListener('mouseup', slideObj.funcMouseUp);
        timerMove = setTimeout(function(){
            getWrapper.addEventListener('mousemove', slideObj.funcMouseMove);

        },100);
    } else if(mainObj.config.type == 'fade'){
        fadeObj.animationSlide();
        if(mainObj.config.mode == 'auto' || mainObj.config.mode == 'automanual'){
            clearInterval(interval);
            interval = setInterval(fadeObj.animationSlide, mainObj.config.swipeDelay);
        }
    }
};

slideObj.animationSlide = function(arg){
    var newArrayOfSlides = [];
    /*анимируем слайдер, создаем новый массив на следующий шаг анимации
     зависимости от arg работает разная ветка в иф и новый массив создается по разной логике
     если arg отрицательный, то слайдер крутится в обратную сторону, если 0 и больше, то все ок*/

    if(arg >= 0 || arg == undefined){
        setTimeout(function(){
            arrayOfSlides[arrayOfSlides.length -1].style.transition = 'none';
            arrayOfSlides[arrayOfSlides.length -1].style.zIndex = -100;
            arrayOfSlides[arrayOfSlides.length -1].style.left = maxWidth + 'px';
        }, mainObj.config.swipeSpeed);
    } else
        newArrayOfSlides.push(arrayOfSlides[arrayOfSlides.length -1]);

    for (var i = 0; i < arrayOfSlides.length; i++){
        if(i == 0){
            arrayOfSlides[i].style.transition = 'left ' + mainObj.config.swipeSpeed + 'ms linear';
            if(arg >= 0 || arg == undefined)
                arrayOfSlides[i].style.left = -maxWidth + 'px';
            else {
                arrayOfSlides[i].style.left = maxWidth + 'px';
                newArrayOfSlides.push(arrayOfSlides[i]);
            }
        } else if ((i == arrayOfSlides.length -1 && arg < 0) || (i == 1 && (arg >= 0 || arg == undefined))){
            arrayOfSlides[i].style.left = 0 + 'px';
            arrayOfSlides[i].style.zIndex = 100;
            arrayOfSlides[i].style.transition = 'left ' + mainObj.config.swipeSpeed + 'ms linear';
            if (i == 1 && (arg >= 0 || arg == undefined))
                newArrayOfSlides.push(arrayOfSlides[i]);
        } else
            newArrayOfSlides.push(arrayOfSlides[i]);
    }


    if(arg >= 0 || arg == undefined)
        newArrayOfSlides.push(arrayOfSlides[0]);

    arrayOfSlides = newArrayOfSlides;
    // удаляем, через время анимации устанавливаем ивент-лисенер
    if(mainObj.config.mode == 'manual' || mainObj.config.mode == 'automanual'){

        getWrapper.removeEventListener('mousedown', mainObj.funсMouseDown);
        clearTimeout(timerMovee);
        timerMovee = setTimeout( function(){
            getWrapper.addEventListener('mousedown', mainObj.funсMouseDown);
        }, mainObj.config.swipeSpeed);
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
    }, mainObj.config.swipeSpeed);

    for (var i = 0; i < arrayOfSlides.length; i++){
        if(i == 0){
            arrayOfSlides[i].style.transition = 'opacity ' + mainObj.config.swipeSpeed + 'ms linear';
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
    if(mainObj.config.mode == 'manual' || mainObj.config.mode == 'automanual'){
        getWrapper.removeEventListener('mousedown', mainObj.funсMouseDown);
        clearTimeout(timerMovee);
        timerMovee = setTimeout( function(){
            getWrapper.addEventListener('mousedown', mainObj.funсMouseDown);
        }, mainObj.config.swipeSpeed);
    }


};

var interval;
interval = setInterval(function(){
    if(arrayOfSlides.length > 1){
        clearInterval(interval);
        if (mainObj.config.type == 'slide'){
            if(mainObj.config.mode == 'auto' || mainObj.config.mode == 'automanual')
                interval = setInterval(slideObj.animationSlide, mainObj.config.swipeDelay);
            else if(mainObj.config.mode == 'manual')
                getWrapper.addEventListener('mousedown', mainObj.funсMouseDown);
        } else if(mainObj.config.type == 'fade'){
            if(mainObj.config.mode == 'auto' || mainObj.config.mode == 'automanual')
                interval = setInterval(fadeObj.animationSlide, mainObj.config.swipeDelay);
            else if(mainObj.config.mode == 'manual')
                getWrapper.addEventListener('mousedown', mainObj.funсMouseDown);

        }
    }
},100);












