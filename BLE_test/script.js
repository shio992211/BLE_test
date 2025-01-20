let characteristic;

document.getElementById('connectButton').addEventListener('click', async () => {
    const outputDiv = document.getElementById('output');
    try {
        outputDiv.style.display = 'block';
        outputDiv.textContent = 'デバイスを検出中...';

        const device = await navigator.bluetooth.requestDevice({
            filters: [{
                namePrefix: 'ESP32'  // 名前が「ESP32」で始まるデバイスのみ選択
            }],
            optionalServices: ['12345678-1234-5678-1234-56789abcdef0'] // 特定のサービスUUIDを指定
        });

        outputDiv.textContent = `Connecting to ${device.name}...`;
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService('12345678-1234-5678-1234-56789abcdef0');
        characteristic = await service.getCharacteristic('abcdef01-1234-5678-1234-56789abcdef0');

        // 接続成功 → 画面遷移
        document.getElementById('connectPage').style.display = 'none';
        document.getElementById('controlPage').style.display = 'block';
    } catch (error) {
        console.error(error);
        outputDiv.className = 'alert alert-danger';
        outputDiv.textContent = 'Bluetoothの接続に失敗しました: ' + error.message;
    }
});

// ボタン1で「1」を送信
document.getElementById('sendButton1').addEventListener('click', async () => {
    try {
        const encoder = new TextEncoder('utf-8');
        const data = encoder.encode('1'); // "1"を送信
        await characteristic.writeValue(data);
        alert('データの送信に成功しました: 1');
    } catch (error) {
        console.error(error);
        alert('通信に失敗しました: ' + error.message);
    }
});

// ボタン2で「2」を送信
document.getElementById('sendButton2').addEventListener('click', async () => {
    try {
        const encoder = new TextEncoder('utf-8');
        const data = encoder.encode('0'); // "2"を送信
        await characteristic.writeValue(data);
        alert('データの送信に成功しました: 0');
    } catch (error) {
        console.error(error);
        alert('通信に失敗しました: ' + error.message);
    }
});
