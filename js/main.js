/**
 * Created by Igor on 20.05.16.
 */
var Slider = function(container, mode, swipeSpeed, swipeDelay, type, imagesUrl){
    this.container = container;
    this.mode = mode;
    this.swipeSpeed = swipeSpeed;
    this.swipeDelay = swipeDelay;
    this.type = type;
    this.images = imagesUrl;
};



var Slide = function(){/*Slider.call(this);*/};
var Fade = function(){/*Slider.call(this);*/};

Slide.prototype = Object.create(Slider.prototype);
Fade.prototype = Object.create(Slider.prototype);

var activeSliders = {
    slider1: new Slider(
        /*  container: */document.getElementsByTagName('div')[0], //область в которую слайдер рендерить
        /*  mode: */'automanual',
        /* swipeSpeed:*/ 500,
        /* swipeDelay:*/ 3000,
        /*  type:*/ 'fade',
        /*  images:*/ ['./img/1.jpg',
            './img/2.jpg',
            './img/3.jpg',
            './img/4.jpg'
        ]),
    slider2: new Slider(
        /*  container: */document.getElementsByClassName('poc')[0], //область в которую слайдер рендерить
        /*  mode: */'automanual',
        /* swipeSpeed:*/ 500,
        /* swipeDelay:*/ 3000,
        /*  type:*/ 'slide',
        /*  images:*/ ['./img/1.jpg',
            './img/2.jpg',
            './img/3.jpg',
            './img/4.jpg'
        ]),
    slider3: new Slider(
        /*  container: */document.getElementsByClassName('pocc')[0], //область в которую слайдер рендерить
        /*  mode: */'automanual',
        /* swipeSpeed:*/ 1000,
        /* swipeDelay:*/ 5000,
        /*  type:*/ 'slide',
        /*  images:*/ [ 'http://dedushka.org/demo/slider/i/1.jpg',
            'http://dedushka.org/demo/slider/i/2.jpg',
            'http://dedushka.org/demo/slider/i/3.jpg',
            'http://dedushka.org/demo/slider/i/4.jpg',
            'http://dedushka.org/demo/slider/i/5.jpg']),
    slider4: new Slider(
        /*  container: */document.getElementsByClassName('inli')[0], //область в которую слайдер рендерить
        /*  mode: */'automanual',
        /* swipeSpeed:*/ 1000,
        /* swipeDelay:*/ 5000,
        /*  type:*/ 'fade',
        /*  images:*/ [ 'http://dedushka.org/demo/slider/i/1.jpg',
            'http://dedushka.org/demo/slider/i/2.jpg',
            'http://dedushka.org/demo/slider/i/3.jpg',
            'http://dedushka.org/demo/slider/i/4.jpg',
            'http://dedushka.org/demo/slider/i/5.jpg'])
};


function initSliders(obj){
    if (obj.type == 'fade'){
        obj.__proto__ = Object.create(Fade.prototype);
    } else if (obj.type == 'slide'){
        obj.__proto__ = Object.create(Slide.prototype);
    }
}

for (var key in activeSliders){
    if(activeSliders.hasOwnProperty(key)) {
        initSliders(activeSliders[key]);
    }
}

Fade.prototype.findStartPosition = function(){
    for (var i = 0; i <  this.validImgs.length; i++){
        this.validImgs[i].style.transition = 'opacity ' + this.swipeSpeed + 'ms linear';
        this.validImgs[i].style.opacity = 0;
        if(i == 0){
            this.validImgs[i].style.left = 0 + 'px';
            this.validImgs[i].style.zIndex = 100;
            this.validImgs[i].style.opacity = 1;
        } else if( i == 1)
            this.validImgs[i].style.zIndex = 50;
        else
            this.validImgs[i].style.zIndex = -100;
    }
};

Slide.prototype.findStartPosition = function(){
    for (var i = 0; i <  this.validImgs.length; i++){
        if(i == 0)
            this.validImgs[i].style.left = 0 + 'px';
        else
            this.validImgs[i].style.left = this.maxWidth + 'px';
    }
};

var createDomElement = function(type, className, link){
    var element =  document.createElement(type);
    if (className)
        element.className = className;
    if (link)
        element.setAttribute('src', link);
    return element;
};

