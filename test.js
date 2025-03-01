// Simple test functions for the Koi Pond
function testDOMElements() {
    console.log('Running DOM element tests...');
    
    // Test 1: Check if pond container exists
    const container = document.getElementById('pond-container');
    console.assert(container !== null, 'Pond container should exist');
    
    // Test 2: Check if SVG was created
    const svg = document.getElementById('pond');
    console.assert(svg !== null, 'SVG element should exist');
    
    // Test 3: Check if koi fish were created
    const koi = document.querySelectorAll('.koi');
    console.assert(koi.length === 2, `Expected 2 koi fish, found ${koi.length}`);
    
    // Test 4: Check if lily pads were created
    const lilyPads = document.querySelectorAll('.lily-pad');
    console.assert(lilyPads.length >= 8, `Expected at least 8 lily pads, found ${lilyPads.length}`);
    
    console.log('All tests completed!');
}

// Run tests after the page has loaded
window.addEventListener('load', function() {
    // Wait a moment for animations to initialize
    setTimeout(testDOMElements, 500);
});
