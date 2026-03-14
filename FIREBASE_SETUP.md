# Firebase setup for MoneyMitra

## 1) Firebase Authentication

In Firebase Console:

1. Open **Authentication**.
2. Go to **Sign-in method**.
3. Enable **Email/Password**.
4. Add your local/dev domain to **Authorized domains** if needed.

> Firebase Authentication does not use a security rules file like Firestore.
> Access is controlled by enabled sign-in providers and application logic.

## 2) Firestore data model used by the app

The app stores per-user finance data in this document path:

- `finance/{userId}`

Example document shape:

```json
{
  "wallet": {
    "connected": true,
    "provider": "Razorpay",
    "startingBalance": 0,
    "razorpayDeposits": 5000
  },
  "goals": [
    {
      "id": "goal_1",
      "name": "Laptop",
      "target": 50000,
      "saved": 3000
    }
  ],
  "transactions": [],
  "budgets": [],
  "updatedAt": "server timestamp"
}
```

## 3) Firestore security rules

Paste these rules into **Firestore Database > Rules**:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /finance/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 4) Recommended test flow

1. Sign up or sign in.
2. Connect wallet from the Wallet page.
3. Add money to wallet.
4. Create a savings goal.
5. Add money to the savings goal.
6. Refresh the app.
7. Confirm wallet balance and goals reload from Firestore.
