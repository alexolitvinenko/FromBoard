$(function() {
	$('a').on('touchend, click', (event) => {
		event.preventDefault();
		if ($(event.currentTarget).hasClass('menu__link_mobile')) {
			$('.overlay').toggleClass('overlay_active');
			$('.header__bottom-block_mobile').slideToggle();
		}
		let anchor = $(event.currentTarget).attr('href');
		$('body,html').animate({
			scrollTop: $(anchor).offset().top
		}, 800);
	});

	$('.burger').on('click', (event) => {
		$('.overlay').css({'z-index': $(event.currentTarget).css('z-index')}).toggleClass('overlay_active');
		$('.header__bottom-block_mobile').slideToggle();
	});

	$('.reviews__slider').slick({
		infinite: true,
		slidesToShow: 2,
		slidesToScroll: 2,
		responsive: [
			{
				breakpoint: 1044,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					infinite: true
				}
			}
		]
	});

	$('.calculator-form, .question-form').on('submit', (event) => {
		event.preventDefault();
		let name = $(event.currentTarget).find('input[name="name"]').val();
		$('.success-modal__text').text(`${name}, ваша заявка отправлена! Ожидайте ответа по указанному телефону.`)
		$(event.currentTarget)[0].reset();
		$('.overlay').css({'z-index': $('.success-modal').css('z-index')}).toggleClass('overlay_active');
		$('.success-modal').fadeIn();
	});
	$('.success-modal__close-btn, .success-modal__btn').on('click', (event) => {
		event.preventDefault();
		$('.success-modal').fadeOut();
		$('.overlay').toggleClass('overlay_active');
	});

	$('.guarantees__more-btn').on('click', (event) => {
		event.preventDefault();
		if ($('.guarantees__item_hidden').length > 0) {
			$('.guarantees__item_hidden:lt(4)').toggleClass('guarantees__item_hidden');
			if ($('.guarantees__item_hidden').length === 0) {
				$('.guarantees__more-btn').addClass('guarantees__more-btn_hidden')
			}
		}
	});
});

let CBR_XML_Daily_Ru = (rates) => {
	let USDrate = rates.Valute.USD.Value.toFixed(2).replace('.', ',');
	$('.USD').text(USDrate);
  
	let EURrate = rates.Valute.EUR.Value.toFixed(2).replace('.', ',');
	$('.EUR').text(EURrate);
	
	let CNYrate = rates.Valute.CNY.Value.toFixed(2).replace('.', ',');
	$('.CNY').text(CNYrate);
}