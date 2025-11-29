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


// ===== Collection Slider =====
const collectionSlider = document.querySelector('.collection-slider');
if (collectionSlider) {
    const slides = collectionSlider.querySelectorAll('.collection-preview');
    const dots = collectionSlider.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    let sliderInterval = null;
    const SLIDE_DURATION = 2500;

    function goToSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }

    function startAutoSlide() {
        if (sliderInterval) clearInterval(sliderInterval);
        sliderInterval = setInterval(nextSlide, SLIDE_DURATION);
    }

    function stopAutoSlide() {
        if (sliderInterval) {
            clearInterval(sliderInterval);
            sliderInterval = null;
        }
    }

    // Клик по точкам
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            startAutoSlide();
        });
    });

    // Пауза при наведении
    collectionSlider.addEventListener('mouseenter', stopAutoSlide);
    collectionSlider.addEventListener('mouseleave', startAutoSlide);

    // Запуск автослайда
    startAutoSlide();
}