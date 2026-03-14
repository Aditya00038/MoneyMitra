# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Razorpay setup (Savings Goals)

1. Copy `.env.example` to `.env.local`.
2. Set your Razorpay Key ID (public key):

```env
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

3. (Recommended for production) set backend order API endpoint:

```env
VITE_RAZORPAY_ORDER_API=https://your-api.example.com/api/razorpay/order
```

### Important

- Never put Razorpay `key_secret` in frontend (`VITE_...`) env files.
- `key_secret` must stay on backend only.
- Frontend uses `VITE_RAZORPAY_KEY_ID` and optionally calls your backend to create a Razorpay order.
