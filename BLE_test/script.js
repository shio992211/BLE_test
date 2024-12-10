document.getElementById('connectButton').addEventListener('click', async () => {
    const outputDiv = document.getElementById('output');
    try {
        outputDiv.style.display = 'block';
        outputDiv.textContent = 'Searching for devices...';

        // デバイス選択
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['12345678-1234-1234-1234-123456789012']
        });

        outputDiv.textContent = `Connecting to ${device.name}...`;

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService('12345678-1234-1234-1234-123456789012');
        const characteristic = await service.getCharacteristic('87654321-4321-4321-4321-210987654321');

        // データを読み取る
        const value = await characteristic.readValue();
        const decoder = new TextDecoder('utf-8');
        outputDiv.className = 'alert alert-success';
        outputDiv.textContent = 'Received from ESP32: ' + decoder.decode(value);

        // データを書き込む
        const encoder = new TextEncoder('utf-8');
        const data = encoder.encode('Hello from Web!');
        await characteristic.writeValue(data);

        alert('Data sent to ESP32 successfully!');
    } catch (error) {
        console.error(error);
        outputDiv.className = 'alert alert-danger';
        outputDiv.textContent = 'Bluetooth connection failed: ' + error.message;
    }
});