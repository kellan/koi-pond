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
    const patchCount = 2 + Math.floor(Math.random() * 3); // 2-4 kohaku patches
    
    const newKoi = createSingleKoi({
        x: svgX,
        y: svgY,
        rotation: rotation,
        scale: scale,
        spotCount: patchCount // Using the same parameter name for compatibility
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
        spotCount: 3  // 3 kohaku patches
    }));
    
    // Second fish - starts at bottom edge, swimming up
    koiFish.push(createSingleKoi({
        x: 700,
        y: 550,
        rotation: 270,  // Swimming up
        scale: 0.6,     // Smaller scale
        spotCount: 2    // 2 kohaku patches
    }));
    
    // Third fish - starts at top edge, swimming down
    koiFish.push(createSingleKoi({
        x: 300,
        y: 50,
        rotation: 90,  // Swimming down
        scale: 0.5,    // Smaller scale
        spotCount: 4   // 4 kohaku patches
    }));
    
    // Fourth fish - starts at right edge, swimming left
    koiFish.push(createSingleKoi({
        x: 950,
        y: 350,
        rotation: 180,  // Swimming left
        scale: 0.65,    // Smaller scale
        spotCount: 3    // 3 kohaku patches
    }));
    
    // Fifth fish - starts in the middle, swimming diagonally
    koiFish.push(createSingleKoi({
        x: 500,
        y: 300,
        rotation: 45,  // Swimming diagonally
        scale: 0.55,   // Smaller scale
        spotCount: 2   // 2 kohaku patches
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
    
    // Add kohaku pattern (red patches on white) inspired by kohaku-koi-h.jpg
    let attempts = 0;
    const maxAttempts = 50;
    
    // Create larger patches that extend to the edges like in the reference image
    const patchCount = 2 + Math.floor(Math.random() * 3); // 2-4 patches
    
    // Define pattern types based on the kohaku reference image
    const patternTypes = [
        { name: 'headPatch', chance: 0.4 }, // Patch on head (less common)
        { name: 'backPatch', chance: 0.8 }, // Large patch on back/middle (very common)
        { name: 'tailPatch', chance: 0.6 }, // Patch near tail (common)
        { name: 'bellyPatch', chance: 0.5 }  // Patch on belly/bottom (medium common)
    ];
    
    // Select which pattern elements to include
    const selectedPatterns = [];
    patternTypes.forEach(pattern => {
        if (Math.random() < pattern.chance) {
            selectedPatterns.push(pattern.name);
        }
    });
    
    // Ensure we have at least 2 patterns
    if (selectedPatterns.length < 2) {
        // Add the back patch if not already selected (most common in kohaku)
        if (!selectedPatterns.includes('backPatch')) {
            selectedPatterns.push('backPatch');
        }
        
        // If still need one more, add another random pattern
        if (selectedPatterns.length < 2) {
            const remainingPatterns = patternTypes
                .filter(p => !selectedPatterns.includes(p.name))
                .sort((a, b) => b.chance - a.chance);
            
            if (remainingPatterns.length > 0) {
                selectedPatterns.push(remainingPatterns[0].name);
            }
        }
    }
    
    // Create each selected pattern
    for (const patternName of selectedPatterns) {
        let patchPath;
        
        switch (patternName) {
            case 'headPatch':
                // Create a patch on the head area
                patchPath = createHeadPatch(bodyRx, bodyRy);
                break;
                
            case 'backPatch':
                // Create a large patch on the back/middle area
                patchPath = createBackPatch(bodyRx, bodyRy);
                break;
                
            case 'tailPatch':
                // Create a patch near the tail
                patchPath = createTailPatch(bodyRx, bodyRy);
                break;
                
            case 'bellyPatch':
                // Create a patch on the belly/bottom
                patchPath = createBellyPatch(bodyRx, bodyRy);
                break;
        }
        
        if (patchPath) {
            patchPath.setAttribute('fill', '#ff4d4d'); // Bright orange-red for kohaku pattern
            spotsGroup.appendChild(patchPath);
        }
    }
    
    // Helper function to create a head patch
    function createHeadPatch(bodyRx, bodyRy) {
        const patch = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        // Head patch typically covers part of the head but not the eyes
        // Start from one edge of the body and extend partway across
        const headCoverage = 0.3 + Math.random() * 0.2; // Cover 30-50% of head length
        const sideExtension = 0.7 + Math.random() * 0.3; // How far down the sides it extends
        
        // Create points for the patch
        const points = [];
        
        // Top edge points (following the curve of the body)
        points.push({ x: bodyRx * (1 - headCoverage), y: -bodyRy * sideExtension });
        points.push({ x: bodyRx, y: -bodyRy * (0.3 + Math.random() * 0.4) });
        
        // Bottom edge points
        points.push({ x: bodyRx, y: bodyRy * (0.3 + Math.random() * 0.4) });
        points.push({ x: bodyRx * (1 - headCoverage), y: bodyRy * sideExtension });
        
        // Create the path data
        let pathData = `M ${points[0].x},${points[0].y} `;
        
        // Add curves between points
        for (let i = 1; i < points.length; i++) {
            const prevPoint = points[i-1];
            const currPoint = points[i];
            
            // Create control points for the curve
            const cpX1 = prevPoint.x + (currPoint.x - prevPoint.x) * 0.5;
            const cpY1 = prevPoint.y;
            const cpX2 = prevPoint.x + (currPoint.x - prevPoint.x) * 0.5;
            const cpY2 = currPoint.y;
            
            pathData += `C ${cpX1},${cpY1} ${cpX2},${cpY2} ${currPoint.x},${currPoint.y} `;
        }
        
        // Close the path with a curve back to the start
        const firstPoint = points[0];
        const lastPoint = points[points.length-1];
        const cpX1 = lastPoint.x - (bodyRx * 0.2);
        const cpY1 = lastPoint.y;
        const cpX2 = firstPoint.x - (bodyRx * 0.2);
        const cpY2 = firstPoint.y;
        
        pathData += `C ${cpX1},${cpY1} ${cpX2},${cpY2} ${firstPoint.x},${firstPoint.y} Z`;
        
        patch.setAttribute('d', pathData);
        return patch;
    }
    
    // Helper function to create a back patch
    function createBackPatch(bodyRx, bodyRy) {
        const patch = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        // Back patch typically covers a large portion of the middle/back
        // Determine the coverage area
        const startX = bodyRx * (0.3 + Math.random() * 0.2); // Start 30-50% from head
        const endX = -bodyRx * (0.1 + Math.random() * 0.3); // End 10-40% from tail
        const topExtension = 1.0; // Extend fully to the top edge
        const bottomExtension = Math.random() < 0.5 ? 0.3 + Math.random() * 0.3 : 1.0; // Sometimes extend to bottom
        
        // Create points for the patch
        const points = [];
        
        // Front edge points
        points.push({ x: startX, y: -bodyRy * topExtension });
        
        // If not extending to bottom, add points to curve around
        if (bottomExtension < 1.0) {
            points.push({ x: startX + (endX - startX) * 0.3, y: -bodyRy * 0.8 });
            points.push({ x: startX + (endX - startX) * 0.7, y: -bodyRy * 0.9 });
            points.push({ x: endX, y: -bodyRy * topExtension });
        } else {
            // If extending to bottom, go all the way around
            points.push({ x: startX, y: bodyRy * bottomExtension });
            points.push({ x: endX, y: bodyRy * bottomExtension });
            points.push({ x: endX, y: -bodyRy * topExtension });
        }
        
        // Create the path data
        let pathData = `M ${points[0].x},${points[0].y} `;
        
        // Add curves between points
        for (let i = 1; i < points.length; i++) {
            const prevPoint = points[i-1];
            const currPoint = points[i];
            
            // Create control points for the curve
            let cpX1, cpY1, cpX2, cpY2;
            
            if (i === 1 && bottomExtension >= 1.0) {
                // Special case for the first curve when wrapping around
                cpX1 = prevPoint.x;
                cpY1 = prevPoint.y + (currPoint.y - prevPoint.y) * 0.5;
                cpX2 = currPoint.x;
                cpY2 = prevPoint.y + (currPoint.y - prevPoint.y) * 0.5;
            } else if (i === 3 && bottomExtension >= 1.0) {
                // Special case for the last curve when wrapping around
                cpX1 = prevPoint.x;
                cpY1 = prevPoint.y + (currPoint.y - prevPoint.y) * 0.5;
                cpX2 = currPoint.x;
                cpY2 = prevPoint.y + (currPoint.y - prevPoint.y) * 0.5;
            } else {
                // Standard curve
                cpX1 = prevPoint.x + (currPoint.x - prevPoint.x) * 0.5;
                cpY1 = prevPoint.y;
                cpX2 = prevPoint.x + (currPoint.x - prevPoint.x) * 0.5;
                cpY2 = currPoint.y;
            }
            
            pathData += `C ${cpX1},${cpY1} ${cpX2},${cpY2} ${currPoint.x},${currPoint.y} `;
        }
        
        // Close the path
        pathData += 'Z';
        
        patch.setAttribute('d', pathData);
        return patch;
    }
    
    // Helper function to create a tail patch
    function createTailPatch(bodyRx, bodyRy) {
        const patch = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        // Tail patch typically covers the tail area
        // Determine the coverage area
        const startX = -bodyRx * (0.3 + Math.random() * 0.2); // Start 30-50% from end
        const endX = -bodyRx; // End at the tail
        const topExtension = 0.7 + Math.random() * 0.3; // How far up it extends
        const bottomExtension = 0.7 + Math.random() * 0.3; // How far down it extends
        
        // Create points for the patch
        const points = [];
        
        // Add points to define the patch
        points.push({ x: startX, y: -bodyRy * topExtension });
        points.push({ x: endX * 0.9, y: -bodyRy * topExtension * 0.8 });
        points.push({ x: endX, y: 0 }); // Tail tip
        points.push({ x: endX * 0.9, y: bodyRy * bottomExtension * 0.8 });
        points.push({ x: startX, y: bodyRy * bottomExtension });
        
        // Create the path data
        let pathData = `M ${points[0].x},${points[0].y} `;
        
        // Add curves between points
        for (let i = 1; i < points.length; i++) {
            const prevPoint = points[i-1];
            const currPoint = points[i];
            
            // Create control points for the curve
            let cpX1, cpY1, cpX2, cpY2;
            
            if (i === 2) { // Special case for the tail tip
                cpX1 = prevPoint.x + (currPoint.x - prevPoint.x) * 0.7;
                cpY1 = prevPoint.y;
                cpX2 = currPoint.x;
                cpY2 = currPoint.y - (currPoint.y - prevPoint.y) * 0.5;
            } else if (i === 3) { // Special case after the tail tip
                cpX1 = prevPoint.x;
                cpY1 = prevPoint.y + (currPoint.y - prevPoint.y) * 0.5;
                cpX2 = currPoint.x + (prevPoint.x - currPoint.x) * 0.7;
                cpY2 = currPoint.y;
            } else {
                // Standard curve
                cpX1 = prevPoint.x + (currPoint.x - prevPoint.x) * 0.5;
                cpY1 = prevPoint.y;
                cpX2 = prevPoint.x + (currPoint.x - prevPoint.x) * 0.5;
                cpY2 = currPoint.y;
            }
            
            pathData += `C ${cpX1},${cpY1} ${cpX2},${cpY2} ${currPoint.x},${currPoint.y} `;
        }
        
        // Close the path with a curve
        const firstPoint = points[0];
        const lastPoint = points[points.length-1];
        
        pathData += `C ${lastPoint.x + (firstPoint.x - lastPoint.x) * 0.3},${lastPoint.y} 
                      ${lastPoint.x + (firstPoint.x - lastPoint.x) * 0.7},${firstPoint.y} 
                      ${firstPoint.x},${firstPoint.y} Z`;
        
        patch.setAttribute('d', pathData);
        return patch;
    }
    
    // Helper function to create a belly patch
    function createBellyPatch(bodyRx, bodyRy) {
        const patch = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        // Belly patch typically covers part of the bottom/belly area
        // Determine the coverage area
        const startX = bodyRx * (0.1 + Math.random() * 0.2); // Start 10-30% from head
        const endX = -bodyRx * (0.2 + Math.random() * 0.3); // End 20-50% from tail
        const bottomExtension = 1.0; // Extend fully to the bottom edge
        const topExtension = 0.2 + Math.random() * 0.3; // How far up it extends
        
        // Create points for the patch
        const points = [];
        
        // Add points to define the patch
        points.push({ x: startX, y: bodyRy * bottomExtension });
        points.push({ x: startX, y: bodyRy * topExtension });
        points.push({ x: startX + (endX - startX) * 0.5, y: bodyRy * (topExtension + 0.1) });
        points.push({ x: endX, y: bodyRy * topExtension });
        points.push({ x: endX, y: bodyRy * bottomExtension });
        
        // Create the path data
        let pathData = `M ${points[0].x},${points[0].y} `;
        
        // Add curves between points
        for (let i = 1; i < points.length; i++) {
            const prevPoint = points[i-1];
            const currPoint = points[i];
            
            // Create control points for the curve
            let cpX1, cpY1, cpX2, cpY2;
            
            if (i === 1 || i === 4) { // Vertical segments
                cpX1 = prevPoint.x;
                cpY1 = prevPoint.y + (currPoint.y - prevPoint.y) * 0.5;
                cpX2 = currPoint.x;
                cpY2 = prevPoint.y + (currPoint.y - prevPoint.y) * 0.5;
            } else {
                // Standard curve
                cpX1 = prevPoint.x + (currPoint.x - prevPoint.x) * 0.5;
                cpY1 = prevPoint.y;
                cpX2 = prevPoint.x + (currPoint.x - prevPoint.x) * 0.5;
                cpY2 = currPoint.y;
            }
            
            pathData += `C ${cpX1},${cpY1} ${cpX2},${cpY2} ${currPoint.x},${currPoint.y} `;
        }
        
        // Close the path
        pathData += 'Z';
        
        patch.setAttribute('d', pathData);
        return patch;
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
            
            // Create simple circles and near-perfect ovals
            const shapeType = Math.floor(Math.random() * 2); // 0-1 for circle or oval
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            if (shapeType === 0) {
                // Perfect circle
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', '0');
                circle.setAttribute('cy', '0');
                circle.setAttribute('r', '50');
                circle.setAttribute('fill', color);
                lilyPad.appendChild(circle);
            } 
            else {
                // Near-perfect oval (slightly elongated circle)
                const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
                // Very subtle aspect ratio variation to keep it close to a circle
                const aspectRatio = 0.9 + Math.random() * 0.2; // Between 0.9 and 1.1
                ellipse.setAttribute('cx', '0');
                ellipse.setAttribute('cy', '0');
                ellipse.setAttribute('rx', '50');
                ellipse.setAttribute('ry', 50 * aspectRatio);
                ellipse.setAttribute('fill', color);
                lilyPad.appendChild(ellipse);
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
    
    // Add subtle movement to the kohaku patches
    const patches = koi.querySelectorAll('g[clip-path] path');
    patches.forEach((patch, index) => {
        // Create a very slight movement for each patch
        gsap.to(patch, {
            scale: 1.02,
            duration: 1.5 + (index * 0.3),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
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