Slider.prototype.generateSlider = function (some){
    var maxWidth, maxHeight;
    var counter = 0;
    var obj = this;
    obj.validImgs = [];
    obj.container.className = obj.container.className + ' ' + obj.type;
    var getWrapper = obj.container.appendChild(createDomElement('div', 'slider'));
    getWrapper.setAttribute('data-count', some);
    // узнаем макс ширину и высоту обертки слайдера и устанавливаем ее

    (function(){
        for(var i = 0; i < obj.images.length; i++){
            var newImg = createDomElement('img', 'slides', obj.images[i]);
            obj.validImgs.push(newImg);

            function checkImg(newElement, i){

                newElement.onload = function(){
                    counter++;
                    if(counter == obj.images.length)
                        deleteBrokenImgs();
                };

                newElement.onerror = function(){
                    counter++;
                    delete obj.validImgs[i];
                    if(counter == obj.images.length)
                        deleteBrokenImgs();
                };
            }
            checkImg(newImg, i);

            function deleteBrokenImgs(){
                var newArr = [];
                for (var i = 0; i < obj.validImgs.length; i++ ){
                    if(obj.validImgs[i] != undefined)
                        newArr.push(obj.validImgs[i]);
                }
                obj.validImgs = newArr;
                buildSlider();
            }

            function buildSlider(){
                for(var i = 0; i < obj.validImgs.length; i++){
                    getWrapper.appendChild(obj.validImgs[i]);

                    if(maxHeight <  obj.validImgs[i].naturalHeight || !maxHeight ){
                        maxHeight =  obj.validImgs[i].naturalHeight;
                        getWrapper.style.height = maxHeight + 'px';
                    }
                    if(maxWidth <  obj.validImgs[i].naturalWidth || !maxWidth ){
                        maxWidth =  obj.validImgs[i].naturalWidth;
                        getWrapper.style.width = maxWidth + 'px';
                    }
                }
                obj.maxWidth = maxWidth;
                // находим начальное положение изображений

                   obj.findStartPosition();

            }
        }
    })();
return obj.container.getElementsByTagName('div')[0].getElementsByTagName('img');
    //return document.body.getElementsByClassName('slides');
};

for (var some in activeSliders){
    if(activeSliders.hasOwnProperty(some)) {
        activeSliders[some].arrayOfSlides = activeSliders[some].generateSlider(some);
    }
}

Slider.prototype.funсMouseDown = function(){
  //  this.container.removeEventListener('mousedown', this.eventMouseDown);
    this.container.addEventListener('mousedown', this.eventMouseDown);
};

Slider.prototype.eventMouseDown = function(e){
    var domElement = this;
    domElement.ondragstart = function() {
        return false;
    };

    var objSlider = this.getElementsByClassName('slider')[0].getAttribute('data-count');
    if (domElement.className.indexOf('slide') >= 0){
        activeSliders[objSlider].mouseX0 = e.clientX;

          activeSliders[objSlider].container.addEventListener('mouseup', activeSliders[objSlider].funcMouseUp);
          activeSliders[objSlider].timerMove = setTimeout(function(){
          activeSliders[objSlider].container.addEventListener('mousemove', activeSliders[objSlider].funcMouseMove);
         },100);
        // todo разобраться тут
    } else if (domElement.className.indexOf('fade') >= 0){
        activeSliders[objSlider].animationSlide();
        if(activeSliders[objSlider].mode == 'auto' || activeSliders[objSlider].mode == 'automanual'){
             clearInterval(activeSliders[objSlider].interval);
            activeSliders[objSlider].interval = setInterval(activeSliders[objSlider].animationSlide.bind(activeSliders[objSlider]), activeSliders[objSlider].swipeDelay);
        }
    }
};

Slider.prototype.funcMouseUp = function(){
    var objSlider = this.getElementsByClassName('slider')[0].getAttribute('data-count');
    clearTimeout(activeSliders[objSlider].timerMove);
    activeSliders[objSlider].container.removeEventListener('mousedown', activeSliders[objSlider].eventMouseDown);
    activeSliders[objSlider].container.removeEventListener('mousemove', activeSliders[objSlider].funcMouseMove);
    activeSliders[objSlider].container.removeEventListener('mouseup',  activeSliders[objSlider].funcMouseUp);
    if(activeSliders[objSlider].mode == 'auto' || activeSliders[objSlider].mode == 'automanual'){
        clearInterval(activeSliders[objSlider].interval);
        activeSliders[objSlider].interval = setInterval(activeSliders[objSlider].animationSlide.bind(activeSliders[objSlider]),  activeSliders[objSlider].swipeDelay);
    }
    activeSliders[objSlider].animationSlide(0);

};

Slider.prototype.funcMouseMove = function(e) {
    var objSlider = this.getElementsByClassName('slider')[0].getAttribute('data-count');
    var mouseX1 = e.clientX;
    activeSliders[objSlider].container.removeEventListener('mousedown', activeSliders[objSlider].funсMouseDown);
    activeSliders[objSlider].container.removeEventListener('mousemove', activeSliders[objSlider].funcMouseMove);
    activeSliders[objSlider].container.removeEventListener('mouseup', activeSliders[objSlider].funcMouseUp);

    if(activeSliders[objSlider].mouseX0 - mouseX1 < 0){
        activeSliders[objSlider].arrayOfSlides[activeSliders[objSlider].arrayOfSlides.length -1].style.transition = 'none';
        activeSliders[objSlider].arrayOfSlides[activeSliders[objSlider].arrayOfSlides.length -1].style.zIndex = -100;
        activeSliders[objSlider].arrayOfSlides[activeSliders[objSlider].arrayOfSlides.length -1].style.left = - activeSliders[objSlider].maxWidth + 'px';
        setTimeout(function(){
            activeSliders[objSlider].animationSlide(activeSliders[objSlider].mouseX0 - mouseX1);
        }, 10);
    } else
        activeSliders[objSlider].animationSlide(activeSliders[objSlider].mouseX0 - mouseX1);
    if( activeSliders[objSlider].mode == 'auto' ||  activeSliders[objSlider].mode == 'automanual'){
        clearInterval(activeSliders[objSlider].interval);
        activeSliders[objSlider].interval = setInterval(activeSliders[objSlider].animationSlide.bind(activeSliders[objSlider]), activeSliders[objSlider].swipeDelay);
    }

};



