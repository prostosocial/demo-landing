const popup = document.getElementById('popup');

const popupContent = popup.querySelector('.popup-content');
const popupHeaderPanel = popup.querySelector('.popup-header-panel');
const popupTitle = popup.querySelector('.popup-header-title');
const contentContainer = popup.querySelector('#contentContainer');

const blurEl = popup.querySelector('.blur-layer');

var popupIsOpen = false;

function openPopup(title, iconId, contentFile, action, isEnabledBlur = true) {

    blurEl.style.display = isEnabledBlur ? 'block' : 'none';

    popupIsOpen = true;

    contentContainer.innerHTML = '';

    document.body.style.overflow = 'hidden';

    popupHeaderPanel.onclick = action;

    popupTitle.querySelector('span').textContent = title;

    popupTitle.querySelector('svg use').setAttribute('href', iconId);

    popup.classList.add('active');
    
    fetch(contentFile)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка загрузки файла: ${response.status}`);
            }
            return response.text();
        })
        .then(content => {
            contentContainer.innerHTML = content;

            // Синхронизировать тариф если это попап оплаты
            if (contentFile.includes('tiers.html')) {
                setTimeout(syncTierInPopup, 50);
            }

            requestAnimationFrame(() => {
                popupContent.classList.add('show');
            });
        })
        .catch(error => {
            console.error('Ошибка при загрузке содержимого:', error);
            contentContainer.innerHTML = `<p>Ошибка загрузки содержимого: ${error.message}</p>`;
            popup.style.display = 'flex';
        });

    popup.scrollTop = popupContent.scrollTop = contentContainer.scrollTop = 0;
}

function switchPopupContent(title, iconId, contentFile, action, isEnabledBlur = true) {
    
  popupContent.classList.remove('show');

  setTimeout(() => {
      blurEl.style.display = isEnabledBlur ? 'block' : 'none';

      contentContainer.innerHTML = '';

      popupTitle.querySelector('span').textContent = title;

      popupTitle.querySelector('svg use').setAttribute('href', iconId);

      popupHeaderPanel.onclick = action;

      fetch(contentFile)
          .then(response => {
              if (!response.ok) {
                  throw new Error(`Ошибка загрузки файла: ${response.status}`);
              }
              return response.text();
          })
          .then(content => {
              contentContainer.innerHTML = content;

              requestAnimationFrame(() => {
                  popupContent.classList.add('show');
              });
          })
          .catch(error => {
              console.error('Ошибка при загрузке содержимого:', error);
              contentContainer.innerHTML = `<p>Ошибка загрузки содержимого: ${error.message}</p>`;
          });

      popup.scrollTop = popupContent.scrollTop = contentContainer.scrollTop = 0;

  }, 300); 
}


function closePopup() {

  popupIsOpen = false;

    popupContent.classList.remove('show');
    
    setTimeout(() => {
        popup.style.opacity = '0';
        
        document.body.style.overflow = '';
        
        setTimeout(() => {
            popup.classList.remove('active');
            popup.style.opacity = ''; 
            
            contentContainer.innerHTML = '';

            popupContent.style.transition = '';
            popupContent.style.transform = '';
        }, 500); 
    }, 100);
}

function onToggleItem(item) {

    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    const contentInner = content.querySelector('.accordion-content-inner');
    
    const isActive = item.classList.toggle('active');
    
    if (isActive) {
        const height = contentInner.offsetHeight;
        content.style.maxHeight = `${height}px`;
    } else {
        content.style.maxHeight = '0px';
    }          
}

function toggleOption(option) {
    const toggler = option.parentElement;
    const options = toggler.querySelectorAll('.toggler-option');
    const slider = toggler.querySelector('.toggler-slider');
    const isVertical = toggler.classList.contains('vertical');
    const index = parseInt(option.dataset.index);

    toggler.dataset.selected = index;

    options.forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');

    if (isVertical) {
        slider.style.transform = `translateY(${index * 100}%)`;
    } else {
        slider.style.transform = `translateX(${index * 100}%)`;
    }

    document.dispatchEvent(new CustomEvent('toggleChange', {
        detail: {
            togglerId: toggler.id,
            selectedIndex: index
        }
    }));
}


var card = 'russian';
var tier = 'tier1';

// Выбор тарифа на основном экране
function selectPricingOption(element, tierType) {
    tier = tierType;

    const options = document.querySelectorAll('.pricing-option');
    options.forEach(opt => opt.classList.remove('pricing-option-active'));
    element.classList.add('pricing-option-active');
}

// Синхронизация тарифа в попапе при открытии
function syncTierInPopup() {
    const tier1 = document.getElementById('tier-1');
    const tier2 = document.getElementById('tier-2');

    if (tier1 && tier2) {
        if (tier === 'tier1') {
            tier1.classList.add('selected');
            tier2.classList.remove('selected');
            const slider = tier1.parentElement.querySelector('.toggler-slider');
            if (slider) slider.style.transform = 'translateY(0%)';
        } else {
            tier1.classList.remove('selected');
            tier2.classList.add('selected');
            const slider = tier1.parentElement.querySelector('.toggler-slider');
            if (slider) slider.style.transform = 'translateY(100%)';
        }
    }
}

function choosePaymentMethod(cardType, option){

  card = cardType;

  const emailSection = document.getElementById('mailform');
  const tier1 = document.getElementById("tier-1");
  const tier2 = document.getElementById("tier-2");

  const tier1name = tier1.querySelector("h3");
  const tier1desc = tier1.querySelector(".tierdesc");

  const tier2name = tier2.querySelector("h3");
  const tier2desc = tier2.querySelector(".tierdesc");

  const emailInput = document.getElementById('email'); 

  if(cardType === "foreign"){
    emailSection.classList.remove('hidden');
    
    tier1name.textContent = '15';
    tier1name.parentElement.querySelector("span").textContent = '$';
    tier1desc.textContent = 'Один месяц, подписка';

    tier2name.textContent = '190';
    tier2name.parentElement.querySelector("span").textContent = '$';

    emailInput.setAttribute('required', '');
  }
  else{
    emailSection.classList.add('hidden');

    tier1name.textContent = '2900';
    tier1name.parentElement.querySelector("span").textContent = '₽';
    tier1desc.textContent = 'Три месяца, подписка';

    tier2name.textContent = '14900';
    tier2name.parentElement.querySelector("span").textContent = '₽';

    emailInput.removeAttribute('required');
  }

  toggleOption(option);

}

function chooseTier(tierType, option){

  tier = tierType;

  const option1Radio = document.getElementById('subOption1Radio');
  const option2Radio = document.getElementById('subOption2Radio');

  if(tierType === 'tier1'){
    option1Radio.checked = true;
  }
  else{
    option2Radio.checked = true;
  }

  toggleOption(option);
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}


let isSubmitting = false;
const form = document.getElementById('paymentForm');

form.addEventListener('submit', function(e) {
  if (isSubmitting) {
      e.preventDefault();
      return;
  }

  if(card === 'foreign'){
    const emailInput = document.getElementById('email');
    if (!validateEmail(emailInput.value)) {
      e.preventDefault();
      isSubmitting = false;
    }
    else{
      isSubmitting = true;
    }
  }
  else{
    isSubmitting = true;
    e.preventDefault();

    let redirectUrl = '';

    if(tier === "tier1"){
      redirectUrl = 'https://prosto.social/checkout/?add-to-cart=16611';
    }
    else{
      redirectUrl = 'https://prosto.social/checkout/?add-to-cart=1340';
    }

    setTimeout(() => { window.location.href = redirectUrl; }, 100);
  }

});


// ===== Responsive Sliders (Swiper) =====
const MOBILE_BREAKPOINT = 768;

// Base configs
const collectionBaseConfig = {
    loop: true,
    autoplay: {
        delay: 6000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
    },
    pagination: {
        el: '.collection-slider .slider-dots',
        clickable: true,
        bulletClass: 'slider-dot',
        bulletActiveClass: 'active'
    },
    navigation: {
        nextEl: '.collection-slider .slider-arrow-next',
        prevEl: '.collection-slider .slider-arrow-prev'
    }
};

const testimonialBaseConfig = {
    loop: true,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
    },
    pagination: {
        el: '.testimonial-slider .testimonial-dots',
        clickable: true,
        bulletClass: 'testimonial-dot',
        bulletActiveClass: 'active'
    },
    navigation: {
        nextEl: '.testimonial-slider .slider-arrow-next',
        prevEl: '.testimonial-slider .slider-arrow-prev'
    }
};

// Mobile config additions
const mobileConfig = {
    slidesPerView: 1.15,
    centeredSlides: true,
    spaceBetween: 12
};

// Desktop config additions
const desktopConfig = {
    slidesPerView: 1,
    effect: 'fade',
    fadeEffect: { crossFade: true }
};

let collectionSwiper = null;
let testimonialSwiper = null;
let currentMode = null;

function initSwipers() {
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    const newMode = isMobile ? 'mobile' : 'desktop';

    if (currentMode === newMode) return;
    currentMode = newMode;

    // Destroy existing swipers
    if (collectionSwiper) {
        collectionSwiper.destroy(true, true);
        collectionSwiper = null;
    }
    if (testimonialSwiper) {
        testimonialSwiper.destroy(true, true);
        testimonialSwiper = null;
    }

    const modeConfig = isMobile ? mobileConfig : desktopConfig;

    collectionSwiper = new Swiper('.collection-slider', {
        ...collectionBaseConfig,
        ...modeConfig
    });

    testimonialSwiper = new Swiper('.testimonial-slider', {
        ...testimonialBaseConfig,
        ...modeConfig
    });
}

// Initialize on load
initSwipers();

// Reinitialize on resize (debounced)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initSwipers, 150);
});

// ===== FAQ Preview Accordion =====
function toggleFaqPreview(item) {
    const content = item.querySelector('.faq-preview-content');
    const contentInner = content.querySelector('.faq-preview-content-inner');
    const isActive = item.classList.toggle('active');

    if (isActive) {
        content.style.maxHeight = contentInner.offsetHeight + 'px';
    } else {
        content.style.maxHeight = '0px';
    }
}