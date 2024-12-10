let characteristic; // キャラクタリスティックの参照

        document.getElementById('connectButton').addEventListener('click', async () => {
            const outputDiv = document.getElementById('output');
            try {
                outputDiv.style.display = 'block';
                outputDiv.textContent = 'Searching for devices...';

                // BLEデバイスに接続
                const device = await navigator.bluetooth.requestDevice({
                    acceptAllDevices: true,
                    optionalServices: ['12345678-1234-5678-1234-56789abcdef0']
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
                outputDiv.textContent = 'Bluetooth connection failed: ' + error.message;
            }
        });

        document.getElementById('sendButton').addEventListener('click', async () => {
            try {
                const encoder = new TextEncoder('utf-8');
                const data = encoder.encode('1'); // "1"を送信
                await characteristic.writeValue(data);
                alert('Data "1" sent to ESP32!');
            } catch (error) {
                console.error(error);
                alert('Failed to send data: ' + error.message);
            }
        });