Slide.prototype.animationSlide = function(arg){
    var obj = this;
    var arrayOfSlides = this.arrayOfSlides;
    var newArrayOfSlides = [];

    /*анимируем слайдер, создаем новый массив на следующий шаг анимации
     зависимости от arg работает разная ветка в иф и новый массив создается по разной логике
     если arg отрицательный, то слайдер крутится в обратную сторону, если 0 и больше, то все ок*/
obj.slideDelay = function(){
    arrayOfSlides[arrayOfSlides.length -1].style.transition = 'none';
    arrayOfSlides[arrayOfSlides.length -1].style.zIndex = -100;
    arrayOfSlides[arrayOfSlides.length -1].style.left = obj.maxWidth + 'px';
};
    if(arg >= 0 || arg == undefined){
        setTimeout(obj.slideDelay.bind(obj), this.swipeSpeed);
    } else
        newArrayOfSlides.push(arrayOfSlides[arrayOfSlides.length -1]);

    for (var i = 0; i < arrayOfSlides.length; i++){
        if(i == 0){
            arrayOfSlides[i].style.transition = 'left ' + obj.swipeSpeed + 'ms linear';
            if(arg >= 0 || arg == undefined)
                arrayOfSlides[i].style.left = - obj.maxWidth + 'px';
            else {
                arrayOfSlides[i].style.left = obj.maxWidth + 'px';
                newArrayOfSlides.push(arrayOfSlides[i]);
            }
        } else if ((i == arrayOfSlides.length -1 && arg < 0) || (i == 1 && (arg >= 0 || arg == undefined))){
            arrayOfSlides[i].style.left = 0 + 'px';
            arrayOfSlides[i].style.zIndex = 100;
            arrayOfSlides[i].style.transition = 'left ' + this.swipeSpeed + 'ms linear';
            if (i == 1 && (arg >= 0 || arg == undefined))
                newArrayOfSlides.push(arrayOfSlides[i]);
        } else
            newArrayOfSlides.push(arrayOfSlides[i]);
    }


    if(arg >= 0 || arg == undefined)
        newArrayOfSlides.push(arrayOfSlides[0]);

    this.arrayOfSlides = newArrayOfSlides;
    // удаляем, через время анимации устанавливаем ивент-лисенер
    if(obj.mode == 'manual' || obj.mode == 'automanual'){
        clearTimeout(obj.timerMovee);
        obj.container.removeEventListener('mousedown', obj.eventMouseDown);
        obj.timerMovee = setTimeout( function(){

            obj.funсMouseDown();
        }, obj.swipeSpeed);
    }
};

Fade.prototype.animationSlide = function(){
    var obj = this;
    var arrayOfSlides = this.arrayOfSlides;
    var newArrayOfSlides = [];
/*    setTimeout(function(){
        console.log('500', arrayOfSlides[0]);
        arrayOfSlides[0].style.transition = 'none';
        arrayOfSlides[0].style.opacity = 1;
        arrayOfSlides[0].style.zIndex = -100;
    }, obj.swipeSpeed);*/

    for (var i = 0; i < arrayOfSlides.length; i++){
        if(i == 0){
   //         arrayOfSlides[i].style.transition = 'opacity ' + obj.swipeSpeed + 'ms linear';
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

    this.arrayOfSlides = newArrayOfSlides;

    // удаляем, через время анимации устанавливаем ивент-лисенер
    if(obj.mode == 'manual' || obj.mode == 'automanual'){
        clearTimeout(obj.timerMove);
        obj.container.removeEventListener('mousedown', obj.eventMouseDown);
        obj.timerMove = setTimeout( function(){
            obj.funсMouseDown();
        }, obj.swipeSpeed);
    }


};

Slider.prototype.initSliders = function(){
    var interval;
    var obj = this;
      (function(){
          interval = setInterval(function(){
          if(obj.arrayOfSlides.length > 1){
              clearInterval(interval);
              if (obj.type == 'slide'){
                  if(obj.mode == 'auto' || obj.mode == 'automanual')
                      obj.interval = setInterval(obj.animationSlide.bind(obj), obj.swipeDelay);
                  else if(obj.mode == 'manual')
                      obj.container.addEventListener('mousedown', obj.funсMouseDown);
              } else if(obj.type == 'fade'){
                  if(obj.mode == 'auto' || obj.mode == 'automanual')
                      obj.interval = setInterval(obj.animationSlide.bind(obj), obj.swipeDelay);
                  else if(obj.mode == 'manual')
                      obj.container.addEventListener('mousedown', obj.funсMouseDown);

              }
          }


          },100);


      })()

};



for (var slid in activeSliders){
    if(activeSliders.hasOwnProperty(slid)) {
        activeSliders[slid].initSliders();
    }
}






