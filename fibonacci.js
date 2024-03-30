// JavaScript source code
function fibonacciSeries(numTerms) {
    let fibonacci = [0, 1]; // Initialize the series with first two terms
    
    // Generate subsequent terms
    for (let i = 2; i < numTerms; i++) {
        fibonacci[i] = fibonacci[i - 1] + fibonacci[i - 2];
    }
    
    return fibonacci;
}

// Example usage:
const numTerms = 10; // Change this to generate Fibonacci series with different number of terms
const series = fibonacciSeries(numTerms);

// Print each term individually
let result = "Fibonacci Series up to " + numTerms + " terms: ";
for (let i = 0; i < series.length; i++) {
    result += series[i];
    if (i < series.length - 1) {
        result += ", ";
    }
}
// Display result
return result;
