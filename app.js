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
    // Create fish at different edges with directions that will take them across the screen
    
    // First fish - starts at left edge, swimming right (with slight angle)
    const koi1 = createSingleKoi({
        x: 50,
        y: 200,
        rotation: 0,  // Swimming right
        scale: 1,
        spotCount: 3
    });
    svg.appendChild(koi1);
    
    // Second fish - starts at bottom edge, swimming up (with slight angle)
    const koi2 = createSingleKoi({
        x: 700,
        y: 550,
        rotation: 270,  // Swimming up
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
    
    // Create tail (at the back of the fish)
    const tail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tail.setAttribute('d', 'M -80,0 Q -120,40 -100,0 Q -120,-40 -80,0');
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
    
    // Determine if this is a horizontal or vertical swimming fish
    const isHorizontalSwimmer = (initialRotation % 180 < 45 || initialRotation % 180 > 135);
    
    // Create points that will take the fish across the screen
    const points = [];
    
    if (isHorizontalSwimmer) {
        // For horizontal swimmers (left to right or right to left)
        const swimDirection = Math.cos(initialRotation * Math.PI / 180) > 0 ? 1 : -1; // 1 for right, -1 for left
        
        // Create a path that goes from one side to the other
        const screenWidth = 1000;
        const numPoints = 5;
        
        for (let i = 0; i < numPoints; i++) {
            // Calculate position along the horizontal path
            const progress = (i + 1) / numPoints;
            const newX = initialX + swimDirection * progress * screenWidth;
            
            // Add some vertical variation
            const verticalVariation = Math.random() * 200 - 100;
            const newY = Math.max(50, Math.min(550, initialY + verticalVariation));
            
            // Small rotation variations
            const rotationVariation = Math.random() * 20 - 10;
            const newRotation = (initialRotation + rotationVariation) % 360;
            
            points.push({
                x: Math.max(50, Math.min(950, newX)),
                y: newY,
                rotation: newRotation
            });
        }
    } else {
        // For vertical swimmers (top to bottom or bottom to top)
        const swimDirection = Math.sin(initialRotation * Math.PI / 180) > 0 ? 1 : -1; // 1 for down, -1 for up
        
        // Create a path that goes from top to bottom or vice versa
        const screenHeight = 600;
        const numPoints = 5;
        
        for (let i = 0; i < numPoints; i++) {
            // Calculate position along the vertical path
            const progress = (i + 1) / numPoints;
            const newY = initialY + swimDirection * progress * screenHeight;
            
            // Add some horizontal variation
            const horizontalVariation = Math.random() * 200 - 100;
            const newX = Math.max(50, Math.min(950, initialX + horizontalVariation));
            
            // Small rotation variations
            const rotationVariation = Math.random() * 20 - 10;
            const newRotation = (initialRotation + rotationVariation) % 360;
            
            points.push({
                x: newX,
                y: Math.max(50, Math.min(550, newY)),
                rotation: newRotation
            });
        }
    }
    
    // Create a timeline for smooth movement
    const timeline = gsap.timeline({
        repeat: -1,
        ease: "power1.inOut",
        onRepeat: function() {
            // When the animation repeats, reposition the fish at the opposite edge
            const lastPoint = points[points.length - 1];
            
            // Determine which edge to place the fish based on its last position
            let newX, newY, newRotation;
            
            if (isHorizontalSwimmer) {
                // If it was swimming horizontally, place it at the opposite horizontal edge
                newX = lastPoint.x > 500 ? 50 : 950;
                newY = Math.random() * 500 + 50;
                newRotation = lastPoint.x > 500 ? 0 : 180; // Face right if at left edge, left if at right edge
            } else {
                // If it was swimming vertically, place it at the opposite vertical edge
                newX = Math.random() * 900 + 50;
                newY = lastPoint.y > 300 ? 50 : 550;
                newRotation = lastPoint.y > 300 ? 90 : 270; // Face down if at top edge, up if at bottom edge
            }
            
            // Immediately set the new position
            gsap.set(koi, {
                attr: { transform: `translate(${newX}, ${newY}) rotate(${newRotation}) scale(${0.8 + Math.random() * 0.4})` }
            });
        }
    });
    
    // Add each point to the timeline
    points.forEach(point => {
        timeline.to(koi, {
            duration: 8 + Math.random() * 4, // Slightly faster to cross the screen in reasonable time
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
