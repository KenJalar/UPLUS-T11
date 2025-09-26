document.addEventListener("DOMContentLoaded", function() {

    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    const dynamicScrollbar = document.querySelector('.dynamic-scrollbar');

    // Navbar scroll effects
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > lastScrollY && window.scrollY > 150) {
            navbar.classList.add('navbar-hidden');
        } else {
            navbar.classList.remove('navbar-hidden');
        }
        lastScrollY = window.scrollY;

        // Dynamic scrollbar
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / scrollHeight) * 100;
        if (dynamicScrollbar) {
            dynamicScrollbar.style.height = `${scrolled}%`;
            dynamicScrollbar.style.opacity = '1';
        }
        
        clearTimeout(window.scrollTimeout);
        window.scrollTimeout = setTimeout(() => {
            if (dynamicScrollbar) {
                dynamicScrollbar.style.opacity = '0';
            }
        }, 1500);

        handleBackToTopButton();
    });

    // Back to top button functionality
    function handleBackToTopButton() {
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (window.scrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }
    }
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Hero section text slider
    const heroTexts = document.querySelectorAll("#hero-text-slider h1");
    if (heroTexts.length > 0) {
        let currentTextIndex = 0;
        heroTexts.forEach((text, index) => { if (index !== 0) text.style.display = 'none'; });
        setInterval(() => {
            heroTexts[currentTextIndex].style.display = 'none';
            currentTextIndex = (currentTextIndex + 1) % heroTexts.length;
            heroTexts[currentTextIndex].style.display = 'block';
        }, 4000);
    }

    // Scroll-triggered animations
    const fadeElems = document.querySelectorAll('.scroll-fade');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    fadeElems.forEach(elem => observer.observe(elem));

    // General Animated Stat Counter Function
    const animateCountUp = (el) => {
        const target = +el.getAttribute('data-target');
        const duration = 1500;
        const frameRate = 1000 / 60;
        const totalFrames = Math.round(duration / frameRate);
        let currentFrame = 0;
        
        const count = () => {
            currentFrame++;
            const progress = currentFrame / totalFrames;
            const currentValue = Math.round(target * progress);

            el.innerText = (el.getAttribute('data-prefix') || '') + currentValue.toLocaleString() + (el.getAttribute('data-suffix') || '');

            if (currentFrame < totalFrames) {
                requestAnimationFrame(count);
            } else {
                 el.innerText = (el.getAttribute('data-prefix') || '') + target.toLocaleString() + (el.getAttribute('data-suffix') || '');
            }
        };
        requestAnimationFrame(count);
    };

    // Intersection Observer for general stat counters
    const statCounters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCountUp(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    statCounters.forEach(counter => counterObserver.observe(counter));

    // [CORRECTED] Objectives Slider Logic
    const scrollerContainers = document.querySelectorAll('.objectives-scroller-container');
    scrollerContainers.forEach(container => {
        const scroller = container.querySelector('.objectives-scroller'); // The element that scrolls
        const track = container.querySelector('.objectives-track');       // The content track
        const prevBtn = container.querySelector('.scroller-btn.prev');
        const nextBtn = container.querySelector('.scroller-btn.next');
        
        if (!scroller || !track || !prevBtn || !nextBtn) return;
    
        let autoScrollInterval;
    
        const scroll = (amount) => {
            // We scroll the 'scroller', not the 'track'
            scroller.scrollBy({ left: amount, behavior: 'smooth' });
        };
    
        const startAutoScroll = () => {
            stopAutoScroll();
            autoScrollInterval = setInterval(() => {
                // Check the scroll position of the 'scroller'
                if (scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1) {
                    scroller.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scroll(scroller.clientWidth);
                }
            }, 5000);
        };
    
        const stopAutoScroll = () => {
            clearInterval(autoScrollInterval);
        };
    
        nextBtn.addEventListener('click', () => scroll(scroller.clientWidth));
        prevBtn.addEventListener('click', () => scroll(-scroller.clientWidth));
    
        container.addEventListener('mouseenter', stopAutoScroll);
        container.addEventListener('mouseleave', startAutoScroll);
    
        startAutoScroll();
    });


    // Donation form handling
    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your inquiry! As our payment gateway is under maintenance, a member of our team will contact you shortly regarding your intended donation. We appreciate your support!');
            const modal = bootstrap.Modal.getInstance(document.getElementById('donationModal'));
            if (modal) modal.hide();
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (!this.getAttribute('data-bs-target') && this.getAttribute('href').length > 1) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    const offset = 80;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = target.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Project Filtering Logic
    const filterButtons = document.querySelectorAll('.btn-filter');
    const projectItems = document.querySelectorAll('.project-item-wrapper');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const filterValue = this.getAttribute('data-filter');
            projectItems.forEach(item => {
                const itemStatus = item.getAttribute('data-status');
                item.style.transform = 'scale(0.9)';
                item.style.opacity = '0';
                setTimeout(() => {
                    if (filterValue === 'all' || filterValue === itemStatus) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.transform = 'scale(1)';
                            item.style.opacity = '1';
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                }, 300);
            });
        });
    });
    
    // Event Filtering Logic
    const eventFilterButtons = document.querySelectorAll('.btn-event-filter');
    const eventItems = document.querySelectorAll('.event-item-wrapper');
    eventFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            eventFilterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const filterValue = this.getAttribute('data-filter');
            eventItems.forEach(item => {
                const itemStatus = item.getAttribute('data-status');
                item.style.transform = 'scale(0.9)';
                item.style.opacity = '0';
                setTimeout(() => {
                    if (filterValue === 'all' || filterValue === itemStatus) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.transform = 'scale(1)';
                            item.style.opacity = '1';
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    // Objective Modal Stat Animation
    const objectiveModals = document.querySelectorAll('.objective-modal');
    objectiveModals.forEach(modal => {
        modal.addEventListener('show.bs.modal', function() {
            const numberEl = modal.querySelector('.objective-stat-number');
            if (numberEl) {
                numberEl.innerText = '0' + (numberEl.getAttribute('data-suffix') || '');
                animateCountUp(numberEl);
            }
        });
    });

    // Event Modal Logic
    const eventDetailModal = document.getElementById('eventDetailModal');
    if (eventDetailModal) {
        eventDetailModal.addEventListener('show.bs.modal', function (event) {
            const card = event.relatedTarget;
            const title = card.getAttribute('data-event-title');
            const banner = card.getAttribute('data-event-banner');
            const description = card.getAttribute('data-event-description');
            const date = card.getAttribute('data-event-date');
            const location = card.getAttribute('data-event-location');
            const galleryImages = card.getAttribute('data-event-gallery') ? card.getAttribute('data-event-gallery').split(',') : [];
            eventDetailModal.querySelector('#eventModalTitle').textContent = title;
            eventDetailModal.querySelector('#eventModalDescription').textContent = description;
            eventDetailModal.querySelector('#eventModalDate').textContent = date;
            eventDetailModal.querySelector('#eventModalLocation').textContent = location;
            const galleryContainer = eventDetailModal.querySelector('#eventModalGalleryContainer');
            const bannerImg = eventDetailModal.querySelector('#eventModalBanner');
            galleryContainer.innerHTML = ''; bannerImg.style.display = 'none';
            if (galleryImages.length > 0) {
                const galleryHTML = `<div id="eventImageSlider" class="carousel slide" data-bs-ride="carousel"><div class="carousel-inner" style="border-radius: 12px; overflow: hidden;">${galleryImages.map((img, index) => `<div class="carousel-item ${index === 0 ? 'active' : ''}"><img src="${img.trim()}" class="d-block w-100 event-modal-gallery-img" alt="Event image ${index + 1}"></div>`).join('')}</div>${galleryImages.length > 1 ? `<button class="carousel-control-prev gallery-btn" type="button" data-bs-target="#eventImageSlider" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span></button><button class="carousel-control-next gallery-btn" type="button" data-bs-target="#eventImageSlider" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span></button>` : ''}</div>`;
                galleryContainer.innerHTML = galleryHTML;
            } else if (banner) { bannerImg.src = banner; bannerImg.style.display = 'block'; }
        });
    }

    // Impact Cycle Modal Logic (About Page)
    const impactCycleModal = document.getElementById('impactCycleDetailModal');
    if (impactCycleModal) {
        const impactCycleContent = {
            learning: {
                icon: 'fas fa-chalkboard-teacher',
                html: `<h4>Month 1: Learning & Capacity Building</h4><p>This initial phase focuses on intensive training and skill development through engaging, hands-on workshops.</p><h6><strong>Key Activities: </strong></h6><ul><li><strong>Learning Labs: </strong> Intensive training sessions, workshops, and mentorship programs.</li><li><strong>Focus: </strong>  life skills, entrepreneurship, leadership, climate action, digital literacy, and mental health.</li></ul><h6><strong>Expected Outcome: </strong></h6><p>Youth and community members acquire foundational knowledge, practical skills, and the confidence to initiate change.</p>`
            },
            application: {
                icon: 'fas fa-tools',
                html: `<h4>Month 2: Skills Application & Group Formation</h4><p>Participants move from theory to practice, applying their new abilities in real-world settings and collaborative projects.</p><h6><strong>Key Activities: </strong></h6><ul><li><strong>Apprenticeships/Placements: </strong> Attachment to workplaces, businesses, or innovation hubs to gain hands-on experience and build employability.</li><li><strong>Interest Group Formation: </strong> Participants form teams based on shared passions (e.g., agribusiness, tech, arts) to develop small projects or community initiatives.</li></ul><h6><strong>Expected Outcome: </strong></h6><p>Enhanced work-readiness and the birth of innovative, collaborative projects rooted in community needs.</p>`
            },
            mentorship: {
                icon: 'fas fa-users',
                html: `<h4>Month 3: Follow-Ups & Mentorship</h4><p>This phase is dedicated to refining ideas and overcoming obstacles with expert guidance and consistent support.</p><h6><strong>Key Activities: </strong></h6><ul><li><strong>Regular Check-ins:</strong> Consistent coaching and monitoring of each group's progress.</li><li><strong>One-on-one Mentorship:</strong> Personalized support to strengthen project ideas, refine skills, and address specific challenges.</li></ul><h6><strong>Expected Outcome: </strong></h6><p>Well-prepared groups with robust, viable initiatives ready for evaluation and public presentation.</p>`
            },
            evaluation: {
                icon: 'fas fa-trophy',
                html: `<h4>Month 4 (Quarter Review): Evaluation & Recognition</h4><p>The cycle culminates in assessing impact, celebrating success, and providing a platform for growth.</p><h6><strong>Key Activities: </strong></h6><ul><li><strong>Program Evaluation:</strong> A thorough assessment of individual and group achievements, challenges, and overall impact.</li><li><strong>Exhibition & Presentations:</strong> Groups showcase their refined projects and solutions to the public, partners, and potential funders.</li><li><strong>Awards & Recognition:</strong> Outstanding groups receive recognition, prizes, or seed funding to scale up their work.</li></ul><h6><strong>Expected Outcome: </strong></h6><p>Successful initiatives are identified and supported for future growth, celebrating the achievements of all participants.</p>`
            },
            sustainability: {
                icon: 'fas fa-recycle',
                html: `<h4>Ongoing: Sustainability & Scaling</h4><p>We ensure the long-term success and community ownership of every initiative, creating a legacy of empowerment.</p><h6><strong>Key Activities: </strong></h6><ul><li><strong>Community Integration:</strong> Successful projects are integrated into existing community structures to ensure they last.</li><li><strong>Fostering Ownership:</strong> We work to ensure local leaders and participants take full ownership of the projects' futures.</li><li><strong>Feedback Loop:</strong> Learnings from each completed cycle are documented and used to improve the next one, guaranteeing continuous improvement.</li></ul><h6><strong>Expected Outcome: </strong></h6><p>A self-perpetuating cycle of community-owned, sustainable development that creates lasting impact.</p>`
            }
        };

        impactCycleModal.addEventListener('show.bs.modal', function(event) {
            const triggerElement = event.relatedTarget;
            const contentKey = triggerElement.getAttribute('data-content-key');
            const title = triggerElement.getAttribute('data-title');
            const contentData = impactCycleContent[contentKey];

            if (contentData) {
                const modalTitle = impactCycleModal.querySelector('#impactCycleModalTitle');
                const modalIcon = impactCycleModal.querySelector('#impactCycleModalIcon');
                const modalBody = impactCycleModal.querySelector('#impactCycleModalBody');
                modalTitle.textContent = title;
                modalIcon.className = '';
                contentData.icon.split(' ').forEach(cls => modalIcon.classList.add(cls));
                modalIcon.classList.add('fa-7x', 'text-success', 'mb-4');
                modalBody.innerHTML = contentData.html;
            }
        });
    }
});