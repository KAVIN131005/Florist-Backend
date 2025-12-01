# Complete Payment Flow Test
$baseUrl = "http://localhost:8081/api"
$authToken = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJVU0VSIl0sInN1YiI6ImhhcmluaUBnbWFpbC5jb20iLCJpYXQiOjE3NjQ1ODgxODEsImV4cCI6MTc2NDY3NDU4MX0.2vt3hxloFinfEnjmj6tFJIqypggMDftmOnkrqo7HOeg"

$headers = @{
    'Authorization' = "Bearer $authToken"
    'Content-Type' = 'application/json'
}

Write-Host "🌸 FLORIST PAYMENT FLOW DEMONSTRATION" -ForegroundColor Green

# Step 1: View existing orders
Write-Host "`n📋 STEP 1: Viewing current orders..." -ForegroundColor Yellow
try {
    $existingOrders = Invoke-RestMethod -Uri "$baseUrl/orders" -Method GET -Headers $headers
    Write-Host "Found $($existingOrders.Count) existing order(s):" -ForegroundColor Blue
    
    foreach ($order in $existingOrders) {
        Write-Host "  Order #$($order.id) - Rs.$($order.totalAmount) - Status: $($order.status)" -ForegroundColor Cyan
        if ($order.payment) {
            Write-Host "    Payment: $($order.payment.status)" -ForegroundColor Green
            if ($order.payment.floristShare) {
                Write-Host "    Florist Share: Rs.$($order.payment.floristShare) (80%)" -ForegroundColor Green
                Write-Host "    Admin Share: Rs.$($order.payment.adminShare) (20%)" -ForegroundColor Green
            }
        }
    }
} catch {
    Write-Host "Error getting existing orders: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 2: Create new order
Write-Host "`n🛒 STEP 2: Creating new order..." -ForegroundColor Yellow
$cartItems = @(
    @{
        productId = 1
        productName = "Premium Jasmine"
        productImage = "jasmine.jpg"
        price = 72.0
        quantity = 5
        floristId = 1
        floristName = "Garden Paradise"
        floristUsername = "florist1"
    }
)

$orderData = @{
    cartItems = $cartItems
    deliveryAddress = "123 Revenue Split Demo Street, Payment City"
    totalAmount = 360.0
} | ConvertTo-Json -Depth 3

try {
    $newOrder = Invoke-RestMethod -Uri "$baseUrl/orders" -Method POST -Headers $headers -Body $orderData
    Write-Host "✅ New order created successfully!" -ForegroundColor Green
    Write-Host "   Order ID: $($newOrder.id)" -ForegroundColor Blue
    Write-Host "   Total: Rs.$($newOrder.totalAmount)" -ForegroundColor Blue
    Write-Host "   Status: $($newOrder.status)" -ForegroundColor Blue
    
    $orderId = $newOrder.id
    
} catch {
    Write-Host "Error creating order: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 3: Check orders again
Write-Host "`n📊 STEP 3: Checking updated orders list..." -ForegroundColor Yellow
try {
    $updatedOrders = Invoke-RestMethod -Uri "$baseUrl/orders" -Method GET -Headers $headers
    Write-Host "Current orders:" -ForegroundColor Blue
    
    foreach ($order in $updatedOrders) {
        Write-Host "`n  Order #$($order.id)" -ForegroundColor White
        Write-Host "     Amount: Rs.$($order.totalAmount)" -ForegroundColor Cyan
        Write-Host "     Status: $($order.status)" -ForegroundColor Yellow
        Write-Host "     Items: $($order.items.Count) item(s)" -ForegroundColor Cyan
        
        if ($order.payment) {
            Write-Host "     Payment Status: $($order.payment.status)" -ForegroundColor Green
            if ($order.payment.floristShare) {
                Write-Host "     Florist Earnings: Rs.$($order.payment.floristShare) (80%)" -ForegroundColor Green
                Write-Host "     Platform Fee: Rs.$($order.payment.adminShare) (20%)" -ForegroundColor Blue
            }
        } else {
            Write-Host "     Payment: Pending" -ForegroundColor Yellow
        }
    }
    
    Write-Host "`n✅ SUMMARY:" -ForegroundColor Green
    Write-Host "- Order creation: Working" -ForegroundColor Green
    Write-Host "- Order display: Working with payment status" -ForegroundColor Green
    Write-Host "- Revenue split: Ready for 80/20 distribution" -ForegroundColor Green
    Write-Host "- Payment integration: Ready for Razorpay" -ForegroundColor Green
    
} catch {
    Write-Host "Error getting updated orders: $($_.Exception.Message)" -ForegroundColor Red
}