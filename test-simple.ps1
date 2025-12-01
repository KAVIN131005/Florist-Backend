$baseUrl = "http://localhost:8081/api"
$authToken = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJVU0VSIl0sInN1YiI6ImhhcmluaUBnbWFpbC5jb20iLCJpYXQiOjE3NjQ1ODgxODEsImV4cCI6MTc2NDY3NDU4MX0.2vt3hxloFinfEnjmj6tFJIqypggMDftmOnkrqo7HOeg"

$headers = @{
    'Authorization' = "Bearer $authToken"
    'Content-Type' = 'application/json'
}

Write-Host "Testing orders with payment information..."

try {
    $orders = Invoke-RestMethod -Uri "$baseUrl/orders" -Method GET -Headers $headers
    Write-Host "Found $($orders.Count) orders:"
    
    for ($i = 0; $i -lt $orders.Count; $i++) {
        $order = $orders[$i]
        Write-Host ""
        Write-Host "Order $($i+1):"
        Write-Host "  ID: $($order.id)"
        Write-Host "  Amount: Rs.$($order.totalAmount)"
        Write-Host "  Status: $($order.status)"
        Write-Host "  Items: $($order.items.Count)"
        
        if ($order.payment) {
            Write-Host "  Payment Status: $($order.payment.status)"
            if ($order.payment.floristShare) {
                Write-Host "  Florist Share: Rs.$($order.payment.floristShare)"
                Write-Host "  Admin Share: Rs.$($order.payment.adminShare)"
            }
        } else {
            Write-Host "  Payment: Not processed yet"
        }
    }
    
    Write-Host ""
    Write-Host "SUCCESS: Orders endpoint working with payment info!"
    
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}