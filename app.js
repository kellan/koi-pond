// Koi Pond Animation
document.addEventListener('DOMContentLoaded', function() {
    console.log('App loaded');
    initKoiPond();
    
    // Add click event listener to create new koi fish
    document.getElementById('pond-container').addEventListener('click', function(event) {
        createKoiAtClick(event);
    });
});

// Function to create a new koi fish at the clicked position
function createKoiAtClick(event) {
    const svg = document.getElementById('pond');
    if (!svg) return;
    
    // Get click coordinates relative to the SVG
    const svgRect = svg.getBoundingClientRect();
    const x = event.clientX - svgRect.left;
    const y = event.clientY - svgRect.top;
    
    // Convert screen coordinates to SVG viewBox coordinates
    const viewBox = svg.viewBox.baseVal;
    const svgWidth = svgRect.width;
    const svgHeight = svgRect.height;
    
    const svgX = (x / svgWidth) * viewBox.width;
    const svgY = (y / svgHeight) * viewBox.height;
    
    // Create a new koi at the click position with random attributes
    const rotation = Math.random() * 360;
    const scale = 0.4 + Math.random() * 0.3; // Reduced from 0.7-1.2 to 0.4-0.7
    const spotCount = 2 + Math.floor(Math.random() * 4);
    
    const newKoi = createSingleKoi({
        x: svgX,
        y: svgY,
        rotation: rotation,
        scale: scale,
        spotCount: spotCount
    });
    
    // Add entrance animation
    gsap.from(newKoi, {
        attr: { opacity: 0 },
        duration: 0.5,
        ease: "power1.inOut"
    });
    
    // Insert the new koi before the first lily pad to ensure it appears under lily pads
    const firstLilyPad = svg.querySelector('.lily-pad');
    if (firstLilyPad) {
        svg.insertBefore(newKoi, firstLilyPad);
    } else {
        // If no lily pads exist, just append
        svg.appendChild(newKoi);
    }
    
    // Animate the new koi
    animateKoi(newKoi);
}

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
    
    // Create lily pads first so they appear behind the fish
    createLilyPads(svg);
    
    // Create koi fish on top of lily pads
    createKoiFish(svg);
    
    // Start animations
    animateElements();
}

function createKoiFish(svg) {
    // Create more fish at different edges with directions that will take them across the screen
    const fishCount = 5; // Increased from 2 to 5 initial fish
    const koiFish = [];
    
    // Create fish at various positions
    // First fish - starts at left edge, swimming right
    koiFish.push(createSingleKoi({
        x: 50,
        y: 200,
        rotation: 0,  // Swimming right
        scale: 0.7,   // Smaller scale
        spotCount: 3
    }));
    
    // Second fish - starts at bottom edge, swimming up
    koiFish.push(createSingleKoi({
        x: 700,
        y: 550,
        rotation: 270,  // Swimming up
        scale: 0.6,     // Smaller scale
        spotCount: 4
    }));
    
    // Third fish - starts at top edge, swimming down
    koiFish.push(createSingleKoi({
        x: 300,
        y: 50,
        rotation: 90,  // Swimming down
        scale: 0.5,    // Smaller scale
        spotCount: 2
    }));
    
    // Fourth fish - starts at right edge, swimming left
    koiFish.push(createSingleKoi({
        x: 950,
        y: 350,
        rotation: 180,  // Swimming left
        scale: 0.65,    // Smaller scale
        spotCount: 5
    }));
    
    // Fifth fish - starts in the middle, swimming diagonally
    koiFish.push(createSingleKoi({
        x: 500,
        y: 300,
        rotation: 45,  // Swimming diagonally
        scale: 0.55,   // Smaller scale
        spotCount: 3
    }));
    
    // Insert the koi fish at the beginning of the SVG so they appear under lily pads
    // Use insertBefore with the first child to ensure they're at the bottom of the stack
    if (svg.firstChild) {
        koiFish.forEach(koi => {
            svg.insertBefore(koi, svg.firstChild);
        });
    } else {
        koiFish.forEach(koi => {
            svg.appendChild(koi);
        });
    }
}

