window.addEventListener('load', function() {
        const body = document.querySelector('body');
        const bgPopup = document.querySelector('.bg_onetime_popup');
        const popup = document.querySelector('.onetime_popup');
        const popupTitleClose = document.querySelector('.onetime_popup_title_close');
        body.classList.add('open_popup');

        bgPopup.addEventListener('click', function() {
            closePopup();
        });
        popup.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        popupTitleClose.addEventListener('click', function() {
            closePopup();
        });

        function closePopup() {
            body.classList.remove('open_popup');
        }
}, false);