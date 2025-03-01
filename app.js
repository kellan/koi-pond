// Koi Pond Animation
document.addEventListener('DOMContentLoaded', function() {
    console.log('App loaded');
    initKoiPond();
});

function initKoiPond() {
    const container = document.getElementById('pond-container');
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', 'pond');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 1000 600'); // Changed to a wider aspect ratio
    svg.setAttribute('preserveAspectRatio', 'xMinYMin slice'); // Changed to slice mode to ensure full coverage
    container.appendChild(svg);
    
    // Create koi fish
    createKoiFish(svg);
    
    // Create lily pads
    createLilyPads(svg);
    
    // Start animations
    animateElements();
}

function createKoiFish(svg) {
    // Create first koi fish - tail points at 45 degrees, so fish will swim at 225 degrees
    const koi1 = createSingleKoi({
        x: 300,
        y: 400,
        rotation: 45,  // Tail direction
        scale: 1,
        spotCount: 3
    });
    svg.appendChild(koi1);
    
    // Create second koi fish with variations - tail points at -30 degrees, so fish will swim at 150 degrees
    const koi2 = createSingleKoi({
        x: 600,
        y: 700,
        rotation: -30,  // Tail direction
        scale: 0.8,
        spotCount: 4
    });
    svg.appendChild(koi2);
}

function createSingleKoi(options) {
    const koiGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    koiGroup.classList.add('koi');
    koiGroup.setAttribute('transform', `translate(${options.x}, ${options.y}) rotate(${options.rotation}) scale(${options.scale})`);
    
    // Create koi body (white ellipse)
    const body = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    body.setAttribute('cx', '0');
    body.setAttribute('cy', '0');
    body.setAttribute('rx', '80');
    body.setAttribute('ry', '40');
    body.setAttribute('fill', 'white');
    koiGroup.appendChild(body);
    
    // Create tail
    const tail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tail.setAttribute('d', 'M 80,0 Q 120,40 100,0 Q 120,-40 80,0');
    tail.setAttribute('fill', 'white');
    koiGroup.appendChild(tail);
    
    // Add orange spots
    for (let i = 0; i < options.spotCount; i++) {
        const spot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const spotX = Math.random() * 120 - 60;
        const spotY = Math.random() * 60 - 30;
        const spotRadius = 5 + Math.random() * 10;
        
        spot.setAttribute('cx', spotX);
        spot.setAttribute('cy', spotY);
        spot.setAttribute('r', spotRadius);
        spot.setAttribute('fill', i % 3 === 0 ? 'black' : 'orange');
        koiGroup.appendChild(spot);
    }
    
    return koiGroup;
}

function createLilyPads(svg) {
    const lilyPadCount = 8 + Math.floor(Math.random() * 5); // 8-12 lily pads
    const colors = ['#3a7d44', '#81b29a', '#3d405b', '#4d7ea8', '#2b6777'];
    const placedLilyPads = [];
    // Fish is about 160 units long, lily pad base size should be similar
    const baseScale = 1.6; // Increased to make lily pads roughly the same diameter as fish length
    const scaleVariation = 0.2; // Even smaller variation for more consistent sizes
    const minDistance = 180; // Increased minimum distance to account for larger lily pads
    
    // Try to place lily pads without overlapping
    let attempts = 0;
    const maxAttempts = 100;
    
    for (let i = 0; i < lilyPadCount && attempts < maxAttempts; i++) {
        const scale = baseScale + Math.random() * scaleVariation;
        const rotation = Math.random() * 360;
        
        // Try to find a non-overlapping position
        let validPosition = false;
        let x, y;
        let positionAttempts = 0;
        
        while (!validPosition && positionAttempts < 20) {
            x = Math.random() * 900 + 50; // Wider distribution for the new aspect ratio
            y = Math.random() * 500 + 50; // Adjusted for the new aspect ratio
            
            // Check if this position overlaps with any existing lily pad
            validPosition = true;
            for (const pad of placedLilyPads) {
                const dx = x - pad.x;
                const dy = y - pad.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < minDistance) {
                    validPosition = false;
                    break;
                }
            }
            
            positionAttempts++;
        }
        
        if (validPosition) {
            const lilyPad = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            lilyPad.classList.add('lily-pad');
            
            lilyPad.setAttribute('transform', `translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`);
            
            // Create the lily pad shape (circle with a cut)
            // Using radius of 50 with scale of 1.6 gives diameter of ~160 units, matching fish length
            const pad = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pad.setAttribute('d', 'M 0,0 A 50,50 0 1 1 0,0.1 L 0,0 z');
            pad.setAttribute('fill', colors[Math.floor(Math.random() * colors.length)]);
            lilyPad.appendChild(pad);
            
            svg.appendChild(lilyPad);
            
            // Remember this lily pad's position
            placedLilyPads.push({ x, y, scale });
        } else {
            // If we couldn't place this lily pad, try again
            i--;
            attempts++;
        }
    }
}

function animateElements() {
    // Animate koi fish
    const koi = document.querySelectorAll('.koi');
    koi.forEach(fish => {
        animateKoi(fish);
    });
    
    // Animate lily pads
    const lilyPads = document.querySelectorAll('.lily-pad');
    lilyPads.forEach(pad => {
        animateLilyPad(pad);
    });
}

function animateKoi(koi) {
    // Get current transform to extract initial position and rotation
    const transform = koi.getAttribute('transform');
    const initialX = parseFloat(transform.split('translate(')[1].split(',')[0]);
    const initialY = parseFloat(transform.split(',')[1].split(')')[0]);
    const initialRotation = parseFloat(transform.split('rotate(')[1].split(')')[0]);
    
    // Get random points for the koi to swim to, ensuring they swim in the opposite direction of their tail
    const points = [];
    for (let i = 0; i < 5; i++) {
        // Calculate a new position that's in the opposite direction of the tail
        const currentRotationRad = (initialRotation + i * 72) * Math.PI / 180;
        // Move in the opposite direction of where the tail points
        const distanceToMove = 300 + Math.random() * 500;
        const newX = initialX + Math.cos(currentRotationRad) * distanceToMove;
        const newY = initialY + Math.sin(currentRotationRad) * distanceToMove;
        
        // Ensure the fish stays within bounds
        const boundedX = Math.max(50, Math.min(950, newX));
        const boundedY = Math.max(50, Math.min(550, newY));
        
        // New rotation should be in the direction of movement (opposite of tail)
        const newRotation = (initialRotation + 180 + Math.random() * 60 - 30) % 360;
        
        points.push({
            x: boundedX,
            y: boundedY,
            rotation: newRotation
        });
    }
    
    // Create a timeline for smooth movement
    const timeline = gsap.timeline({
        repeat: -1,
        ease: "power1.inOut"
    });
    
    // Add each point to the timeline
    points.forEach(point => {
        timeline.to(koi, {
            duration: 10 + Math.random() * 5,
            svgOrigin: "500 500",
            attr: { transform: `translate(${point.x}, ${point.y}) rotate(${point.rotation}) scale(${0.8 + Math.random() * 0.4})` },
            ease: "power1.inOut"
        });
    });
}

function animateLilyPad(lilyPad) {
    // Create a gentler swaying motion with smaller range and slower speed
    const rotationAmount = 2 + Math.random() * 3; // Reduced from 5-15 to 2-5 degrees
    const duration = 5 + Math.random() * 3; // Increased from 3-5 to 5-8 seconds
    
    gsap.to(lilyPad, {
        duration: duration,
        rotation: `+=${rotationAmount}`,
        svgOrigin: "500 500",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
    });
}
