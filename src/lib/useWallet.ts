import { useState, useEffect, useRef, useCallback } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import {
  listenWalletBalance,
  addToWallet,
  deductFromWallet,
  type User,
} from "./firebase";

// ── Pricing constants ─────────────────────────────────────────────────────────
// Gemini Live API cost: ~₹1.87 per 10 min session
// Our rate: ₹2/min  →  ~10× margin
// Bill every 30 seconds = ₹1 per tick
export const RATE_PER_MIN_INR = 2;
export const BILL_INTERVAL_SEC = 30;
export const BILL_AMOUNT_PER_TICK = (RATE_PER_MIN_INR * BILL_INTERVAL_SEC) / 60; // ₹1
export const MIN_BALANCE_TO_START = RATE_PER_MIN_INR; // need at least ₹2 (1 min)

export type TopUpStatus = "idle" | "processing" | "error";

export function useWallet(user: User | null, onBalanceDepleted: () => void) {
  const [balance, setBalance] = useState(0);
  const [topUpStatus, setTopUpStatus] = useState<TopUpStatus>("idle");
  const [topUpError, setTopUpError] = useState<string | null>(null);
  const [callSeconds, setCallSeconds] = useState(0);

  const meterRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onDepletedRef = useRef(onBalanceDepleted);
  onDepletedRef.current = onBalanceDepleted;

  // ── Real-time Firestore balance listener ────────────────────────────────────
  useEffect(() => {
    if (!user) { setBalance(0); return; }
    const unsub = listenWalletBalance(user.uid, setBalance);
    return unsub;
  }, [user?.uid]);

  // ── Cashfree top-up ──────────────────────────────────────────────────────────
  // Order creation & verification run through logger-server.cjs (port 3001,
  // proxied at /api by Vite) — Cashfree blocks direct browser calls via CORS.
  const initiateTopUp = useCallback(async (amount: number): Promise<boolean> => {
    if (!user) return false;
    setTopUpStatus("processing");
    setTopUpError(null);

    try {
      // 1. Create order (server proxies to Cashfree with secret key)
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          userEmail: user.email,
          userName: user.displayName,
          amount,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Order creation failed");

      // 2. Open Cashfree popup checkout
      const mode = import.meta.env.VITE_CASHFREE_ENV === "production" ? "production" : "sandbox";
      const cashfree = await load({ mode });
      const result: any = await cashfree.checkout({
        paymentSessionId: orderData.paymentSessionId,
        redirectTarget: "_modal",
      });
      if (result?.error) throw new Error(result.error.message || "Payment failed");

      // 3. Verify payment (server-side)
      const verifyRes = await fetch("/api/verify-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderData.orderId }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.paid) throw new Error("Payment not confirmed. Please contact support.");

      // 4. Credit Firestore wallet
      await addToWallet(user.uid, amount, orderData.orderId);
      setTopUpStatus("idle");
      return true;
    } catch (err: any) {
      setTopUpError(err.message || "Payment failed. Try again.");
      setTopUpStatus("error");
      setTimeout(() => { setTopUpStatus("idle"); setTopUpError(null); }, 5000);
      return false;
    }
  }, [user]);

  // ── Per-minute billing meter ────────────────────────────────────────────────
  const startMeter = useCallback((museId: string) => {
    if (meterRef.current) clearInterval(meterRef.current);
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    setCallSeconds(0);

    // Elapsed call-time counter (every second)
    callTimerRef.current = setInterval(() => {
      setCallSeconds((s) => s + 1);
    }, 1000);

    // Billing tick (every BILL_INTERVAL_SEC seconds)
    meterRef.current = setInterval(async () => {
      if (!user) return;
      const { success, newBalance } = await deductFromWallet(
        user.uid,
        BILL_AMOUNT_PER_TICK,
        museId
      );
      if (!success || newBalance < BILL_AMOUNT_PER_TICK) {
        onDepletedRef.current();
      }
    }, BILL_INTERVAL_SEC * 1000);
  }, [user]);

  const stopMeter = useCallback(() => {
    if (meterRef.current) { clearInterval(meterRef.current); meterRef.current = null; }
    if (callTimerRef.current) { clearInterval(callTimerRef.current); callTimerRef.current = null; }
    setCallSeconds(0);
  }, []);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const minutesRemaining = Math.floor(balance / RATE_PER_MIN_INR);

  return {
    balance,
    minutesRemaining,
    canStartCall: balance >= MIN_BALANCE_TO_START,
    minBalanceToStart: MIN_BALANCE_TO_START,
    ratePerMin: RATE_PER_MIN_INR,
    topUpStatus,
    topUpError,
    callSeconds,
    callTimeFormatted: formatSeconds(callSeconds),
    initiateTopUp,
    startMeter,
    stopMeter,
  };
}
