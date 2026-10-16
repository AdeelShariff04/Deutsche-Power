(function($) {
	"use strict";

	/* ===============================
    	DOM READY (single entry)
	=============================== */
	document.addEventListener("DOMContentLoaded", function () {
		const html = document.documentElement;

		/* ---------- PRELOADER ---------- */
		const preloader = document.getElementById("preloader");
		const textEl = document.getElementById("preloader-text");

		if (preloader && textEl) {
			let progress = 0;
			const fakeLoading = setInterval(() => {
				progress++;
				textEl.textContent = progress + "%";
				if (progress >= 100) {
					clearInterval(fakeLoading);
					preloader.classList.add("fade-out");
					setTimeout(() => preloader.remove(), 1000);
				}
			}, 10);
		}

		/* ---------- RTL TOGGLE ---------- */
		(function () {
			const savedDir = localStorage.getItem("direction") || "ltr";

			// Restore direction on load
			html.setAttribute("dir", savedDir);
			html.classList.add(savedDir);
			html.classList.remove(savedDir === "rtl" ? "ltr" : "rtl");

			const rtlBtn = document.getElementById("rtlToggle");
			if (rtlBtn) {
				rtlBtn.addEventListener("click", function () {
					const isRTL = html.getAttribute("dir") === "rtl";
					const newDir = isRTL ? "ltr" : "rtl";

					html.setAttribute("dir", newDir);
					html.classList.remove(isRTL ? "rtl" : "ltr");
					html.classList.add(newDir);

					localStorage.setItem("direction", newDir);

					// Refresh GSAP ScrollTriggers
					if (window.gsap && window.ScrollTrigger) {
						ScrollTrigger.refresh(true);
					}
				});
			}
		})();

		/* ---------- WOW / FADE UP ---------- */
		const wowElements = document.querySelectorAll(".wow, .fadeUp");
		if (wowElements.length && "IntersectionObserver" in window) {
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							entry.target.classList.add("fadeInUp");
						}
					});
				},
				{ threshold: 0.3 }
			);
			wowElements.forEach((el) => observer.observe(el));
		}

		/* ---------- NICE SELECT ---------- */
		if (typeof $ === "function" && $.fn.niceSelect) {
			$('select:not(.ignore)').niceSelect();
		}
	});



	/* ===============================
		SCROLL TO TOP
	=============================== */
	function scrollTopController() {
		const el = $(".back-to-top");
		if (!el.length) return;

		function update() {
		const scrollTop = window.scrollY;
		const height =
			document.documentElement.scrollHeight -
			document.documentElement.clientHeight;
		const percent = height ? Math.round((scrollTop / height) * 100) : 0;

		el.css(
			"background",
			`conic-gradient(#FFC979 ${percent}%, #FFFFFF ${percent}%)`
		);

		el.toggleClass("active", scrollTop > 100);
			$(".back-to-top-percentage").html(
				percent < 96 ? `${percent}%` : "<span>Top</span>"
			);
		}

		window.addEventListener("scroll", update, { passive: true });
		window.addEventListener("load", update);

		el.on("click", () =>
		window.scrollTo({ top: 0, behavior: "smooth" })
		);
	}
	scrollTopController();


	/* ===============================
    	HEADER STYLE
	=============================== */
	function headerStyle() {
		if ($(".main-header").length) {
			const windowpos = $(window).scrollTop();
			$(".main-header").toggleClass("fixed-header", windowpos >= 80);
			$(".scroll-top").toggleClass("open", windowpos >= 80);
		}
	}
	headerStyle();


	/* ===============================
		SUBMENU DROPDOWN
	=============================== */
	if ($(".main-header li.dropdown ul").length) {
			$(".main-header .navigation li.dropdown").append(
			'<div class="dropdown-btn"><span class="icon-10"></span></div>'
		);
	}

	/* ===============================
		MOBILE MENU
	=============================== */
	if ($(".mobile-menu").length) {
		const menuHTML = $(".main-header .menu-area .main-menu").html();
		$(".mobile-menu .menu-box .menu-outer").append(menuHTML);
		$(".sticky-header .main-menu").append(menuHTML);

		$(".mobile-menu").on("click", ".dropdown-btn", function () {
			$(this).toggleClass("open");
			$(this).siblings("ul, .megamenu").first().slideToggle(500);
		});

		$(".mobile-nav-toggler").on("click", function () {
			$("body").addClass("mobile-menu-visible");
		});

		$(".mobile-menu .menu-backdrop, .mobile-menu .close-btn").on(
		"click",
			function () {
				$("body").removeClass("mobile-menu-visible");
			}
		);
	}


	/* ===============================
		SIDEBAR POPUP
	=============================== */
	if ($("#sidebar-popup").length) {
		$(".sidebar-toggler").on("click", () => {
			$("body").addClass("sidebar-open");
		});

		$(".close-popup, .sidebar-popup .overlay-layer").on("click", () => {
			$("body").removeClass("sidebar-open");
		});

		$(document).on("keydown", (e) => {
			if (e.key === "Escape") {
				$("body").removeClass("sidebar-open");
			}
		});
	}


	/* ===============================
		CONTACT FORM
	=============================== */
	if ($(".contact-form").length) {
		$(".contact-form").validate({
			rules: {
				username: { required: true },
				email: { required: true, email: true },
				phone: { required: true },
				message: { required: true },
			},
		});
	}


	/* ===============================
		FANCYBOX
	=============================== */
	if ($(".lightbox-image").length) {
		$(".lightbox-image").fancybox({
			openEffect: "fade",
			closeEffect: "fade",
			helpers: { media: {} },
		});
	}


	/* ===============================
		TABS
	=============================== */
	$(".tabs-box .tab-btn").on("click", function (e) {
		e.preventDefault();
		const target = $($(this).data("tab"));
		if (!target.is(":visible")) {
		$(this).addClass("active-btn").siblings().removeClass("active-btn");
		target
			.fadeIn(100)
			.addClass("active-tab")
			.siblings()
			.hide()
			.removeClass("active-tab");
		}
	});


	/* ===============================
		ACCORDION
	=============================== */
	$(".accordion-box").on("click", ".acc-btn", function () {
		const box = $(this).closest(".accordion-box");
		const acc = $(this).closest(".accordion");

		if (!$(this).hasClass("active")) {
			box.find(".acc-btn").removeClass("active");
			box.find(".acc-content").slideUp(300);
			$(this).addClass("active");
			acc.addClass("active-block").siblings().removeClass("active-block");
			$(this).next(".acc-content").slideDown(300);
		}
	});


	/* ===============================
		SWIPER CAROUSEL
	=============================== */
	if ($(".single-item-carousel").length) {
		let singleItemCarousel = new Swiper(".single-item-carousel", {
			slidesPerView: 1,
			loop: true,
			spaceBetween: 30,
			mousewheel: false,
			speed: 500,
			watchSlidesVisibility: true,
			watchSlidesProgress: true,
			autoplay: { delay: 5000 },
			pagination: { el: ".single-column-pagination", clickable: true },
			navigation: {
				nextEl: ".swiper-prev",
				prevEl: ".swiper-next",
			},
			breakpoints: {
				1900: { slidesPerView: 1, spaceBetween: 30 },
				1199: { slidesPerView: 1, spaceBetween: 30 },
				991: { slidesPerView: 1, spaceBetween: 30 },
				767: { slidesPerView: 1, spaceBetween: 30 },
				499: { slidesPerView: 1, spaceBetween: 30 },
			},
		});
	}

	if ($('.three-item-carousel').length) {
		let threeItemCarousel = new Swiper('.three-item-carousel', {
			slidesPerView: 1,
			spaceBetween: 30,
			mousewheel: false,
			speed: 500,
			watchSlidesVisibility: true,
			watchSlidesProgress: true,
			loop: true,
			autoplay: {
				delay: 5000,
			},
			pagination: {
				el: '.three-item-pagination',
				clickable: true
			},
			navigation: {
				nextEl: '.three-item-prev-btn',
				prevEl: '.three-item-next-btn',
			},
			breakpoints: {
				1900: { slidesPerView: 3, spaceBetween: 30 },
				1199: { slidesPerView: 3, spaceBetween: 30 },
				991: { slidesPerView: 2, spaceBetween: 30 },
				767: { slidesPerView: 2, spaceBetween: 30 },
				499: { slidesPerView: 1, spaceBetween: 30 },
			},
		});
	}

	if ($('.clients-carousel').length) {
		let clientsCarousel = new Swiper('.clients-carousel', {
			slidesPerView: 1,
			spaceBetween: 30,
			mousewheel: false,
			speed: 500,
			watchSlidesVisibility: true,
			watchSlidesProgress: true,
			loop: true,
			autoplay: {
				delay: 5000,
			},
			pagination: {
				el: '.clients-pagination',
				clickable: true
			},
			navigation: {
				nextEl: '.clients-prev-btn',
				prevEl: '.clients-next-btn',
			},
			breakpoints: {
				1900: { slidesPerView: 6, spaceBetween: 30 },
				1199: { slidesPerView: 6, spaceBetween: 30 },
				991: { slidesPerView: 4, spaceBetween: 30 },
				767: { slidesPerView: 2, spaceBetween: 30 },
				499: { slidesPerView: 1, spaceBetween: 30 },
			},
		});
	}


	/* ===============================
		PROGRESS BAR
	=============================== */
	if ($(".count-bar").length) {
		$(".count-bar").appear(
		function () {
			let el = $(this);
			let percent = el.data("percent");
			$(el).css("width", percent).addClass("counted");
		},
		{ accY: -50 }
		);
	}


	/* ===============================
		LENIS
	=============================== */
	const lenis = new Lenis({ smooth: true });
		function raf(time) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}
	requestAnimationFrame(raf);


	/* ===============================
		GSAP + ARRANGE
	=============================== */
	const mediaMatch =
	typeof gsap !== "undefined" && gsap.matchMedia
		? gsap.matchMedia()
		: null;

	function rtlValue(v) {
		return document.documentElement.dir === "rtl" ? -v : v;
	}

	function isRTL() {
		return document.documentElement.getAttribute("dir") === "rtl";
	}

	function slidebarSticky() {
	const containers = document.querySelectorAll(".slidebar-stickiy-container");

	// ✅ correct guard
	if (!containers.length || !mediaMatch) return;

	containers.forEach((container) => {
		const panels = container.querySelectorAll(".slidebar-stickiy");
			if (!panels.length) return;

			mediaMatch.add("(min-width: 1024px)", () => {
				const startOffset = 30;
				const lastPanel = panels[panels.length - 1];
				const paddingBottom =
					parseInt(getComputedStyle(container).paddingBottom) || 0;

				panels.forEach((panel) => {
					gsap.to(panel, {
						ease: "circ",
						scrollTrigger: {
							trigger: panel,
							start: `top-=${startOffset} top`,
							endTrigger: container,
							end: () =>
							`bottom top+=${lastPanel.offsetHeight + startOffset + paddingBottom}`,
							pin: true,
							pinSpacing: false,
							scrub: true,
							markers: false,
							invalidateOnRefresh: true,

							// ✅ RTL / LTR SAFE FIX
							onRefresh: () => {
								if (isRTL()) {
									panel.style.left = "auto";
									panel.style.right = "0";
								} else {
									panel.style.right = "auto";
									panel.style.left = "0";
								}
							},
						},
					});
				});
			});
		});
	}
	slidebarSticky();

	function initArrangeAnim() {
		if (!mediaMatch) return;

		mediaMatch.add("(min-width: 992px)", () => {
		document.querySelectorAll(".ax-arrange-item").forEach((panel, i) => {
			gsap.from(panel, {
			xPercent: i % 2 ? rtlValue(20) : rtlValue(-20),
			scrollTrigger: {
				trigger: panel,
				start: "top bottom",
				end: "center center",
				scrub: true,
			},
			});
		});
		});
	}
	initArrangeAnim();

	// opacity text
	{const els = document.querySelectorAll(".opacity-text");
		if (els && els.length && typeof SplitType !== "undefined") {
			els.forEach((el) => {
				var t = new SplitType(el, { types: "words" });
				gsap.from(t.words, {
				scrollTrigger: {
					trigger: el,
					start: "top 34%",
					end: "top -10%",
					scrub: true,
					pin: ".pinned-section",
					pinSpacing: true,
				},
				opacity: 0.2,
				stagger: 0.1,
				duration: 1,
				ease: "power2.out",
				});
			});
		}
	}

	// block stack
	const blockStack = gsap.utils.toArray(".block-stack");
	if (blockStack.length) {
		ScrollTrigger.matchMedia({
			"(min-width: 992px)": function () {
				blockStack.forEach((item) => {
					gsap.to(item, {
						opacity: 0,
						scale: 0.9,
						y: 50,
						scrollTrigger: {
							trigger: item,
							start: "top top",
							end: "+=100%",      // IMPORTANT: required for proper pin
							scrub: true,
							pin: true,
							pinSpacing: false,
						}
					});
				});
			}
		});
	}


	/* ===============================
		ODOMETER
	=============================== */
	if ($(".odometer").length) {
		let odo = $(".odometer");
		odo.each(function () {
			$(this).appear(function () {
				let countNumber = $(this).attr("data-count");
				$(this).html(countNumber);
			});
		});
	}


	/* ===============================
		SCROLL DIRECTION
	=============================== */
	let lastScroll = window.scrollY;
		window.addEventListener(
		"scroll",
		() => {
		const current = window.scrollY;
		document.body.classList.toggle("scroll-down", current > lastScroll);
		document.body.classList.toggle("scroll-up", current < lastScroll);
		lastScroll = current;
		},
		{ passive: true }
	);


	/* ===============================
		DARK MODE
	=============================== */
	const darkBtn = document.getElementById("darkToggle");
		if (localStorage.getItem("theme") === "dark") {
		document.documentElement.classList.add("dark");
	}
	darkBtn &&
		darkBtn.addEventListener("click", () => {
		document.documentElement.classList.toggle("dark");
		localStorage.setItem(
			"theme",
			document.documentElement.classList.contains("dark")
			? "dark"
			: "light"
		);
	});


	/* ===============================
		SCROLL IMAGE TRANSLATE
	=============================== */

	const bgImage = document.querySelector(".scroll-bg-image");
		if (bgImage) {
			window.addEventListener(
			"scroll",
			function () {
				let scrollY = window.scrollY || 0;
				let translateValue = scrollY * 0.5;
				bgImage.style.transform = `translateY(${translateValue}px)`;
			},
			{ passive: true }
		);
	}


	/* ===============================
		MARQUEE SCROLL
	=============================== */
	if ($(".marquee_mode-rightToLeft").length) {
		$(".marquee_mode-rightToLeft").marquee({
			speed: 30,
			gap: 0,
			delayBeforeStart: 0,
			direction: "left",
			duplicated: true,
			pauseOnHover: true,
			startVisible: true,
		});
	}


	/* ===============================
		SCROLL IMAGE EFFECT
	=============================== */
	const image = document.querySelector(".image-wrapper");
		if (image) {
			gsap.set(image, { scale: 0.1 });

			gsap.to(image, {
			scale: 1,
			ease: "none",
			scrollTrigger: {
				trigger: ".image-parents",
				start: "top 80%",
				end: "top 0%",
				scrub: true
			}
		});
	}


	/* ===============================
		SCROLL MOVMENT EFFECT
	=============================== */
	const wrapper = document.querySelector(".testimonial-wrapper");

		if (wrapper) {

		const isRTL = () =>
			document.documentElement.getAttribute("dir") === "rtl";

		// Calculate horizontal scroll distance
		const getScrollAmount = () => {
			const containerWidth = wrapper.parentElement.offsetWidth;
			const scrollWidth = wrapper.scrollWidth;

			// RTL moves positive, LTR moves negative
			return isRTL()
			? scrollWidth - containerWidth
			: -(scrollWidth - containerWidth);
		};

		// GSAP animation
		const horizontalTween = gsap.to(wrapper, {
			x: getScrollAmount,
			ease: "none"
		});

		// ScrollTrigger
		ScrollTrigger.create({
			trigger: ".testimonial",
			start: "bottom bottom",
			end: () => `+=${Math.abs(getScrollAmount())}`,
			pin: true,
			animation: horizontalTween,
			scrub: 1,
			invalidateOnRefresh: true
		});

		// Recalculate on resize or dir switch
		window.addEventListener("resize", ScrollTrigger.refresh);
	}


	/* ===============================
		MOUSE HOVER ACTIVE BLOCK
	=============================== */
	{
		const t=document.querySelectorAll(".moving-item");
			0<t.length&&t[0].classList.add("active"),t.forEach(e=>
			{e.addEventListener("mouseenter",function()
				{t.forEach(e=>e.classList.remove("active")),
					this.classList.add("active")
				})
		})
	}


	/* ===============================
		CURVED TEXT / CIRCLE TEXT
	=============================== */
	function initCurvedText(selector, options = {}) {
		const element = document.getElementById(selector);

		if (element) {
			const circle = new CircleType(element);

			// Apply options
			if (options.radius !== undefined) circle.radius(options.radius);
			if (options.direction !== undefined) circle.dir(options.direction);
		} else {
			console.warn(`Element with ID "${selector}" not found.`);
		}
	}
	initCurvedText('curve_text_1', { radius: 90 });



	/* ===============================
		WINDOW EVENTS
	=============================== */
	$(window).on("scroll", headerStyle);
	

})(window.jQuery);