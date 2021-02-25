
var galleryThumbs = new Swiper('.swiper-thumbs', {
        slidesPerView: 'auto',
        mousewheel: true,
        forceToAxis: true,
        watchOverflow: true,
        speed: 300,
        freeMode: true,
        effect: 'slide',
        ploadeImages: false,
        keyboard: 
            {
                enabled: true,
                onlyInViewport: false,
            },
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        centerInsufficientSlides: true,
        scrollbar: 
            {
                el: '.scrollbar-thumbs',
                draggable: true,
                hide: true,
                snapOnRelease: true,
            },
    
  
  });
  
  var galleryTop = new Swiper('.swiper-gallery', {
    
        slidesPerView: 1,
        watchOverflow: true,
        speed: 1,
        zoom: 
            {
               maxRatio: 3,
               containerClass: 'swiper-zoom-container',
               zoomedSlideClass: 'swiper-zoom-target'
            },
        freeMode: false,
        mousewheel:
            {
            thresholdDelta: 40,
            forceToAxis: true,
            },
        watchSlidesVisibility: true,
        keyboard: 
            {
                enabled: true,
                onlyInViewport: false,
            },
        effect: 'fade',
        preloadImages: false,
        fadeEffect: 
            {
             crossFade: true
            },
        watchSlidesProgress: true,
        thumbs: 
            {
            swiper: galleryThumbs,
            },
        hashNavigation: true,
        navigation: 
            {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            }
  
  });