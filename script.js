async function searchOrders() {
    const username = document.getElementById('username').value.trim();
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error-message');
    
    // 清空之前的结果
    resultDiv.innerHTML = '';
    errorDiv.innerHTML = '';
    
    if (!username) {
        errorDiv.innerHTML = '请输入用户名';
        return;
    }

    try {
        const response = await fetch(`data/${username}.json`);
        
        if (!response.ok) {
            throw new Error('未找到该用户的订单信息');
        }

        const orders = await response.json();
        
        if (orders.length === 0) {
            errorDiv.innerHTML = '该用户暂无订单信息';
            return;
        }

        orders.forEach((order, index) => {
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order-item';
            orderDiv.innerHTML = `
                <h3>订单 #${index + 1}</h3>
                <div class="order-details">
                    <div class="order-detail">
                        <div class="detail-label">产品</div>
                        <div class="detail-value">${order.产品}</div>
                    </div>
                    <div class="order-detail">
                        <div class="detail-label">数量</div>
                        <div class="detail-value">${order.数量}</div>
                    </div>
                    <div class="order-detail">
                        <div class="detail-label">快递</div>
                        <div class="detail-value">${order.快递}</div>
                    </div>
                </div>
            `;
            resultDiv.appendChild(orderDiv);
        });

    } catch (error) {
        errorDiv.innerHTML = error.message;
    }
}