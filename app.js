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
    const minDistance = 220; // Increased minimum distance to prevent overlapping
    
    // Try to place lily pads without overlapping
    let attempts = 0;
    const maxAttempts = 200; // Increased max attempts to find valid positions
    
    for (let i = 0; i < lilyPadCount && attempts < maxAttempts; i++) {
        const scale = baseScale + Math.random() * scaleVariation;
        const effectiveRadius = 50 * scale; // Calculate the actual radius after scaling
        const rotation = Math.random() * 360;
        
        // Try to find a non-overlapping position
        let validPosition = false;
        let x, y;
        let positionAttempts = 0;
        const maxPositionAttempts = 30; // Increased position attempts
        
        while (!validPosition && positionAttempts < maxPositionAttempts) {
            x = Math.random() * 900 + 50; // Wider distribution for the new aspect ratio
            y = Math.random() * 500 + 50; // Adjusted for the new aspect ratio
            
            // Check if this position overlaps with any existing lily pad
            validPosition = true;
            for (const pad of placedLilyPads) {
                const dx = x - pad.x;
                const dy = y - pad.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const combinedRadius = effectiveRadius + (50 * pad.scale); // Combined radii of both pads
                
                // Use the combined radii plus a buffer to ensure no overlap
                if (distance < combinedRadius + 20) {
                    validPosition = false;
                    break;
                }
            }
            
            // Also check if too close to edges
            if (validPosition) {
                if (x - effectiveRadius < 0 || x + effectiveRadius > 1000 || 
                    y - effectiveRadius < 0 || y + effectiveRadius > 600) {
                    validPosition = false;
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
            
            // If we've tried too many times, reduce the number of lily pads
            if (attempts > maxAttempts * 0.8 && lilyPadCount > 8) {
                lilyPadCount--;
                console.log("Reducing lily pad count to avoid overcrowding:", lilyPadCount);
            }
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
    
    // Add wiggle effect to the fish's body
    addWiggleToFish(koi);
    
    // Create a more natural swimming path
    if (isHorizontalSwimmer) {
        // For horizontal swimmers (left to right or right to left)
        const swimDirection = Math.cos(initialRotation * Math.PI / 180) > 0 ? 1 : -1; // 1 for right, -1 for left
        
        // Create a path that goes from one side to the other with S-curve pattern
        const screenWidth = 1000;
        const numPoints = 10; // More points for smoother, more natural movement
        
        // Create an S-curve path with occasional pauses
        for (let i = 0; i < numPoints; i++) {
            // Calculate position along the horizontal path
            const progress = (i + 1) / numPoints;
            
            // Add slight S-curve to the path using sine wave
            const sinValue = Math.sin(progress * Math.PI);
            const newX = initialX + swimDirection * progress * screenWidth;
            
            // Add some vertical variation with S-curve influence
            const verticalVariation = sinValue * 120; // Use sine wave for smoother vertical movement
            const newY = Math.max(50, Math.min(550, initialY + verticalVariation));
            
            // Calculate rotation based on direction of movement (fish turn toward where they're going)
            let rotationVariation;
            
            if (progress > 0.7) {
                // Start turning as we approach the edge (last 30% of journey)
                // Turn up or down based on position in pond
                const turnDirection = (initialY > 300) ? -1 : 1; // Turn up if in bottom half, down if in top half
                
                // Make the turn more gradual and natural
                const turnProgress = (progress - 0.7) / 0.3; // Normalize to 0-1 for the turning phase
                rotationVariation = turnDirection * Math.pow(turnProgress, 2) * 90; // Use quadratic easing for more natural turn
            } else {
                // Small variations that follow the direction of movement
                // Fish rotate slightly toward the direction they're moving vertically
                rotationVariation = verticalVariation > 0 ? 
                    Math.min(15, verticalVariation / 8) : 
                    Math.max(-15, verticalVariation / 8);
            }
            
            const newRotation = (initialRotation + rotationVariation) % 360;
            
            // Add occasional pause points (slower segments)
            const isPausePoint = Math.random() < 0.2 && i > 0 && i < numPoints - 1;
            
            points.push({
                x: Math.max(50, Math.min(950, newX)),
                y: newY,
                rotation: newRotation,
                duration: isPausePoint ? 8 + Math.random() * 4 : 4 + Math.random() * 2 // Longer duration for pauses
            });
        }
    } else {
        // For vertical swimmers (top to bottom or bottom to top)
        const swimDirection = Math.sin(initialRotation * Math.PI / 180) > 0 ? 1 : -1; // 1 for down, -1 for up
        
        // Create a path that goes from top to bottom or vice versa
        const screenHeight = 600;
        const numPoints = 10; // More points for smoother movement
        
        for (let i = 0; i < numPoints; i++) {
            // Calculate position along the vertical path
            const progress = (i + 1) / numPoints;
            
            // Add slight S-curve to the path using sine wave
            const sinValue = Math.sin(progress * Math.PI);
            const newY = initialY + swimDirection * progress * screenHeight;
            
            // Add some horizontal variation with S-curve influence
            const horizontalVariation = sinValue * 120; // Use sine wave for smoother horizontal movement
            const newX = Math.max(50, Math.min(950, initialX + horizontalVariation));
            
            // Calculate rotation based on direction of movement
            let rotationVariation;
            
            if (progress > 0.7) {
                // Start turning as we approach the edge (last 30% of journey)
                // Turn left or right based on position in pond
                const turnDirection = (initialX > 500) ? -1 : 1; // Turn left if in right half, right if in left half
                
                // Make the turn more gradual and natural
                const turnProgress = (progress - 0.7) / 0.3; // Normalize to 0-1 for the turning phase
                rotationVariation = turnDirection * Math.pow(turnProgress, 2) * 90; // Use quadratic easing for more natural turn
            } else {
                // Small variations that follow the direction of movement
                // Fish rotate slightly toward the direction they're moving horizontally
                rotationVariation = horizontalVariation > 0 ? 
                    Math.min(15, horizontalVariation / 8) : 
                    Math.max(-15, horizontalVariation / 8);
            }
            
            const newRotation = (initialRotation + rotationVariation) % 360;
            
            // Add occasional pause points (slower segments)
            const isPausePoint = Math.random() < 0.2 && i > 0 && i < numPoints - 1;
            
            points.push({
                x: newX,
                y: Math.max(50, Math.min(550, newY)),
                rotation: newRotation,
                duration: isPausePoint ? 8 + Math.random() * 4 : 4 + Math.random() * 2 // Longer duration for pauses
            });
        }
    }
    
    // Create a timeline for smooth movement
    const timeline = gsap.timeline({
        repeat: -1,
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
            
            // Reset the wiggle animation
            addWiggleToFish(koi);
        }
    });
    
    // Add each point to the timeline with varying durations and easing
    points.forEach((point, index) => {
        // Use different easing for different segments to create more natural movement
        const ease = index % 2 === 0 ? "sine.inOut" : "power1.inOut";
        
        timeline.to(koi, {
            duration: point.duration,
            svgOrigin: "500 500",
            attr: { transform: `translate(${point.x}, ${point.y}) rotate(${point.rotation}) scale(${0.8 + Math.random() * 0.4})` },
            ease: ease
        });
    });
}

// Add a subtle wiggle animation to simulate fish swimming motion
function addWiggleToFish(koi) {
    // Find the tail element (last path in the koi group)
    const tail = koi.querySelector('path');
    if (!tail) return;
    
    // Create a subtle wiggle animation for the tail
    gsap.to(tail, {
        attr: { d: 'M -80,0 Q -120,40 -100,0 Q -120,-40 -80,0' },
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    
    // Also add a subtle scaling effect to the body to simulate swimming motion
    const body = koi.querySelector('ellipse');
    if (body) {
        gsap.to(body, {
            attr: { ry: 38 }, // Slightly squeeze the body
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
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
