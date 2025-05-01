// Space Theme Animations and Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations
    initializeAnimations();
    
    // Initialize space background
    initSpaceBackground();
    
    // Initialize hover effects
    initializeHoverEffects();
    
    // Initialize counters with space theme
    initializeCounters();
});

function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                entry.target.style.transitionDelay = Math.random() * 0.5 + 's';
            }
        });
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function initSpaceBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'space-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.5';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let stars = [];
    let meteors = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Star {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.z = Math.random() * 2;
            this.size = Math.random() * 2;
            this.twinkleSpeed = Math.random() * 0.05;
            this.twinkleStrength = Math.random() * 0.7 + 0.3;
            this.angle = 0;
        }

        update() {
            this.angle += this.twinkleSpeed;
            this.currentOpacity = this.twinkleStrength + Math.sin(this.angle) * 0.2;

            this.y += 0.1 * this.z;
            if (this.y > canvas.height) this.reset();
        }

        draw() {
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${this.currentOpacity})`;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class Meteor {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = 0;
            this.size = Math.random() * 2 + 1;
            this.speed = Math.random() * 15 + 10;
            this.trail = [];
            this.maxTrailLength = 20;
            this.angle = Math.random() * Math.PI / 4 + Math.PI / 4;
        }

        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;

            this.trail.unshift({x: this.x, y: this.y});
            if (this.trail.length > this.maxTrailLength) {
                this.trail.pop();
            }

            if (this.y > canvas.height || this.x > canvas.width) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = this.size;
            ctx.moveTo(this.x, this.y);
            
            for (let i = 0; i < this.trail.length; i++) {
                const point = this.trail[i];
                ctx.lineTo(point.x, point.y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 * (1 - i/this.trail.length)})`;
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(point.x, point.y);
            }
        }
    }

    // Create stars and meteors
    for (let i = 0; i < 200; i++) {
        stars.push(new Star());
    }
    for (let i = 0; i < 2; i++) {
        meteors.push(new Meteor());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw stars
        stars.forEach(star => {
            star.update();
            star.draw();
        });

        // Update and draw meteors
        meteors.forEach(meteor => {
            meteor.update();
            meteor.draw();
        });
        
        requestAnimationFrame(animate);
    }

    animate();
}

function initializeHoverEffects() {
    const cards = document.querySelectorAll('.ai-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 30;
            const angleY = (centerX - x) / 30;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(123, 44, 243, 0.1), var(--card-bg))`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.background = 'var(--card-bg)';
        });
    });
}

function initializeCounters() {
    const counters = document.querySelectorAll('.ai-counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.unobserve(counter);
            }
        });
        
        observer.observe(counter);
    });
} 