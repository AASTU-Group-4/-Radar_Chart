
// Function to capture and validate user input data
function getChartData() {
    const name = document.getElementById('name').value.trim();
    const maths = parseInt(document.getElementById('maths').value);
    const science = parseInt(document.getElementById('science').value);
    const social = parseInt(document.getElementById('social').value);
    const music = parseInt(document.getElementById('music').value);
    const art = parseInt(document.getElementById('art').value);

    // Validate the input data
    if (!name || isNaN(maths) || isNaN(science) || isNaN(social) || isNaN(music) || isNaN(art)) {
        alert("Please fill out all fields correctly.");
        return null;
    }

    // Prepare data for radar chart
    const labels = ['Maths', 'Science', 'Social Studies', 'Music', 'Art'];
    const values = [maths, science, social, music, art];

    return { name, labels, values };
}

// Event listener for the form submission
document.getElementById('chartForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    const chartData = getChartData();
    if (chartData) {
        
        // Call your function to render the radar chart here
    }
});