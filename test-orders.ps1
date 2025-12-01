# Test script for orders endpoint
$baseUrl = "http://localhost:8081/api"
$authToken = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJVU0VSIl0sInN1YiI6ImhhcmluaUBnbWFpbC5jb20iLCJpYXQiOjE3NjQ1ODgxODEsImV4cCI6MTc2NDY3NDU4MX0.2vt3hxloFinfEnjmj6tFJIqypggMDftmOnkrqo7HOeg"

$headers = @{
    'Authorization' = "Bearer $authToken"
    'Content-Type' = 'application/json'
}

# Test GET orders endpoint
Write-Host "Testing GET /api/orders endpoint..."
try {
    $getResponse = Invoke-RestMethod -Uri "$baseUrl/orders" -Method GET -Headers $headers
    Write-Host "GET Response: $($getResponse | ConvertTo-Json)"
} catch {
    Write-Host "GET Error: $($_.Exception.Message)"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
}

# Test POST orders endpoint with sample cart items
Write-Host "`nTesting POST /api/orders endpoint with cart items..."
$cartItems = @(
    @{
        productId = 1
        productName = "Red Roses"
        productImage = "roses.jpg"
        price = 50.0
        quantity = 100
        floristId = 1
        floristName = "Test Florist"
        floristUsername = "florist1"
    }
)

$orderData = @{
    cartItems = $cartItems
    deliveryAddress = "123 Test Street, Test City"
    totalAmount = 50.0
} | ConvertTo-Json -Depth 3

try {
    $postResponse = Invoke-RestMethod -Uri "$baseUrl/orders" -Method POST -Headers $headers -Body $orderData
    Write-Host "POST Response: $($postResponse | ConvertTo-Json)"
} catch {
    Write-Host "POST Error: $($_.Exception.Message)"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody"
    }
}