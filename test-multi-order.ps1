# Test multiple items order
$baseUrl = "http://localhost:8081/api"
$authToken = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJVU0VSIl0sInN1YiI6ImhhcmluaUBnbWFpbC5jb20iLCJpYXQiOjE3NjQ1ODgxODEsImV4cCI6MTc2NDY3NDU4MX0.2vt3hxloFinfEnjmj6tFJIqypggMDftmOnkrqo7HOeg"

$headers = @{
    'Authorization' = "Bearer $authToken"
    'Content-Type' = 'application/json'
}

# Test with multiple items like a real cart scenario
$cartItems = @(
    @{
        productId = 1
        productName = "Red Roses"
        productImage = "roses.jpg"
        price = 50.0
        quantity = 2
        floristId = 1
        floristName = "Test Florist"
        floristUsername = "florist1"
    },
    @{
        productId = 2
        productName = "White Lilies"
        productImage = "lilies.jpg"  
        price = 75.0
        quantity = 1
        floristId = 1
        floristName = "Test Florist"
        floristUsername = "florist1"
    }
)

$orderData = @{
    cartItems = $cartItems
    deliveryAddress = "123 Test Street, Test City"
    totalAmount = 175.0
} | ConvertTo-Json -Depth 3

Write-Host "Testing multi-item order creation..."
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/orders" -Method POST -Headers $headers -Body $orderData
    Write-Host "SUCCESS - Order created with ID: $($response.id)"
    Write-Host "Total Amount: $($response.totalAmount)"
    Write-Host "Items Count: $($response.items.Count)"
    Write-Host "Status: $($response.status)"
    
    if ($response.id -and $response.totalAmount -gt 0) {
        Write-Host "`n✅ ORDER CREATION IS WORKING - Ready for Razorpay integration!"
    } else {
        Write-Host "`n❌ Order creation failed - missing ID or amount"
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
}