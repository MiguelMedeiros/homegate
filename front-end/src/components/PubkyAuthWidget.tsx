"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";
import * as pubky from "@synonymdev/pubky";

const DEFAULT_HTTP_RELAY = "https://httprelay.staging.pubky.app/link/";
const TESTNET_HTTP_RELAY = "http://localhost:15412/link";

interface PubkyAuthWidgetProps {
  relay?: string;
  caps?: string;
  open?: boolean;
  testnet?: boolean;
  onSuccess?: (publicKey: string, session?: pubky.Session, token?: pubky.AuthToken) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export function PubkyAuthWidget({
  relay,
  caps = "",
  open = false,
  testnet = false,
  onSuccess,
  onError,
  className = "",
}: PubkyAuthWidgetProps) {
  const [pubkyZ32, setPubkyZ32] = useState<string>("");
  const [authUrl, setAuthUrl] = useState<string>("");
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sdkRef = useRef<pubky.Pubky | null>(null);

  // Generate QR code
  const updateQr = useCallback(() => {
    if (!canvasRef.current || !authUrl) return;
    
    try {
      QRCode.toCanvas(canvasRef.current, authUrl, {
        margin: 2,
        width: 192, // 48 * 8 = 384px (w-48)
        color: { light: "#fff", dark: "#000" },
      });
    } catch (e) {
      console.error("QR render error:", e);
      onError?.(e as Error);
    }
  }, [authUrl, onError]);

  // Generate auth flow
  const generateFlow = useCallback(async () => {
    if (!sdkRef.current) return;

    setPubkyZ32("");
    setAuthUrl("");

    try {
      const relayUrl = relay || (testnet ? TESTNET_HTTP_RELAY : DEFAULT_HTTP_RELAY);
      
      // Start the flow with the SDK's client
      const flow = sdkRef.current.startAuthFlow(caps as pubky.Capabilities, relayUrl);
      
      // Capture the deep link before awaiting
      const url = flow.authorizationUrl;
      setAuthUrl(url);

      // Update QR code after URL is set
      setTimeout(() => {
        updateQr();
        requestAnimationFrame(() => updateQr());
      }, 50);

      // Stop loading once QR is ready

      // Wait for approval based on capabilities (this is async and will happen in background)
      if (caps && caps.trim().length > 0) {
        // Capabilities requested -> wait for a Session
        const session = await flow.awaitApproval();
        const publicKey = session.info.publicKey.z32();
        setPubkyZ32(publicKey);
        onSuccess?.(publicKey, session);
      } else {
        // No capabilities -> wait for an AuthToken
        const token = await flow.awaitToken();
        const publicKey = token.publicKey.z32();
        setPubkyZ32(publicKey);
        onSuccess?.(publicKey, undefined, token);
      }
    } catch (error) {
      console.error("Auth flow failed:", error);
      onError?.(error as Error);
    }
  }, [relay, caps, testnet, onSuccess, onError, updateQr]);

  // Initialize SDK
  useEffect(() => {
    sdkRef.current = testnet ? pubky.Pubky.testnet() : new pubky.Pubky();
  }, [testnet]);

  // Auto-generate flow if open prop is true
  useEffect(() => {
    if (open && !authUrl && sdkRef.current) {
      // Use setTimeout to ensure SDK and state are ready
      const timer = setTimeout(() => {
        generateFlow();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, authUrl, generateFlow]);

  // Update QR when authUrl changes
  useEffect(() => {
    updateQr();
  }, [updateQr]);

  const showSuccess = Boolean(pubkyZ32);

  const instruction = caps && caps.trim().length
    ? "Scan or copy Pubky auth URL"
    : "Scan to authenticate (no capabilities requested)";

  return (
    <div 
      className={`
        relative flex flex-col items-center
        transition-all duration-300 ease-in-out
        ${className}
      `}
    >

      {/* Instruction */}
      <p className="mb-6 text-center text-sm text-muted-foreground">
        {instruction}
      </p>

      {/* Content */}
      {showSuccess ? (
        caps?.length ? (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Successfully authorized:</p>
            <p className="text-sm font-mono mb-2">{pubkyZ32}</p>
            <p className="text-sm text-muted-foreground mb-2">With capabilities</p>
            {caps.split(",").map((cap, index) => (
              <p key={index} className="text-sm text-muted-foreground">{cap}</p>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Successfully authenticated:</p>
            <p className="text-sm font-mono">{pubkyZ32}</p>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center w-full">
          {/* QR Code - Clean, no background */}
          <div className="flex justify-center items-center bg-white p-4 rounded-2xl">
            <canvas 
              ref={canvasRef} 
              className="w-48 h-48"
            />
          </div>
        </div>
      )}
    </div>
  );
}
