# Test with existing product ID
$baseUrl = "http://localhost:8081/api"
$authToken = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJVU0VSIl0sInN1YiI6ImhhcmluaUBnbWFpbC5jb20iLCJpYXQiOjE3NjQ1ODgxODEsImV4cCI6MTc2NDY3NDU4MX0.2vt3hxloFinfEnjmj6tFJIqypggMDftmOnkrqo7HOeg"

$headers = @{
    'Authorization' = "Bearer $authToken"
    'Content-Type' = 'application/json'
}

# Test final order similar to what frontend sends
$cartItems = @(
    @{
        productId = 1
        productName = "Jasmine"
        productImage = "jasmine.jpg"
        price = 72.0
        quantity = 3
        floristId = 1
        floristName = "Test Florist"
        floristUsername = "florist1"
    }
)

$orderData = @{
    cartItems = $cartItems
    deliveryAddress = "456 Demo Avenue, Payment Test City"
    totalAmount = 216.0
} | ConvertTo-Json -Depth 3

Write-Host "Testing final order creation for Razorpay integration..."
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/orders" -Method POST -Headers $headers -Body $orderData
    
    Write-Host "`n🎉 SUCCESS!"
    Write-Host "===================="
    Write-Host "Order ID: $($response.id)"
    Write-Host "Total Amount: Rs. $($response.totalAmount)"
    Write-Host "Status: $($response.status)"
    Write-Host "Created At: $($response.createdAt)"
    Write-Host "Items: $($response.items.Count) item(s)"
    
    foreach ($item in $response.items) {
        Write-Host "  - $($item.productName): $($item.grams)g @ Rs.$($item.pricePer100g)/100g = Rs.$($item.subtotal)"
    }
    
    Write-Host "`n✅ READY FOR RAZORPAY PAYMENT!"
    Write-Host "The frontend will receive order ID '$($response.id)' for payment processing."
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody"
    }
}