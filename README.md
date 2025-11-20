# Nodesty API Client

A powerful API client for Nodesty.

## 📦 Features

- ⚡ Fast & Secure
- 🔌 Easy to use
- ✅ Type-Safe
- ⚙️ Modular & Scalable
- 💯 %100 Coverage of Nodesty API

## 🚀 Getting Started

### Installation

```bash
npx nypm i @nodesty/api-client
```

### Usage

```javascript
import { NodestyApiClient } from '@nodesty/api-client';

const api = new NodestyApiClient({
    accessToken: 'YOUR_NODESTY_PERSONAL_ACCESS_TOKEN',
});

// Now you can access different services:
const user = api.user;
const vps = api.vps;
const firewall = api.firewall;
const dedicatedServer = api.dedicatedServer;
const mailHosting = api.mailHosting;
```

## ❤️ Contribute

Contributions are always welcome! Please read the [contribution guidelines](CONTRIBUTING.md) first.

## ⚖️ License

[MIT](LICENSE)