function createSingleKoi(options) {
    const koiGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    koiGroup.classList.add('koi');
    koiGroup.setAttribute('transform', `translate(${options.x}, ${options.y}) rotate(${options.rotation}) scale(${options.scale})`);
    koiGroup.setAttribute('opacity', '1'); // Ensure full opacity for new fish
    
    // Create koi body (white ellipse) - scaled down
    const body = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    body.setAttribute('cx', '0');
    body.setAttribute('cy', '0');
    body.setAttribute('rx', '50'); // Reduced from 80
    body.setAttribute('ry', '25'); // Reduced from 40
    body.setAttribute('fill', 'white');
    koiGroup.appendChild(body);
    
    // Create tail (at the back of the fish) - scaled down
    const tail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tail.setAttribute('d', 'M -50,0 Q -75,25 -65,0 Q -75,-25 -50,0'); // Scaled down from original
    tail.setAttribute('fill', 'white');
    koiGroup.appendChild(tail);
    
    // Create a clipping path for the spots to stay within the fish body
    const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    const clipId = `fish-clip-${Math.floor(Math.random() * 10000)}`; // Unique ID
    clipPath.setAttribute('id', clipId);
    
    // Add the body shape to the clip path - scaled down
    const clipBody = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    clipBody.setAttribute('cx', '0');
    clipBody.setAttribute('cy', '0');
    clipBody.setAttribute('rx', '50'); // Reduced from 80
    clipBody.setAttribute('ry', '25'); // Reduced from 40
    clipPath.appendChild(clipBody);
    
    // Add the clip path to the SVG
    koiGroup.appendChild(clipPath);
    
    // Create a group for the spots that will use the clip path
    const spotsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    spotsGroup.setAttribute('clip-path', `url(#${clipId})`);
    koiGroup.appendChild(spotsGroup);
    
    // Track placed spots to avoid overlap
    const placedSpots = [];
    const bodyRx = 50; // Reduced from 80
    const bodyRy = 25; // Reduced from 40
    
    // Add spots (orange and black)
    let attempts = 0;
    const maxAttempts = 50;
    
    for (let i = 0; i < options.spotCount && attempts < maxAttempts; i++) {
        // Generate a spot within the ellipse bounds
        const spotRadius = 3 + Math.random() * 5; // Reduced from 5-13 to 3-8
        
        // Try to find a non-overlapping position
        let validPosition = false;
        let spotX, spotY;
        let positionAttempts = 0;
        
        while (!validPosition && positionAttempts < 20) {
            // Generate random position within the ellipse
            // Use parametric equation with random angle and radius factor
            const angle = Math.random() * Math.PI * 2;
            const radiusFactor = Math.random() * 0.8; // Stay within 80% of the ellipse to avoid edge clipping
            
            spotX = Math.cos(angle) * (bodyRx - spotRadius) * radiusFactor;
            spotY = Math.sin(angle) * (bodyRy - spotRadius) * radiusFactor;
            
            // Check if this position overlaps with any existing spot
            validPosition = true;
            for (const existingSpot of placedSpots) {
                const dx = spotX - existingSpot.x;
                const dy = spotY - existingSpot.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < spotRadius + existingSpot.radius + 2) { // Add 2px buffer
                    validPosition = false;
                    break;
                }
            }
            
            positionAttempts++;
        }
        
        if (validPosition) {
            const spot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            spot.setAttribute('cx', spotX);
            spot.setAttribute('cy', spotY);
            spot.setAttribute('r', spotRadius);
            spot.setAttribute('fill', i % 3 === 0 ? 'black' : 'orange');
            spotsGroup.appendChild(spot);
            
            // Remember this spot's position and radius
            placedSpots.push({ x: spotX, y: spotY, radius: spotRadius });
        } else {
            // If we couldn't place this spot, try again
            i--;
            attempts++;
        }
    }
    
    return koiGroup;
}

function createLilyPads(svg) {
    const lilyPadCount = 15 + Math.floor(Math.random() * 10); // Increased to 15-25 lily pads
    // Colors from the image - vibrant circles in various colors
    const colors = [
        '#f94144', // bright red
        '#f3722c', // orange
        '#f8961e', // light orange
        '#f9c74f', // yellow
        '#90be6d', // light green
        '#43aa8b', // teal
        '#4d908e', // dark teal
        '#577590', // blue
        '#277da1', // dark blue
        '#9d4edd', // purple
        '#e63946', // red
        '#ff9f1c', // orange
        '#ffbf69', // light orange
        '#2ec4b6', // turquoise
        '#ff595e', // coral
        '#ffca3a', // yellow
        '#8ac926', // green
        '#1982c4', // blue
        '#6a4c93'  // purple
    ];
    const placedLilyPads = [];
    // Fish is now about 100 units long, lily pads should be smaller
    const baseScale = 0.8; // Reduced from 1.6 to make lily pads smaller
    const scaleVariation = 0.3; // Slightly more variation for visual interest
    const minDistance = 120; // Reduced minimum distance to allow more lily pads
    
    // Try to place lily pads without overlapping
    let attempts = 0;
    const maxAttempts = 300; // Increased max attempts to find valid positions
    
    for (let i = 0; i < lilyPadCount && attempts < maxAttempts; i++) {
        const scale = baseScale + Math.random() * scaleVariation;
        const effectiveRadius = 50 * scale; // Calculate the actual radius after scaling
        const rotation = Math.random() * 360;
        
        // Try to find a non-overlapping position
        let validPosition = false;
        let x, y;
        let positionAttempts = 0;
        const maxPositionAttempts = 50; // Further increased position attempts
        
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
                
                // Use the combined radii plus a larger buffer to ensure no overlap
                if (distance < combinedRadius + 40) {
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
            
            // Create varied lily pad shapes inspired by the image
            const shapeType = Math.floor(Math.random() * 4); // 0-3 for different shape types
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            if (shapeType === 0) {
                // Ellipse/oval shape (like in the image)
                const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
                // Randomize the aspect ratio
                const aspectRatio = 0.6 + Math.random() * 0.8; // Between 0.6 and 1.4
                ellipse.setAttribute('cx', '0');
                ellipse.setAttribute('cy', '0');
                ellipse.setAttribute('rx', '50');
                ellipse.setAttribute('ry', 50 * aspectRatio);
                ellipse.setAttribute('fill', color);
                lilyPad.appendChild(ellipse);
            } 
            else if (shapeType === 1) {
                // Organic blob shape with bezier curves
                const blob = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                
                // Create an organic shape with 6-8 points and bezier curves
                const points = 6 + Math.floor(Math.random() * 3);
                let pathData = '';
                
                for (let j = 0; j <= points; j++) {
                    const angle = (j / points) * Math.PI * 2;
                    // Vary the radius to create irregular shapes
                    const radius = 50 * (0.8 + Math.random() * 0.4);
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    
                    if (j === 0) {
                        pathData = `M ${x},${y}`;
                    } else {
                        // Use bezier curves for smooth, organic shapes
                        const prevAngle = ((j-1) / points) * Math.PI * 2;
                        const cpRadius = radius * (0.9 + Math.random() * 0.2);
                        
                        // Control points for the bezier curve
                        const cp1x = Math.cos(prevAngle + (angle - prevAngle) * 0.3) * cpRadius * 1.2;
                        const cp1y = Math.sin(prevAngle + (angle - prevAngle) * 0.3) * cpRadius * 1.2;
                        const cp2x = Math.cos(angle - (angle - prevAngle) * 0.3) * cpRadius * 1.2;
                        const cp2y = Math.sin(angle - (angle - prevAngle) * 0.3) * cpRadius * 1.2;
                        
                        pathData += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
                    }
                }
                
                pathData += ' Z'; // Close the path
                blob.setAttribute('d', pathData);
                blob.setAttribute('fill', color);
                lilyPad.appendChild(blob);
            }
            else if (shapeType === 2) {
                // Rounded rectangle or pill shape (seen in the image)
                const roundedRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                const width = 100;
                const height = 40 + Math.random() * 60; // Vary height for different proportions
                const cornerRadius = 20 + Math.random() * 30; // Rounded corners
                
                roundedRect.setAttribute('x', -width/2);
                roundedRect.setAttribute('y', -height/2);
                roundedRect.setAttribute('width', width);
                roundedRect.setAttribute('height', height);
                roundedRect.setAttribute('rx', cornerRadius);
                roundedRect.setAttribute('ry', cornerRadius);
                roundedRect.setAttribute('fill', color);
                lilyPad.appendChild(roundedRect);
            }
            else {
                // Circle with a bite or cut (like traditional lily pad)
                const pad = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                // Create a circle with a random cut/bite
                const cutAngle = Math.random() * Math.PI * 2; // Random position for the cut
                const cutWidth = Math.PI / 6 + (Math.random() * Math.PI / 6); // Size of the cut
                
                // Start and end points of the arc
                const startX = Math.cos(cutAngle) * 50;
                const startY = Math.sin(cutAngle) * 50;
                const endX = Math.cos(cutAngle + cutWidth) * 50;
                const endY = Math.sin(cutAngle + cutWidth) * 50;
                
                // Create the path: move to start, arc around, then close through center
                const pathData = `M ${startX},${startY} A 50,50 0 1 1 ${endX},${endY} L 0,0 Z`;
                
                pad.setAttribute('d', pathData);
                pad.setAttribute('fill', color);
                lilyPad.appendChild(pad);
            }
            
            svg.appendChild(lilyPad);
            
            // Remember this lily pad's position
            placedLilyPads.push({ x, y, scale });
        } else {
            // If we couldn't place this lily pad, try again
            i--;
            attempts++;
            
            // If we've tried too many times, reduce the number of lily pads
            if (attempts > maxAttempts * 0.5 && lilyPadCount > 5) {
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
        // Only animate fish that don't already have animations
        if (!fish.hasAttribute('data-animated')) {
            animateKoi(fish);
            fish.setAttribute('data-animated', 'true');
        }
    });
    
    // Animate lily pads
    const lilyPads = document.querySelectorAll('.lily-pad');
    lilyPads.forEach(pad => {
        // Only animate lily pads that don't already have animations
        if (!pad.hasAttribute('data-animated')) {
            animateLilyPad(pad);
            pad.setAttribute('data-animated', 'true');
        }
    });
}

function animateKoi(koi) {
    // Skip if this koi is already being animated
    if (koi.hasAttribute('data-timeline')) return;
    
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
            // Store reference to the timeline on the koi element
            koi.setAttribute('data-timeline', 'active');
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
    
    // Create a subtle wiggle animation for the tail - scaled down
    gsap.to(tail, {
        attr: { d: 'M -50,0 Q -75,25 -65,0 Q -75,-25 -50,0' },
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    
    // Also add a subtle scaling effect to the body to simulate swimming motion
    const body = koi.querySelector('ellipse');
    if (body) {
        gsap.to(body, {
            attr: { ry: 23 }, // Slightly squeeze the body (scaled down from 38)
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
